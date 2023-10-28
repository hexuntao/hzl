<template>
  <view class="pages">
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <lk-cell
        v-for="(item, index) in list"
        :key="index"
        :icon="item.avatar"
        icon-size="40"
        :label="item.labelText"
        :to="item.to"
      >
        <view slot="title" class="title">
          <view class="text">{{ item.titleText }}</view>
          <view class="tag">{{ item.tagText }}</view>
        </view>
        <view slot="rightIcon" class="image">
          <image :src="item.image" mode="widthFix" />
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import { GET_THINGCIRCLETWOLAC } from "@/common/interface/thingcircletwo";
import loadMixin from "@/mixins/load-list";
import { formatDate } from "@/common/utils";
import thingcircletwoMixin from "@/mixins/thingcircletwo";
export default {
  name: "packages-thingcircletwo-collect",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      },
      upOption: {
        empty: {
          tip: "暂无点赞收藏"
        }
      }
    };
  },
  mixins: [loadMixin, thingcircletwoMixin],
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_THINGCIRCLETWOLAC(this.params)
        .then(({ data }) => {
          let list = data.data;
          list.forEach(e => {
            e.avatar = e.user_headimg;
            e.titleText = e.thing_user_name || "匿名";
            e.tagText = e.type > 2 ? "收藏了你的干货" : "赞了你的干货";
            e.labelText = formatDate(e.create_time, "YYYY-MM-DD hh:mm:ss");
            e.image = e.thing_type == 2 ? e.video_img.pic_cover : e.pic_cover;
            e.to = {
              path: "/packages/thingcircletwo/detail",
              query: {
                type: e.thing_type == 2 ? "video" : "imgtext",
                thing_id: e.type_id
              }
            };
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  flex-flow: column;
  .tag {
    color: $text-gray;
  }
}
.image {
  width: 160rpx;
  image {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
