<template>
  <view class="pages">
    <lk-choice-address
      v-if="isShowAddress"
      :info="address"
      @select="onAddress"
    />
    <choice-store
      v-if="isShowStore"
      :info="storeInfo"
      :list="storeList"
      @select="onStore"
    />
    <view class="cell-group">
      <lk-cell
        :icon="info.image"
        icon-size="40"
        :title="info.prize_name"
        :label="info.name"
      />
    </view>
    <view class="foot-btn-group fixed">
      <lk-button
        round
        block
        :color="theme.gradient"
        type="danger"
        :loading="isLoading"
        @click="onReceive"
      >
        立即领取
      </lk-button>
    </view>
  </view>
</template>

<script>
import { GET_PRIZEDETAIL, GET_ACCEPTPRIZE } from "@/common/interface/prize";
import { mapGetters, mapActions } from "vuex";
import { yuan, isEmpty } from "@/common/utils";
import choiceStore from "./component/choice-store";
export default {
  name: "packages-prize-confirm",
  data() {
    return {
      params: {
        member_prize_id: ""
      },
      info: {
        type: null, //奖品类型 1=>余额 2=>积分 3=>优惠券 4=>礼品券 5=>商品 6=>赠品
        goods_type: null //0 => 计时计次商品 1 => 普通商品 3 => 虚拟商品
      },
      address: {},
      storeInfo: {},
      storeList: [],

      isLoading: false
    };
  },
  computed: {
    ...mapGetters(["static", "orderFrom"]),
    defImg() {
      const base = this.static.baseImgPath;
      const obj = {
        1: base + "default-balance.png",
        2: base + "default-integral.png",
        3: base + "default-coupon.png",
        4: base + "default-giftvoucher.png",
        5: base + "default-goods.png",
        6: base + "default-gift.png"
      };
      return obj;
    },
    isShowAddress() {
      return (
        (this.info.type == 5 && this.info.goods_type == 1) ||
        this.info.type == 6
      );
    },
    isShowStore() {
      return this.info.type == 5 && this.info.goods_type == 0;
    }
  },
  onLoad(query) {
    this.params.member_prize_id = query.member_prize_id || "";
    this.getLocation({ showLoading: true }).then(res => {
      this.params.lat = res.lat;
      this.params.lng = res.lng;
      this.getData();
    });
  },
  methods: {
    ...mapActions(["getLocation"]),
    getData() {
      GET_PRIZEDETAIL(this.params).then(({ data }) => {
        this.info.type = data.type;
        this.info.goods_type = data.goods_type;
        this.info.image = data.pic || this.defImg[data.type];
        this.info.name = data.name;
        this.info.prize_name = data.prize_name;

        this.storeList = data.store_list || [];
        if (!isEmpty(data.address)) {
          this.address = {
            name: data.address.consigner,
            tel: data.address.mobile,
            id: data.address.address_id,
            address:
              data.address.province_name +
              data.address.city_name +
              data.address.district_name +
              data.address.address_detail
          };
        }
      });
    },
    onAddress(address) {
      this.address = address;
      this.params.address_id = address.id;
      this.getData();
    },
    onStore(item) {
      this.storeInfo = item;
    },
    onReceive() {
      let params = {};
      console.log(this.address)
      params.member_prize_id = this.params.member_prize_id;
      params.order_from = this.orderFrom;
      if (this.isShowAddress) {
        params.address_id = this.address.id;
        if (!params.address_id) {
          return this.$Prompt.toast("请选择收货地址!");
        }
      }
      if (this.isShowStore) {
        params.card_store_id =
          this.storeInfo.card_store_id || this.storeInfo.store_id;
        if (!params.card_store_id) {
          return this.$Prompt.toast("请选择门店!");
        }
      }
      this.isLoading = true;
      GET_ACCEPTPRIZE(params, { loadingText: "领取中" })
        .then(({ data }) => {
          this.$Navigate.replace("/packages/prize/result").then(() => {
            this.isLoading = false;
          });
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    choiceStore
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  margin: 20rpx 0 190rpx;
}
</style>
