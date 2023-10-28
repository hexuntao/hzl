<template>
  <view class="pages">
    <image :src="turnplate" mode="widthFix" class="dial" />
    <view class="rigth-tap">
      <view class="description" @click="handDescription">活动说明</view>
      <view class="description" @click="navPrize">我的奖品</view>
    </view>
    <explain
      v-if="wheelsurf_id"
      :isShow="isshow"
      :wheelsurf_id="wheelsurf_id"
      @close="handclose"
    />

    <view class="wheel-wrap">
      <view class="wheel-main">
        <view
          class="wheel-bg"
          :style="{ transform: rotateAngle, transition: rotateTransition }"
        >
          <Adventures v-if="adventuresShow" :items="info" />
        </view>
        <view class="wheel-pointer-box">
          <view class="wheel-pointer" @click="rotateHandle">
            <image
              :src="info.pointer_pic ? info.pointer_pic : pointerPic"
              mode="widthFix"
            />
          </view>
        </view>
      </view>
    </view>
    <view class="wheel-chance" v-if="frequency != -9999">
      剩余抽奖次数：
      <span>{{ frequency }}</span>
      次
    </view>

    <view class="prize-wrap">
      <view class="prize-title">大转盘中奖记录</view>
      <view class="prize-list-wrap">
        <view class="item">
          <tonyscroll :list="win"></tonyscroll>
        </view>
      </view>
    </view>
    <PopupNoPrize
      @close="NoPrizeclose"
      :isShow="noPrize"
      @share="share"
      v-if="noPrize"
    />

    <PopupWinPrize
      :isShow="winPrize"
      :termname="termname"
      :prizename="prizename"
      @share="share"
      @close="winPrizeclose"
    ></PopupWinPrize>

    <PopupActivityEnd @close="handendclose" v-if="ActivityEndshow" />

    <PopupShare :isShow="isshare" @close="closeshare" />
    <cover-view class="cover_view popup" v-if="ShowbindMobile">
      <cover-view class="bindMobileText">
        <cover-view class="titleText">您还未绑定手机号</cover-view>
        <cover-view class="confirmText">请先确认授权获取手机号码</cover-view>
        <cover-view class="allButton">
          <button size="mini" @click="closeBind">取消</button
          ><button
            size="mini"
            open-type="getPhoneNumber"
            @getphonenumber="getphonenumber"
          >
            确认授权
          </button>
        </cover-view>
      </cover-view>
    </cover-view>
    <lk-shortcut-entry />
  </view>
