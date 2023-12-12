<template>
  <view class="foot-side-bar">
    
  </view>
</template>

<script>
import { mapState } from "vuex";
import {
  GET_THINGCIRCLETWOFOLLOW,
  GET_THINGCIRCLETWOLIKES,
  GET_THINGCIRCLETWOCOLLECTION
} from "@/common/interface/thingcircletwo";
// import { wan } from "@/common/utils";

let attentFlag = true;
let likeFlag = true;
let collectFlag = true;
export default {
  data() {
    return {
      isAttented: this.info.is_attention,

      isCollect: this.info.is_collect,
      collects: this.info.collects || 0,

      likes: this.info.likes || 0,
      isLike: this.info.is_like
    };
  },
  watch: {
    "info.id"(e) {
      this.isAttented = this.info.is_attention;

      this.isCollect = this.info.is_collect;
      this.collects = this.info.collects;

      this.isLike = this.info.is_like;
      this.likes = this.info.likes;
    }
  },
  props: {
    type: String,
    info: Object,
    active: Number
  },
  computed: {
    ...mapState({
      memberInfo: ({ member }) => member.info
    }),
    attentbtn() {
      let obj = {
        show: false,
        text: ""
      };
      if (this.memberInfo.uid && this.memberInfo.uid != this.info.user_id) {
        obj.show = true;
        obj.text = this.isAttented ? "已关注" : "关注";
        obj.color = this.isAttented ? "" : this.theme.color;
      }
      return obj;
    },
    likeIcon() {
      return {
        color: this.isLike ? "#f44" : ""
      };
    },
    likesText() {
      // return wan(this.likes);
    },
    collectIcon() {
      return {
        color: this.isCollect ? "#f44" : ""
      };
    },
    collectText() {
      // return wan(this.collects);
    },
    commentCountText() {
      // return wan(this.info.evaluates);
    }
  },
  methods: {
    action(data) {
      this.$emit("action", this.active, data);
    },
    onSay() {
      this.$emit("say", {
        params: {
          thing_id: this.info.id,
          topic_id: this.info.topic_id
        },
        action: "add"
      });
    },
    onAttent() {
      if (!attentFlag) {
        return;
      }
      attentFlag = false;
      GET_THINGCIRCLETWOFOLLOW({
        thing_auid: this.info.user_id
      })
        .then(res => {
          this.isAttented = !this.isAttented;
          attentFlag = true;
          this.action({ is_attention: this.isAttented });
        })
        .catch(() => {
          attentFlag = true;
        });
    },
    onLike() {
      if (!likeFlag) {
        return;
      }
      likeFlag = false;
      GET_THINGCIRCLETWOLIKES({
        thing_id: this.info.id
      })
        .then(res => {
          this.likes = res.count;
          this.isLike = !this.isLike;
          likeFlag = true;
          this.action({ likes: this.likes, is_like: this.isLike });
        })
        .catch(() => {
          likeFlag = true;
        });
    },
    onCollect() {
      if (!collectFlag) {
        return;
      }
      collectFlag = false;
      GET_THINGCIRCLETWOCOLLECTION({
        thing_id: this.info.id
      })
        .then(res => {
          this.collects = res.count;
          this.isCollect = !this.isCollect;
          collectFlag = true;
          this.action({ collects: this.collects, is_collect: this.isCollect });
        })
        .catch(() => {
          collectFlag = true;
        });
    },
    onComment() {
      this.$emit("show-comment", this.active);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
