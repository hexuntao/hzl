<template>
  <view class="pages">
    <view class="cell-group">
      <lk-checkbox-group
        v-model="value"
        :active-color="theme.color"
        flex-flow="column"
      >
        <view class="item" v-for="(item, index) in list" :key="index">
          <lk-checkbox :name="item.goods_id">
            <view>
              <lk-goods-card
                :title="item.goods_name"
                :image="item.goods_img"
                :price="item.price"
                :origin-price="item.market_price"
              />
            </view>
          </lk-checkbox>
        </view>
      </lk-checkbox-group>
    </view>
    <view class="foot-btn-group fixed">
      <lk-button
        round
        block
        :color="theme.gradient"
        type="danger"
        @click="onSubmit"
      >
        推荐
      </lk-button>
    </view>
  </view>
</template>

<script>
import { GET_RECOMMENDGOODSLIST } from "@/common/interface/thingcircle";
export default {
  name: "packages-thingcircle-release-goods",
  data() {
    return {
      value: [],
      list: []
    };
  },
  computed: {},
  onLoad(query) {
    if (query.ids) {
      let arr = query.ids.split(",");
      this.value = arr.map(e => parseInt(e));
    }
    this.getData();
  },
  methods: {
    getData() {
      GET_RECOMMENDGOODSLIST({}, { loadingText: "加载中" }).then(
        ({ code, data }) => {
          if (code === 0) {
            return this.$Prompt
              .modal({
                title: "提示",
                content: "未开启推荐商品",
                showCancel: false
              })
              .then(() => {
                this.$Navigate.back();
              });
          }
          this.list = data || [];
        }
      );
    },
    onSubmit() {
      uni.$emit("get-release-goodsid", { ids: this.value.join(",") });
      this.$Navigate.back();
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group {
  background-color: #ffffff;
  padding-bottom: 148rpx;
}
.item {
  width: 100%;
  position: relative;
  padding: $cell-padding;
}
.item::after {
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
</style>
