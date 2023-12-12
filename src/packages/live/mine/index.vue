<template>
  <view class="pages">
    <lk-header-panel
      :avatar="info.user_headimg"
      :name="info.uname"
      :custom-style="{
        background: '#ffffff',
        color: '#323233',
        padding: '20rpx 30rpx'
      }"
    >
      <view class="info">
        <view class="tag" v-if="info.tagText">{{ info.tagText }}</view>
      </view>
      <view class="bottom" slot="bottom">
        <view class="item" @click="toLink('/packages/live/mine/follow')">
          关注<text>{{ info.focus_num || 0 }}</text>
        </view>
        <view class="item" @click="toLink('/packages/live/mine/fans')">
          粉丝<text>{{ info.fans_num || 0 }}</text>
        </view>
      </view>
    </lk-header-panel>
    <view class="cell-group" v-if="isAnchor">
      <lk-cell title="带货分成">
        <lk-icon
          slot="rightIcon"
          class-prefix="v-icon"
          name="v-icon-help-02"
          @click="showHelpTip"
        />
      </lk-cell>
      <view class="card-panel">
        <view class="item">
          <text class="num">{{ info.unfreeze_earnings || 0 }}</text>
          <text class="text">已分成</text>
        </view>
        <view class="item">
          <text class="num">{{ info.freeze_earnings || 0 }}</text>
          <text class="text">冻结分成</text>
        </view>
        <view class="item">
          <text class="num">{{ info.total_earnings || 0 }}</text>
          <text class="text">累计分成</text>
        </view>
      </view>
    </view>
    <view class="cell-group">
      <lk-cell
        v-for="(item, index) in cellItems"
        :icon-square="false"
        icon-size="20"
        :key="index"
        :icon="item.icon"
        :title="item.title"
        :to="item.to"
        is-link
      />
    </view>
    <footer-tab :active="2" :anchor_id="info.anchor_id" />
  </view>
</template>

<script>
import { GET_LIVEANCHORINFO } from "@/common/interface/live";
import footerTab from "@/pages/live/component/footer-tab";
import { wan } from "@/common/utils";
import { mapGetters } from "vuex";
export default {
  name: "packages-live-mine-index",
  data() {
    return {
      info: {
        anchor_id: 0
      }
    };
  },
  computed: {
    ...mapGetters(["static"]),
    // 主播id，0不是主播
    isAnchor() {
      return !!this.info.anchor_id;
    },
    cellItems() {
      const info = this.info;
      let arr = [];
      if (this.isAnchor) {
        let statusObj = {
          2: {
            title: "主播信息",
            icon: this.static.baseImgPath + "icons/live-xx.png",
            to: "/packages/live/mine/info"
          },
          3: {
            title: "完善主播信息",
            icon: this.static.baseImgPath + "icons/live-ws.png",
            to: "/packages/live/mine/apply?hash=replenish"
          }
        };
        if (statusObj[info.page_status]) {
          arr.push(statusObj[info.page_status]);
        }
        arr.push({
          title: "主播小店",
          icon: this.static.baseImgPath + "icons/live-xd.png",
          to: "/packages/live/mine/shop"
        });
      } else {
        if (info.applyType == 1) {
          arr.push({
            title: "申请主播",
            icon: this.static.baseImgPath + "icons/live-zb.png",
            to: "/packages/live/mine/apply"
          });
        }
      }
      arr.push({
        title: "观看历史",
        icon: this.static.baseImgPath + "icons/live-ls.png",
        to: "/packages/live/mine/history"
      });
      return arr;
    }
  },
  onLoad() {},
  onShow() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      GET_LIVEANCHORINFO().then(({ data }) => {
        this.info = data;
        this.info.applyType = parseInt(this.info.be_auchor_cond);
        this.info.tagText = this.info.room_no
          ? "房号: " + this.info.room_no
          : "";
        this.info.focus_num = wan(this.info.focus_num || 0);
        this.info.fans_num = wan(this.info.fans_num || 0);
      });
    },
    showHelpTip() {
      this.$Prompt.modal({
        content: "带货获得分成将直接发放至余额账户，订单完成后方可提现。",
        showCancel: false
      });
    },
    toLink(e) {
      this.$Navigate.push(e);
    }
  },
  components: {
    footerTab
  }
};
</script>

<style lang="scss" scoped>
.info {
  margin-top: 16rpx;
}
.tag {
  font-size: $font-size-sm;
  border-radius: 99999rpx;
  height: 44rpx;
  display: inline-flex;
  align-items: center;
  line-height: 28rpx;
  color: #ffffff;
  padding: 8rpx 16rpx;
  background: linear-gradient(to right, #ff5b4b, #ff417b);
}
.bottom {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  .item {
    width: 33.3%;
    text {
      font-weight: 800;
      padding: 0 20rpx;
      font-size: $font-size-lg;
    }
  }
}
.cell-group {
  margin: 20rpx 0;
}
.card-panel {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  background: #fff;
  .item {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    padding: 30rpx 0;
    line-height: 40rpx;
  }
  .text {
    font-size: $font-size;
  }
  .num {
    color: $red;
  }
}
</style>
