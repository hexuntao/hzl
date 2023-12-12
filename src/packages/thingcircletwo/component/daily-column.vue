<template>
  <view class="cell-item">
    <view class="date">
      <view class="box">
        <view class="day">{{ day }}</view>
        <view class="month">{{ month }}</view>
      </view>
    </view>
    <view class="wrapper">
      <view
        class="item"
        v-for="(item, index) in columns"
        :key="index"
        @click="toDetail(item)"
      >
        <view class="image">
          <image :src="item.image" mode="aspectFill" />
        </view>
        <view class="text">{{ item.title }}</view>
      </view>
    </view>
  </view>
</template>

<script>
function formateTime(timeStamp, index) {
  if (!timeStamp) return timeStamp;
  var time_list = timeStamp.split("-");
  return time_list[index];
}
export default {
  data() {
    return {};
  },
  props: {
    items: Object
  },
  computed: {
    day() {
      return formateTime(this.items.create_day, 2);
    },
    month() {
      return formateTime(this.items.create_day, 1) + "月";
    },
    columns() {
      const list = this.items.child_data || [];
      let arr = [];
      list.forEach(e => {
        let img = "";
        if (e.thing_type == 2) {
          img = e.video_img.pic_cover;
        } else {
          img = e.img_temp_array[0].pic_cover;
        }
        arr.push({
          id: e.id,
          thing_type: e.thing_type,
          title: e.title || e.content,
          image: img
        });
      });
      return arr;
    }
  },
  methods: {
    toDetail(item) {
      this.$Navigate.push({
        path: "/packages/thingcircletwo/detail",
        query: {
          type: item.thing_type == 2 ? "video" : "imgtext",
          thing_id: item.id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-item::after {
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
.cell-item {
  display: flex;
  flex-flow: row;
  background-color: #ffffff;
  position: relative;
  .date {
    flex: none;
    color: $text-gray;
    display: flex;
    flex-flow: row;
    width: 140rpx;
    justify-content: flex-end;
    .box {
      display: flex;
      justify-items: center;
      justify-content: center;
    }
  }
  .day {
    font-size: 48rpx;
    line-height: 120rpx;
  }
  .month {
    font-size: $font-size-sm;
    line-height: 136rpx;
    padding-left: 10rpx;
  }
  .wrapper {
    flex: 1;
    display: flex;
    flex-flow: column;
  }
  .item {
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
    padding: $cell-padding;
  }
  .image {
    width: 120rpx;
    height: 120rpx;
    margin-right: 20rpx;
    background-color: $image-background;
    image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .text {
    line-height: 40rpx;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    flex: 1;
    max-height: 80rpx;
  }
}
</style>
