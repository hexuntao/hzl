<template>
  <view class="catalog">
    <view class="list" v-if="info.length>0">
      <lk-cell
        v-for="(item, index) in info"
        :key="index"
        @click="navClick(index)"
      >
        <view slot="title" class="list-title">
          {{item.knowledge_payment_name}}
        </view>
        <view class="same" v-if="getActive==index">
          <text class="line1"></text>
          <text class="line2"></text>
          <text class="line3"></text>
          <text class="line4"></text>
        </view>
        <view class="tisp" v-else>
          <view v-if="showTag">
            <text class="btn" v-if="item.text!=''">{{item.text}}</text>
            <text v-else class="tisp-lock icons icons-lock"></text>
          </view>
        </view>
      </lk-cell>
    </view>
    <view class="empty" v-else>暂无目录</view>
  </view>
</template>

<script>
import { GET_GOODSDETAIL_LIST } from "@/common/interface/course";
export default {
  data() {
    return {
    };
  },
  props: {
    info: {
      type: Array,
      default: () => []
    },
    getActive: [Number, String],
    showTag: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    navClick(index) {
      this.$emit('fnData',index);
    },
  }
};
</script>

<style scoped lang="scss">
.catalog {
  .same {
    display: inline-block;
  }
  .same text {
    display: inline-block;
    width: 4rpx;
    height: 20rpx;
    margin-bottom: 0;
    background-color: $red;
    margin-left: 4rpx;
  }
  .same text.line1 {
    -webkit-animation: line 0.6s infinite ease-in-out alternate;
    -moz-animation: line 0.6s infinite ease-in-out alternate;
    animation: line 0.6s infinite ease-in-out alternate;
  }
  .same text.line2 {
    -webkit-animation: line 0.6s 0.2s infinite ease-in-out alternate;
    -moz-animation: line 0.6s 0.2s infinite ease-in-out alternate;
    animation: line 0.6s 0.2s infinite ease-in-out alternate;
  }
  .same text.line3 {
    -webkit-animation: line 0.6s 0.3s infinite ease-in-out alternate;
    -moz-animation: line 0.6s 0.3s infinite ease-in-out alternate;
    animation: line 0.6s 0.3s infinite ease-in-out alternate;
  }
  .same text.line4 {
    -webkit-animation: line 0.6s 0.15s infinite ease-in-out alternate;
    -moz-animation: line 0.6s 0.15s infinite ease-in-out alternate;
    animation: line 0.6s 0.15s infinite ease-in-out alternate;
  }
  @keyframes line {
    0% {
      height: 2rpx;
    }

    to {
      height: 30rpx;
    }
  }

  @-webkit-keyframes line {
    0% {
      height: 2rpx;
    }

    to {
      height: 30rpx;
    }
  }
}
  .tisp {
    position: absolute;
    right: 0;
    .tisp-lock {
      color: #9e9e9e;
    }
  }
  .btn {
    width: 120rpx;
    height: 48rpx;
    line-height: 48rpx;
    border-radius: 48rpx;
    background: linear-gradient(90deg, #FC4353, #FF5E41);
    font-size: 26rpx;
    color: $white;
    text-align: center;
    display: block;
  }
  .list-title {
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2; /*要显示的行数*/
    -webkit-box-orient: vertical;
  }
</style>
