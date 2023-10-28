<template>
  <view>
    <lk-cell title="物流公司" :value="name" is-link @click="show = true" />
    <lk-popup
      v-model="show"
      position="bottom"
      title="选择物流公司"
      round
      closeable
    >
      <view class="list">
        <lk-search
          v-model="params.search_text"
          placeholder="请输入关键词"
          action="搜索"
          @search="search"
        />
        <lk-load-list-view
          :fixed="false"
          ref="load"
          @init="loadInit"
          :down="downOption"
          @down="downCallback"
          :up="upOption"
          @up="upCallback"
        >
          <lk-cell
            clickable
            v-for="(item, index) in list"
            :key="index"
            :title="item.company_name"
            @click="select(item)"
          />
        </lk-load-list-view>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { GET_EXPRESSCOMPANY } from "@/common/interface/order";
import loadMixin from "@/mixins/load-list";
export default {
  data() {
    return {
      show: false,
      params: {
        search_text: ""
      },
      downOption: {
        use: false
      }
    };
  },
  props: {
    name: String
  },
  mixins: [loadMixin],
  methods: {
    search(e) {
      this.params.search_text = e;
      this.resetList();
    },
    select(item) {
      this.show = false;
      this.$emit("select", item);
    },
    upCallback(page) {
      this.params.page_index = page.num;
      GET_EXPRESSCOMPANY(this.params)
        .then(({ data }) => {
          let list = data.expressList || [];
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
.list {
  width: 100%;
  height: 65vh;
  overflow-y: auto;
}
</style>
