<template>
  <lk-field
    :required="items.required"
    :label="items.label"
    type="textarea"
    autosize
    rows="2"
    placeholder="请输入内容"
    v-model="items.value"
  />
</template>

<script>
import form from "../../mixin/form";
export default {
  data() {
    return {};
  },
  mixins: [form]
};
</script>

<style scoped lang="scss"></style>
