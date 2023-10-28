<template>
  <view class="choice-address">
    <view class="address-tab">
      <lk-cell center is-link @click="onZhihuan">
        <lk-icon
          slot="icon"
          square
          size="24"
          color="#9eabbd"
        />
        <view class="info">
          <view class="head">
            <view class="title">{{ tabInfo.order_no }}</view>
          </view>
          <view class="label">{{ tabInfo.title }} {{ tabInfo.value }}</view>
        </view>
      </lk-cell>
    </view>

    <lk-popup  v-model="showList"
      title="选择置换商品"
      position="bottom"
      round
      closeable
    >
      <view class="items">
        <lk-load-list-view
          :fixed="false"
          ref="load"
          @init="loadInit"
          :down="downOption"
          @down="downCallback"
          :up="upOption"
          @up="upCallback"
        >
          <lk-radio-group v-model="order_goods_id" :active-color="theme.color">
            <view class="item">
              <lk-cell-zhihuan
                v-for="(item, index) in list"
                :key="index"
                center
                :title="item.goods_name"
                :label="item.sku_name_show"
                :order_no="item.order_no"
                clickable
                @click="onSelect(item)"
              >
                <lk-radio slot="rightIcon" :name="item.order_goods_id" />
              </lk-cell-zhihuan>
            </view>
          </lk-radio-group>
        </lk-load-list-view>
      </view>

    </lk-popup>

  </view>
</template>

<script>

import { GET_ORDERZHIHUANG } from "@/common/interface/order";
import loadMixin from "@/mixins/load-list";
export default {
  data() {
    return {
      onbackevent: "on-back-address",
      showList: false,
      // list: [],
      showEdit: false,
      params: {
        page_index: 1,
        page_size: 12
      },
      upOption: {
        auto: false
      },
      downOption: {
        use: false
      },
      is_saving: false,
      order_goods_id: 0
    };
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [loadMixin],
  computed: {
    tabInfo() {
      const info = this.info;
      console.log(111222333);
      console.log(info);
      this.order_goods_id = info.order_goods_id || 0;
      return {
        icon: info.order_goods_id ? "location-o" : "add-o",
        order_no: info.order_no ? info.order_no : "",
        title: info.order_goods_id ? info.goods_name : "",
        value: info.order_goods_id ? info.sku_name_show : "",
        label: info.order_goods_id ? info.address : ""
      };
    }
  },
  mounted() {
    uni.$on(this.onbackevent, data => {
      if (data) {
        this.resetList();
      }
    });
  },
  beforeDestroy() {
    uni.$off(this.onbackevent);
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      this.getZhihuanList(this.params).then(list => {});
    },
    onZhihuan() {
      this.showList = true;
      if (!this.list.length) {
        this.$load.triggerUpScroll();
      }
    },
    onSelect(item) {
      if (this.showList) {
        this.$emit("select", item);
        this.showList = false;
        this.order_goods_id = item.order_goods_id;
      }
    },
    getZhihuanList(params) {
      return new Promise((resolve, reject) => {
        const list = [];
        GET_ORDERZHIHUANG(params)
          .then(({ data }) => {
            const arr = data.list || [];
            arr.forEach(e => {
              let obj = {};
              obj.order_goods_id = e.order_goods_id;
              obj.goods_name = e.goods_name;
              obj.sku_name_show = e.sku_name+' ￥'+e.real_money_new+' x'+e.num;
              obj.order_no = e.order_no;
              obj.num = e.num;
              list.push(obj);
            });
            this.concatList(list, data.total_count);
            resolve(list);
          })
          .catch(() => {
            this.$load.endErr();
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.choice-address {
  .address-tab {
    position: relative;
    padding-bottom: 4rpx;
    .info {
      display: flex;
      flex-flow: column;
      .head {
        display: flex;
        justify-content: space-between;
      }
      .value {
        font-size: $font-size-sm;
        color: $text-light;
      }
      .label {
        font-size: $font-size-sm;
        color: $text-light;
        line-height: 36rpx;
      }
    }
  }

  .address-tab::before {
    content: "";
    z-index: 1;
    left: 0;
    right: 0;
    bottom: 0;
    height: 4rpx;
    position: absolute;
    background: -webkit-repeating-linear-gradient(
      135deg,
      #ff6c6c 0,
      #ff6c6c 20%,
      transparent 0,
      transparent 25%,
      #3283fa 0,
      #3283fa 45%,
      transparent 0,
      transparent 50%
    );
    background: repeating-linear-gradient(
      -45deg,
      #ff6c6c 0,
      #ff6c6c 20%,
      transparent 0,
      transparent 25%,
      #3283fa 0,
      #3283fa 45%,
      transparent 0,
      transparent 50%
    );
    background-size: 160rpx;
  }

  .items {
    width: 100%;
    height: 70vh;
    overflow-y: auto;
    padding-bottom: 160rpx;
  }
  .item{
    width: 100%;
  }
}
</style>
