<template>
  <view class="card-group-box">
    <lk-cell
      isLink
      @click="show = true"
      icon-prefix="v-icon"
      icon="v-icon-team"
      is-link
      value="拼团详情"
      :to="
        `/packages/lucklyspell/detail?out_trade_no=${out_trade_no}&order_id=${order_id}`
      "
    >
      <view slot="title">
        <text>拼团情况</text>
        <text class="num">{{ info.now_num || 0 }}/{{ info.group_num || 0 }}</text>
      </view>
      <view slot="rightIcon" class="right-box">
        <lk-icon name="arrow" custom-class="lk-cell__right-icon" />
      </view>
    </lk-cell>
    <view class="recordlistitem">
      <view class="recordlistimg">
        <view v-for="(item, index) in grouprecordlist" :key="index">
          <img
            :src="item.user_headimg ? item.user_headimg : noAvatar"
            class="headimg"
          />
        </view>
        <view class="showmore" v-if="showmore"> </view>
      </view>
    </view>
  </view>
</template>
<script>
import { GETLUCKYSPELLRECORD } from "@/common/interface/lucklyspell";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      info: {},
      grouprecordlist: [],
      showmore: false,
    };
  },
  props: {
    out_trade_no: [String, Number],
    order_id: [String, Number],
  },
  mounted() {
    this.LucklySpellDeatil();
  },
  methods: {
    LucklySpellDeatil() {
      GETLUCKYSPELLRECORD({
        out_trade_no: this.out_trade_no,
        order_id: this.order_id,
      }).then(({ data }) => {
        this.info = data;
        if (data.users.length <= 10) {
          this.grouprecordlist = this.info.users;
        } else {
          this.showmore = true;
          this.grouprecordlist = this.info.users.slice(0, 9);
        }
      });
    },
  },
  computed: {
    ...mapGetters(["static"]),
    noAvatar() {
      return this.static.noAvatar;
    },
  },
};
</script>

<style lang="scss" scoped>
.right-box {
  display: flex;
  align-items: center;
  color: $text-light;
}
.recordlistitem {
  background-color: $white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  position: relative;

  .recordlistimg {
    display: flex;
    .headimg {
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      margin-right: -12rpx;
    }
    .showmore {
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      background-color: #cbcbcb;
      position: relative;
    }
    .showmore::after {
      content: "•••";
      color: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
}
.num {
  color: $red;
  padding-left: 20rpx;
}
</style>
