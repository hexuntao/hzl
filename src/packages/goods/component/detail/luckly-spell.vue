<template>
  <view>
    <view class="card-group-box">
      <lk-cell>
        <view class="lucklyspell">
          <view class="lucklyspellitem">
            <image :src="lucylyimg.img1" class="lucklyimg" />

            <view>
              <view>参与拼团</view>
              <view class="lh">
                <text class="num">{{ info.group_num }}</text
                ><text>人成团</text></view
              >
            </view>
          </view>
          <view class="lucklyspellitem">
            <image :src="lucylyimg.img2" class="lucklyimg" />
            <view
              ><text class="num">{{ info.win_num }}</text
              ><text>人拼中发货</text></view
            >
            <view class="lh"
              ><text class="num">{{ info.loser_num }}</text
              ><text>人不中退款</text></view
            >
          </view>
          <view class="lucklyspellitem">
            <image :src="lucylyimg.img3" class="lucklyimg" />
            <view>未拼中获得奖励</view>
            <view class="lh3"
              ><text class="num">￥</text
              ><text class="num failure_reward">{{ info.failure_reward }}</text
              ><text> 红包</text></view
            >
          </view>
        </view>
      </lk-cell>
    </view>
    <view class="card-group-box">
      <lk-cell :title="recordnum" isLink @click="show = true">
        <view slot="rightIcon" class="right-box">
          <text class="text">查看拼团成员</text>
          <lk-icon name="arrow" custom-class="lk-cell__right-icon" />
        </view>
      </lk-cell>

      <view class="recordlistitem">
        <view class="recordlistimg">
          <view v-for="(item, index) in grouprecordlist" :key="index">
            <image
              :src="item.user_headimg ? item.user_headimg : noAvatar"
              class="headimg"
            />
          </view>
          <view class="showmore" v-if="showmore"> </view>
        </view>
        <view
          ><text>还差 </text>
          <text class="num"
            >{{ info.group_num - info.group_record_list.length }}人</text
          >
          <text>成团</text></view
        >
      </view>
    </view>
    <lk-popup
      v-model="show"
      position="bottom"
      round
      closeable
      title="正在幸运拼团"
    >
      <view class="list">
        <lk-cell v-for="(item, index) in info.group_record_list" :key="index">
          <view class="nowrecordlist">
            <view class="nowrecordlistleft">
              <image
                :src="item.user_headimg ? item.user_headimg : noAvatar"
                class="user_headimg"
              />
              <view class="recordno">
                <view>{{ item.user_name }}</view>
                <view>参团编号：{{ item.record_no }}</view>
              </view>
            </view>
            <view class="addtime">
              {{ item.add_time }}
            </view>
          </view>
        </lk-cell>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showmore: false,
      show: false
    };
  },
  props: {
    info: [Object]
  },
  computed: {
    ...mapGetters(["static"]),
    lucylyimg() {
      const lucylyspellimg = {
        img1: this.static.baseImgPath + "lucklyspell1.png",
        img2: this.static.baseImgPath + "lucklyspell2.png",
        img3: this.static.baseImgPath + "lucklyspell3.png"
      };
      return lucylyspellimg;
    },
    noAvatar() {
      return this.static.noAvatar;
    },

    recordnum() {
      return this.info.group_record_list.length + "人在拼团，可直接参与";
    },
    grouprecordlist() {
      if (this.info.group_record_list.length <= 10) {
        return this.info.group_record_list;
      } else {
        this.showmore = true;
        return this.info.group_record_list.slice(0, 9);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.lucklyspell {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  .lucklyspellitem {
    text-align: center;
    font-size: 22rpx;
    width: 33.33%;
    .lucklyimg {
      width: 40rpx;
      height: 40rpx;
    }

    .failure_reward {
      font-size: 34rpx;
      font-weight: 600;
      padding-right: 4rpx;
    }
  }
}
.num {
  color: red;
}

.text {
  color: $text-light;
  font-size: $font-size-sm;
}

.right-box {
  display: flex;
  align-items: center;
  color: $text-light;
}
.recordlistitem {
  background-color: $white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  position: relative;

  .recordlistimg {
    display: flex;
    .headimg {
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      margin-right: -12rpx;
    }
    .showmore {
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      background-color: #cbcbcb;
      position: relative;
    }
    .showmore::after {
      content: "•••";
      color: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
}
.list {
  height: 70vh;
  overflow-y: auto;
}
.nowrecordlist {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .nowrecordlistleft {
    display: flex;
    .recordno {
      padding-left: 20rpx;
    }
    .recordno :last-child {
      color: #a7a7a7;
    }
  }
  .addtime {
    color: #a7a7a7;
  }

  .user_headimg {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    border: 1rpx solid #ca3b2c;
  }
}
.lucklyspell::after {
  content: "";
  width: 130rpx;
  border: 2rpx dashed #a7a7a7;
  position: absolute;
  top: 23rpx;
  left: 150rpx;
  opacity: 0.3;
}
.lucklyspell::before {
  content: "";
  width: 130rpx;
  border: 2rpx dashed #a7a7a7;
  position: absolute;
  top: 23rpx;
  right: 150rpx;
  opacity: 0.3;
}
.lh {
  line-height: 1.2;
}
.lh3 {
  line-height: 0.9;
}
</style>
