<template>
  <view :class="items.id">
    <view class="delivery-group" :style="styles" v-show="isShow">
      <lk-cell is-link @click="click">
        <view
          slot="icon"
          class="title"
          :style="{ color: items.style.titlecolor }"
        >
          配送
        </view>
        <view class="value" :style="{ color: valueColor }">
          {{ valueText }}
        </view>
        <div slot="rightIcon" class="right-box">
          <text class="text-link">切换</text>
          <lk-icon name="arrow" custom-class="lk-cell__right-icon" />
        </div>
      </lk-cell>
      <lk-popup v-model="show" position="bottom">
        <view class="delivery-popup">
          <view class="foot-btn-group fixed">
            <lk-button round block @click="show = false">关闭</lk-button>
          </view>
        </view>
      </lk-popup>
    </view>
  </view>
</template>

<script>
import reform from "@/components/mixin/reform";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      show: false
    };
  },
  mixins: [reform],
  computed: {
    ...mapGetters(["token"]),
    isShow() {
      return this.items.params.show;
    },
    styles() {
      return formatStyle({
        marginTop: pxTorpx(this.items.style.margintop),
        marginBottom: pxTorpx(this.items.style.marginbottom)
      });
    },
    valueText() {
      return this.items.params.info.address || "请选择配送地址";
    },
    valueColor() {
      return this.items.params.isCurrent
        ? this.items.style.currentcolor
        : this.items.style.nocurrentcolor;
    }
  },
  methods: {
    click() {
      this.show = true;
    },
    select(item) {
      this.$emit("event", "delivery", item);
      this.items.params.info = item;
      this.items.params.isCurrent = true;
      this.show = false;
    }
  }
};
</script>

<style scoped lang="scss">
.delivery-group {
  .title {
    width: 100rpx;
    color: $text-gray;
  }

  .value {
    color: $text-light;
  }

  .right-box {
    display: flex;
    align-items: center;
  }

  .text-link {
    font-size: $font-size-sm;
  }

  .delivery-popup {
    width: 100%;
    height: calc(100vh - var(--window-top));
    background: #fff;
    position: relative;
  }
}
</style>
