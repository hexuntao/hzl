<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="card-group-box" :style="itemStyle">
        <lk-cell
          v-for="(item, index) in list"
          :key="index"
          icon-prefix="v-icon"
          :background="items.style.background"
          :icon="item.iconclass"
          :icon-style="iconcolor"
          :title="item.text"
          :title-style="textcolor"
          :title-right="item.remark"
          :title-right-style="remarkcolor"
          is-link
          @click="click(index)"
        />
      </view>
    </view>
  </view>
</template>

<script>
import mixin from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
export default {
  data() {
    return {
      list: []
    };
  },
  mixins: [mixin],
  computed: {
    itemStyle() {
      return formatStyle({
        marginTop: pxTorpx(this.items.style.margintop)
      });
    },
    textcolor() {
      return {
        color: this.items.style.textcolor
      };
    },
    iconcolor() {
      return {
        color: this.items.style.iconcolor
      };
    },
    remarkcolor() {
      return {
        color: this.items.style.remarkcolor
      };
    }
  },
  created() {
    let arr = [];
    if (this.items.data) {
      for (const key in this.items.data) {
        const item = this.items.data[key];
        arr.push(item);
      }
    }
    this.list = arr;
  },
  mounted() {
    this.initIntersection().then(() => {});
  },
  methods: {
    click(index) {
      const item = this.list[index];
      if (item.appid) {
        return this.toLink({
          appid: item.appid,
          mpath: item.mpath
        });
      }
      this.toLink(item.linkurl);
    }
  }
};
</script>

<style scoped lang="scss"></style>
