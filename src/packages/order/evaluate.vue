<template>
  <view class="pages">
    <view class="card-group-box">
      <lk-cell icon="shop-o" :title="order_info.shop.shop_name" />
      <view
        class="items"
        v-for="(item, index) in order_info.goods"
        :key="index"
      >
        <lk-cell :icon="item.img" icon-size="40">
          <view class="praise-box" v-if="!isAgain">
            <view
              class="item"
              v-for="(child, i) in praiseArr"
              :key="i"
              @click="onPraise(index, child.score)"
            >
              <lk-icon
                :name="'v-icon-' + child.icon"
                :color="item.score === child.score ? theme.color : '#999'"
                class-prefix="v-icon"
              />
              <view
                :style="{
                  color: item.score === child.score ? theme.color : '#999'
                }"
              >
                {{ child.text }}
              </view>
            </view>
          </view>
          <view v-else>{{ item.name }}</view>
        </lk-cell>
        <lk-field
          v-model="item.evaluate"
          type="textarea"
          placeholder="分享你购买到此商品的想法与心情"
          rows="4"
          autosize
        />
        <view class="cell-item">
          <lk-upload
            max-count="5"
            :custom-name="index"
            :form-data="{ type: 'evaluate' }"
            @on-success="onSuccess"
            @on-remove="onRemove"
          />
        </view>
      </view>
    </view>
    <view class="score card-group-box" v-if="!isAgain && shop">
      <lk-cell icon="shop-o" title="店铺评分" />
      <view class="cell-item">
        <view class="item">
          <view class="text">描述相符</view>
          <lk-star v-model="shop_desc" size="20" gutter="10" allow-click />
        </view>
        <view class="item">
          <view class="text">物流服务</view>
          <lk-star v-model="shop_stic" size="20" gutter="10" allow-click />
        </view>
        <view class="item">
          <view class="text">服务态度</view>
          <lk-star v-model="shop_service" size="20" gutter="10" allow-click />
        </view>
      </view>
    </view>
    <view class="score card-group-box" v-if="!isAgain && isStore">
      <lk-cell icon="shop-o" title="门店评分" />
      <view class="cell-item">
        <view class="item">
          <view class="text">服务态度</view>
          <lk-star v-model="store_service" size="20" gutter="10" allow-click />
        </view>
      </view>
    </view>
    <view class="foot-btn-group">
      <lk-button
        block
        round
        type="danger"
        :color="theme.gradient"
        :loading="isLoading"
        @click="onSubmit"
      >
        提交
      </lk-button>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { ADD_ORDEREVALUATE } from "@/common/interface/order";
import { Base64 } from "@/common/lib/base64";
import { mapState } from "vuex";
function getListValue(list = []) {
  let a = [];
  list.forEach(e => {
    if (e.response) {
      a.push(e.response.src);
    }
  });
  return a;
}
export default {
  name: "packages-order-evaluate",
  data() {
    return {
      order_id: null,
      order_info: {},
      praiseArr: [
        {
          text: "好评",
          icon: "praise",
          score: 5,
          checked: true
        },
        {
          text: "中评",
          icon: "review",
          score: 3,
          checked: false
        },
        {
          text: "差评",
          icon: "review",
          score: 1,
          checked: false
        }
      ],

      shop_desc: 0,
      shop_service: 0,
      shop_stic: 0,

      store_service: 0, //门店评分

      isAgain: false, //是否再次评价
      isStore: false,

      isLoading: false
    };
  },
  computed: {
    ...mapState({
      shop: ({ config }) => config.addons.shop
    })
  },
  onLoad(options) {
    this.order_info = JSON.parse(options.order_info);
    this.order_id = options.order_id;
    this.isAgain = options.hash == "again";
    this.isStore = !!this.order_info.store_id;
    if (this.order_info.goods) {
      this.order_info.goods.forEach((e, index) => {
        e.name = decodeURIComponent(e.name);
      });
    }
    if (this.order_info.shop) {
      this.order_info.shop.shop_name = decodeURIComponent(
        this.order_info.shop.shop_name
      );
    }
  },
  methods: {
    onPraise(index, score) {
      this.order_info.goods[index].score = score;
    },
    onSuccess(data, i, list, index) {
      this.order_info.goods[index].arrImg = getListValue(list);
    },
    onRemove(i, list, index) {
      this.order_info.goods[index].arrImg = getListValue(list);
    },
    onSubmit() {
      const $this = this;
      const list = $this.order_info.goods;
      let goods_evaluate = [];
      list.forEach(e => {
        let obj = {};
        obj.order_goods_id = e.id;
        obj.content = e.evaluate;
        if (!$this.isAgain) obj.explain_type = e.score;
        obj.images = e.arrImg;
        goods_evaluate.push(obj);
      });
      const params = {};
      params.order_id = $this.order_id;
      params.goods_evaluate = goods_evaluate;
      if (!$this.isAgain && $this.shop_desc) params.shop_desc = $this.shop_desc;
      if (!$this.isAgain && $this.shop_service)
        params.shop_service = $this.shop_service;
      if (!$this.isAgain && $this.shop_stic) params.shop_stic = $this.shop_stic;
      if (!$this.isAgain && $this.isStore && $this.store_service)
        params.store_service = $this.store_service;
      // return console.log(params);
      $this.isLoading = true;
      ADD_ORDEREVALUATE(params, { isAgain: $this.isAgain })
        .then(({ message }) => {
          $this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
            $this.$Navigate.replace("/pages/order/list");
          });
        })
        .catch(() => {
          $this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-item {
  padding: $cell-padding;
  background: #ffffff;
  .item {
    display: flex;
    line-height: 48rpx;
    .text {
      width: 180rpx;
    }
  }
}
.praise-box {
  display: flex;
  flex-flow: row;
  height: 100%;
  .item {
    flex: 1;
    display: flex;
    flex-flow: row;
    justify-content: center;
    align-items: center;
  }
}
</style>
