<template>
  <view>
    <lk-cell
      :title="label"
      :required="required"
      field
      :is-link="!!rightArrow"
      @click="click"
    >
      <picker
        v-if="mode != 'region'"
        :mode="modeType"
        :value="active"
        :range="columns"
        :disabled="disabled"
        :start="minDate"
        :end="maxDate"
        :range-key="rangeKey"
        @change="change"
        @cancel="cancel"
      >
        <text :class="isActive">{{ activeText }}</text>
      </picker>
      <lk-area-picker
        v-if="mode === 'region'"
        ref="areaPicker"
        :placeholder="placeholder"
        :type="areaType"
        :code="areaCode"
        @confirm="onConfirmArea"
      />
      <!-- <text v-if="mode === 'region'" :class="isActive">{{ activeText }}</text> -->
    </lk-cell>
    
  </view>
</template>

<script>
import { formatDate } from "@/common/utils";
export default {
  data() {
    return {
      cname: "cell-picker-group",
      areaValueText: ""
    };
  },
  props: {
    value: [String, Number],
    label: String,
    placeholder: String,
    disabled: Boolean,
    rightArrow: {
      type: Boolean,
      default: true
    },
    required: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: "selector"
    },
    rangeKey: {
      type: String,
      default: "name"
    },
    minDate: {
      type: String,
      default: "1900-01-01"
    },
    maxDate: {
      type: String,
      default: ""
    },
    areaType: {
      type: [String, Number],
      default: 3
    },
    areaCode: String,
    areaValue: String
  },
  computed: {
    active: {
      get() {
        if (this.mode === "date") {
          // let value = "";
          // if (this.value) {
          //   value = formatDate(this.value);
          // }
          // console.log(this.value)
          return this.value || "";
        } else {
          return this.value || 0;
        }
      },
      set(e) {
        this.$emit("input", e == -1 ? 0 : e);
      }
    },
    modeType() {
      if (this.mode == "region") {
        return "selector";
      }
      return this.mode;
    },
    activeText() {
      if (this.mode == "selector") {
        let obj = this.columns[this.active];
        return obj ? obj[this.rangeKey] : this.placeholder;
      }
      if (this.mode == "region") {
        return this.areaValueText || this.areaValue || this.placeholder;
      }
      return this.active || this.placeholder;
    },
    isActive() {
      return this.activeText != this.placeholder ? "active" : "";
    }
  },
  methods: {
    click() {
      if (this.disabled) {
        return this.$emit("disabled");
      }
      if (this.mode === "region") {
        // this.$refs.areaPicker.show();
      }
    },
    change(e) {
      this.active = e.detail.value == -1 ? 0 : e.detail.value;
      this.$emit("confirm", e.detail.value == -1 ? 0 : e.detail.value);
    },
    cancel(e) {
      this.$emit("cancel");
    },
    onConfirmArea(data) {
      this.areaValueText = data.text;
      this.$emit("confirm", data);
    }
  }
};
</script>

<style scoped lang="scss">
.active {
  color: $text-color;
}
</style>
