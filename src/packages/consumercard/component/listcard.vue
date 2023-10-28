<template>
  <view>
    <view class="cell" @click="toDetail(item.card_id)">
      <view>
        <view class="info" :class="itemBg">
          <view>
            <view class="name">{{ item.goods_name }}</view>
            <view class="time">
              有效期至：
              <text>{{ item.invalid_time }}</text>
            </view>
          </view>
          <view class="num">
            <view>{{ numText }}</view>
            <view class="strong" v-if="numText != '最后一天'">
              {{ item.surplus_num }}
            </view>
          </view>
        </view>
      </view>
    </view>
		<!-- <view class="cell" @click="toDetail(item.card_id)">
		  <view>
		    <view class="info" :class="itemBg">
		      <view>
		        <view class="name">天河核销</view>
		        <view class="time">
		          技师名称：
		          <text>你好</text>
		        </view>
						<view class="">2020:00:00</view>
		      </view>
		      <view class="num">
		        <view>待核销</view>
		        <view  >
		          预约时间：00:00
		        </view>
		      </view>
		    </view>
		  </view>
		</view> -->
  </view>
</template>

<script>
export default {
  props: {
    item: {}
  },
  computed: {
    numText() {
      const { type, state, surplus_num } = this.item;
      let text = "";
      if (type == 1) {
        text = state != 2 && surplus_num == 0 ? "最后一天" : "剩余天数";
      } else {
        text = "剩余次数";
      }
      return text;
    },
    itemBg() {
      let className = "";
      if (this.item.state == 2) {
        className = "disabled-bg";
      } else {
        className = this.item.type == 1 ? "time-bg" : "number-bg";
      }
      return className;
    }
  },
  methods: {
    toDetail(card_id) {
      this.$Navigate.push(`/packages/consumercard/detail?cardid=${card_id}`);
    }
  }
};
</script>

<style scoped lang="scss">
.cell {
  margin-bottom: 20rpx;
  margin-top: 10rpx;
}
.info {
  color: #ffffff;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  width: 90%;
  height: 160rpx;
  align-items: center;
  margin: 0 auto;
  background-color: #999999;
  padding: 0rpx 15rpx 0rpx 15rpx;
  border-radius: 15rpx;
}
.num {
  text-align: center;
}
.name {
  padding-bottom: 18rpx;
}
.strong {
  font-size: 40rpx;
}
.number-bg {
  background: #2c9cf0;
}

.time-bg {
  background: #ffab32;
}

.disabled-bg {
  background: #999;
}
</style>
