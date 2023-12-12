<template>
  <lk-cell-picker-group
    :label="items.label"
    :required="items.required"
    mode="region"
    :area-type="items.type"
    placeholder="请选择地区"
    @confirm="areaConfirm"
  />
</template>

<script>
import form from "../../mixin/form";
export default {
  data() {
    return {};
  },
  mixins: [form],
  methods: {
    areaConfirm(data) {
      let arr = [];
      arr[0] = data.text;
      arr[1] = data.item.map(({ id }) => id).join("_");
      arr[2] = data.code;
      this.items.value = arr.join(",");
    }
  }
};
</script>

<style scoped lang="scss"></style>
