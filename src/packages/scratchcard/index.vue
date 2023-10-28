<template>
  <!-- 刮刮乐 -->
  <view class="pages">
    <image :src="scratchard" mode="widthFix" class="scratchardimg" />
    <view class="right-tag">
      <view class="menu" @click="openExplain">活动说明</view>
      <view class="menu" @click="prizelist">我的奖品</view>
    </view>
    <view class="scratch">

      <view class="box">
        <!-- 刮奖结果展示 -->
        <view class="img">{{termname}}</view>
        <!-- 刮奖结果图片 -->

        <canvas class="canvas-box" v-bind:style="{ display:canvasStyle }" canvas-id="canvas-id" :disable-scroll="true" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd">
          <cover-view class="cover_view popup" v-if="ShowbindMobile">
            <cover-view class="bindMobileText">
              <cover-view class="titleText">您还未绑定手机号</cover-view>
              <cover-view class="confirmText">请先确认授权获取手机号码</cover-view>
              <cover-view class="allButton">
                <button size='mini' @click="closeBind">取消</button><button size='mini' open-type="getPhoneNumber" @getphonenumber="getphonenumber" >确认授权</button>
              </cover-view>
              
            </cover-view>
          </cover-view>

        </canvas>

      </view>

      <!-- 刮奖前提示消息，开始刮奖后隐藏  -->
      <view v-if="!toDraw">
      </view>
      <view class="tip">
        <view class="text" v-if="frequency!= -9999">
          <view class="text-tip">剩余抽奖次数：</view>
          <view class="light">{{frequency}}</view>
          <view class="text-tip">次</view>
        </view>
        <!-- 开始刮奖按钮 -->
        <view class="btn">
          <view @click="scratchStart" :class="termname?'btntext':'btncontinue'">再刮一次</view>
        </view>
      </view>
    </view>
    <view class="prize-wrap">
      <view class="prize-title">幸运刮刮卡中奖记录</view>
      <view class="prize-list-wrap">
        <view class="item">
          <tonyscroll :list="win"></tonyscroll>
        </view>
      </view>
    </view>
    <!-- 活动说明弹窗 -->
    <explain :scratch_card_id="scratchcard_id" v-if="scratchcard_id" :isShow="isExplain" @close="closeExplain" />
    <!-- 活动结束弹窗 -->
    <popupactivityend v-if="activity"></popupactivityend>
    <!--中奖弹出框-->
    <popupWinPrize :isShow="winPrize" :termname="termname" :prizename="prizename" @share="share" @close="winPrizeclose"></popupWinPrize>
    <!--未中奖弹出框-->
    <popupnoprize :isShow="noPrize" @close="NoPrizeclose" @share="share" />

    <popupshare :isShow="isshare" @close="closeshare" />
    <lk-shortcut-entry />
  </view>
