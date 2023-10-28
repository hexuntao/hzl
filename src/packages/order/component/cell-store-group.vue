<template>
  <view>
    <lk-cell :title="title" :value="value" :is-link="isLink" @click="click" />
    <lk-popup-store
      v-model="show"
      :store_id="store_id"
      :list="list"
      @select="select"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      show:false
    };
  },
  props: {
    title: [String, Number],
    value: [String, Number],
    isLink: Boolean,
    list: Array,
    store_id: [String, Number]
  },
  methods: {
    select(e) {
      this.$emit("select", e);
    },
    click() {
      this.$emit("show-popup");
    }
  }
};
</script>
