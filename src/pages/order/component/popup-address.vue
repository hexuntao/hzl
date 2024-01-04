<template>
  <view class="choice-address">
    <lk-popup
      v-model="show"
      title="选择收货地址"
      position="bottom"
      round
      closeable
    >
      <view class="items">
        <lk-load-list-view
          :fixed="false"
          ref="load"
          @init="loadInit"
          :down="downOption"
          @down="downCallback"
          :up="upOption"
          @up="upCallback"
        >
          <lk-radio-group v-model="addressId" :active-color="theme.color">
            <view class="item">
              <lk-cell
                v-for="(item, index) in list"
                :key="index"
                center
                :title="item.title"
                :label="item.address"
                clickable
                @click="onSelect(item)"
              >
                <lk-radio slot="rightIcon" :name="item.id" />
              </lk-cell>
            </view>
          </lk-radio-group>
        </lk-load-list-view>
      </view>
      <view class="foot-btn-group fixed">
        <lk-button
          block
          round
          type="danger"
          :color="theme.gradient"
          :to="'/packages/member/address/post?onbackevent=' + onbackevent"
        >
          新增地址
        </lk-button>
      </view>
    </lk-popup>
  </view>
</template>

<script>
import { GET_ADDRESSLIST } from '@/common/interface/member';
import loadMixin from '@/mixins/load-list';
export default {
  data() {
    return {
      onbackevent: 'on-back-address',
      params: {
        page_index: 1,
        page_size: 12,
      },
      upOption: {
        auto: false,
      },
      downOption: {
        use: false,
      },
      addressId: 0,
    };
  },
  mixins: [loadMixin],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit('input', e);
      },
    },
  },
  watch: {
    value(e) {
      if (e && this.$load && !this.list.length) {
        this.$load.triggerUpScroll();
      }
    },
  },
  mounted() {
    uni.$on(this.onbackevent, data => {
      if (data) {
        this.resetList();
      }
    });
  },
  beforeDestroy() {
    uni.$off(this.onbackevent);
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      this.getAddressList(this.params).then(list => {});
    },
    onSelect(item) {
      if (this.show) {
        this.$emit('select', item);
        this.show = false;
        this.addressId = item.id;
      }
    },
    getAddressList(params) {
      return new Promise((resolve, reject) => {
        const list = [];
        GET_ADDRESSLIST(params)
          .then(({ data }) => {
            const arr = data.address_list || [];
            arr.forEach(e => {
              let obj = {};
              obj.id = e.id;
              obj.name = e.consigner;
              obj.tel = e.mobile;
              obj.title = e.consigner + ' , ' + e.mobile;
              obj.province = e.province;
              obj.city = e.city;
              obj.district = e.district;
              obj.area_code = e.area_code;
              if (e.type == 1) {
                obj.address = e.chinese_country_name + e.address;
              } else {
                obj.address =
                  e.province_name + e.city_name + e.district_name + e.address;
              }
              list.push(obj);
            });
            this.concatList(list, data.total_count);
            resolve(list);
          })
          .catch(() => {
            this.$load.endErr();
          });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.choice-address {
  .address-tab {
    position: relative;
    padding-bottom: 4rpx;
    .info {
      display: flex;
      flex-flow: column;
      .head {
        display: flex;
        justify-content: space-between;
      }
      .value {
        font-size: $font-size-sm;
        color: $text-light;
      }
      .label {
        font-size: $font-size-sm;
        color: $text-light;
        line-height: 36rpx;
      }
    }
  }

  .address-tab::before {
    content: '';
    z-index: 1;
    left: 0;
    right: 0;
    bottom: 0;
    height: 4rpx;
    position: absolute;
    background: -webkit-repeating-linear-gradient(
      135deg,
      #ff6c6c 0,
      #ff6c6c 20%,
      transparent 0,
      transparent 25%,
      #3283fa 0,
      #3283fa 45%,
      transparent 0,
      transparent 50%
    );
    background: repeating-linear-gradient(
      -45deg,
      #ff6c6c 0,
      #ff6c6c 20%,
      transparent 0,
      transparent 25%,
      #3283fa 0,
      #3283fa 45%,
      transparent 0,
      transparent 50%
    );
    background-size: 160rpx;
  }

  .items {
    width: 100%;
    height: 70vh;
    overflow-y: auto;
    padding-bottom: 160rpx;
  }
  .item {
    width: 100%;
  }
}
</style>
