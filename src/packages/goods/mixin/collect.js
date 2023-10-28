import {
  SET_GOODSCOLLECT,
  CANCEL_GOODSCOLLECT
} from "@/common/interface/goods";
export default {
  data() {
    return {
      collectFlag: ""
    };
  },
  computed: {
    collectInfo() {
      return {
        icon: this.collectFlag ? "v-icon-star-f-01" : "v-icon-star-01",
        text: this.collectFlag ? "已收藏" : "收藏",
        color: this.collectFlag ? "#f44" : "inherit",
        api: this.collectFlag ? CANCEL_GOODSCOLLECT : SET_GOODSCOLLECT,
        message: this.collectFlag ? "取消成功" : "收藏成功"
      };
    }
  },
  methods: {
    // 商品 收藏/取消
    goodsCollect(goods_id = 0) {
      if (!this.token) {
        return;
      }
      let params = {
        goods_id
      };
      if (this.promoteType == "seckill") {
        params.seckill_id = this.promoteParams.seckill_id;
      }
      this.collectInfo.api(params).then(() => {
        this.$Prompt.toast({
          icon: "success",
          title: this.collectInfo.message
        });
        this.collectFlag = !this.collectFlag;
      });
    }
  }
};
