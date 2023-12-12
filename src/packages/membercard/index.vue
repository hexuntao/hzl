<template>
  <view class="pages">
    <lk-cell-add-wxcard
      v-if="info.wx_membercard_status==0"
      :params="info.membercard_id"
      @success="loaddata"
      addtype='membercard'
    />
    <memeberdetail :info="info" />
    <qrcode :membercard_no="info.membercard_no" :text="text" />
    <view class="btn-group">
      <lk-button  size="lager"
          :custom-style="{ width: '300rpx', margin: '10rpx' }" round :color="theme.gradient" to="/packages/membercard/recharge">
        充值
        <text class="gift" v-if="info.show_full_gift==1">满赠</text>
      </lk-button>
      <lk-button  size="lager"
          :custom-style="{ width: '300rpx', margin: '10rpx' }" round :color="theme.gradient" to="/packages/membercard/log/list">明细</lk-button>
    </view>
    <lk-shortcut-entry />
  </view>
</template>
<script>
import { GET_MEMBERCARDINDEX } from "@/common/interface/membercard";
import memeberdetail from "./component/memeberdetail";
import qrcode from "./component/qrcode";
export default {
  name: "packages-membercard-index",
  data() {
    return {
      info: {},
      text: "（门店结账时出示此码，自动享受会员优惠）",
    };
  },
  onShow() {
    this.loaddata();
  },
  methods: {
    loaddata() {
      GET_MEMBERCARDINDEX().then(({ data }) => {
        this.info = data.data;
        if (data.have_memebrcard == 0) {
          this.$Navigate.replace("/packages/membercard/upgrade");
        }
      });
    },
  },
  components: {
    memeberdetail,
    qrcode,
  },
};
</script>

<style lang="scss" scoped>
.card-icon {
  width: 100rpx !important;
}
.btn-group{
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 14rpx 0;
}
.gift {
  background-color: #ffad29;
  font-size: 20rpx;
  width: 30rpx;
  height: 30rpx;
  margin-left: 10rpx;
}
.foot-btn-group {
  padding: 30rpx;
}
.data-v-183645da {
  width: 300rpx !important;
}

</style>
