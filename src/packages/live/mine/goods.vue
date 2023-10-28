<template>
  <view class="pages">
    <view class="header">
      <lk-search
        v-model="params.search_text"
        placeholder="请输入商品名称"
        action="搜索"
        @search="onSearch"
      />
    </view>
    <lk-category-nav
      v-model="active"
      :navs="navs"
      top="54"
      @change="onNavChange"
    >
      <lk-load-list-view
        ref="load"
        :fixed="false"
        @init="loadInit"
        :down="downOption"
        @down="downCallback"
        :up="upOption"
        @up="upCallback"
      >
        <view class="list">
          <lk-goods-card
            v-for="(item, index) in list"
            :key="index"
            cell-padding
            :title="item.goods_name"
            :image="item.img_src"
            :price="item.price"
          >
            <view slot="num">
              <lk-button
                round
                theme-color
                size="mini"
                :loading="item.btnLoading"
                :plain="!!item.is_picked"
                @click="pick(index)"
              >
                {{ item.is_picked ? "取消" : "挑选" }}
              </lk-button>
            </view>
          </lk-goods-card>
        </view>
      </lk-load-list-view>
    </lk-category-nav>
  </view>
</template>

<script>
import {
  GET_LIVESHOPGOODSCATEGORY,
  GET_LIVESHOPGOODSCATEGORYGOODS,
  GET_LIVEPICKGOODS
} from "../interface";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-live-mine-goods",
  data() {
    return {
      active: 0,
      navs: [],

      params: {
        page_index: 1,
        page_size: 10,
        category_id: 0,
        search_text: "",
        anchor_id: 0
      },
      upOption: {
        auto: false,
        empty: {
          type: "goods",
          tip: "暂无商品"
        }
      }
    };
  },
  mixins: [loadMixin],
  computed: {},
  onLoad(query) {
    this.params.anchor_id = query.anchor_id || 0;
  },
  methods: {
    onSearch(value) {
      this.params.search_text = value;
      this.resetList();
    },
    loadInitEnd() {
      setTimeout(() => {
        this.getCategory().then(() => {
          this.params.category_id = this.navs[this.active]
            ? this.navs[this.active].category_id
            : "";
          this.$load.triggerUpScroll();
        });
      });
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_LIVESHOPGOODSCATEGORYGOODS(this.params)
        .then(({ data }) => {
          let list = data.data || [];
          list.forEach(e => {
            e.btnLoading = false;
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onNavChange(index) {
      this.params.category_id = this.navs[index].category_id;
      this.resetList();
    },
    getCategory() {
      return new Promise((resolve, reject) => {
        if (this.navs.length) {
          resolve();
        } else {
          GET_LIVESHOPGOODSCATEGORY()
            .then(({ data }) => {
              const list = data.category_list || [];
              list.forEach(e => {
                e.name = e.short_name || e.category_name;
              });
              this.navs = list;
              resolve();
            })
            .catch(() => {});
        }
      });
    },
    pick(index) {
      const item = this.list[index];
      let params = {
        anchor_id: this.params.anchor_id,
        goods_id: item.goods_id
      };
      item.btnLoading = true;
      GET_LIVEPICKGOODS(params, { isPicked: !!item.is_picked })
        .then(({ message }) => {
          item.is_picked = !item.is_picked;
          item.btnLoading = false;
          this.$Prompt.toast({ title: message, icon: "success" });
        })
        .catch(() => {
          item.btnLoading = false;
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 1;
}
.content {
  .item {
    margin: 0px 8rpx 40rpx;
    .item-head {
      color: $text-gray;
      font-weight: 800;
      display: flex;
      align-items: center;
      height: 92rpx;
      padding: 0 10rpx;
      text {
        padding: 12rpx 20rpx;
      }
    }
    .item-main {
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      .item-child {
        width: 33.333334%;
        text-align: center;
        .box {
          margin: 8rpx;
        }
        .image-box {
          height: 0;
          width: 100%;
          padding: 50% 0;
          overflow: hidden;
          position: relative;
          .image {
            display: flex;
            width: 100%;
            height: 100%;
            border: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }
        .name {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          padding: 12rpx 8rpx 16rpx;
        }
      }
    }
  }
}
</style>