</template>
<script>
import { isWeixin } from "@/common/utils";
import $Plugins from "@/api/plugins";
import explain from "./component/explain"; //活动奖品组件
import PopupActivityEnd from "./component/PopupActivityEnd"; //活动结束
import PopupNoPrize from "./component/PopupNoPrize"; //未中奖弹出框
import PopupWinPrize from "./component/PopupWinPrize"; //中奖弹出框
import PopupShare from "./component/PopupShare"; //分享
import Adventures from "./component/Adventures"; //转盘数据
import tonyscroll from "./component/tony-scroll"; //滚动
import { mapActions, mapGetters, mapMutations } from "vuex";
import {
  GET_WHEELSURFINFO,
  GET_PRIZERECORDS,
  GET_USERFREQUENCY,
  GET_USERWHEELSURF
} from "@/common/interface/wheelsurf"; //转盘详情api
export default {
  data() {
    return {
      ShowbindMobile: false,
      adventuresShow: false,
      wheelsurf_id: "",
      isshare: false,
      infoid: "",
      isshow: false,
      win: [], //中奖纪录
      ActivityEndshow: false, //活动结束
      frequency: 0, //抽奖次数
      noPrize: false, //未中奖弹框
      termname: null, //奖项名称
      prizename: null, //奖品名称
      winPrize: false, //中奖弹框
      info: {}, // 转盘详情
      startRotDegree: 0, //初始旋转角度
      rotateAngle: 0, //将要旋转的角度
      rotateTransition: "transform 5s ease-in-out", //初始化选中的过度属性控制
      clickFlag: true, //是否可以旋转抽奖
      prizeCode: null //是否中奖
    };
  },
  computed: {
    ...mapGetters(["token", "isShowBindMobile"]),
    // 转盘背景图
    turnplate() {
      return this.$store.getters.static.baseImgPath + "wheelsurf-bg.png";
    },
    // 指针图片
    pointerPic() {
      return this.$store.getters.static.baseImgPath + "wheels-pointer.png";
    }
  },
  components: {
    explain: explain,
    PopupActivityEnd: PopupActivityEnd,
    PopupNoPrize: PopupNoPrize,
    PopupWinPrize: PopupWinPrize,
    Adventures: Adventures,
    PopupShare: PopupShare,
    tonyscroll: tonyscroll
  },
  onReady() {
    this.navPrize;
  },

  methods: {
    ...mapMutations(["setLoginBeforePath"]),
    ...mapActions(["mpBindMobile"]),
    callLoad(query) {
      this.wheelsurf_id = query.wheelsurf_id;
      this.getData();
    },
    getData() {
      GET_USERFREQUENCY({
        wheelsurf_id: this.wheelsurf_id
      }).then(res => {
        if (res.data.state === 1) {
          uni.showToast({
            title: "活动还没有开始",
            duration: 3000
          });
        } else if (res.data.state === 2) {
          //活动开始
          this.frequency = res.data.frequency;
        } else if (res.data.state === 3) {
          //活动结束
          this.ActivityEndshow = true;
        }
      });
      GET_WHEELSURFINFO({ wheelsurf_id: this.wheelsurf_id }).then(res => {
        this.info = res.data;
        this.adventuresShow = true;
      });
      // 中奖名单
      GET_PRIZERECORDS({ wheelsurf_id: this.wheelsurf_id }).then(res => {
        {
          this.win = res.data.data;
        }
      });
    },
    share() {
      // #ifdef H5
      if (isWeixin()) {
        this.isshare = true;
      } else {
        this.$Prompt.toast("请点击下方工具栏“分享”按钮进行分享");
      }
      // #endif
      // #ifdef APP-PLUS
      $Plugins.shareWithSystem({
        summary: "砸金蛋",
        href: this.shareParams.link
      });
      // #endif
    },
    winPrizeclose() {
      this.winPrize = false;
    },
    closeshare() {
      this.isshare = false;
    },
    handDescription() {
      this.isshow = true; // 点击活动说明
    },
    handclose() {
      this.isshow = false;
    },
    navPrize() {
      this.$Navigate.push("/packages/prize/list"); // 点击我的奖品跳转
    },
    handendclose() {
      this.ActivityEndshow = false; //活动结束页面关闭
      this.$Navigate.replace("/pages/mall/index");
    },
    NoPrizeclose() {
      //未中奖
      this.noPrize = false;
    },

    rotateHandle() {
      //点击抽奖
      const $this = this;
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
          url: "/pages/member/bind"
        });
        // #endif
        // #ifdef MP-WEIXIN
        this.ShowbindMobile = true;
        // #endif
        return false;
      }
      if ($this.frequency === 0) {
        uni.showToast({
          title: "抱歉，没有抽奖机会了",
          icon: "none"
        });
        return false;
      }
      if (!$this.clickFlag) return false;
      $this.clickFlag = false; // 旋转结束前，不允许再次触发
      GET_USERWHEELSURF({ wheelsurf_id: $this.wheelsurf_id }).then(res => {
        if (res.code == 0 || res.code == 1) {
          $this.prizeCode = res.code; //0 => 未中奖 1 => 中奖
          $this.termname = res.data.term_name;
          $this.prizename = res.data.prize_name;
          for (let index = 0; index < $this.info.prize.length; index++) {
            if ($this.info.prize[index].prize_id == res.data.prize_id) {
              // 指定每次旋转到的奖品下标
              this.rotating(index);
              break;
            }
          }
        } else {
          return false;
        }
      });
    },

    // 转动盘子
    rotating(index) {
      if (this.frequency !== -9999) {
        this.frequency = this.frequency - 1;
      }
      let resultIndex = index, // 最终要旋转到哪一块，对应prize_list的下标
        randCircle = 10; // 附加多转几圈
      let resultAngle = []; //最终会旋转到下标的位置所需要的度数
      if (this.info.prize.length == 6) {
        resultAngle = [360, 300, 240, 180, 120, 60];
      } else if (this.info.prize.length == 8) {
        resultAngle = [360, 315, 270, 225, 180, 135, 90, 45];
      } else if (this.info.prize.length == 10) {
        resultAngle = [360, 324, 288, 252, 216, 180, 144, 108, 72, 36];
      } else if (this.info.prize.length == 12) {
        resultAngle = [360, 330, 300, 270, 240, 210, 180, 150, 120, 90, 60, 30];
      }

      // 转动盘子
      let rotateAngle =
        this.startRotDegree +
        randCircle * 360 +
        resultAngle[resultIndex] -
        (this.startRotDegree % 360);
      this.startRotDegree = rotateAngle;
      this.rotateAngle = "rotate(" + rotateAngle + "deg)";

      // 旋转结束后，允许再次触发
      setTimeout(() => {
        this.clickFlag = true;
        this.gameOver();
      }, 5000); // 延时，保证转盘转完
    },

    gameOver() {
      if (this.prizeCode === 0) {
        //未中奖
        this.noPrize = true;
      } else if (this.prizeCode === 1) {
        //中奖
        this.winPrize = true;
      }
    },
    // 关闭授权
    closeBind() {
      this.ShowbindMobile = false;
    },
    //确认授权
    getphonenumber(event) {
      this.ShowbindMobile = false;
      if (event.detail.encryptedData) {
        this.mpBindMobile(event.detail);
      } else {
        console.log("拒绝获取手机");
      }
    }
  }
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
    .titleText {
      height: 100rpx;
      line-height: 100rpx;
    }
    .confirmText {
      height: 100rpx;
      line-height: 100rpx;
    }
    .allButton {
      display: flex;
      justify-content: space-around;
      button {
        width: 35%;
      }
    }
  }
}
.pages {
  width: 100vw;
  // height: 100vh;
  background-color: #e43130;

  //  width: 100%;
  overflow: hidden;
  // min-height: 56px;
}
.dial {
  height: 100%;
  width: 100%;
}
.bgimg {
  width: 100vw;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: contain;
}

