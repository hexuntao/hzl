<template>
  <view class="pages">
    <lk-load-list
      ref="load"
      bottom="190"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
    >
      <view class="list">
        <lk-radio-group
          v-model="defaultId"
          flex-flow="column"
          :active-color="theme.color"
          @change="onDefault"
        >
          <view
            class="card-group-box"
            v-for="(item, index) in list"
            :key="index"
          >
            <lk-cell>
              <view class="value-item">
                <view class="label">收货人</view>
                <view class="name">{{ item.consigner }}</view>
                <view class="tel">{{ item.mobile }}</view>
              </view>
              <view class="value-item">
                <view class="label">收货地址</view>
                <view class="address">
                  {{ item.province_name }}{{ item.city_name
                  }}{{ item.district_name }}{{ item.address }}
                </view>
              </view>
            </lk-cell>
            <lk-cell>
              <view class="foot">
                <view>
                  <lk-radio :name="item.id">设为默认</lk-radio>
                </view>
                <view class="btn-group">
                  <view class="btn" @click="onEdit(item.id)">
                    <lk-icon square name="edit" />
                    <text>编辑</text>
                  </view>
                  <view class="btn" @click="onRemove(item.id)">
                    <lk-icon square name="delete" />
                    <text>删除</text>
                  </view>
                </view>
              </view>
            </lk-cell>
          </view>
        </lk-radio-group>
      </view>
    </lk-load-list>
    <view class="foot-btn-group fixed">
      <lk-button
        round
        block
        :color="theme.gradient"
        type="danger"
        to="/packages/member/address/post"
      >
        新增地址
      </lk-button>
    </view>
  </view>
</template>

<script>
import {
  GET_ADDRESSLIST,
  DEL_ADDRESS,
  SET_DEFAULTADDRESS
} from "@/common/interface/member";
import loadMixin from "@/mixins/load-list";
let showFlag = 0;
export default {
  name: "packages-member-address-list",
  data() {
    return {
      defaultId: "",
      params: {
        page_index: 1,
        page_size: 12
      }
    };
  },
  mixins: [loadMixin],
  onLoad() {},
  onShow() {
    if (showFlag == 1) {
      this.resetList();
    }
  },
  onHide() {
    showFlag = 1;
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_ADDRESSLIST(this.params)
        .then(({ data }) => {
          let list = data.address_list || [];
          const obj = list.filter(e => {
            return e.is_default === 1;
          })[0];
          this.defaultId = obj ? obj.id : "";
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onDefault(id) {
      id && SET_DEFAULTADDRESS({ id });
    },
    onEdit(address_id) {
      this.$Navigate.push({
        path: "/packages/member/address/post",
        query: { address_id }
      });
    },
    onRemove(id) {
      this.$Prompt
        .modal({
          title: "提示",
          content: "是否确定删除该地址?"
        })
        .then(() => {
          DEL_ADDRESS({ id }).then(res => {
            this.resetList();
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.value-item {
  display: flex;
  flex-flow: row;
}
.label {
  width: 140rpx;
  font-weight: 800;
}
.name {
  flex: 1;
}
.tel {
  font-size: $font-size-sm;
  color: $text-gray;
}
.address {
  font-size: $font-size-sm;
  color: $text-light;
  flex: 1;
}
.foot {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  .btn-group {
    display: flex;
    flex-flow: row;
    align-items: center;
    .btn {
      display: flex;
      align-items: center;
      margin-left: 20rpx;
    }
  }
}
</style>
