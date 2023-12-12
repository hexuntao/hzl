 <template>
  <view>
    <!-- 刮奖 -->
    <view class="withbg">
      <view class="scratch">
        <text class="text">{{message}}</text>
        <view class="box">
          <canvas
            class="canvas-box"
            canvas-id="canvas-id"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
          ></canvas>
        </view>
      </view>
    </view>
    <view class="scratchcard-chance" v-if="this.frequency !==-9999">
      剩余抽奖次数：
      <text>{{frequency}}</text>次
    </view>
    <view class="btn-continue">
      <text   @click="again">再刮一次</text>
    </view>

    <Popup-ActivityEnd v-if="ActivityEndshow" />
    <!-- 中奖 -->
    <PopupWinPrize
      :isShow="isWin"
      :termname="termname"
      :prizename="prizename"
      @close="close"
      @share="share"
    />
    <!-- 没有中奖 -->
    <PopupNoPrize :isShow="noprize" @close="close" @share="share" />

    <PopupShare :isShow="isshare" @close="closeshare" />
  </view>
</template>
 
 <script>
import Scratch from "./scratch.js";
import PopupActivityEnd from "./PopupActivityEnd"; //活动结束
import PopupShare from "./PopupShare"; //分享
import PopupNoPrize from "./PopupNoPrize"; //没有中奖
import PopupWinPrize from "./PopupWinPrize"; //中奖弹出框
import {
  GET_SCRATCHCARDINFO,
  GET_FREQUENCY,
  GET_PRIZERECORDS,
  SET_USERSCRATCHCARD
} from "@/common/interface/scratchcard";

export default {
  props: {
    scratchcard_id: null
  },
  data: function() {
    return {
      isshare: false,
      message: "",
      termname: "", //奖项内容
      prizename: "", //奖项名称
      isContinue: true, //是否在砸一次
      frequency: "", //抽奖次数
      isWin: false, // 中奖
      noprize: false,
      scratchWidth: 350, // 绘制刮奖范围宽
      scratchHeight: 150, // 绘制刮奖范围高
      scratchSize: 10, // 触手大小
      scratchScale: 0.25, // 需刮开百分比
      ActivityEndshow: false,
      prizecode: null //中奖状态
    };
  },
  mounted: async function(option) {
    this.initCanvas();
    console.log(option);

    //活动状态
    const scartstate = await GET_FREQUENCY({
      scratch_card_id: this.scratchcard_id
    });
    // console.log(scartstate);
    this.frequency = scartstate.data.frequency;
    if (scartstate.data.state == 1) {
      uni.showToast({
        title: "活动还没有开始",
        duration: 5000,
        icon: "none"
      });
    } else if (scartstate.data.state == 2) {
      this.init();
    } else if (scartstate.data.state == 3) {
      this.ActivityEndshow = true;
    }
  },
  //注册
  components: {
    PopupActivityEnd,
    PopupNoPrize,
    PopupWinPrize,
    PopupShare
  },
  methods: {
  
    initCanvas() {
      // 刮奖初始化信息必须在onReady后，不然h5不支持（小程序可在onLoad执行）
      new Scratch(this, {
        canvasId: "canvas-id",
        width: this.scratchWidth,
        height: this.scratchHeight,
        size: this.scratchSize,
        scale: this.scratchScale
      });
    },
    async init() {
      //抽奖

      const prizedata = await SET_USERSCRATCHCARD({
        scratch_card_id: '4'
      });
      // console.log("scratch_card_id: 3");

      this.message = prizedata.message;
      if (prizedata.code === 1) {
        this.termname = prizedata.data.term_name;
        this.prizename = prizedata.data.prize_name;
        this.prizecode = prizedata.code;
      } else {
        this.prizecode = prizedata.code;
      }
    },

    again() {
      //再刮一次
      this.frequency--;
      this.initCanvas();
      this.isContinue = true;
      this.init();
    },
    share() {
      this.isshare = true;
    },
    closeshare() {
      this.isshare = false;
    },
    // 关闭
    close() {
      (this.isWin = false), (this.noprize = false);
    }
  }
};
</script>
 
 <style scoped lang="scss">
.text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40rpx;
}
.withbg {
  width: 610upx;
  height: 310upx;
  background-color: #fff;
  margin: 0 auto;
  border-radius: 20rpx;
}
.scratch {
  width: 600upx;
  height: 300upx;

  background-size: contain;
  margin: 0 auto;
  padding: 29upx 25upx 21upx;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  .box {
    width: 100%;
    height: 100%;

    border-radius: 20upx;
    position: relative;
    overflow: hidden;

    .img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .canvas-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100.5%;
      height: 100%;
      border-radius: 20upx;
      overflow: hidden;
    }
    .tip {
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 999;
      text-align: center;
      .text {
        font-size: 30upx;
        font-weight: bold;

        margin-top: 69upx;
        .text-tip {
          display: inline-block;
          vertical-align: middle;
        }
        .light {
          display: inline-block;
          vertical-align: middle;
          margin: 0 6upx !important;
        }
      }
      .btn {
        width: 360upx;
        height: 82upx;
        border: none;
        border-radius: 41upx;
        margin: 59upx auto 0;
        position: relative;
        background: none;
        .btn-img {
          border: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .text {
          display: inline;
          position: absolute;
          text-align: center;
          color: #fff;
          font-size: 30upx;
          font-weight: bold;
          margin: 0;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .award-box {
      width: 100%;
      height: 100%;
      border-radius: 20upx;
      text-align: center;
      line-height: 270upx;

      .text {
        font-size: 40upx;
        font-weight: bold;
      }
    }
  }
}


.btn-continue{
  background-color: #fff55a;
  border: 1px solid #fff55a;
  color: #a50000;
  margin: 30rpx auto;
  display: block;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 40rpx;
  box-sizing: border-box;
  box-shadow: 0px 4px 1px #fec201;
  width: 60%;
  text-align: center;
}

.scratchcard-chance {
  text-align: center;
  color: #fff;
  font-size: 28rpx;
  margin-top: 20rpx;
}
.scratchcard-chance span {
  color: #ffff00;
}
</style>