.rigth-tap {
  position: absolute;
  top: 15%;
  right: 0rpx;
  z-index: 999;
}
.description {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ff446e;
  width: 140upx;
  height: 55upx;
  margin-bottom: 40upx;
  font-size: 28upx;
  background-color: #fff;
  border-bottom-left-radius: 40rpx;
  border-top-left-radius: 40rpx;
}

.wheel-wrap {
  position: relative;
  top: -600rpx;
  left: 0;
  width: 100%;
}
.wheel-main {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 10px;
}
.wheel-bg {
  position: absolute;
  top: 0%;
  width: 74%;
  padding-bottom: 74%;
  border-radius: 50%;
}
.wheel-pointer-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -56%);
  width: 25%;
  z-index: 100;
}
.wheel-pointer {
  position: relative;
  padding-bottom: 100%;
  width: 100%;
}
.wheel-pointer image {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 285rpx;
  left: 0;
}
.wheel-chance {
  position: absolute;
  top: 570rpx;
  width: 100vw;
  text-align: center;
  color: #fff;
  font-size: 28upx;
  margin-top: 300upx;
}
.wheel-chance span {
  color: #ffff00;
}
.prize-wrap {
  background-color: #fff;
  border-radius: 20rpx;
  position: relative;
  bottom: 0;
  width: 90%;
  height: 400rpx;
  margin: 0 auto;
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
</style>
