<template>
  <view>
    <lk-popup v-model="show" position="bottom" round title="银行卡" closeable>
      <lk-radio-group v-model="cardId" :active-color="theme.color">
        <view class="cell-group">
          <lk-cell-account-item
            v-for="(item, index) in list"
            :key="index"
            :clickable="!item.disabled"
            :title="item.title"
            :image="item.logo"
            :label="item.label"
            @click="select(item)"
          >
            <view slot="rightIcon">
              <text
                class="text-link"
                v-if="item.disabled"
                @click="toUpdate(item)"
              >
                升级
              </text>
              <lk-radio :name="item.id" :disabled="item.disabled" v-else />
            </view>
          </lk-cell-account-item>
        </view>
      </lk-radio-group>
      <view class="foot-btn-group fixed">
        <lk-button
          type="danger"
          :color="theme.gradient"
          round
          block
          :to="
            '/packages/property/account/post?hash=add&addtype=bank&onbackevent=' +
              onbackevent
          "
        >
          添加银行卡
        </lk-button>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import property from "@/mixins/property";
import { GET_BANKCARDLIST } from "@/common/interface/property";
export default {
  data() {
    return {
      onbackevent: "on-back-addbank",
      showAdd: false,
      list: []
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    cardId: [Number, String]
  },
  watch: {
    show(e) {
      if (e) {
        this.getBankCardList();
      }
    }
  },
  mixins: [property],
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
  mounted() {
    uni.$on(this.onbackevent, data => {
      if (data) {
        this.getBankCardList();
      }
    });
  },
  beforeDestroy() {
    uni.$off(this.onbackevent);
  },
  methods: {
    getBankCardList() {
      GET_BANKCARDLIST().then(({ data }) => {
        let list = this.packageAccountList(data, true);
        let arr = list.map(e => {
          if (e.type == 1 && e.is_update) {
            // 自动类型 需要升级情况 前往升级
            // is_update 表示需要升级
            e.disabled = true;
            e.sort = 1;
          } else if (e.type == 4) {
            // 手动类型 前往升级
            e.disabled = true;
            e.sort = 1;
          } else {
            e.disabled = false;
            e.sort = 0;
          }
          return e;
        });
        this.list = arr.sort((a, b) => a.sort - b.sort);
      });
    },
    close() {
      this.show = false;
    },
    select(item) {
      if (item.disabled) return false;
      this.$emit("select", item);
      this.close();
    },
    // 添加银行卡成功
    signingSuccess() {
      this.getBankCardList();
    },
    // 升级银行卡
    toUpdate(data) {
      // 升级签约参数
      const info = {
        type: data.type,
        account_id: data.id,
        realname: data.realname,
        account_number: data.account_number,
        bank_code: data.bank_code,
        bank_type: data.bank_type,
        bank_card: data.bank_card,
        valid_date: data.valid_date,
        cvv2: data.cvv2,
        mobile: data.mobile,
        thpinfo: "",
        smscode: ""
      };
      this.$Navigate.push({
        path: "/packages/property/account/post",
        query: {
          info: JSON.stringify(info),
          hash: "edit",
          onbackevent: this.onbackevent
        }
      });
    }
  },
  beforeDestroy() {
    this.close();
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.cell-group {
  width: 100%;
  height: 70vh;
  overflow-y: auto;
  padding-bottom: 160rpx;
}
.foot-btn-group {
  background: #ffffff;
}
</style>
