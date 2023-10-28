<template>
  <info-item
    is-root
    :info="info"
    :name="name"
    @reply="onReply"
    @init="initList"
  >
    <view class="comment" v-if="info.reply_list.total_count">
      <view v-for="(item, index) in info.reply_list.data" :key="index">
        <info-item
          :info="item"
          :name="index"
          @reply="onReply"
          @init="onGetMore"
        />
        <view class="show-more" v-if="showMore">
          <text @click="onGetMore">展开更多回复</text>
        </view>
      </view>
    </view>
  </info-item>
</template>

<script>
import infoItem from "./info-item";
import { GET_THINGCIRCLEREPLY } from "@/common/interface/thingcircle";
export default {
  data() {
    return {
      showMore: this.items.reply_list.total_count > 1
    };
  },
  props: {
    items: Object,
    name: [String, Number],
    thingInfo: Object
  },
  computed: {
    info() {
      let info = this.items;
      info.topic_id = this.thingInfo.topic_id;
      info.to_placeholder_name = info.thing_user_name || "匿名";
      info.comment_likes = info.like_count;
      info.comment_pid = info.id; //当前评论id
      info.reply_list.data.forEach(e => {
        e.topic_id = this.thingInfo.topic_id;
        e.to_placeholder_name = e.thing_user_name;
        e.comment_pid = info.id; //当期评论父级id
      });
      return info;
    }
  },
  methods: {
    onGetMore() {
      GET_THINGCIRCLEREPLY(
        {
          thing_id: this.info.thing_id,
          comment_pid: this.info.id
        },
        { isShowLoading: true }
      ).then(({ data }) => {
        this.$emit("get-more", this.name, data);
        this.showMore = false;
      });
    },
    initList() {
      this.$emit("init-list", this.name); //重置评论列表
    },
    onReply(data) {
      this.$emit("reply", data);
    }
  },
  components: {
    infoItem
  }
};
</script>

<style lang="scss" scoped>
.comment {
  background: $background-color;
  padding: 20rpx;
  margin-top: 10rpx;
}
.reply-name {
  padding: 0 8rpx;
  color: $blue;
}
.show-more {
  margin-left: 80rpx;
  color: $blue;
  font-size: $font-size-sm;
}
</style>
