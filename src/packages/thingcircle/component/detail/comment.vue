<template>
  <view>
    <lk-load-list-view
      :fixed="false"
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view>
        <comment-item
          v-for="(item, index) in list"
          :key="index"
          :items="item"
        />
      </view>
    </lk-load-list-view>
  </view>
</template>

<script>
import { GET_COMMENTLIST } from "@/common/interface/thingcircle";
import commentItem from "./comment-item";
import loadMixin from "@/mixins/load-list";
export default {
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 10,
        thing_id: this.info.id
      },
      downOption: {
        use: false
      }
    };
  },
  mixins: [loadMixin],
  props: {
    type: String,
    info: Object,
    active: Number
  },
  computed: {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_COMMENTLIST(this.params)
        .then(({ data }) => {
          let list = data.data;
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  },
  components: {
    commentItem
  }
};
</script>

<style lang="scss" scoped></style>
