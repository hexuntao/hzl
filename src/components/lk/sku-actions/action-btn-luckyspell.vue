<template>
  <action-btn-confirm v-if="action" :action="action" @click="click" />
  <view class="sku-action-group" v-else>
    <view class="action-btn">
      <lk-button square theme-color @click="luckyspell">
        {{ btnText }}
      </lk-button>
    </view>
  </view>
</template>

<script>
import actionBtnConfirm from "./action-btn-confirm";
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  props: {
    // 活动相关参数
    params: Object,
    // 商品基本信息
    info: Object,
    action: String,
    directClick: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(["member"]),
    btnText() {
      /*if (this.params.thresholdtype_point)
        return (
          "立即参团" +
          "(消耗" +
          this.params.thresholdtype_point +
          this.member.texts.point_style +
          ")"
        );
      else return "立即参团";*/

      return "立即参团";
    }
  },
  methods: {
    click(action) {
      this[action]();
    },
    luckyspell() {
      if (
        !this.directClick &&
        this.params.group_record_list.some(e => e.uid == this.member.info.uid)
      ) {
        this.$Prompt
          .modal({
            title: "提示",
            content: "您已参加了该产品本轮拼团，是否再拼一份？",
            confirmText: "再拼一份"
          })
          .then(res => {
            this.$emit("click", "luckyspell", {
              luckyspell_id: this.params.luckyspell_id
            });
          })
          .catch(() => {});
      } else {
        this.$emit("click", "luckyspell", {
          luckyspell_id: this.params.luckyspell_id
        });
      }
    }
  },
  components: {
    actionBtnConfirm
  }
};
</script>

<style scoped></style>
