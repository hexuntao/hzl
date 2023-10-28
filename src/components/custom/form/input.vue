<template>
  <lk-field
    :required="items.required"
    :label="items.label"
    :placeholder="items.placeholder"
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
