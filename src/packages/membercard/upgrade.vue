<template>
  <view class="pages">
    <upgradetab :list="list" @handtab="handtab" />
    <upgradeequity :list="list[index]"  :tabindex='index' />
    <upgradepackagetype :content="content" :content_title="content_title" :spec_list="spec_list" :tabindex='index' />
  </view>
</template>

<script>
import { GET_UPGRADEMEMBERCARD } from "@/common/interface/membercard";
import upgradetab from "./component/upgradetab";
import upgradeequity from "./component/upgradeequity";
import upgradepackagetype from "./component/packagetype";
export default {
  name: "packages-membercard-upgrade",
  data() {
    return {
      index: 0,
      list: [],
      spec_list: [], //套餐类型
      content: "", //协议内容
      content_title: "", //协议名称
    };
  },
  computed: {},
  onLoad() {
    this.loaddata();
  },
  watch: {
    index(e) {
      this.loaddata();
    },
  },
  methods: {
    handtab(e) {
      this.index = e;
    },

    loaddata() {
      GET_UPGRADEMEMBERCARD().then((res) => {
        if (res.data.membercard_list.length == 0) {
          this.$Prompt
            .modal({
              content: "暂无可升级的会员卡！",
              showCancel: false,
            })
            .then(() => {
              this.$Navigate.back();
            });
          return false;
        } else {
          this.spec_list = res.data.membercard_list[this.index].spec_list;
          this.content = res.data.content;
          this.content_title = res.data.content_title;
          this.list= res.data.membercard_list;
        }
      });
    },
  },
  components: {
    upgradetab,
    upgradeequity,
    upgradepackagetype,
  },
};
</script>

<style lang="scss" scoped></style>
