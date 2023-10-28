<template>
 
  <view class="popup" v-if="isShow">
    <view class="popup-explain-wrap">
      <view class="explain-content">
        <view class="prize-title">
          <image :src="explainimg" mode="widthFix" />
          <text>活动奖品</text>
        </view>
        <view class="prize-table">
          <view class="table-th _ul">
            <view class="ulLi">
              <text class="tal">奖项</text>
              <text>奖品名称</text>
              <text class="tar">数量</text>
            </view>
          </view>
          <view class="_ul">
            <view class="ulLi" v-for="(item,index) in info.prize" :key="index">
              <text class="tal">{{item.term_name}}</text>
              <text>{{item.prize_name}}</text>
              <text class="tar">{{item.num}}</text>
            </view>
          </view>
        </view>
        <view class="prize-title">
          <image :src="explainimg" mode="widthFix" />
          <text>活动时间</text>
        </view>
        <view class="time">{{ info.start_time }} ~ {{info.end_time }}</view>

        <view class="prize-title">
          <image :src="explainimg" mode="widthFix" />
          <text>活动说明</text>
        </view>
        <view class="time" v-if="info.desc">{{info.desc}}</view>
      </view>
      <!---知道了-->
      <view class="explain-bottom">
        <image :src="arcs" class="pic-arcs" mode="widthFix" />
        <view class="bottom-wrap">
          <view @click="close" class="buttonClose">知道了</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_SCRATCHCARDINFO } from '@/common/interface/scratchcard';
import { formatDate } from "@/common/utils";
export default {
  data() {
    return {
		info:{}
	};
  },

  props: {
    isShow: {
          type: Boolean,
          default: false
        },
        scratch_card_id: [Number, String]
  },
    computed: {
      // 金元宝图片
      explainimg() {
        return this.$store.getters.static.baseImgPath + "prize_title.png";
      },
      // 半圆图片
      arcs() {
        return this.$store.getters.static.baseImgPath + "arcs.png";
      }
    },

  mounted() {
	GET_SCRATCHCARDINFO({scratch_card_id:this.scratch_card_id}).then(({ data }) => {
	      this.info = data;
		  this.info.start_time=formatDate(data.start_time,"YYYY-MM-DD hh:mm:ss")
		  this.info.end_time=formatDate(data.end_time,"YYYY-MM-DD hh:mm:ss")
	    });
  },
  methods: {
    close() {
          this.$emit("close");
        }
  }
};
</script>

<style lang="scss" scoped>
.popup {
  background-color: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;
  z-index: 2001;
  transition: all 0.2s;
}
.popup-explain-wrap {
  position: relative;
  /* height: 50%; */
  width: 90%;
  left: 50%;
  top: 50%;
  background: linear-gradient(to top, #e94e2f, #95100d);
  border-radius: 16rpx;
  overflow: hidden;
  transform: translate(-50%, -50%);
}
.explain-content {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 40rpx 30rpx 80px;
  margin: 40rpx 30rpx;
}
.prize-title {
  width: 198rpx;
  height: 68rpx;
  position: relative;
  /* overflow: hidden; */
}
.prize-title image {
  width: 100%;
  height: auto;
}
.prize-title text {
  color: #e94e2f;
  text-align: center;
  position: absolute;
  top: 34rpx;
  right: 16px;
  font-size: 24rpx;
}
.prize-table {
  position: relative;
  overflow: hidden;
  margin: 0 15px;
}
.prize-table ._ul .ulLi,
.table-th .ulLi {
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  display: flex;
}
.prize-table ._ul:last-child .ulLi {
  color: #666666;
  height: 60rpx;
  line-height: 60rpx;
}
.prize-table ._ul:last-child {
  max-height: 150px;
  overflow-y: auto;
}
.table-th {
  position: relative;
}
.table-th .ulLi {
  color: #e84d2f;
  font-size: 28rpx;
  height: 60rpx;
  line-height: 60rpx;
}
.table-th:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #cccccc;
  transform: scaleY(0.5);
}
.prize-table ._ul .ulLi text:nth-child(2) {
  width: 50%;
}
.prize-table ._ul .ulLi text {
  display: inline-block;
  width: 25%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.tal {
  text-align: left;
}
.tar {
  text-align: right;
}
.time {
  margin-left: 20px;
  color: #666666;
  font-size: 24rpx;
  padding: 20rpx 0rpx;
}
.explain-bottom {
  width: 100%;
  position: absolute;
  z-index: 100;
  bottom: 0;
  left: 0;
  line-height: 0;
}
.pic-arcs {
  width: 100%;
  display: block;
  height: 40rpx;
}
.explain-bottom .bottom-wrap {
	margin: 0 auto;
  width: 100%;
  height: 80rpx;
  background-color: #e64a2d;
}
.explain-bottom .bottom-wrap .buttonClose {
  display: block;
  margin-bottom: 20rpx;
  background-color: #f7d724;
  color: #e54125;
  border-radius: 20rpx;
  font-size: 25rpx;
  width: 450rpx;
  margin: 0 auto;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
}
</style>