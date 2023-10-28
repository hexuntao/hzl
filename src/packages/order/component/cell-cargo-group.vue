<template>
  <view>
    <lk-cell
      :title="receivegoodscode.copy_writing"
      valueClass="lk-cell__value--nowrap"
      :value="nameText"
      is-link
      @click="isshow"
    />
    <lk-popup
      v-model="show"
      position="bottom"
      :title="
        !is_use_manys
          ? receivegoodscode.copy_writing + '(可用一张)'
          : receivegoodscode.copy_writing
      "
      closeable
      round
    >
      <lk-field
        :placeholder="'请输入' + receivegoodscode.copy_writing"
        v-model="goods_code"
        :inputStyle="inputStyle"
      >
        <lk-button
          slot="button"
          size="small"
          round
          theme-color
          @click="bindCargo"
          >使用</lk-button
        >
      </lk-field>
      <view class="popup-coupon">
        <view
          class="card"
          :style="styles.color"
          v-for="(item, index) in list"
          :key="index"
        >
          <view class="info" :class="item.checked ? 'checkbgc' : 'nocheckbgc'">
            <image
              class="info-img"
              mode="aspectFit"
              :src="item.goodsImg"
            ></image>

            <view>
              <view class="name-group">
                <view
                  class="name"
                  :class="item.type != 3 ? 'first-letter' : ''"
                >
                  {{ item.title }}
                </view>
                <view class="name-label">
                  {{ item.nameLabel }}
                </view>
              </view>
              <view class="label">
                {{ item.label }}
              </view>
              <view class="time">
                <text>
                  {{ item.timeText }}
                </text>
              </view>
            </view>
          </view>
          <view
            class="right-box"
            :class="item.checked ? 'checkbgc' : 'nocheckbgc'"
          >
            <lk-button
              size="small"
              type="text"
              plain
              round
              :color="item.used ? 'rgb(14, 159, 254)' : 'red'"
              :disabled="!!item.disabled"
              :loading="!!item.loading"
              @click="clickUse(item)"
            >
              {{ item.checked ? checkuse : item.btnText }}
            </lk-button>
          </view>
        </view>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { formatDate, yuan } from "@/common/utils";
