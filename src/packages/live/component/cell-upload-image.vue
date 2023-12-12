<template>
  <view class="cell-group">
    <lk-cell :title="label" field required>
      <lk-upload :max-count="1" @on-success="onSuccess" @on-remove="onRemove" />
      <view slot="rightIcon">
        <text
          v-if="exampleImg"
          @click="showExamplePopup = true"
          class="text-link"
        >
          示例
        </text>
      </view>
    </lk-cell>
    <lk-popup
      v-if="exampleImg"
      v-model="showExamplePopup"
      wrpper-style="background:transparent;"
    >
      <view>
        <image class="example-img" mode="aspectFit" :src="exampleImg" />
      </view>
    </lk-popup>
  </view>
</template>

<script>
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
      showExamplePopup: false
    };
  },
  props: {
    value: String,
    label: String,
    exampleImg: String
  },
  methods: {
    onSuccess(data, i, list) {
      this.$emit("input", getListValue(list));
    },
    onRemove(index, list) {
      this.$emit("input", getListValue(list));
    }
  }
};
</script>

<style lang="scss" scoped>
.example-img {
  width: 80vw;
  height: 400rpx;
}
</style>
