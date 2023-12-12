<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <lk-cell class="item" v-for="(item, index) in list" :key="index">
        <view class="box">
          <view class="img">
            <image :src="item.user_headimg" />
          </view>
          <view class="info">
            <view>
              <text class="name">会员id：{{item.uid}}</text>
            </view>
            <view>
              <text class="name">{{item.nick_name}}</text>
              <text class="level-name">{{ item.distributor_level_name }}</text>
            </view>
            <view>
              <text>{{ item.num }}分红份数</text>
            </view>
          </view>
        </view>
      </lk-cell>
    </lk-load-list>
  </view>
</template>

<script>
import loadMixin from "@/mixins/load-list";
import { GET_CUSTOMERLIST } from "@/common/interface/distribute";
import { mapState } from "vuex";
export default {
  name: "packages-distribute-customer",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      params: {
        page_index: 1
      }
    };
  },
  mixins: [loadMixin],
  computed: {
    ...mapState({
      distributeTexts: ({ distribute }) => distribute.texts
    })
  },
  onLoad() {},
  onShow() {
    this.pageStyle.title = this.distributeTexts.my_customer;
  },
  methods: {
    upCallback() {

      GET_CUSTOMERLIST()
        .then(({ data }) => {
          let list = data || [];
          this.concatList(list, 0);
        })
        .catch(() => {
          this.$load.endErr();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
}

.img {
  width: 120rpx;
  height: 120rpx;
  margin-right: 20rpx;
}

.img image {
  display: block;
  width: 100%;
  height: 100%;
}

.info {
  flex: 1;
}

.info .level-name {
  padding-left: 20rpx;
  color: #606266;
}
</style>
