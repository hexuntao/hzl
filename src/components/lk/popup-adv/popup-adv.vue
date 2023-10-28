<template>
  <lk-popup
    v-model="show"
    :mask-close="false"
    prevent-touchmove
    wrpper-style="background:transparent;"
    :custom-style="{ zIndex: 1000, bottom: '0' }"
  >
    <view class="box">
      <view class="image" :style="imageStyle">
        <image :src="adv.image" mode="aspectFit" @click="toLink" />
      </view>
      <lk-icon name="close" square color="#ffffff" size="20" @click="close" />
    </view>
  </lk-popup>
</template>

<script>
import { mapState } from "vuex";
import { pxTorpx } from "@/common/utils";
import { formatStyle } from "@/common/utils/stringify";
import $Storage from "@/api/storage";

const DateNow = new Date().getTime();

export default {
  data() {
    return {
      show: false
    };
  },
  props: {},
  watch: {
    adv(e) {
      this.showAdv();
    }
  },
  computed: {
    ...mapState({
      adv: ({ config }) => config.adv
    }),
    imageStyle() {
      return formatStyle({
        width: pxTorpx(this.adv.width),
        height: pxTorpx(this.adv.height)
      });
    },
    hours() {
      const adv = this.adv;
      const rule = parseInt(adv.rule);
      let hour = 0;
      if (rule) {
        if (rule == 1) {
          hour = 24;
        } else if (rule == 2) {
          hour = 24 * 3;
        } else if (rule == 3) {
          hour = 24 * 5;
        } else if (rule == 4) {
          hour = 24 * 30;
        }
        hour = hour * 3600 * 1000;
      }
      return hour;
    }
  },
  mounted() {
    this.showAdv();
  },
  methods: {
    showAdv() {
      const advDate = $Storage.get("adv_date_now");
      if (this.adv.show) {
        if (!advDate) {
          this.show = true;
          return;
        }
        if (!this.hours) {
          this.show = true;
          return;
        }
        if (this.hours) {
          // 有规则情况下
          // 是否是24小时，72小时，5天，一个月内 ，是：不弹出，不是：弹出
          this.show = !(DateNow - parseInt(advDate) < this.hours);
        }
      }
    },
    close() {
      this.show = false;
      $Storage.set("adv_date_now", DateNow);
    },
    toLink() {
      this.$Navigate.push(this.adv.link);
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  .image {
    margin-bottom: 20rpx;
    max-width: 80vw;
    max-height: 80vh;
    width: 700rpx;
    height: 394rpx;
    image {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
