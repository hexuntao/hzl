<template>
  <view class="pages">
    <anchor-top-bar
      :avatar="info.user_headimg"
      :name="info.uname"
      :label="topBarLabel"
    >
      <view slot="infoRight">
        <lk-button
          v-if="showFollow"
          round
          theme-color
          size="mini"
          :loading="btnLoading"
          @click="onFollow"
        >
          {{ info.is_focus ? "已关注" : "关注" }}
        </lk-button>
      </view>
    </anchor-top-bar>
    <image
      v-if="pageTypeBg"
      :src="pageTypeBg"
      class="page-type-bg"
      mode="aspectFill"
    />
    <luxury-gift-group ref="luxuryGiftList" :list="luxuryGiftList" />
    <view class="footer-warp">
      <view>
        <gift-barrage ref="giftBarrage" :list="giftBarrageList" />
      </view>
      <view>
        <notice-group :list="noticeList" />
      </view>
      <view>
        <msg-group :list="msgList" />
      </view>
      <view>
        <goods-group :list="goodsList" @click-goods="onClickGoods" />
      </view>
    </view>
    <!-- #ifdef APP-PLUS -->
    <player-video
      v-if="livePlayerUrl"
      :src="livePlayerUrl"
      :poster="info.live_img"
    />
    <!--  #endif -->
    <!-- #ifdef H5 -->
    <tc-player
      v-if="livePlayerUrl && livePlayerOptions.SDKAppID"
      :url="livePlayerUrl"
      :options="livePlayerOptions"
      :group-info="info"
      ref="tcPlayer"
    />
    <!--  #endif -->
    <!-- #ifdef MP -->
    <live-player
      v-if="livePlayerUrl"
      id="livePlayer"
      ref="live-player"
      class="live-player"
      :src="livePlayerUrl"
      object-fit="fillCrop"
      autoplay
      :picture-in-picture-mode="pictureInPictureMode"
      @statechange="onStatechange"
      @error="onPlayerError"
      @enterpictureinpicture="onEnterpictureinpicture"
      @leavepictureinpicture="onLeavepictureinpicture"
    ></live-player>
    <!--  #endif -->
    <goods-group
      v-model="showGoods"
      is-popup
      :list="goodsList"
      @click-goods="onClickGoods"
    />
    <gift-group v-model="showGift" @send-gift="onSendGift" />
    <send-write-group v-model="showSendWrite" @send="onSend" />
    <bottom-action-bar
      :anchor_id="anchor_id"
      :like-count="likeCount || 0"
      :is-mute="isMute"
      @action="onAction"
    />
  </view>
</template>

