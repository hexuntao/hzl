<template>
  <view class="pages">
    <view class="list">
      <view class="card-group-box" v-for="(item, index) in list" :key="index">
        <lk-cell-account-item
          clickable
          :title="item.title"
          :image="item.logo"
          :label="item.label"
          @click="toDetail(item)"
        />
      </view>
    </view>
    <view class="foot-btn-group fixed">
      <lk-button
        round
        block
        :color="theme.gradient"
        type="danger"
        to="/packages/property/account/post?hash=add"
      >
        新增账户
      </lk-button>
    </view>
  </view>
</template>

<script>
import {
  GET_ASSETACCOUNTLIST,
  DEL_ASSETACCOUNT
} from "@/common/interface/property";
import { Base64 } from "@/common/lib/base64";
import property from "@/mixins/property";
import { mapState } from "vuex";
export default {
  name: "packages-property-account-list",
  data() {
    return {
      list: []
    };
  },
  mixins: [property],
  computed: {
    ...mapState({
      memberInfo: ({ member }) => member.info
    })
  },
  onLoad() {},
  onShow() {
    this.getList();
  },
  methods: {
    getList() {
      GET_ASSETACCOUNTLIST()
        .then(({ data }) => {
          this.list = this.packageAccountList(data);
        })
        .catch(() => {});
    },
    toDetail(item) {
      // const obj = {
      //   id: null,
      //   type: null,
      //   title: null,
      //   logo: null,
      //   label: null,
      //   showLabel: null,
      //   realname: null
      // };
      // for (let key in obj) {
      //   obj[key] = item[key];
      // }
      // if (item.type == 1) {
      //   obj.once_money = item.once_money;
      //   obj.day_money = item.day_money;
      //   obj.update = !!item.is_update;
      // }
      // if (item.type == 2) {
      //   obj.label = this.memberInfo.wx_openid;
      //   obj.showLabel = this.memberInfo.wx_openid;
      // }
      // if (item.type == 4) {
      //   obj.bank_name = item.open_bank;
      // }
      this.$Navigate.push({
        path: "/packages/property/account/detail",
        query: {
          account_id: item.id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  margin-bottom: 190rpx;
}
</style>