import { BIND_RECEIVEGOODSCODETOUSER } from "@/common/interface/deliverycode";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { mapState } from "vuex";
import { Base64 } from "@/common/lib/base64";
export default {
  data() {
    return {
      showname: [],
      receive_goods_code_base: [],
      show: false,
      name: "",
      goods_code: "",
      inputStyle: {
        "text-align": "center"
      },
      checkuse: "已使用",
      isUse: 2
    };
  },
  props: {
    value: Boolean,
    shopName: String,
    lists: Array,
    cargoNum: [String, Number],
    cargoName: {
      type: Array,
      default: () => []
    },
    is_use_manys: [String, Number], //可使用单张还是多张 0 单张 1多张
    shop_id: [String, Number],
    items: {
      type: Array,
      default: () => []
    },
    goodsList: {
      type: Array,
      default: () => []
    },
    receivegoodscode: Object,
    isreceivegoodscodeused: {
      type: Array,
      default: () => [] //后台返回的领货码
    },
    couponUse: [String, Number], //0不允许 优惠券，领货码同时使用
    couponList: [String, Number], //是否使用了优惠券 1使用过，2未使
    cleararrcode: [String, Number]
  },
  watch: {
    couponList(e) {
      if (e) this.isUse = e;
    },
    cleararrcode(e) {
      if (e) this.receive_goods_code_base = [];
    }
  },
  computed: {
    ...mapState({
      authKey: ({ authKey }) => authKey
    }),
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
      else if (this.cargoName.length > 0) {
        return "共使用" + this.cargoName.length + "张券";
      } else {
        return this.cargoNum + " 张可用" + this.receivegoodscode.copy_writing;
      }
    },

    styles() {
      return {
        color: formatStyle({ color: this.theme.color }),
        background: formatStyle({ background: this.theme.opacity })
      };
    },
    list() {
      const items = this.lists || [];
      items.forEach(e => {
        e.goodsImg = e.goods_info.picture;
        e.nameLabel = e.goods_info.goods_name;
        e.btnText = e.used ? "已选" : "使用";
        e.receive_goods_code_base = e.code;
        if (e.discount_type == 1) {
          e.label = "全额满减";
        } else if (e.discount_type == 2) {
          e.label = "减免" + e.discount_price + "元";
        }
        if (e.validity_type == 2) {
          e.timeText =
            "有期限 " +
            formatDate(e.start_time, "YYYY.MM.DD") +
            " ~ " +
            formatDate(e.end_time, "YYYY.MM.DD");
        } else {
          e.timeText = "永久有效";
        }
      });
      return items;
    }
  },

  methods: {
    clickUse(item) {
      item.shop_id = this.shop_id;
      if (this.receive_goods_code_base.indexOf(item.code) !== -1) {
        this.receive_goods_code_base.splice(
          this.receive_goods_code_base.indexOf(item.code),
          1
        );
      } else {
        if (this.is_use_manys) {
          this.receive_goods_code_base.push(item.code);
        } else {
          this.receive_goods_code_base = [item.code];
        }
      }
      item.receive_goods_code_base = this.receive_goods_code_base;
      this.show = false;
      this.$emit("use", item);
    },
    bindCargo() {
      const $this = this;
      let params = {
        type: 2,
        goods_ids: "",
        code: ""
      };

      if (!$this.goods_code) {
        $this.$Prompt.toast("请输入" + $this.receivegoodscode.copy_writing);
        return;
      }
      params.code = Base64.encode($this.goods_code + $this.authKey);

      let goodsIds = [];
      this.goodsList.forEach(element => {
        goodsIds.push(element.goods_id);
      });
      params.goods_ids = goodsIds.toString();

      if (this.receive_goods_code_base.indexOf(params.code) !== -1) {
        this.$Prompt.toast(
          "该" + this.receivegoodscode.copy_writing + "只能使用一次！"
        );
        return;
      }

      BIND_RECEIVEGOODSCODETOUSER(params)
        .then(res => {
          if (res.code == 1) {
            $this.$Prompt
              .toast({ title: "绑定成功", icon: "success" })
              .then(res => {
                $this.goods_code = "";
                if (this.is_use_manys) {
                  this.receive_goods_code_base.push(params.code);
                } else {
                  this.receive_goods_code_base = [params.code];
                }
                this.$emit("use", {
                  receive_goods_code_base: this.receive_goods_code_base,
                  shop_id: $this.shop_id
                });
                this.show = false;
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    isshow() {
      if (this.isUse == 1 && this.couponUse == 0) this.show = false;
      else this.show = true;
    }
  }
};
</script>

<style scoped lang="scss">
.popup-coupon {
  width: 100%;
  height: 70vh;
  overflow-y: auto;
  .card {
    display: flex;
    margin: 20rpx 30rpx;
    color: $red;
    .info {
      display: flex;
      flex: 1;
      padding: 20rpx;
      border-top-left-radius: 16rpx;
      border-bottom-left-radius: 16rpx;
      border-top-right-radius: 12rpx;
      border-bottom-right-radius: 12rpx;
      color: inherit;
    }
    .info .info-img {
      height: 120rpx;
      width: 120rpx;
      padding-right: 10rpx;
    }

    .info .name-group {
      display: flex;
      align-items: center;
      line-height: 44rpx;
    }

    .info .name {
      font-size: $font-size-lg;
    }

    .info .name-label {
      width: 400rpx;
      margin-left: 20rpx;
      font-size: $font-size-sm;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .info .label {
      font-size: $font-size-sm;
    }

    .info .time {
      font-size: $font-size-xs;
      margin-top: 8rpx;
    }

    .right-box {
      padding: 20rpx;
      white-space: nowrap;
      display: flex;
      justify-content: center;
      align-items: center;
      border-top-left-radius: 12rpx;
      border-bottom-left-radius: 12rpx;
      border-top-right-radius: 16rpx;
      border-bottom-right-radius: 16rpx;
      color: inherit;
      position: relative;
      overflow: hidden;
      width: 130rpx;
    }

    .right-box::before {
      content: " ";
      position: absolute;
      pointer-events: none;
      box-sizing: border-box;
      display: block;
      width: 2rpx;
      height: 100%;
      left: 0;
      border-left: 2rpx dashed;
      border-color: inherit;
    }

    .right-box .btn {
      background: transparent;
      color: inherit;
      border: none;
      padding: 0;
    }

    .right-box .btn:active::before {
      opacity: 0;
    }
  }
}
/deep/.lk-cell__value--nowrap {
  display: block;
}
.nocheckbgc {
  background-color: #ffdada;
}
.checkbgc {
  background-color: #eee;
  opacity: 0.8;
}
</style>
