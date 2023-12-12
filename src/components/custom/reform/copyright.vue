<template>
  <view :class="items.id" v-if="info.params.is_show != '0'">
    <view class="reform-box">
      <view class="copyright">
        <view class="box" :class="flexName" @click="click">
          <image
            class="image"
            mode="heightFix"
            :src="image"
            v-if="info.params.showlogo == 1 && image"
          />
          <view class="text">{{ info.params.text }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mixin from "../../mixin/reform";
import { mapState } from "vuex";
import { addImgSrcDomain } from "@/common/utils";
export default {
  mixins: [mixin],
  computed: {
    ...mapState({
      info: ({ config }) => config.copyright
    }),
    image() {
      return this.info.params.src ? addImgSrcDomain(this.info.params.src) : "";
    },
    flexName() {
      return this.info.style.showtype == 1 ? "flex-row" : "";
    }
  },
  mounted() {
    if (this.info.params.is_show != "0") {
      this.initIntersection().then(() => {});
    }
  },
  methods: {
    click() {
      if (this.info.params.appid) {
        return this.toLink({
          appid: this.info.params.appid,
          mpath: this.info.params.mpath
        });
      }
      this.toLink(this.info.params.linkurl);
    }
  }
};
</script>

<style lang="scss" scoped>
.copyright {
  padding: $cell-padding;
  line-height: 40rpx;
  color: $text-light;
  font-size: $font-size-sm;
  display: flex;
  justify-content: center;
  align-items: center;
  .image {
    width: auto;
    height: 60rpx;
    display: block;
    margin: 0 auto;
  }
  .flex-row {
    display: flex;
    flex-flow: row;
    align-items: center;
  }
  .text {
    padding: 0 10rpx;
    text-align: center;
  }
}
</style>
