<template>
  <view class="evaluate">
    <view class="header">
      <lk-tabs
        nav-per-view="5"
        :active-color="theme.color"
        :line-color="theme.color"
        slot-title
        @change="onTab"
      >
        <lk-tab v-for="(item, index) in tabs" :key="index">
          {{ item.title }}
        </lk-tab>
      </lk-tabs>
    </view>
    <lk-load-list
      ref="load"
      top="88"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="list">
        <view class="items lk-cell" v-for="(item, index) in list" :key="index">
          <lk-cell :border="false" :title="item.name" :label="item.explainText">
            <image class="image" :src="item.image" slot="icon" />
            <view class="time" slot="rightIcon">{{ item.time }}</view>
          </lk-cell>
          <view class="item">
            <view class="content">{{ item.content }}</view>
            <view class="imgs" v-if="item.images[0]">
              <lk-cell-image-panel :list="item.images" />
            </view>
          </view>
          <view class="item" v-if="item.explain_first">
            <view class="title">[商家回复]：</view>
            <view class="content">{{ item.explain_first }}</view>
          </view>
          <view class="item" v-if="item.again_content || item.again_images[0]">
            <view class="title">追评：</view>
            <view class="content">{{ item.again_content }}</view>
            <view class="imgs" v-if="item.again_images[0]">
              <lk-cell-image-panel :list="item.again_images" />
            </view>
          </view>
          <view class="item" v-if="item.again_explain">
            <view class="title">[追评回复]：</view>
            <view class="content">{{ item.again_explain }}</view>
          </view>
        </view>
      </view>
    </lk-load-list>
  </view>
</template>

<script>
function explainText(value) {
  let text = "";
  if (value == 5) {
    text = "好评";
  } else if (value == 3) {
    text = "中评";
  } else if (value == 1) {
    text = "差评";
  }
  return text;
}

import { GET_GOODSEVALUATE } from "@/common/interface/goods";
import { formatDate } from "@/common/utils";
import { mapGetters } from "vuex";
import loadMixin from "@/mixins/load-list";
export default {
  data() {
    return {
      evaluate_count: 0,
      imgs_count: 0,
      praise_count: 0,
      center_count: 0,
      bad_count: 0,
      params: {
        goods_id: "",
        page_index: 1,
        page_size: 20,
        is_image: null,
        explain_type: null
      },
      upOption: {
        empty: {
          tip: "暂无评价"
        }
      }
    };
  },
  mixins: [loadMixin],
  computed: {
    ...mapGetters(["static"]),
    tabs() {
      return [
        {
          name: "全部",
          type: null,
          count: this.evaluate_count,
          title: `全部(${this.evaluate_count})`
        },
        {
          name: "图片",
          type: true,
          count: this.imgs_count,
          title: `图片(${this.imgs_count})`
        },
        {
          name: "好评",
          type: 5,
          count: this.praise_count,
          title: `好评(${this.praise_count})`
        },
        {
          name: "中评",
          type: 3,
          count: this.center_count,
          title: `中评(${this.center_count})`
        },
        {
          name: "差评",
          type: 1,
          count: this.bad_count,
          title: `差评(${this.bad_count})`
        }
      ];
    }
  },
  onLoad(query) {
    this.params.goods_id = query.goods_id;
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_GOODSEVALUATE(this.params)
        .then(({ data }) => {
          let list = this.filterList(data.review_list);
          this.evaluate_count = data.evaluate_count;
          this.imgs_count = data.imgs_count;
          this.praise_count = data.praise_count;
          this.center_count = data.center_count;
          this.bad_count = data.bad_count;
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onTab(index) {
      const type = this.tabs[index].type;
      if (type === true) {
        this.params.is_image = true;
        this.params.explain_type = null;
      } else {
        this.params.is_image = null;
        this.params.explain_type = type;
      }
      this.resetList();
    },
    filterList(list = []) {
      let arr = [];
      list.forEach(item => {
        arr.push({
          ...item,
          image: item.user_img || this.static.noAvatar,
          name: item.user_name || item.nick_name || "匿名",
          explainText: explainText(item.explain_type),
          time: formatDate(item.addtime)
        });
      });
      return arr;
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.header {
  height: 88rpx;
  position: fixed;
  width: 100%;
  z-index: 10;
}
.evaluate {
  .items {
    position: relative;
    display: flex;
    flex-flow: column;
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    color: $text-color;
    font-size: $font-size;
    line-height: 48rpx;
    background-color: #fff;
    padding: 0;
    .image {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      display: block;
      overflow: hidden;
      margin-right: 20rpx;
      background: #f8f8f8;
    }
    .time {
      font-size: $font-size-sm;
    }
    .item {
      padding: 20rpx 30rpx;
      .title {
        font-size: $font-size-sm;
        color: #af7119;
      }
    }
  }
}
</style>
