<template>
  <view class="pages">
    <view class="banner">
      <image :src="banner" mode="widthFix" />
    </view>
    <view class="foot-btn-group cell-group">
      <lk-button
        round
        block
        type="danger"
        :color="theme.gradient"
        @click="clickStateBtn"
      >
        {{ stateText }}
      </lk-button>
    </view>
    <view class="cell-group">
      <lk-tabs
        v-if="tabs.length"
        v-model="active"
        nav-per-view="4"
        :active-color="theme.color"
        :line-color="theme.color"
      >
        <lk-tab :title="item.title" v-for="(item, index) in tabs" :key="index">
          <view class="protocol-content descript richtext" v-if="item.content">
            <lk-parser show-with-animation lazy-load :html="item.content" />
          </view>
          <view v-else class="empty">暂无协议</view>
        </lk-tab>
      </lk-tabs>
    </view>
    <lk-popup
      v-model="contract.show"
      round
      closeable
      position="bottom"
      :title="contract.title"
    >
      <view class="contract">
        <view class="content">
          <lk-parser
            show-with-animation
            lazy-load
            :html="contract.content"
          ></lk-parser>
        </view>
        <view class="foot-btn-group fixed">
          <lk-button
            round
            block
            type="danger"
            :color="theme.gradient"
            @click="toApply"
          >
            同意，前往申请
          </lk-button>
        </view>
      </view>
    </lk-popup>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { mapGetters } from "vuex";
import {
  GET_SHOPAPPLYSTATE,
  GET_SHOPAPPLYPROTOCOL
} from "@/common/interface/shop";
export default {
  name: "packages-shop-business-index",
  data() {
    return {
      active: 0,
      applyState: "",
      tabs: [],
      referee_uid:'',
      contract: {
        show: false,
        title: "",
        content: ""
      }
    };
  },
  computed: {
    ...mapGetters(["static"]),
    banner() {
      return this.static.baseImgPath + "shop-join-adv.png";
    },
    stateText() {
      return this.applyState == "apply" ? "申请入驻" : "查看进度";
    }
  },
  onLoad(query) {
  this.referee_uid=query.extend_code?query.extend_code:''
    GET_SHOPAPPLYSTATE()
      .then(({ data }) => {
        this.applyState = data.status;
        this.getApplyProtocol();
      })
      .catch(() => {});
  },
  methods: {
    getApplyProtocol() {
      GET_SHOPAPPLYPROTOCOL()
        .then(({ data }) => {
          this.tabs = data.shop_protocol.filter((e, i) => i < 4);
          if (data.shop_protocol[4]) {
            this.contract.title = data.shop_protocol[4].title;
            this.contract.content = data.shop_protocol[4].content;
          }
        })
        .catch(() => {});
    },
    clickStateBtn() {
      if (this.applyState == "apply") {
        this.contract.show = true;
      } else {
        this.$Navigate.push("/packages/shop/business/result?referee_uid="+this.referee_uid);
      }
    },
    toApply() {
      this.$Navigate.push("/packages/shop/business/apply?referee_uid="+this.referee_uid).then(() => {
        this.contract.show = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  min-height: 200rpx;
  background: $image-background;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.cell-group {
  margin: 20rpx 0;
  background: #ffffff;
}
.protocol-content {
  padding: $cell-padding;
}
.contract {
  padding: $cell-padding;
  .content {
    height: 60vh;
    overflow-y: auto;
    margin-bottom: 160rpx;
  }
}
</style>
