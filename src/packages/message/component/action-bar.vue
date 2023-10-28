<template>
  <view class="footer-bar">
    <view class="action-bar">
      <view class="bar-icon">
        <lk-icon name="chat-o" size="28" />
      </view>
      <view class="bar-input">
        <textarea
          class="input"
          type="text"
          auto-height
          fixed
          :maxlength="-1"
          :cursor-spacing="15"
          disable-default-padding
          :show-confirm-bar="false"
          :value="content"
          @focus="hideDrawer"
          @input="onInput"
          @confirm="onConfirm"
        ></textarea>
      </view>
      <view class="bar-icon">
        <lk-icon name="smile-o" size="28" @click="clickBar(1)" />
      </view>
      <view class="bar-icon" :style="sendTextBarClass ? 'width:0' : ''">
        <lk-icon name="add-o" size="28" @click="clickBar(2)" />
      </view>
      <view class="bar-icon bar-icon-send" :class="sendTextBarClass">
        <view class="send-text" @click="onSend">发送</view>
      </view>
    </view>
    <view
      class="drawer-mask"
      :style="showDrawerMask"
      @click="hideDrawer"
    ></view>
    <view class="drawer-group" :style="drawerHeight">
      <view class="emoji-group" :style="emojiHeight">
        <view class="item" v-for="(item, index) in emojiList" :key="index">
          <view class="icon">
            <image
              :src="emojiPath + index + '.gif'"
              mode="aspectFit"
              @click="selectEmoji(index)"
            />
          </view>
        </view>
      </view>
      <view class="action-group" :style="actionHeight">
        <view class="item" v-for="(item, index) in actionList" :key="index">
          <view class="icon">
            <lk-icon
              :name="item.icon"
              size="28"
              @click="clickAction(item.name)"
            />
          </view>
          <view class="text">{{ item.text }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import emoji from "../lib/emoji";
import { mapGetters } from "vuex";
import $Media from "@/api/media";
import baseMixin from "../mixin/base";
import { GET_QLKEFUUPADIMG } from "@/common/interface/message";

export default {
  data() {
    return {
      emojiList: emoji,
      actionList: [
        {
          name: "album",
          icon: "photo",
          text: "相册"
        }
        // {
        //   name: "shoot",
        //   icon: "photograph",
        //   text: "拍摄"
        // }
      ],
      drawerActive: 0,
      content: ""
    };
  },
  mixins: [baseMixin],
  computed: {
    showDrawerMask() {
      return this.drawerActive ? "display:block;" : "display:none;";
    },
    drawerHeight() {
      return this.drawerActive ? "" : "height:0";
    },
    emojiHeight() {
      return this.drawerActive == 1 ? "height:auto" : "height:0";
    },
    actionHeight() {
      return this.drawerActive == 2 ? "height:auto" : "height:0";
    },
    sendTextBarClass() {
      return this.content ? "show-send-text" : "";
    }
  },
  methods: {
    hideDrawer() {
      this.drawerActive = 0;
    },
    clickBar(i) {
      this.drawerActive = this.drawerActive === i ? 0 : i;
    },
    clickAction(name) {
      typeof this[name + "Fn"] === "function" && this[name + "Fn"]();
    },
    // 选择相册
    albumFn() {
      $Media
        .chooseImage({
          count: 9,
          sourceType: ["album"]
        })
        .then(res => {
          res.tempFilePaths.forEach(e => {
            GET_QLKEFUUPADIMG({
              baseUrl: this.qlApiBaseUrl,
              filePath: e,
              name: "file",
              formData: "",
              isShowLoading: true
            })
              .then(({ data }) => {
                this.content = `img[${this.addImgSrcKfDomain(data.src)}]`;
                this.onSend();
              })
              .catch(() => {});
          });
        });
    },
    onInput(e) {
      const val = String(e.detail.value || "").trim();
      this.content = val;
    },
    onConfirm(e) {
      const val = String(e.detail.value || "").trim();
      this.content = val;
    },
    selectEmoji(index) {
      const val = " face" + emoji[index] + " ";
      this.content += val;
    },
    // 发送
    onSend() {
      this.$emit("send", this.content);
      this.content = "";
      this.hideDrawer();
    }
  }
};
</script>

<style lang="scss" scoped>
.footer-bar {
  position: fixed;
  bottom: 0;
  z-index: 998;
  background-color: #f5f5f5;
  box-sizing: content-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
.action-bar {
  padding: 10rpx;
  display: flex;
  background-color: #f5f5f5;
  border-top-width: 1rpx;
  border-top-style: solid;
  border-top-color: #eaeaea;
  flex-flow: row;
  align-items: flex-end;
  position: relative;
  z-index: 10;
  .bar-icon {
    flex: none;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70rpx;
    height: 70rpx;
    color: $text-color;
    overflow: hidden;
  }
  .bar-input {
    flex: 1;
    margin: 0 10rpx;
  }
  .input {
    width: auto;
    background-color: transparent;
    border: 0;
    flex: 1;
    min-height: 40rpx;
    border-width: 0;
    background-color: #ffffff;
    border-radius: 10rpx;
    font-size: $font-size;
    padding: 0 16rpx;
    line-height: 40rpx;
    padding: 14rpx;
    max-height: 228rpx;
    box-sizing: content-box;
  }
  .bar-icon.bar-icon-send {
    overflow: hidden;
    transition: 0.3s;
    width: 0;
  }
  .bar-icon.bar-icon-send.show-send-text {
    width: 100rpx;
  }

  .send-text {
    border-radius: 8rpx;
    color: #ffffff;
    padding: 0 16rpx;
    width: 88rpx;
    height: 60rpx;
    line-height: 60rpx;
    white-space: nowrap;
    font-size: $font-size-sm;
    letter-spacing: 4rpx;
    background-color: $green;
    overflow: hidden;
  }
}
.drawer-group {
  width: 100%;
  height: 400rpx;
  overflow-y: auto;
  background-color: #f5f5f5;
  position: relative;
  z-index: 10;
  transition: 0.3s;
}
.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
}
.action-group {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  overflow: hidden;
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    color: $text-light;
    width: 25%;
    flex-flow: column;
    font-size: $font-size-sm;
    padding: 20rpx 0;
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 20rpx;
      background-color: #ffffff;
      width: 100rpx;
      height: 100rpx;
      margin: 10rpx;
      text-align: center;
      color: $text-color;
    }
    .text {
      margin-bottom: 10rpx;
    }
  }
}
.emoji-group {
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  padding: 0 20rpx;
  overflow: hidden;
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10%;
    padding: 20rpx 0;
    .icon {
      width: 44rpx;
      height: 44rpx;
    }
    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
