<template>
  <lk-cell :title="items.label" field :required="items.required">
    <lk-radio-group
      v-model="value"
      :active-color="theme.color"
      @change="onChange"
    >
      <lk-radio :name="option" v-for="(option, index) in options" :key="index">
        <text>{{ option }}</text>
      </lk-radio>
    </lk-radio-group>
  </lk-cell>
</template>

<script>
import form from "../../mixin/form";
export default {
  data() {
    return {
      value: this.items.value,
      options: []
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
    }
    this.options = options;
  },
  methods: {
    onChange(e) {
      this.value = e;
      this.items.value = e;
    }
  }
};
</script>

<style scoped lang="scss"></style>
