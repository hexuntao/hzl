<template>
  <view>
    <view class="header">
      <lk-search disabled placeholder="请输入关键词" @click="toLink" />
      <lk-tabs
        :active-color="theme.color"
        :line-color="theme.color"
        slot-title
        nav-per-view="4"
        :line="false"
      >
        <lk-tab
          v-for="(tab, index) in tabs"
          :key="index"
          :disabled="tab.disabled"
        >
          <view
            class="tab-item"
            :class="tab.disabled ? 'disabled-color' : ''"
            @click="onSort(tab, index)"
          >
            <text>{{ tab.name }}</text>
            <view
              v-if="tab.icon"
              :style="{
                transform:
                  tab.sort_type == 'DESC' ? 'rotate(180deg)' : 'rotate(0deg)'
              }"
            >
              <lk-icon :name="tab.icon" class-prefix="v-icon" />
            </view>
          </view>
        </lk-tab>
      </lk-tabs>
    </view>
    <lk-popup v-model="show" position="top" :custom-style="top">
      <view class="shop-group">
        <lk-cell clickable @click="onGroupSort(0, '')">
          <view :class="shopGroupActive === 0 ? 'active' : ''">全部</view>
        </lk-cell>
        <lk-cell
          clickable
          v-for="(item, index) in shopGroupList"
          :key="index"
          @click="onGroupSort(index + 1, item.shop_group_id)"
        >
          <view :class="shopGroupActive === index + 1 ? 'active' : ''">
            {{ item.group_name }}
          </view>
        </lk-cell>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { mapState } from "vuex";
import { GET_SHOPGROUP } from "@/common/interface/shop";
import { pxTorpx } from "@/common/utils";
export default {
  data() {
    return {
      show: false,
      shopGroupList: [],
      shopGroupActive: 0,

      sortKey: {
        shop_collect: "DESC",
        comprehensive: "DESC",
        sale_num: "DESC"
      },
      windowTop: 0
    };
  },
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons
    }),
    tabs() {
      let arr = [
        {
          name: this.shopGroupText,
          sort: false
        },
        {
          name: "人气",
          icon: "v-icon-sort2",
          sort: "shop_collect",
          sort_type: this.sortKey["shop_collect"]
        },
        {
          name: "评分",
          icon: "v-icon-sort2",
          sort: "comprehensive",
          sort_type: this.sortKey["comprehensive"]
        }
      ];

      if (this.addons.store) {
        arr.push({
          name: "附近门店",
          disabled: true,
          sort: false,
          to: "/pages/store/list"
        });
      } else {
        arr.push({
          name: "销量",
          icon: "v-icon-sort2",
          sort: "sale_num",
          sort_type: this.sortKey["sale_num"]
        });
      }
      return arr;
    },
    shopGroupText() {
      let text = "全部";
      if (this.shopGroupList.length && this.shopGroupActive != 0) {
        text = this.shopGroupList[this.shopGroupActive - 1].group_name;
      }
      return text;
    },
    top() {
      return {
        top: pxTorpx(98 + this.windowTop)
      };
    }
  },
  created() {
    const $this = this;
    uni.getSystemInfo({
      success(res) {
        if (res.windowTop) $this.windowTop = res.windowTop;
      }
    });
  },
  methods: {
    // 商品排序
    onSort(item, index) {
      if (item.to) {
        return this.$Navigate.push(item.to);
      }
      let params = {};
      if (!item.sort) {
        if (!this.shopGroupList.length) {
          GET_SHOPGROUP().then(({ data }) => {
            this.shopGroupList = data.shop_group_list.filter(
              ({ is_visible }) => is_visible
            );
          });
        }
        this.show = !this.show;
        return;
      }

      this.shopGroupActive = 0;
      this.show = false;

      params.order = this.tabs[index].sort;
      params.shop_group_id = "";

      if (this.sortKey[item.sort]) {
        //升序降序
        params.sort = this.sortKey[item.sort];
        if (this.sortKey[item.sort] == "DESC") {
          this.sortKey[item.sort] = "ASC";
        } else {
          this.sortKey[item.sort] = "DESC";
        }
      } else {
        // 默认
        params.sort = "";
      }
      this.$emit("change", params);
    },
    onGroupSort(index, shop_group_id) {
      let params = {};
      params.order = "";
      params.sort = "";
      params.shop_group_id = shop_group_id;
      this.shopGroupActive = index;
      this.show = false;

      this.$emit("change", params);
    },
    toLink() {
      this.$Navigate.push({
        path: "/packages/mall/search",
        query: {
          type: "shop"
        }
      });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.header {
  height: 196rpx;
  position: fixed;
  width: 100%;
  z-index: 300;
}
.tab-item {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}
.disabled-color {
  color: $text-color;
}
.shop-group {
  position: relative;
  width: 100%;
  background: #ffffff;
  overflow: hidden;
  .active {
    color: $red;
    padding: 0 8rpx;
  }
}
</style>
