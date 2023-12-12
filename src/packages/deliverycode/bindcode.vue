<template>
  <view class="pages">
    <lk-field
      :label="receivegoodscode.copy_writing"
      :placeholder="'请输入' + receivegoodscode.copy_writing"
      v-model="goods_code"
    />
    <view class="notice">
      <view class="notice_title">注意</view>
      <view class="notice_detail"
        >绑定后无法解绑，无法转增，仅限该账号使用</view
      >
    </view>
    <view class="foot-btn-group fixed">
      <lk-button round block theme-color @click="onBind">
        绑定
      </lk-button>
    </view>
    <lk-shortcut-entry />
  </view>
</template>
<script>
import { mapState } from "vuex";
import { Base64 } from "@/common/lib/base64";
import { BIND_RECEIVEGOODSCODETOUSER } from "@/common/interface/deliverycode";
export default {
  name: "packages-deliverycode-bindcode",
  data() {
    return {
      goods_code: ""
    };
  },
  computed: {
    ...mapState({
      receivegoodscode: ({ member }) => member.info.receivegoodscode,
      authKey: ({ authKey }) => authKey
    })
  },
  methods: {
    onBind() {
      const $this = this;
      if (!$this.goods_code) {
        $this.$Prompt.toast("请输入" + $this.receivegoodscode.copy_writing);
        return;
      }
      let code = $this.goods_code + $this.authKey;
      BIND_RECEIVEGOODSCODETOUSER({ code: Base64.encode(code), type: 1 })
        .then(res => {
          if (res.code == 1) {
            $this.$Prompt
              .toast({ title: "绑定成功", icon: "success" })
              .then(() => {
                $this.$Navigate.replace("/packages/deliverycode/list");
              });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.pages {
  .notice {
    padding-left: 30rpx;
    .notice_title {
      color: #ff0000;
      height: 80rpx;
      line-height: 80rpx;
    }
    .notice_detail {
      color: #999999;
    }
  }
  .bindcode_btn {
    position: fixed;
    left: 20rpx;
    bottom: 20rpx;
    width: 710rpx;
  }
}
</style>
