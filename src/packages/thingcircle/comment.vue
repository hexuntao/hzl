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
import { GET_THINGCIRCLEAT } from "@/common/interface/thingcircle";
import loadMixin from "@/mixins/load-list";
import { formatDate } from "@/common/utils";
import thingcircleMixin from "@/mixins/thingcircle";
export default {
  name: "packages-thingcircle-comment",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 20
      },
      upOption: {
        empty: {
          tip: "暂无评论@"
        }
      }
    };
  },
  mixins: [loadMixin, thingcircleMixin],
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_THINGCIRCLEAT(this.params)
        .then(({ data }) => {
          let list = data.data;
          list.forEach(e => {
            e.avatar = e.user_headimg;
            e.titleText = e.thing_user_name || "匿名";
            e.tagText = e.content;
            e.labelText = formatDate(e.create_time, "YYYY-MM-DD hh:mm:ss");
            e.image = e.thing_type == 2 ? e.video_img.pic_cover : e.pic_cover;
            e.to = {
              path: "/packages/thingcircle/detail",
              query: {
                type: e.thing_type == 2 ? "video" : "imgtext",
                thing_id: e.thing_id
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
    line-height: 32rpx;
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