</template>
<script>
import $Plugins from "@/api/plugins";
import {
  GET_FREQUENCY,
  GET_PRIZERECORDS,
  SET_USERSCRATCHCARD,
} from "@/common/interface/scratchcard";
import { isWeixin } from "@/common/utils";
import popupactivityend from "./component/PopupActivityEnd"; //活动结束
import explain from "./component/explain"; //活动奖品组件
import tonyscroll from "./component/tony-scroll"; //滚动
import popupnoprize from "./component/PopupNoPrize"; //没有中奖
import popupshare from "./component/PopupShare"; //分享
import popupWinPrize from "./component/PopupWinPrize"; //中奖弹出框
import Scratch from "./component/scratch.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "scratchcard-centre",
  data() {
    return {
      ShowbindMobile: false,
      bingMobile: true,
      toDraw: true, // 是否开始刮奖
      showResult: false, // 是否显示抽奖结果
      noPrize: false, // 未中奖弹窗
      winPrize: false, //中奖弹窗
      isshare: false, //分享弹窗
      scratchSize: 10, // 触手大小
      scratchScale: 0.1, // 需刮开百分比
      isScratching: false, // 是否正在刮奖,
      hasDraw: true,
      isExplain: false, //活动说明
      info: {}, //详情
      win: [], // 中奖名单
      scratchcard_id: 0, //id
      frequency: 0, //用户当日可抽奖次数(-9999表示无限)
      state: 0, // 刮刮乐状态 1待开始 2活动中 3已结束
      termname: "", //刮奖结果
      prizename: "",
      activity: false, //活动已结束popup
    };
  },
  onReady() {
    this.toDraw = true;
    this.initCanvas();
  },
  onLoad(option) {},
  computed: {
    ...mapGetters(["token", "isShowBindMobile"]),
    scratchard() {
      return this.$store.getters.static.baseImgPath + "scratchcard-bg.png";
    },

    canvasStyle() {
      if (this.winPrize || this.noPrize || this.isshare || this.isExplain||this.activity) {
        return 'none';
      } else {
        return 'block';
      }
    },
  },
  methods: {
    ...mapMutations(["setLoginBeforePath"]),
    ...mapActions(["mpBindMobile"]),
    callLoad(query) {
      this.scratchcard_id = query.scratch_card_id;
      this.getData(query.scratch_card_id);
      this.getprizeRecords();
    },
    // 获取中奖名单
    getprizeRecords() {
      GET_PRIZERECORDS({ scratch_card_id: this.scratchcard_id }).then((res) => {
        this.win = res.data.data || [];
      });
    },
    getData() {
      GET_FREQUENCY({ scratch_card_id: this.scratchcard_id })
        .then(({ data }) => {
          uni.setNavigationBarTitle({
            title: data.scratchcard_name,
          });
          if (data.state == 1) {
            //活动待开
            this.$Prompt.toast("活动还未开始").then(() => {
              this.$Navigate.replace("/pages/member/index");
            });
          } else if (data.state == 2) {
            this.frequency = data.frequency;
          } else if (data.state == 3) {
            //活动已结束
            this.activity = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 点击按钮再刮一次
    scratchStart() {
      if (this.frequency === 0) {
        this.$Prompt.toast("抱歉，您已经没有抽奖机会了。");
        return false;
      }

      if (this.termname) {
        this.termname = "";
        this.toDraw = true;
        this.initCanvas();
        this.isScratching = false;
      }
    },
    // 刮奖中
    doPrizeScratchTicketFun() {
        // 需要绑定手机时，验证不通过时，进行拦截点击
        if (!this.token) {
          this.setLoginBeforePath(this.$store.getters.route.fullPath);
          this.$Navigate.push("/packages/login/index").then(() => {
            this.$Prompt.toast("您未登录，请先登录！");
          });
          return false;
        }
        if (this.isShowBindMobile) {
          // #ifdef H5
          this.$BindMobile.open();
          // #endif

          // #ifdef APP-PLUS
          uni.navigateTo({
            url: "/pages/member/bind",
          });
          // #endif
          // #ifdef MP-WEIXIN
          this.ShowbindMobile = true;
          // #endif
          return false;
        }
      if (this.frequency === 0) {
        this.$Prompt.toast("抱歉，您已经没有抽奖机会了。");
        return false;
      }
      if (this.isScratching) {
        return false;
      } else {
        this.isScratching = true;
      }

      this.toDraw = false;
      // 请求服务器刮奖结果信息
      SET_USERSCRATCHCARD({ scratch_card_id: this.scratchcard_id })
        .then((res) => {
          if (this.frequency !== -9999) {
            this.frequency = this.frequency - 1;
          }
          if (res.code == 0) {
            this.termname = res.message;
          } else if (res.code == 1) {
            this.termname = res.data.term_name;
            this.prizename = res.data.prize_name;
          } else if (res.code == -2) {
            this.termname = res.message;
          }

          this.scratchCardData = res;
        })
        .catch(() => {});
    },
    // 刮奖结束
    scratchEnd() {
      if (this.toDraw == false && this.isScratching == true) {
        let CardData = this.scratchCardData;
        if (CardData.code == 0) {
          this.noPrize = true;
        } else if (CardData.code == 1) {
          this.winPrize = true;
        }
      }
      this.toDraw = true;
    },
    // canvas初始化绘画
    initCanvas() {
      new Scratch(this, {
        canvasId: "canvas-id",
        size: this.scratchSize,
        scale: this.scratchScale,
      });
    },
    //我的奖品
    prizelist() {
      this.$Navigate.push({
        path: "/packages/prize/list",
      });
    },
    // 未中奖
    NoPrizeclose() {
      this.noPrize = false;
    },
    winPrizeclose() {
      this.winPrize = false;
    },
    share() {
      // #ifdef H5
      this.winPrize = false;
      this.noPrize = false;
      if (isWeixin()) {
        this.isshare = true;
      } else {
        this.$Prompt.toast("请点击下方工具栏“分享”按钮进行分享");
      }
      // #endif
      // #ifdef APP-PLUS
      $Plugins.shareWithSystem({
        summary: "刮刮乐",
        href: this.shareParams.link,
      });
      // #endif
    },
    closeshare() {
      this.isshare = false;
    },
    //点击活动说明
    openExplain() {
      this.isExplain = true;
    },
    //关闭活动说明
    closeExplain() {
      this.isExplain = false;
    },
    // 关闭授权
    closeBind(){
      this.ShowbindMobile = false
    },
    //确认授权
    getphonenumber(event) {
      this.ShowbindMobile = false
      if (event.detail.encryptedData) {
        this.mpBindMobile(event.detail);
      } else {
        console.log("拒绝获取手机");
      }
    },
  },
  components: {
    tonyscroll,
    explain,
    popupactivityend,
    popupnoprize,
    popupWinPrize,
    popupshare,
  },
};
</script>

<style lang="scss" scoped>
.cover_view {
  position: relative;
  z-index: 100000;
  top: -30rpx;
}
.popup {
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2001;
  transition: all 0.2s;
  .bindMobileText {
    height: 300rpx;
    text-align: center;
    line-height: 100rpx;
    background-color: #fff;
    margin: calc(50% + 100rpx) auto;
    width: 60%;
    border-radius: 16rpx;
    .titleText{
      height: 100rpx;
      line-height: 100rpx;
    }
    .confirmText{
      height: 100rpx;
      line-height: 100rpx;
    }
    .allButton{
      display: flex;
      justify-content: space-around;
      button{
        width: 35%;
      }
    }
  }
}

.scratch {
  // background: url($baseImgUrl+"luck-draw-guajiang.png") no-repeat;
  background-size: contain;
  margin: 0rpx auto 10rpx;
  padding: 29rpx 25rpx 21rpx;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  left: 0;
  top: -150rpx;
  .tip {
    text-align: center;
    .text {
      margin: 20rpx 0;
      .text-tip {
        color: #fff;
        display: inline-block;
        vertical-align: middle;
      }
      .light {
        color: #ffff00;
        display: inline-block;
        vertical-align: middle;
        margin: 0 6rpx !important;
      }
    }
    .btn {
      .btntext {
        background-color: #fff55a;
        border: 1px solid #fff55a;
        color: #a50000;
        margin: 30rpx auto;
        display: block;
        height: 70rpx;
        line-height: 70rpx;
        border-radius: 40rpx;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -webkit-box-shadow: 0px 4px 1px #fec201;
        box-shadow: 0px 4px 1px #fec201;
        width: 50%;
      }
      .btncontinue {
        opacity: 1;
        -webkit-box-shadow: 0px 4px 1px #cccccc;
        box-shadow: 0px 4px 1px #cccccc;
        color: #999;
        background-color: #e8e8e8;
        border: 1px solid #e5e5e5;
        margin: 30rpx auto;
        display: block;
        height: 70rpx;
        line-height: 70rpx;
        border-radius: 40rpx;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 50%;
      }
    }
  }
  .box {
    height: 320rpx;
    border-radius: 20rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    .img {
      width: calc(100% - 60rpx);
      height: 99%;
      position: absolute;
      top: 0;
      left: 30rpx;
      border-radius: 20rpx;
      background-color: #fff;
      text-align: center;
      box-sizing: border-box;
      overflow: hidden;
      line-height: 320rpx;
      font-size: 32rpx;
    }
    .canvas-box {
      width: calc(100% - 60rpx);
      height: 100%;
      box-sizing: border-box;
      border-radius: 20rpx;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 30rpx;
    }
  }
}
.pages {
  position: relative;
  background-color: #e4352c;
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: contain;
}
.pages .scratchardimg {
  width: 100%;
  display: block;
  margin: 0 40rpx;
}
.right-tag {
  position: absolute;
  z-index: 10;
  top: 15%;
  right: 0;
}
.right-tag .menu {
  color: #ff4444;
  background-color: #fff;
  padding: 12rpx 20rpx;
  border-bottom-left-radius: 20rpx;
  border-top-left-radius: 20rpx;
  font-size: 28rpx;
  margin-top: 40rpx;
  display: block;
}

.prize-wrap {
  background-color: #fff;
  border-radius: 20rpx;
  position: relative;
  bottom: 0px;
  width: 90%;
  height: 400rpx;
  margin: 0 auto;
  margin-bottom: 60rpx;
  display: block;
  left: 0;
  top: -180rpx;
  margin-bottom: 30rpx;
  margin-top: 30rpx;
  overflow: hidden;
}
.prize-title {
  text-align: center;
  font-size: 28rpx;
  color: #e84d2f;
  width: 100%;
  padding-top: 40rpx;
}
.prize-list-wrap {
  overflow: hidden;
  overflow-y: auto;
  padding: 12rpx 0px;
  color: #666;
  height: 300rpx;
}
.prize-list-wrap ul {
  position: relative;
  display: block;
  overflow: hidden;
}
</style>
