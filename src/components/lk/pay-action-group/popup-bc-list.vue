<template>
  <view>
    <lk-popup v-model="show" position="bottom" round title="选择币种" closeable>
      <view class="loading-box" v-if="!list.length">
        <lk-loading><text class="loading-text">加载中</text> </lk-loading>
      </view>
      <lk-radio-group v-model="biId" :active-color="theme.color">
        <view class="cell-group">
          <lk-cell-account-item
            v-for="(item, index) in list"
            :key="index"
            :clickable="!item.disabled"
            :title="item.symbol"
            :image="item.logo"
            :label="item.label"
            @click="select(item)"
          >
            <view slot="rightIcon">
              <lk-radio :name="item.id" :disabled="item.disabled" />
            </view>
          </lk-cell-account-item>
        </view>
      </lk-radio-group>
    </lk-popup>
  </view>
</template>

<script>
import { GET_BLOCKCHAINBILIST } from "@/common/interface/blockchain";
import { yuan } from "@/common/utils";
export default {
  data() {
    return {
      list: []
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    biId: [Number, String]
  },
  watch: {
    show(e) {
      if (e) {
        this.getBlockchainList();
      }
    }
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    }
  },
  mounted() {},
  methods: {
    getBlockchainList() {
      GET_BLOCKCHAINBILIST({})
        .then(({ data }) => {
          let arr = data
            ? data.filter(e => {
                if (e.state_code == 1) {
                  if (parseFloat(e.balance) > 0) {
                    e.disabled = false;
                    e.sort = 0;
                    e.label = `余额 ${e.balance} ${e.symbol} ≈ ${yuan(
                      e.money
                    )}`;
                  } else {
                    e.disabled = true;
                    e.label = `余额不足`;
                    e.sort = 1;
                  }
                }else{
                  e.disabled = true;
                  e.label = `未创建钱包`;
                  e.sort = 1;
                }
                return e;
              })
            : [];
          this.list = arr.sort((a, b) => a.sort - b.sort);
        })
        .catch(() => {});
    },
    close() {
      this.show = false;
    },
    select(item) {
      if (item.disabled) return false;
      this.$emit("select", item);
      this.close();
    }
  },
  beforeDestroy() {
    this.close();
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.loading-box {
  position: absolute;
  top: 120rpx;
  width: 100%;
}
.cell-group {
  width: 100%;
  height: 70vh;
  overflow-y: auto;
  padding-bottom: 100rpx;
}
.foot-btn-group {
  background: #ffffff;
}
.loading-text {
  padding: 0 20rpx;
}
</style>
