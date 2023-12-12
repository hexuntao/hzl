<template>
  <view class="pages">
    <view class="cell-group">
      <lk-grid-panel cols="3" :items="cardItems" />
    </view>
    <view class="cell-group">
      <lk-cell
        v-for="(item, index) in chatList"
        :key="index"
        :icon="item.kefu_avatar"
        icon-size="40"
        :title="item.kefu_name"
        :title-right="item.chat_time"
        :label="item.chat_content"
        @click="toChat(index)"
      />
    </view>
    <lk-shortcut-entry />
    <!-- #ifndef MP-WEIXIN -->
    <lk-tabbar />
    <!--  #endif -->
  </view>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { GET_QLKEFUCHATLIST } from "@/common/interface/message";
export default {
  name: "pages-message-index",
  data() {
    return {
      chatList: []
    };
  },
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons
    }),
    ...mapGetters(["static"]),
    cardItems() {
      return [
        {
          title: "消息通知",
          icon: this.static.baseImgPath + "pic_message.png",
          to: "/packages/message/notice"
        },
        {
          title: "赞和收藏",
          icon: this.static.baseImgPath + "pic_give_up.png",
          to: "/packages/thingcircle/collect"
        },
        {
          title: "评论和@",
          icon: this.static.baseImgPath + "pic_at.png",
          to: "/packages/thingcircle/comment"
        }
      ];
    }
  },
  onLoad() {},
  onShow() {},
  methods: {
    // 获取商城配置回调
    configCall(config) {
      if (this.addons.qlkefu) {
        this.getChatList();
      }
    },
    getChatList() {
      GET_QLKEFUCHATLIST()
        .then(({ data }) => {
          this.chatList = data || [];
        })
        .catch(() => {});
    },
    toChat(index) {
      this.$Navigate.push({
        path: "/packages/message/chat",
        query: {
          seller_code: this.chatList[index].seller_code,
          kefu_code: this.chatList[index].kefu_code
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0;
}
</style>
