<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <view class="content richtext">
      <lk-parser
        v-if="content"
        show-with-animation
        lazy-load
        :html="content"
      ></lk-parser>
    </view>
  </view>
</template>

<script>
import { GET_HELPDETAIL } from "@/common/interface/help";
export default {
  name: "packages-help-detail",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      title: "",
      content: ""
    };
  },
  onLoad(query) {
    this.question_id = query.question_id;
    this.getData();
  },
  methods: {
    getData() {
      GET_HELPDETAIL({ question_id: this.question_id })
        .then(({ data }) => {
          this.title = data.title;
          this.content = data.content;
          this.pageStyle.title = data.title;
        })
        .catch(() => {});
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.content {
  padding: $cell-padding;
  max-width: 100%;
  overflow: hidden;
  background-color: #ffffff;
}
</style>
