<template>
  <lk-field
    v-model="mobile"
    type="number"
    :maxlength="maxlength"
    :placeholder="placeholder"
    @blur="blur"
  >
    <view class="label" slot="label">
      <view class="text">{{ label }}</view>
      <view class="code" v-if="areacodeList.length">
        <picker
          :value="active"
          mode="selector"
          :range="areacodeList"
          range-key="name"
          @change="onChange"
        >
          <text class="">+{{ code }}</text>
          <text class="v-icon v-icon-sort2"></text>
        </picker>
      </view>
    </view>
  </lk-field>
</template>

<script>
import { validMobile } from "@/common/utils/validator";
import store from "@/store";
import { GET_AREACODE } from "@/common/interface/config";
export default {
  data() {
    return {
      cname: "field-areacode",
      active: 0,
      code: "86"
    };
  },
  props: {
    value: null,
    label: {
      type: String,
      default: "手机"
    },
    placeholder: {
      type: String,
      default: "请输入您的手机号码"
    }
  },
  computed: {
    areacodeList() {
      return store.state.config.areacodeList || {};
    },
    mobile: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    },
    maxlength() {
      return this.code == "86" ? 11 : -1;
    }
  },
  mounted() {
    setTimeout(() => {
      this.getAreacodeList();
    });
  },
  methods: {
    getAreacodeList() {
      if (!this.areacodeList.length) {
        store.dispatch("getConfig").then(config => {
          if (config.mobile_type == 1) {
            GET_AREACODE()
              .then(({ data }) => {
                let arr = data || [];
                arr.forEach(e => {
                  e.name = `${e.country}(${e.country_code})`;
                });
                store.commit("setAreacodeList", arr);
              })
              .catch(() => {});
          }
        });
      }
    },
    blur(e) {
      this.$emit("blur", e);
    },
    onChange(e) {
      this.code = this.areacodeList[e.detail.value].country_code;
      this.$emit("get-areacode", this.code);
    }
  }
};
</script>

<style lang="scss" scoped>
.label {
  width: 180rpx;
  font-size: inherit;
  display: flex;
}
.code {
  font-size: $font-size-sm;
  padding-left: 10rpx;
  color: $blue;
  .v-icon {
    font-size: $font-size-sm;
    width: 36rpx;
    color: inherit;
  }
}
</style>
