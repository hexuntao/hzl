<template>
  <view class="pages">
    <lk-tabs
      :active-color="theme.color"
      :line-color="theme.color"
      slot-title
      nav-per-view="3"
      @change="onTab"
    >
      <lk-tab v-for="(tab, index) in tabs" :key="index">{{ tab.name }}</lk-tab>
    </lk-tabs>
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view
        class="item card-group-box"
        v-for="(item, index) in list"
        :key="index"
      >
        <lk-cell
          :icon="item.image"
          icon-size="40"
          :title="item.prize_name"
          :title-right="item.term_name"
          :label="item.activity_name"
        />
        <lk-cell center>
          <view class="label" slot="title">{{ item.timeText }}</view>
          <lk-button
            v-if="item.btnText"
            size="small"
            round
            type="danger"
            :color="theme.gradient"
            :disabled="item.btnDisabled"
            :to="item.btnTo"
          >
            {{ item.btnText }}
          </lk-button>
        </lk-cell>
      </view>
    </lk-load-list>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import { GET_PRIZELIST } from "@/common/interface/prize";
import loadMixin from "@/mixins/load-list";
import { mapGetters } from "vuex";
import { formatDate } from "@/common/utils";

export default {
  name: "packages-prize-list",
  data() {
    return {
      tabs: [
        {
          name: "未领奖",
          state: 1
        },
        {
          name: "已领奖",
          state: 2
        },
        {
          name: "已过期",
          state: 3
        }
      ],
      params: {
        page_index: 1,
        page_size: 20,
        state: 1
      },
      upOption: {
        empty: {
          tip: "没有相关礼品券"
        }
      }
    };
  },
  mixins: [loadMixin],
  computed: {
    ...mapGetters(["static"]),
    defImg() {
      const base = this.static.baseImgPath;
      const obj = {
        1: base + "default-balance.png",
        2: base + "default-integral.png",
        3: base + "default-coupon.png",
        4: base + "default-giftvoucher.png",
        5: base + "default-goods.png",
        6: base + "default-gift.png"
      };
      return obj;
    }
  },
  onLoad() {},
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_PRIZELIST(this.params)
        .then(({ data }) => {
          let list = data.data;
          list.forEach(e => {
            e.image = e.pic || this.defImg[e.type];
            e.timeText = formatDate(e.expire_time, "YYYY-MM-DD hh:mm:ss");
            e.btnText = this.getBtnInfo(e).text;
            e.btnTo = this.getBtnInfo(e).to;
            e.btnDisabled = e.state == 3;
          });
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onTab(index) {
      this.params.state = this.tabs[index].state;
      this.resetList();
    },
    getBtnInfo(info) {
      const btnText = {
        1: {
          text: "领奖",
          to: {
            path: "/packages/prize/confirm",
            query: {
              member_prize_id: info.member_prize_id
            }
          }
        },
        2: {
          text: "物流",
          to: {
            path: "/packages/order/logistics",
            query: {
              order_id: info.receive_id
            }
          }
        },
        3: {
          text: "已过期"
        }
      };
      let obj = {};
      obj.text = btnText[info.state].text || "";
      obj.to = btnText[info.state].to || "";
      if (info.state == 2 && info.type != 5) {
        obj.text = "";
      }
      return obj;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.label {
  font-size: $font-size-sm;
  color: $text-light;
}
</style>
