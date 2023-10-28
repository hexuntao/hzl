<template>
  <view :class="items.id" class="card-group-box" v-if="isShow">
    <view class="specs-group" v-if="isShowSpecs">
      <lk-cell is-link @click="click">
        <view
          slot="icon"
          class="title"
          :style="{ color: items.style.titlecolor }"
        >
          规格
        </view>
        <view class="value" :style="{ color: valueColor }">
          {{ valueText }}
        </view>
      </lk-cell>
    </view>
    <view class="attribute-group" v-if="isShowAttribute">
      <lk-cell is-link @click="attributePopupShow = true">
        <view
          slot="icon"
          class="title"
          :style="{ color: items.style.titlecolor }"
        >
          参数
        </view>
        <view class="value" :style="{ color: valueColor }">
          商品参数
        </view>
      </lk-cell>
      <lk-popup
        v-model="attributePopupShow"
        position="bottom"
        round
        closeable
        title="商品参数"
      >
        <view class="attribute-popup">
          <lk-cell v-for="(a, i) in attributeList" :key="i">
            <view class="cell">
              <view class="title">{{ a.attr_value }}</view>
              <view class="value">{{ a.attr_value_name }}</view>
            </view>
          </lk-cell>
        </view>
      </lk-popup>
    </view>
    <view class="service-group" v-if="isShowService">
      <lk-cell is-link @click="servicePopupShow = true">
        <view class="value">
          <view class="item" v-for="(s, i) in serviceList" :key="i">
            <image class="image" :src="s.imgurl" />
            <text class="title" :style="{ color: items.style.titlecolor }">
              {{ s.title }}
            </text>
          </view>
        </view>
      </lk-cell>
      <lk-popup
        v-model="servicePopupShow"
        position="bottom"
        round
        closeable
        title="服务说明"
      >
        <view class="service-popup">
          <lk-cell :icon="l.imgurl" v-for="(l, i) in serviceList" :key="i">
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
        </view>
      </lk-popup>
    </view>
  </view>
</template>

<script>
import reform from "@/components/mixin/reform";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { pxTorpx, addImgSrcDomain } from "@/common/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      attributePopupShow: false,
      servicePopupShow: false
    };
  },
  mixins: [reform],
  computed: {
    isShow() {
      return this.isShowSpecs || this.isShowAttribute || this.isShowService;
    },
    isShowSpecs() {
      return this.items.params.showSpecs;
    },
    isShowAttribute() {
      return !!this.attributeList.length;
    },
    isShowService() {
      return !!this.serviceList.length;
    },
    styles() {
      return formatStyle({
        marginTop: pxTorpx(this.items.style.margintop),
        marginBottom: pxTorpx(this.items.style.marginbottom)
      });
    },
    valueText() {
      return this.items.params.valueText || "请选择规格";
    },
    valueColor() {
      return this.items.params.isCurrent
        ? this.items.style.currentcolor
        : this.items.style.nocurrentcolor;
    },
    attributeList() {
      return this.items.attribute || [];
    },
    serviceList() {
      let arr = [];
      if (this.items.data) {
        for (const key in this.items.data) {
          const item = this.items.data[key];
          item.imgurl = addImgSrcDomain(item.imgurl);
          arr.push(item);
        }
      }
      return arr;
    }
  },
  methods: {
    click() {
      this.$emit("event", "specs", this.items);
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.specs-group,
.attribute-group {
  .title {
    width: 100rpx;
    color: $text-gray;
  }
  .value {
    color: $text-light;
  }
}

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

.attribute-popup {
  width: 100%;
  height: 70vh;
  overflow-y: auto;
  .cell {
    display: flex;
    flex-flow: row;
    .title {
      width: 200rpx;
    }
    .value {
      flex: 1;
      color: $text-color;
    }
  }
}
.service-popup {
  width: 100%;
  height: 70vh;
  overflow-y: auto;
}
</style>
