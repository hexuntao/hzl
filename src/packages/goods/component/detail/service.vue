<template>
  <view :class="items.id">
    <view class="service-group" :style="styles" v-if="isShow">
      <lk-cell is-link @click="click">
        <view class="value">
          <view class="item" v-for="(t, i) in items.data" :key="i">
            <image class="image" :src="t.imgurl | addDomain" />
            <text class="title" :style="{ color: items.style.titlecolor }">
              {{ t.title }}
            </text>
          </view>
        </view>
      </lk-cell>
      <lk-popup
        v-model="popupShow"
        position="bottom"
        round
        closeable
        title="服务说明"
      >
        <lk-cell
          :icon="l.imgurl | addDomain"
          v-for="(l, i) in items.data"
          :key="i"
        >
          <view
            slot="title"
            class="title"
            :style="{ color: items.style.titlecolor }"
          >
            {{ l.title }}
          </view>
          <view
            slot="label"
            class="desc"
            :style="{ color: items.style.desccolor }"
          >
            {{ l.desc }}
          </view>
        </lk-cell>
      </lk-popup>
    </view>
  </view>
</template>

<script>
import reform from "@/components/mixin/reform";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx, isEmpty } from "@/common/utils";
export default {
  data() {
    return {
      popupShow: false
    };
  },
  mixins: [reform],
  computed: {
    isShow() {
      return !isEmpty(this.items.data) && this.items.params.show;
    },
    styles() {
      return formatStyle({
        marginTop: pxTorpx(this.items.style.margintop),
        marginBottom: pxTorpx(this.items.style.marginbottom)
      });
    }
  },
  methods: {
    click() {
      this.popupShow = true;
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.service-group {
  .value {
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
  }

  .item {
    display: flex;
    margin-right: 20rpx;
    align-items: center;
    white-space: nowrap;
    font-size: $font-size-sm;
  }

  .image {
    display: block;
    width: 48rpx;
    height: 48rpx;
    margin-right: 10rpx;
  }

  .title {
    color: $text-color;
  }

  .desc {
    color: $text-light;
    font-size: $font-size-sm;
  }
}
</style>
