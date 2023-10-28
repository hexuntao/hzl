<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="reform-loading-box" v-if="viewLoading">
        <lk-loading><text class="text">加载中</text></lk-loading>
      </view>
      <block v-if="viewLoaded">
        <view class="cell-group" v-if="formList.length">
          <form-group :items="formList" ref="formGroup" />
        </view>
        <view class="foot-btn-group" v-if="formList.length">
          <lk-button
            block
            round
            theme-color
            :disabled="isDisabled"
            :loading="isLoading"
            @click="onConfirm"
          >
            确定
          </lk-button>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import reform from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx, addImgSrcDomain } from "@/common/utils";
import formGroup from "@/components/custom/form-group";
import {
  GET_GOODSSCHEDLEIFNO,
  SET_GOODSSCHEDLEIFNO
} from "@/common/interface/goods";

export default {
  data() {
    return {
      params: {},
      formList: [],
      isLoading: false
    };
  },
  mixins: [reform],
  computed: {
    isDisabled() {
      return !this.formList.length;
    }
  },
  created() {
    this.viewLoading = true;
  },
  mounted() {
    this.initIntersection().then(() => {
      this.getFormList()
        .then(list => {
          this.viewLoading = false;
          this.formList = list;
          this.viewLoaded = true;
        })
        .catch(() => {
          this.viewLoading = false;
          this.viewError = true;
        });
    });
  },
  methods: {
    getFormList() {
      return new Promise((resovle, reject) => {
        if (this.items.params.formid) {
          GET_GOODSSCHEDLEIFNO({ custom_id: this.items.params.formid })
            .then(({ data }) => {
              resovle(data.value || []);
            })
            .catch(() => {
              reject();
            });
        } else {
          resovle([]);
        }
      });
    },
    onConfirm() {
      const form_data = this.$refs["formGroup"]
        ? this.$refs["formGroup"].getFormData()
        : "";
      if (!form_data) return false;
      let params = {
        custom_id: this.items.params.formid,
        content: JSON.stringify(form_data)
      };
      if (form_data) {
        let day_time = "";
        let hours_time = "";
        form_data.forEach(e => {
          if (e.tag == "schedule") {
            let val = e.value.split(",");
            day_time = val[0] || "";
            hours_time = val[1] || "";
          }
        });
        if (day_time) {
          params.day_time = day_time;
        }
        if (hours_time) {
          params.hours_time = hours_time;
        }
      }
      // return console.log(params);
      this.isLoading = true;
      SET_GOODSSCHEDLEIFNO(params)
        .then(({ message }) => {
          this.$Prompt.toast({ title: message, icon: "success" });
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    formGroup
  }
};
</script>

<style scoped lang="scss">
.cell-group {
  margin: 20rpx 0;
}
</style>
