<template>
  <lk-cell :title="items.label" field :required="items.required">
    <lk-checkbox-group
      v-model="value"
      :active-color="theme.color"
      @change="change"
    >
      <lk-checkbox
        shape="square"
        :name="option"
        v-for="(option, index) in options"
        :key="index"
      >
        <text>{{ option }}</text>
      </lk-checkbox>
    </lk-checkbox-group>
  </lk-cell>
</template>

<script>
import form from "../../mixin/form";
export default {
  data() {
    return {
      value: [],
      options: []
    };
  },
  mixins: [form],
  computed: {},
  mounted() {
    let value = this.items.value;
    let arr = [];
    if (value && typeof value == "string") {
      arr = value.split(",");
    }
    this.value = arr;

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
    }
    this.options = options;
  },
  methods: {
    change(e) {
      this.value = e;
      this.items.value = e.join(",");
    }
  }
};
</script>

<style scoped lang="scss"></style>