<script>
import {
  GET_LIVEANCHORINFO,
  GET_LIVEGOODSLIST,
  SET_LIVEFOCUS,
  GET_LIVEPLAYERURL,
  GET_LIVEROOMSTATUS,
  SET_LIVELIKE,
  GET_LIVEGIFTLIST,
  SET_LIVEWATCHHISTORY
} from "./interface";
import anchorTopBar from "./component/anchor-top-bar";
import msgGroup from "./component/msg-group";
import noticeGroup from "./component/notice-group";
import goodsGroup from "./component/goods-group";
import bottomActionBar from "./component/bottom-action-bar";
import sendWriteGroup from "./component/send-write-group";
import giftGroup from "./component/gift-group";
import giftBarrage from "./component/gift-barrage";
import luxuryGiftGroup from "./component/luxury-gift-group";
// #ifdef APP-PLUS
import playerVideo from "./component/player-video.nvue";
// #endif
import { encodeUriParams, wan, debounce } from "@/common/utils";
import tls from "./mixin/tls";
import { mapGetters } from "vuex";
// #ifdef H5
import tcPlayer from "./component/tc-player";
// #endif
export default {
  name: "packages-live-player",
  data() {
    return {
      pageType: 0, // 页面状态
      anchor_id: "",
      live_id: "",
      info: {
        is_focus: 0,
        likes_num: 0
      },
      btnLoading: false,

      livePlayerUrl: "",

      pictureInPictureMode: [],

      // #ifdef H5
      livePlayerOptions: {
        SDKAppID: ""
      },
      // #endif

      msgList: [], //消息列表
      noticeList: [], //通告列表
      goodsList: [], //推荐商品列表
      giftBarrageList: [], //礼物弹幕列表
      luxuryGiftList: [], //豪华礼物列表

      showGoods: false,
      showSendWrite: false,
      showGift: false,

      toggleBarActive: ""
    };
  },
  mixins: [tls],
  computed: {
    ...mapGetters(["static"]),
    showFollow() {
      return !!this.info.live_uid;
    },
    topBarLabel() {
      return wan(this.memberNum) + "观看";
    },
    pageTypeBg() {
      let bg = {
        1: this.static.baseImgPath + "live-nostarted-bg.jpg",
        2: this.static.baseImgPath + "live-bg.jpg"
      };
      return bg[this.pageType] || "";
    }
  },
  onLoad(query) {
    this.anchor_id = query.anchor_id || 0;
    this.live_id = query.live_id || 0;
    this.getData();
  },
  onShow() {
    this.pictureInPictureMode = [];
    this.getLiveStatus();
  },
  onHide() {
    this.pictureInPictureMode = ["push"];
  },
  onUnload() {
    this.quitGroup();
  },
  onReady() {
    // 注意：需要在onReady中 或 onLoad 延时
    // #ifdef MP
    this.ctx = uni.createLivePusherContext("livePlayer", this);
    if (!this.ctx) {
      return;
    }
    // #endif
  },
  methods: {
    getData() {
      GET_LIVEANCHORINFO({ anchor_id: this.anchor_id }).then(({ data }) => {
        this.info = data || {};
        if (this.info.status == 2) {
          this.likeCount = this.info.likes_num || 0;
          this.pushMsgList({
            type: "system",
            name: "公告",
            content: data.room_notice
          });
          this.getUrl();
          this.getRecGoodsList();
          this.initTLS(this.info);
          this.setWxShare({
            title: data.live_title,
            imgUrl: data.live_img,
            desc: `我正在观看${data.uname}的直播~`
          });
          this.setWatchHistory();
          if (this.info.is_leaving == 1) {
            // 主播已离开
            this.setPageType({ type: 2 });
          }
          if (this.info.is_muting == 1) {
            // 主播已设置禁言
            this.isMute = true;
            this.pushMsgList({
              type: "system",
              name: "公告",
              content: this.muteText
            });
          }
        }
      });
    },
    // 设置观看历史
    setWatchHistory() {
      SET_LIVEWATCHHISTORY({ live_id: this.live_id })
        .then(() => {})
        .catch(() => {});
    },
    getUrl() {
      return new Promise((resovle, reject) => {
        this.livePlayerUrl = "";
        GET_LIVEPLAYERURL({ live_id: this.live_id })
          .then(({ data }) => {
            // #ifdef H5
            this.livePlayerUrl = data.wap_play_url;
            this.livePlayerOptions.flv = data.play_url;
            this.livePlayerOptions.m3u8 = data.wap_play_url;
            // #endif
            // #ifndef H5
            this.livePlayerUrl = data.play_url;
            // #endif
            resovle();
          })
          .catch(() => {
            reject();
          });
      });
    },
    getLiveStatus() {
      GET_LIVEROOMSTATUS({ anchor_id: this.anchor_id }).then(({ data }) => {
        console.log("直播状态：", data.live_status);
        if (data.live_status == 1) {
          // 主播未开始直播
          this.setPageType({ type: 1 });
        }
        if (data.live_status == 0) {
          // 已禁播
          this.$Prompt
            .modal({
              title: "提示",
              showCancel: false,
              content: "抱歉，主播已被禁播"
            })
            .then(() => {
              this.$Navigate.replace("/pages/live/index");
            });
        }
        if (data.live_status == -1) {
          // 异常
          this.$Prompt
            .modal({
              title: "提示",
              showCancel: false,
              content: "抱歉，直播间异常"
            })
            .then(() => {
              this.$Navigate.replace("/pages/live/index");
            });
        }
        if (data.live_status == 4) {
          // 已下播
          return this.$Navigate.replace({
            path: "/packages/live/end",
            query: {
              anchor_id: this.anchor_id,
              live_id: this.live_id
            }
          });
        }
      });
    },
    //获取推荐商品列表
    getRecGoodsList() {
      GET_LIVEGOODSLIST({ anchor_id: this.anchor_id }).then(({ data }) => {
        const list = data.live_goods_list || [];
        list.forEach(e => {
          e.to = {
            path: "/packages/goods/detail",
            query: {
              goods_id: e.goods_id,
              anchor_id: this.anchor_id
            }
          };
        });
        this.goodsList = list;
      });
    },
    // 监听tls初始化完成
    onTLSReady(data) {
      // #ifdef H5
      this.livePlayerOptions.SDKAppID = data.SDKAppID;
      // #endif
      if (!this.info.group_id) {
        return this.$Prompt
          .modal({
            content: "群ID不能为空",
            showCancel: false
          })
          .then(() => {
            this.$Navigate.back();
          });
      }
      this.joinGroup(this.info.group_id); // 加入群聊
    },
    // 关注主播
    onFollow() {
      const info = this.info;
      this.btnLoading = true;
      SET_LIVEFOCUS(
        {
          follow_uid: info.uid,
          live_id: this.live_id
        },
        { isFocued: !!info.is_focus } // 取消or关注
      )
        .then(({ message }) => {
          if (!info.is_focus) {
            this.sendCustomMessage({
              name: "follow"
            });
          }
          info.is_focus = !info.is_focus;
          this.btnLoading = false;
          this.$Prompt.toast({ title: message, icon: "success" });
        })
        .catch(e => {
          this.btnLoading = false;
        });
    },
    // 加入消息列表
    pushMsgList(obj) {
      this.msgList.push(obj);
    },
    // 加入通告列表
    pushNoticeList(obj) {
      this.noticeList.push(obj);
    },
    // 加入礼物弹幕队列列表
    pushGiftList(obj) {
      this.$refs.giftBarrage.push(obj);
      // this.giftBarrageList.push(obj);
      // 豪华礼物类型
      if (obj.type == 2) {
        this.$refs.luxuryGiftList.push(obj);
        // this.luxuryGiftList.push(obj);
      }
    },
    onAction(e, data) {
      this.toggleBarActive = e;
      if (e == "goods") {
        this.showGoods = true;
        this.getRecGoodsList();
      }
      if (e == "write") {
        if (this.isMute) {
          return this.$Prompt.toast(this.muteText);
        }
        this.showSendWrite = true;
      }
      if (e == "gift") {
        this.showGift = true;
      }
      if (e == "like") {
        this.likeCount = data.like_count;
        this.sendCustomMessage({
          name: "like",
          query: {
            like_count: data.like_count,
            like_num: data.like_num
          }
        });
        this.likeCountChange({
          like_count: data.like_count,
          like_num: data.like_num
        });
      }
      if (e == "share") {
        this.sendCustomMessage({
          name: "share"
        });
      }
    },
    likeCountChange: debounce(function(obj) {
      console.log(obj);
      // SET_LIVELIKE({ live_id: this.live_id, likes_num: obj.like_num });
    }, 1000),
    // 发送消息
    onSend(e) {
      if (this.isMute) {
        return this.$Prompt.toast(this.muteText);
      }
      this.sendMessage({
        text: e.text
      });
    },
    // 发送礼物
    onSendGift(e) {
      this.sendCustomMessage({
        name: "gift",
        query: {
          anchor_uid: this.info.uid,
          gift_id: e.id,
          price: e.price
        },
        extension: {
          ...e
        }
      }).then(() => {
        this.pushGiftList(e);
      });
    },
    // 点击商品
    onClickGoods(item) {
      this.sendCustomMessage({
        name: "click_goods",
        query: {
          goods_id: item.goods_id
        }
      });
      this.$Navigate.push(item.to);
    },
    setPageType(e) {
      this.pageType = e.type;
      console.log("setPageType", e.type);
      if (e.type == 2) {
        console.log("主播离开，暂停播放");
        // #ifdef H5
        if (this.$refs.tcPlayer.tweblive) {
          this.$refs.tcPlayer.tweblive.pause();
          this.$refs.tcPlayer.tweblive.shop();
        }
        // #endif
        // #ifdef MP
        if (this.ctx) {
          // 暂停播放
          this.ctx.pause();
        }
        // #endif
      }
      if (e.type == 0) {
        console.log("主播进入，重新播放");
        // #ifdef H5
        if (this.$refs.tcPlayer.tweblive) {
          this.$refs.tcPlayer.tweblive.play();
        }
        // #endif
        // #ifdef MP
        if (this.restartPlayer) {
          this.getUrl();
        } else if (this.ctx) {
          // 恢复播放
          this.ctx.resume();
        }
        // #endif
      }
    },
    onStatechange(e) {
      console.log("onStatechange", e.detail.code, e.detail.message);
      if (e.detail.code == -2301) {
        // 网络断连,自行重启
        this.restartPlayer = true; // 重启播放
      }
    },
    onPlayerError(e) {
      console.log("onPlayerError", e);
    },
    onEnterpictureinpicture(e) {
      console.log("进入小窗", e);
    },
    onLeavepictureinpicture(e) {
      console.log("退出小窗", e);
    }
  },
  components: {
    // #ifdef H5
    tcPlayer,
    // #endif
    anchorTopBar,
    msgGroup,
    noticeGroup,
    goodsGroup,
    bottomActionBar,
    sendWriteGroup,
    giftGroup,
    giftBarrage,
    luxuryGiftGroup,
    // #ifdef APP-PLUS
    playerVideo
    // #endif
  }
};
</script>

<style lang="scss" scoped>
.pages {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
}
.page-type-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}
.live-player {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.footer-warp {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 120rpx;
  bottom: calc(constant(safe-area-inset-bottom) + 120rpx);
  bottom: calc(env(safe-area-inset-bottom) + 120rpx);
  z-index: 20;
}
</style>
