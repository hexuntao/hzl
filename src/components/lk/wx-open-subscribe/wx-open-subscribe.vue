<template>
  <view class="subscribe-box">
    <slot name="btn-subscribe"></slot>
    <wx-open-subscribe
      v-if="templateIds.length > 0 && isWeixinshow"
      :template="templateIds"
      id="subscribe-btn"
      @success="success"
      class="open-subscribe"
    >
      <script type="text/wxtag-template">
        <style>.open-subscribe1 {height:50px;opacity: 0;}</style>
         <button class='open-subscribe1' ></button>
      </script>
    </wx-open-subscribe>
  </view>
</template>

<script>
import { mapActions } from "vuex";
import { isWeixin } from "@/common/utils";

export default {
  props: {
    node_id: [Number, String]
  },
  data() {
    return {
      templateIds: []
    };
  },
  computed: {
    isWeixinshow() {
      return isWeixin();
    }
  },
  mounted() {
    // #ifdef H5
    if (isWeixin()) this.getTemplateId();
    // #endif
  },
  methods: {
    ...mapActions(["setSubscribeH5"]), //公众号订阅通知
    getTemplateId() {
      this.setSubscribeH5({ node_id: this.node_id }).then(res => {
        let arr = [];
        if (res.data && res.data.length > 0) {
          res.data.forEach(e => {
            if (e.template_id) arr.push(e.template_id);
          });
        }

        this.templateIds = arr;
      });
    },

    success() {
      this.$emit("success");
    }
  }
};
</script>

<style>
.subscribe-box {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.open-subscribe {
  width: 100%;
  height: 100rpx;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
