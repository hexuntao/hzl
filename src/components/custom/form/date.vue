<template>
  <lk-cell-picker-group
    v-model="date"
    :label="items.label"
    :required="items.required"
    placeholder="请选择日期"
    mode="date"
    @confirm="onConfirm"
  />
</template>

<script>
import form from "../../mixin/form";
import { dateToTimestamp, formatDate } from "@/common/utils";
export default {
  data() {
    return {};
  },
  mixins: [form],
  computed: {
    date: {
      get() {
        if (this.items.value) {
          return formatDate(this.items.value);
        }
        let time = formatDate(Math.round(new Date() / 1000));
        if (this.items.type == 1) {
          time = this.items.default;
        }
        this.items.value = dateToTimestamp(time);
        return time;
      },
      set(e) {
        console.log(e);
      }
    }
  },
  methods: {
    onConfirm(value) {
      this.date = value;
      this.items.value = dateToTimestamp(value);
    }
  }
};
</script>

<style scoped lang="scss"></style>
