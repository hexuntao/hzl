<template>
  <lk-popup v-model="show" position="bottom" round closeable title="选择门店">
    <lk-radio-group v-model="active">
      <view class="items">
        <lk-cell
          clickable
          v-for="(item, index) in list"
          :key="index"
          @click="select(item)"
        >
          <lk-radio
            :name="item.store_id"
            :active-color="theme.color"
            @click="select(item)"
          >
            <view class="info">
              <view class="name">
                <view>{{ item.store_name }}</view>
                <view class="distance">{{ item.distance | distance }}</view>
              </view>
              <view class="detail">
                <view>
                  {{
                    item.province_name +
                      item.city_name +
                      item.dictrict_name +
                      item.address
                  }}
                </view>
              </view>
            </view>
          </lk-radio>
        </lk-cell>
      </view>
    </lk-radio-group>
    <!-- <view class="foot-btn-group fixed">
      <lk-button size="normal" block round @click="close">
        关闭
      </lk-button>
    </view> -->
  </lk-popup>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    store_id: [String, Number],
    list: {
      type: Array,
      default: () => []
    }
  },
  filters: {
    distance(value) {
      return value + "km";
    }
  },
  computed: {
    show: {
      get() {
        return this.value;
      },
      set(e) {
        this.$emit("input", e);
      }
    },
    active: {
      get() {
        return this.store_id && Number(this.store_id);
      },
      set(e) {}
    }
  },
  methods: {
    close() {
      this.$emit("input", false);
    },
    select(item) {
      this.$emit("select", item);
      this.close();
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
.items {
  width: 100%;
  background: #fff;
  position: relative;
  padding-bottom: 160rpx;
  overflow-y: auto;
  height: 70vh;
  .name {
    display: flex;
    justify-content: space-between;
  }
  .distance {
    text-align: right;
    white-space: nowrap;
    color: $red;
    font-size: $font-size-sm;
  }

  .detail {
    padding: 0;
    color: $text-light;
    font-size: $font-size-sm;
  }
}
</style>
