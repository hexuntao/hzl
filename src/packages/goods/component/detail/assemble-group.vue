<template>
  <view class="assemble-group card-group-box" v-if="isShow">
    <lk-cell is-link @click="show = true">
      <view slot="icon" class="title" :style="{ color: titleColor }">
        {{ title }}
      </view>
      <view class="value">
        {{ info.group_record_count }}人在拼单，可直接参与
      </view>
      <view slot="rightIcon" class="right-box">
        <text class="text">查看更多</text>
        <lk-icon name="arrow" custom-class="lk-cell__right-icon" />
      </view>
    </lk-cell>
    <assemble-item
      v-for="(item, l) in filterList"
      :key="l"
      :item="item"
      @show-detail="showDetail"
      @callback="callback"
    />
    <lk-popup v-model="show" position="bottom" round closeable title="正在拼单">
      <view class="list">
        <assemble-item
          v-for="(item, t) in list"
          :key="t"
          :item="item"
          @show-detail="showDetail"
          @callback="callback"
        />
      </view>
    </lk-popup>
    <popup-assemble
      v-if="activeItem"
      :item="activeItem"
      v-model="showItem"
      @confirm="confirm"
      @callback="callback"
    />
  </view>
</template>

<script>
import assembleItem from "./assemble-item";
import popupAssemble from "./popup-assemble";
export default {
  data() {
    return {
      title: "拼团",
      show: false,
      showItem: false,
      activeItem: ""
    };
  },
  props: {
    titleColor: {
      type: String,
      default: "#606266"
    },
    info: {
      type: [Object, Array],
      default: () => {}
    }
  },
  computed: {
    isShow() {
      return !!this.info.group_record_list.length;
    },
    list() {
      return this.info.group_record_list || [];
    },
    filterList() {
      return this.info.group_record_list.length
        ? this.info.group_record_list.filter((e, i) => i < 2)
        : [];
    }
  },
  methods: {
    showDetail(id) {
      const item = this.list.filter(({ record_id }) => record_id == id);
      this.activeItem = item[0];
      this.showItem = true;
    },
    confirm(id) {
      this.$emit("confirm", id);
      this.showItem = false;
      this.show = false;
    },
    callback() {
      this.$emit("callback");
    }
  },
  components: {
    assembleItem,
    popupAssemble
  }
};
</script>

<style scoped lang="scss">
.assemble-group {
  .title {
    width: 100rpx;
    color: $text-gray;
  }
  .value {
    display: flex;
    flex-flow: column;
    color: $text-gray;
    font-size: $font-size-sm;
  }

  .text {
    color: $text-light;
    font-size: $font-size-sm;
  }

  .right-box {
    display: flex;
    align-items: center;
    color: $text-light;
  }
  .list {
    width: 100%;
    height: 70vh;
    overflow-y: auto;
  }
}
</style>
