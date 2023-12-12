<template>
  <lk-cell :title="items.label" field :required="items.required">
    <lk-upload
      :file-list="list"
      :max-count="items.max"
      :form-data="{ type: 'customform' }"
      @on-success="onSuccess"
      @on-remove="onRemove"
    />
  </lk-cell>
</template>

<script>
import form from "../../mixin/form";
let arr = [];

function getListValue(list = []) {
  let a = [];
  list.forEach(e => {
    if (e.response) {
      a.push(e.response.src);
    }
  });
  return a.join(",");
}

export default {
  data() {
    return {
      list: []
    };
  },
  mixins: [form],
  mounted() {
    let value = this.items.value;
    if (value) {
      this.list = value.split(",").map(e => {
        return { url: e };
      });
    }
  },
  methods: {
    onSuccess(data, i, list) {
      this.items.value = getListValue(list);
    },
    onRemove(index, list) {
      this.items.value = getListValue(list);
    }
  }
};
</script>

<style scoped lang="scss"></style>
