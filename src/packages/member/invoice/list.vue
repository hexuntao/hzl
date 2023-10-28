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
              <view>{{ item.name }}</view>
              <view class="value-item">
                <view class="name">{{ item.title_name }}</view>
              </view>
              <view class="value-item">
                <view class="address">
                  {{ item.taxpayer_no }}
                </view>
              </view>
            </lk-cell>
            <lk-cell>
              <view class="foot">
                <view>
                  <lk-radio :name="item.user_invoice_id">设为默认</lk-radio>
                </view>
                <view class="btn-group">
                  <view class="btn" @click="onEdit(item.user_invoice_id)">
                    <lk-icon square name="edit" />
                    <text>编辑</text>
                  </view>
                  <view class="btn" @click="onRemove(item.user_invoice_id)">
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
        to="/packages/member/invoice/post"
      >
        新增抬头
      </lk-button>
    </view>
  </view>
</template>

<script>
import {
  GET_USERINVOICELIST,
  DELUSERINVOICE,
  SETDEFAULTUSERINVOICE
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
      GET_USERINVOICELIST(this.params)
        .then(({ data }) => {
          let list = data.data || [];
          list.forEach(e => {
            if (e.type == 0) {
              e.name = "不开票";
            }
            if (e.type == 1 && e.title == 1) {
              e.name = "电子普通发票-个人";
            }
            if (e.type == 1 && e.title == 2) {
              e.name = "电子普通发票-公司";
            }
            if (e.type == 2) {
              e.name = "增值税专用发票";
            }
          });

          const obj = list.filter(e => {
            return e.is_default == 1;
          })[0];
          this.defaultId = obj ? obj.user_invoice_id : "";
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onDefault(user_invoice_id) {
      user_invoice_id &&
        SETDEFAULTUSERINVOICE({ user_invoice_id, is_default: 1 });
    },
    onEdit(user_invoice_id) {
      this.$Navigate.push({
        path: "/packages/member/invoice/post",
        query: { user_invoice_id }
      });
    },
    onRemove(user_invoice_id) {
      this.$Prompt
        .modal({
          title: "提示",
          content: "是否确定删除该发票?"
        })
        .then(() => {
          DELUSERINVOICE({ user_invoice_id }).then(res => {
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
