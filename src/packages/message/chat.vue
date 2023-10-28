<template>
  <view class="pages">
    <view class="list" @touchstart="touchstart">
      <view v-if="isLoading && !isLoaded" class="msg-loading">
        <lk-loading><text class="text">加载中</text></lk-loading>
      </view>
      <view v-if="isLoaded" class="msg-end">没有更多消息了</view>
      <view
        class="item"
        v-for="(item, index) in list"
        :key="index"
        :id="`msg-${item.log_id}`"
      >
        <chat-item
          :info="item"
          @send-goods="onSend"
          @send-question="onSendQuestion"
        ></chat-item>
      </view>
    </view>
    <action-bar @send="onSend" />
  </view>
</template>

<script>
import {
  GET_QLKEFUCHATLOG,
  GET_QLKEFUVERIFY
} from "@/common/interface/message";
import { mapState } from "vuex";
import chatItem from "./component/chat-item";
import actionBar from "./component/action-bar";
// import loadMixin from "@/mixins/load-list";
import baseMixin from "./mixin/base";
import socketMixin from "./mixin/socket";
import { throttle } from "@/common/utils";

export default {
  name: "packages-message-chat",
  data() {
    return {
      params: {
        page: 1,
        uid: "",
        t: "",
        tk: "",
        seller: "",
        kefu_code: ""
      },
      customer: {
        uid: 0,
        name: "",
        avatar: "",
        seller: "",
        regTime: "",
        goods: "",
        kefuCode: "",
        tk: "",
        t: ""
      },
      goods: "",

      isLoading: false,
      isLoaded: false,
      isError: false,

      list: [],

      downOption: {
        use: true,
        auto: false,
        native: false
      },
      upOption: {
        use: false // 禁止上拉
      },
      confgFlag: 1,

      isReachTop: false,
      reachTopNum: 20
    };
  },
  mixins: [baseMixin, socketMixin],
  computed: {
    ...mapState({
      subDomain: ({ subDomain }) => subDomain
    })
  },
  onLoad(query) {
    this.params.seller = query.seller_code;
    this.params.kefu_code = query.kefu_code || "";
    this.goods = query.goods ? JSON.parse(query.goods) : "";
  },
  onUnload() {
    this.confgFlag = 1;
  },
  onPageScroll: throttle(function({ scrollTop }) {
    if (
      scrollTop < this.reachTopNum &&
      !this.isLoaded &&
      !this.isLoading &&
      !this.isReachTop
    ) {
      this.isReachTop = true;
      this.getChatLog();
    } else if (scrollTop >= this.reachTopNum) {
      this.isReachTop = false;
    }
  }, 250),
  methods: {
    // 获取商城配置回调
    configCall(config) {
      // #ifdef MP
      console.log("confgFlag", this.confgFlag, config);
      // #endif
      if (this.confgFlag) {
        this.getMemberInfo().then(info => {
          this.params.uid = info.uid;
          this.verifyInfo().then(({ tk, t }) => {
            this.confgFlag = 0;
            this.params.tk = tk;
            this.params.t = t;
            var customer = {
              uid: info.uid,
              name: info.name,
              avatar: info.member_img,
              regTime: info.reg_time,
              seller: this.params.seller,
              kefuCode: this.params.kefu_code,
              goods: this.goods,
              tk: tk,
              t: t
            };
            this.customer = customer;
            // #ifdef MP
            console.log("customer:", this.customer);
            // #endif
            this.initSocket(customer, config.qlkefu_domain_port);
          });
        });
      }
    },
    // 验证客服信息
    verifyInfo() {
      return new Promise((resolve, reject) => {
        const params = {
          seller_code: this.params.seller,
          domain: this.subDomain
        };
        // #ifdef MP
        console.log("verify:params", params, this.qlApiBaseUrl);
        // #endif
        if (params.seller_code) {
          GET_QLKEFUVERIFY(params, {
            baseUrl: this.qlApiBaseUrl
          })
            .then(({ data }) => {
              // #ifdef MP
              console.log("verify:", data);
              // #endif
              resolve({ tk: data.token, t: data.time });
            })
            .catch(() => {});
        }
      });
    },
    // 监听客服接入完成
    onConnect(res) {
      this.getChatLog().then(() => {
        if (this.goods) {
          this.list.push({
            type: "goods",
            goods: {
              ...this.goods
            },
            log_id: "goods-" + new Date().getTime()
          });
        }
        this.wordBottom();
      });
    },
    getChatLog() {
      return new Promise((resolve, reject) => {
        if (this.isLoaded) {
          return false;
        }
        this.isLoading = true;
        GET_QLKEFUCHATLOG(this.params, {
          baseUrl: this.qlApiBaseUrl
        })
          .then(({ data, total, msg }) => {
            let index = this.params.page;

            // 生成view_id,大写,避免污染源数据
            data.forEach(val => {
              val.view_id = "msg-" + val.log_id;
            });

            let sel = `#msg-${
              msg > 1 ? this.list[0].log_id : data[0] ? data[0].log_id : ""
            }`;

            this.list = [...data, ...this.list];

            let msgIds = [];
            this.list.forEach(e => {
              if (e.type == "user" && !e.read_status) {
                msgIds.push(e.log_id);
              }
            });
            this.emitNoRead(msgIds).then(() => {
              this.handleNoRead("user");
            });

            this.$nextTick(() => {
              if (msg >= total) {
                this.isLoaded = true;
                this.isLoading = false;
              }
              if (msg < total) {
                setTimeout(() => {
                  this.isLoading = false;
                }, 100);
                this.params.page++;
              }
              this.bindScroll(sel);
              resolve();
            });
          })
          .catch(() => {
            this.isLoading = false;
          });
      });
    },
    //处理滚动
    bindScroll(sel, duration = 0) {
      const query = uni.createSelectorQuery().in(this);
      query
        .select(sel)
        .boundingClientRect(data => {
          uni.pageScrollTo({
            scrollTop: data && data.top - 20,
            duration
          });
        })
        .exec();
    },
    // 滚动底部
    wordBottom() {
      setTimeout(() => {
        uni.pageScrollTo({
          scrollTop: 99999999,
          duration: 300
        });
      }, 100);
    },
    // 系统消息
    pushSystemMsg({ code, data, msg }) {
      this.list.push({
        type: "system",
        log_id: "system-" + new Date().getTime(),
        content: msg
      });
      this.wordBottom();
    },
    // 处理消息已读未读
    handleNoRead(type) {
      if (type) {
        this.list.forEach(e => {
          if (e.type == type && !e.read_status) {
            e.read_status = 1;
          }
        });
      }
    },
    // 发送消息
    onSend(content) {
      this.emitChatMessage(content).then(data => {
        this.list.push({
          type: "mine",
          log_id: "mine-" + new Date().getTime(),
          ...data
        });
        this.wordBottom();
      });
    },
    // 发送自动回复问题
    onSendQuestion(item) {
      this.emitAutoAnswer(item).then(data => {
        this.list.push({
          type: "robot",
          log_id: "robot-" + new Date().getTime(),
          ...data,
          from_avatar: this.addImgSrcKfDomain(data.from_avatar)
        });
        this.wordBottom();
      });
    },
    // 监听会话消息
    onChatMessage(data) {
      console.log(data);
      this.list.push({
        type: "user",
        log_id: "user-" + new Date().getTime(),
        ...data
      });
      if (data.log_id) {
        this.emitNoRead([data.log_id]).then(() => {
          this.handleNoRead("user");
        });
      } else {
        this.handleNoRead("user");
      }
      this.wordBottom();
    },
    // 监听标记已读
    onReadMessage(type) {
      this.handleNoRead(type);
    },
    // 监听常见问题
    onComQuestion({ data }) {
      this.list.push({
        type: "robot",
        log_id: "robot-" + new Date().getTime(),
        ...data,
        from_avatar: this.addImgSrcKfDomain(data.from_avatar)
      });
      this.wordBottom();
    },
    touchstart() {
      uni.hideKeyboard();
    }
  },
  components: {
    chatItem,
    actionBar
  }
};
</script>

<style lang="scss" scoped>
.list {
  padding-bottom: 100rpx;
  box-sizing: content-box;
  padding-bottom: calc(100rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}
.msg-end {
  padding: 40rpx;
  text-align: center;
  color: $text-light;
  font-size: $font-size-sm;
}
.msg-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100rpx;
  .text {
    padding: 0 20rpx;
  }
}
</style>
