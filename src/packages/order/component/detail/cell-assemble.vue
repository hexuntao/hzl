<template>
  <view class="card-group-box" v-if="show">
    <lk-cell
      icon-prefix="v-icon"
      icon="v-icon-team"
      is-link
      value="拼团详情"
      :to="toDetail"
    >
      <view slot="title">
        <text>拼团情况</text>
        <text class="num">{{ now_num }}/{{ group_num }}</text>
      </view>
    </lk-cell>
    <lk-cell v-if="buyer_list.length">
      <avatar-group :list="buyer_list" :num="group_num" />
    </lk-cell>
  </view>
</template>

<script>
import { GET_ASSEMBLEDETAIL } from "@/common/interface/assemble";
import avatarGroup from "./avatar-group";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      show: false,
      now_num: 0,
      group_num: 0,
      buyer_list: []
    };
  },
  props: {
    record_id: {
      type: [String, Number],
      default: 0,
      required: true
    }
  },
  computed: {
    ...mapGetters(["static"]),
    toDetail() {
      return {
        path: "/packages/assemble/detail",
        query: {
          record_id: this.record_id
        }
      };
    }
  },
  mounted() {
    GET_ASSEMBLEDETAIL({ record_id: this.record_id }).then(({ data }) => {
      this.show = parseInt(data.status) !== -1;
      this.now_num = data.now_num;
      this.group_num = data.group_num;
      let arr = [];
      data.buyer_list.forEach(e => {
        if (e.buyer_id) {
          let obj = {};
          obj.avatar = e.user_headimg || this.static.noAvatar;
          if (e.is_head) {
            obj.tag = "团长";
          }
          arr.push(obj);
        }
      });
      this.buyer_list = arr;
    });
  },
  components: {
    avatarGroup
  }
};
</script>
<style lang="scss" scoped>
.num {
  padding: 0 20rpx;
  color: $red;
}
</style>
