<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="reform-loading-box" v-if="viewLoading">
        <lk-loading><text class="text">加载中</text></lk-loading>
      </view>
      <block v-if="viewLoaded">
        <lk-cell :title="items.params.title">
          <text class="time-text">{{ timeText }}</text>
          <lk-count-down
            :time="timestamp"
            @finish="onFinish"
            background="#666666"
            color="#ffffff"
          />
        </lk-cell>
        <view class="list" v-if="filterList.length">
          <view
            class="item"
            v-for="(item, index) in filterList"
            :key="index"
            @click="toLink('/packages/seckill/list')"
          >
            <lk-tag
              :custom-style="{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1
              }"
              type="danger"
            >
              {{ tagText }}
            </lk-tag>
            <lk-goods-box
              :title="item.goods_name"
              :image="item.pic_cover"
              :price="item.seckill_price"
            />
          </view>
        </view>
        <div v-else class="empty">{{ emptyText }}</div>
      </block>
    </view>
  </view>
</template>

<script>
import reform from "../../mixin/reform";
import { formatStyle } from "@/common/utils/stringify";
import { pxTorpx } from "@/common/utils";
import { GET_CUSTOMSECKILL } from "@/common/interface/seckill";
import { mapState } from "vuex";
export default {
  data() {
    return {
      tagText: "秒杀",
      list: [],
      seckill_going_status: null,
      end_time: 0,
      begin_time: 0,
      seckill_time: 10
    };
  },
  mixins: [reform],
  computed: {
    ...mapState({
      addons: ({ config }) => config.addons
    }),
    filterList() {
      let list = [];
      list = this.list.filter((e, i) => i < 3);
      return list;
    },
    timestamp() {
      let time = 0;
      if (this.seckill_going_status == "going") {
        // 进行中
        time = parseInt(this.end_time) * 1000;
      } else if (this.seckill_going_status == "unstart") {
        // 未开始
        time = parseInt(this.begin_time) * 1000;
      }
      return time;
    },
    timeText() {
      let text = "";
      if (this.seckill_going_status == "going") {
        // 进行中
        text = this.seckill_time + "点场";
      } else if (this.seckill_going_status == "unstart") {
        // 未开始
        text = "距开始";
      }
      return text;
    },
    emptyText() {
      let text = "";
      if (!this.addons.seckill) {
        text = "秒杀应用未开启";
      } else if (this.list.length == 0) {
        text = "暂无秒杀商品";
      }
      return text;
    }
  },
  created() {
    this.viewLoading = true;
  },
  mounted() {
    this.initIntersection().then(() => {
      this.getGoodsList()
        .then(list => {
          this.viewLoading = false;
          this.list = list;
          this.viewLoaded = true;
        })
        .catch(() => {
          this.viewLoading = false;
          this.viewError = true;
        });
    });
  },
  methods: {
    getGoodsList() {
      return new Promise((resovle, reject) => {
        GET_CUSTOMSECKILL({
          seckill_goods_sort: this.items.params.goodssort
        })
          .then(({ data }) => {
            let list = data.goods_list || [];
            if (list.length > 0) {
              this.seckill_going_status = data.seckill_going_status;
              this.end_time = data.end_time;
              this.seckill_time = data.seckill_time;
              this.begin_time = data.begin_time;
            }
            resovle(list);
          })
          .catch(() => {
            reject();
          });
      });
    },
    onFinish() {
      this.getGoodsList()
        .then(list => {
          this.viewLoading = false;
          this.list = list;
          this.viewLoaded = true;
        })
        .catch(() => {
          this.viewLoading = false;
          this.viewError = true;
        });
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.empty {
  background: #fff;
}

.list {
  display: flex;
  flex-flow: row;
  padding: 10rpx;
  background: #fff;
}

.item {
  position: relative;
  width: calc(33.33333% - 20rpx);
  margin: 10rpx;
  font-size: $font-size-sm;
}

.time-text {
  padding-right: 10rpx;
  font-size: $font-size-sm;
}

.item .tag {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
</style>
