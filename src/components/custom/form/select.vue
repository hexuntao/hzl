<template>
  <lk-cell-picker-group
    v-model="active"
    :label="items.label"
    :required="items.required"
    placeholder="请选择"
    :columns="columns"
    @confirm="onConfirm"
  />
</template>

<script>
import form from "../../mixin/form";
export default {
  data() {
    return {
      active: -1,
      columns: []
    };
  },
  mixins: [form],
  computed: {},
  mounted() {
    let options = this.items.options || [];
    if (typeof options == "string") {
      let str = JSON.stringify(options);
      if (str.indexOf("\\n") != -1) {
        str = str.substr(1);
        str = str.substr(0, str.length - 1);
        options = str.split("\\n").filter(e => e && e.trim());
      } else {
        options = options.split(",").filter(e => e && e.trim());
      }
      options = options.map(e => {
        return { name: e };
      });
    }
    options.forEach((e, i) => {
      if (e.name == this.items.value) {
        this.active = i;
      }
    });
    this.columns = options;
  },
  methods: {
    onConfirm(index) {
      this.items.value = this.columns[index].name;
    }
  }
};
</script>

<style scoped lang="scss"></style>
