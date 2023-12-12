<template>
  <view class="asset">
    <view class="asset-group" :class="assetClasses">
      <view class="asset-info" @click="showPopup">
        <lk-icon
          class-prefix="v-icon"
          custom-class="asset-icon"
          square
          :name="coinInfo.logo"
        />
        <view class="text" :class="isFlexRow ? 'flex-row' : 'flex-column'">
          <view class="name">
            <text>
              {{ coinInfo.symbol }}
            </text>
            <lk-icon
              size="12"
              custom-class="asset-down-icon"
              name="arrow-down"
              v-if="!isFlexRow"
            />
          </view>
          <text class="num">{{ coinInfo.price }}</text>
          <text class="fee" v-if="!isFlexRow">{{ coinInfo.charge }}手续费</text>
          <lk-icon
            name="arrow-down"
            custom-class="asset-down-icon"
            size="12"
            v-if="isFlexRow"
          />
        </view>
      </view>
      <view class="asset-right" v-if="isFlexRow">
        <text>
          {{ coinInfo.charge }}
        </text>
        手续费
      </view>
    </view>
    <lk-popup v-model="show" round title="请选择货币类型">
      <view class="asset-popup">
        <lk-cell
          v-for="(item, index) in coinList"
          :key="index"
          clickable
          :icon="item.logo"
          @click="select(index)"
        >
          <view slot="title" class="popup-name">{{ item.symbol }}</view>
        </lk-cell>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { bi } from "@/common/utils";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import {
  GET_BLOCKCHAINBILIST,
  GET_BLOCKCHAINGOODSTRANCOIN
} from "@/common/interface/blockchain";
export default {
  data() {
    return {
      active: 0,
      show: false,
      coinInfo: {
        logo: this.info.logo,
        symbol: this.info.symbol || "",
        charge: this.info.service_charge ? this.info.service_charge + "%" : "",
        price: this.info.symbol_price || ""
      },
      coinList: []
    };
  },
  filters: {
    bi(value) {
      return bi(value);
    }
  },
  props: {
    //是否横向布局
    isFlexRow: {
      type: Boolean,
      default: false
    },
    info: Object,
    goodsInfo: Object
  },
  computed: {
    assetClasses() {
      return this.isFlexRow ? "asset-flex-row" : "";
    }
  },
  methods: {
    showPopup() {
      if (!this.coinList.length) {
        return this.getCoinList().then(list => {
          this.coinList = list;
          this.show = true;
        });
      }
      this.show = true;
    },
    getCoinList() {
      return new Promise((resolve, reject) => {
        GET_BLOCKCHAINBILIST({}, { loadingText: "加载中" })
          .then(({ data }) => {
            let arr = data
              ? data.map(e => {
                  return {
                    logo: e.logo,
                    symbol: e.symbol,
                    charge: "",
                    price: 0
                  };
                })
              : [];
            resolve(arr);
          })
          .catch(() => {
            resolve([]);
          });
      });
    },
    select(index) {
      let item = this.coinList[index];
      GET_BLOCKCHAINGOODSTRANCOIN({
        price: this.goodsInfo.goodsPrice,
        symbol: item.symbol
      })
        .then(({ data }) => {
          let info = data || {};
          this.coinInfo.logo = info.logo || item.logo;
          this.coinInfo.symbol = info.symbol;
          this.coinInfo.charge = info.service_charge
            ? info.service_charge + "%"
            : "";
          this.coinInfo.price = info.symbol_price;
        })
        .catch(() => {});
      this.show = false;
    }
  }
};
</script>

<style scoped lang="scss">
.asset-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
  align-items: center;
  color: $text-gray;
  font-size: $font-size;
  line-height: 32rpx;
  margin-bottom: 10rpx;

  .asset-info {
    display: flex;
    align-items: center;
  }

  .asset-info .text {
    font-size: $font-size-sm;
    color: $text-gray;
  }

  .asset-info .text .name {
    display: flex;
    height: 32rpx;
    line-height: 32rpx;
  }
  .asset-info .text .num {
    line-height: 32rpx;
  }

  .asset-down-icon {
    width: 32rpx !important;
    height: 32rpx !important;
  }

  .asset-info .text.flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .asset-info .text.flex-row .num {
    padding: 0 10rpx;
  }

  .asset-info .text.flex-column {
    display: flex;
    flex-direction: column;
  }

  .asset-info .text .fee {
    font-size: $font-size-xs;
    color: $text-light;
  }

  .asset-right {
    font-size: $font-size-sm;
    color: $text-light;
  }
}
.asset-group::before {
  content: "";
  display: block;
  position: absolute;
  left: -20rpx;
  top: 50%;
  transform: translateY(-48%);
  border-left: 2rpx dashed $border-color;
  height: 70%;
}
.asset-flex-row {
  position: relative;
  width: 100%;
}
.asset-flex-row::before {
  display: none;
}
.asset-popup {
  width: 600rpx;
  max-height: 800rpx;
  overflow-y: auto;
  border-radius: 20rpx;
}
.asset-popup .popup-icon {
  font-size: 40rpx;
  width: 48rpx;
  height: 48rpx;
  text-align: center;
  line-height: 48rpx;
  margin-right: 10rpx;
  color: $text-gray;
}

.asset-popup .popup-name {
  color: $text-gray;
}
</style>
