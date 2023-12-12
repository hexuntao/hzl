<template>
  <view class="header" style="background-color:#fff;">

    <view class="icon-tabs-group" style="position:relative;">

      <view class="tabs-box" style="width:700rpx;margin-right:25rpx;margin-left:25rpx;display:block;">
        <view class="tabs">
          <lk-tabs
              v-model="active2"
              active-color="#000"
              color="#acacac"
              line-color="#fff"
              height="44"
              slot-title

              :nav-per-view="5"

              @change="onChange2"
          >
            <lk-tab v-for="(tab, index) in tabs2" :key="index">
              <text style="color:24rpx;">{{ tab.short_name }}</text>
            </lk-tab>
          </lk-tabs>
        </view>
      </view>

    </view>

  </view>
</template>

<script>
import { mapActions } from "vuex";
import { GET_GOODSCATE } from "@/common/interface/goods";
import { formatStyle } from "@/common/utils/stringify";
let systemInfo = uni.getSystemInfoSync();
export default {
  data() {
    return {
      active: 1,

      tabs2:[],
      active2: 0,
    };
  },

  props: {
    categoryid: {
      type: [String, Number],
      default: 0,
    },

  },
  mounted() {
    this.getData();
  },
  computed: {

  },

  methods: {

    getData() {

      GET_GOODSCATE({category_id:this.categoryid}).then(({ data }) => {
        this.tabs2 = data.list;
        this.onChange2(0);
      });
    },

    onChange2(index) {
      let text = this.tabs2[index]['short_name'];
      let category_id = this.tabs2[index]['category_id'];
      this.$emit("change", { follow: this.active === 0 ? 1 : 0, type:text,category_id:category_id });
    },

  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-flow: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
}
.icon-tabs-group {
  display: flex;
  flex-flow: row;
  background: #ffffff;
  .tabs-box {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .tabs {
  }
  .icon-box {
    width: 88rpx;
    height: 88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    position:absolute;
    right:-10rpx;

  }
}
</style>
