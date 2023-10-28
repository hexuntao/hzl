<template>
  <view>
    <lk-cell title="优惠券" :value="nameText" is-link @click="isshow" />
    <lk-popup-coupon
      v-model="show"
      :items="list"
      :title="shopName"
      :get-type="1"
      @use="use"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      name: "",
      isUse: 2,
    };
  },
  props: {
    value: Boolean,
    shopName: String,
    list: Array,
    couponNum: [String, Number],
    couponName: [String, Number],
    items: {
      type: Array,
      default: () => [],
    },
    couponUse: [String, Number], //0不允许 优惠券，领货码同时使用

    receiveGoodsuse: [String, Number], //是否使用了领货码 1使用过，2未使
  },
  watch: {
    receiveGoodsuse(e) {
      if (e) this.isUse = e;
    },
  },
  computed: {
    // show: {
    //   get() {
    //     return this.value;
    //   },
    //   set(e) {
    //     this.$emit("input", e);
    //   }
    // },
    nameText() {
      if (this.isUse == 1 && this.couponUse == 0)
        return "优惠券和领货码不能同时使用";
      else
        return this.couponName
          ? "已选：" + this.couponName
          : "有 " + this.couponNum + " 张可用优惠券";
    },
  },
  methods: {
    use(item) {
      const flag = this.items.some(({ coupon_id }) => {
        if (coupon_id == item.coupon_id) {
          this.$Prompt.toast("该优惠券只能使用一次！");
          return true;
        }
      });
      if (!flag) {
        this.$emit("use", item);
        this.show = false;
      }
    },
    isshow() {
      if (this.isUse == 1 && this.couponUse == 0) this.show = false;
      else this.show = true;
    },
  },
};
</script>
