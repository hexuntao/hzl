<template>
  <view class="navbar-box">
    <view class="placeholder" v-if="type == 'imgtext'"></view>
    <view v-if="type == 'video'" class="video-left-icon" @click="toBack">
      <lk-icon name="arrow-left" size="20" color="#ffffff" />
    </view>
    <view class="navbar" v-if="type == 'imgtext'">
      <view class="left-icon" @click="toBack">
        <lk-icon name="arrow-left" size="20" />
      </view>
      <view class="info">
        <view class="avatar-name">
          <lk-avatar class="avatar" :src="info.user_headimg" size="70" />
          <view class="name">{{ info.thing_user_name }}</view>
        </view>
        <view class="attent-btn" v-if="attentbtn.show">
          <lk-button
            size="small"
            :color="attentbtn.color"
            round
            bing-mobile
            @click="onAttent"
          >
            {{ attentbtn.text }}
          </lk-button>
        </view>
      </view>
      <view class="right-icon">
        <lk-button
          type="text"
          icon-square
          icon-color="#606266"
          icon="weapp-nav"
          icon-size="20"
          @click="showPopup"
        ></lk-button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { GET_THINGCIRCLEFOLLOW } from "@/common/interface/thingcircle";
import { wan } from "@/common/utils";
let attentFlag = true;
export default {
  data() {
    return {
      isAttented: this.info.is_attention
    };
  },
  watch: {
    "info.id"(e) {
      this.isAttented = this.info.is_attention;
    }
  },
  props: {
    type: String,
    info: Object,
    active: Number
  },
  computed: {
    ...mapState({
      memberInfo: ({ member }) => member.info
    }),
    attentbtn() {
      let obj = {
        show: false,
        text: ""
      };
      if (this.memberInfo.uid && this.memberInfo.uid != this.info.user_id) {
        obj.show = true;
        obj.text = this.isAttented ? "已关注" : "关注";
        obj.color = this.isAttented ? "" : this.theme.color;
      }
      return obj;
    }
  },
  methods: {
    action(data) {
      this.$emit("action", this.active, data);
    },
    toBack() {
      this.$Navigate.back();
    },
    onAttent() {
      if (!attentFlag) {
        return;
      }
      attentFlag = false;
      GET_THINGCIRCLEFOLLOW({
        thing_auid: this.info.user_id
      })
        .then(res => {
          this.isAttented = !this.isAttented;
          attentFlag = true;
          this.action({ is_attention: this.isAttented });
        })
        .catch(() => {
          attentFlag = true;
        });
    },
    showPopup() {
      this.$emit("click-share");
    }
  }
};
</script>

<style lang="scss" scoped>
.placeholder {
  width: 100%;
  height: 88rpx;
}
.video-left-icon {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 88rpx;
  background: #ffffff;
  .left-icon,
  .right-icon {
    flex: none;
    width: 88rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .info {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .avatar-name {
      display: flex;
      flex-flow: row;
      align-items: center;
    }
    .avatar {
      margin-right: 20rpx;
    }
    .name {
      max-width: 260rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .attent-btn {
      display: flex;
      flex-flow: row;
      align-items: center;
    }
  }
}
</style>
