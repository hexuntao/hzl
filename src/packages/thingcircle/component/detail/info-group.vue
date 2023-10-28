<template>
  <view class="info-group" :class="'info-group-' + type">
    <view class="info">
      <view class="tags">
        <view
          class="item item-goods"
          v-if="type == 'video' && info.recommend_goods"
          @click="showGoodsPopup"
        >
          <lk-icon name="cart" />
          <text class="text">视频推荐商品</text>
        </view>
      </view>
      <view class="name">{{ info.title }}</view>
      <view class="content" v-if="info.content">
        <view
          class="text"
          style="line-height:20px"
          :style="contentAll.height"
          :id="'content_' + info.id"
        >
          {{ info.content }}
        </view>
        <view class="show-all" v-if="showAllText" @tap="showAll = !showAll">
          {{ contentAll.text }}
        </view>
      </view>
      <view class="tags">
        <view class="item item-topic" v-if="info.topic_title">
          <text># </text>
          <text class="text">{{ info.topic_title }}</text>
        </view>
        <view class="item item-location" v-if="info.location">
          <lk-icon name="location" />
          <text class="text">{{ info.location }}</text>
        </view>
      </view>
      <view class="foot">
        <view class="time">
          {{ timeDateText }}
        </view>
        <view class="read"> 阅读 {{ readText }} </view>
      </view>
    </view>
  </view>
</template>

<script>
import { wan, formatDate } from "@/common/utils";
export default {
  data() {
    return {
      showAllText: false,
      showAll: false
    };
  },
  watch: {
    "info.id"(e) {
      this.setContentHeight();
    }
  },
  props: {
    type: String,
    info: Object
  },
  computed: {
    timeDateText() {
      return formatDate(this.info.create_time, "YYYY-MM-DD hh:mm:ss");
    },
    readText() {
      return wan(this.info.reading_volumes);
    },
    contentAll() {
      return {
        height: this.showAll ? "height:40px" : "",
        text: this.showAll ? "展开" : "收起",
        class: "nowrap"
      };
    }
  },
  mounted() {
    this.setContentHeight();
  },
  methods: {
    setContentHeight() {
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select("#content_" + this.info.id)
          .boundingClientRect(data => {
            if (this.type == "video") {
              this.showAllText = data.height > 40;
              this.showAll = data.height > 40;
            }
          })
          .exec();
      });
    },
    showGoodsPopup() {
      this.$emit("show-goods-popup", this.info.recommend_goods_list);
    }
  }
};
</script>

<style lang="scss" scoped>
$blue-color: $blue;
.info-group {
}
.info {
  padding: $cell-padding;
  font-size: $font-size-sm;
  line-height: 48rpx;
  position: relative;
  .name {
    font-size: $font-size-lg;
    display: -webkit-box;
    overflow: hidden;
    line-height: 40rpx;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    max-height: 80rpx;
    font-weight: 800;
  }
  .content {
    display: flex;
    flex-flow: row;
    margin: 10rpx 0;
    line-height: 40rpx;
    justify-content: space-between;
    .text {
      overflow: hidden;
      color: $text-gray;
      font-size: $font-size;
    }
    .nowrap {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-wrap: break-word;
    }
    .show-all {
      flex: none;
      color: $blue-color;
      margin-left: 20rpx;
    }
  }
  .tags {
    display: flex;
    flex-flow: row;
    line-height: 40rpx;
    margin: 10rpx 0;
    .item {
      padding: 0 20rpx;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 60rpx;
      color: #fff;
      max-width: 260rpx;
      overflow: hidden;
      margin-right: 20rpx;
      .text {
        display: block;
        max-width: 260rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .item-topic {
      background-color: rgba(91, 146, 225, 0.15);
      color: #5b92e1;
    }
    .item-location {
      background-color: rgba(114, 210, 145, 0.15);
      color: #72d291;
    }
    .item-goods {
      background-color: rgba(114, 210, 145, 0.15);
      color: #ff7837;
    }
  }
  .foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $text-light;
    .time {
    }
    .read {
    }
  }
}

.info::after {
  position: absolute;
  box-sizing: border-box;
  content: " ";
  pointer-events: none;
  right: 0;
  bottom: 0;
  left: 32rpx;
  border-bottom: 2rpx solid $border-color;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}
.info-group-video {
  position: absolute;
  left: 0;
  right: 140rpx;
  z-index: 10;
  bottom: 80rpx;
  .info {
    background: transparent;
    color: #fff;
    .content {
      .text {
        color: #fff;
      }
    }
    .tags {
      .item {
        background: rgba(255, 255, 255, 0.3);
      }
    }
    .foot {
      display: none;
      color: #fff;
    }
  }
}
.info-group-imgtext {
  .info {
    background: #fff;
  }
}
</style>
