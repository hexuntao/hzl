<template>
  <lk-cell :title="items.label" field :required="items.required">
    <view class="date-box">
      <view>
        <lk-cell-picker-group
          v-model="startDate"
          label="开始时间"
          placeholder="请选择日期"
          mode="date"
          @confirm="onStartConfirm"
        />
      </view>
      <view>
        <lk-cell-picker-group
          v-model="endDate"
          label="结束时间"
          placeholder="请选择日期"
          mode="date"
          @confirm="onEndConfirm"
        />
      </view>
    </view>
  </lk-cell>
</template>

<script>
import form from "../../mixin/form";
import { dateToTimestamp, formatDate } from "@/common/utils";
let valueArr = [];
export default {
  data() {
    return {};
  },
  mixins: [form],
  computed: {

    startDate: {
      get() {
        let arr = [];
        let value = this.items.value;
        if (value) {
          arr = value.split(",");
        }
        if (arr[0]) {
          return formatDate(arr[0]);
        }
        let time = formatDate(Math.round(new Date() / 1000));
        if (this.items.start_type == 1) {
          time = this.items.start_default;
        }
       valueArr[0] = dateToTimestamp(time);
       this.items.value = valueArr.join(",");
        return time;
      },
      set(e) {
        console.log(e);
      }
    },
    endDate: {
      get() {
        let arr = [];
        let value = this.items.value;
        if (value) {
          arr = value.split(",");
        }
        if (arr[1]) {
          return formatDate(arr[1]);
        }
        let time = formatDate(Math.round(new Date() / 1000));
        if (this.items.end_type == 1) {
          time = this.items.end_default;
        }
        valueArr[1] = dateToTimestamp(time);
         this.items.value = valueArr.join(",");
        return time;
      },
      set(e) {
        console.log(e);
      }
    }
  },
  methods: {
    onStartConfirm(value) {
      valueArr[0] = dateToTimestamp(value);
      this.items.value = valueArr.join(",");
    },
    onEndConfirm(value) {
      valueArr[1] = dateToTimestamp(value);
      this.items.value = valueArr.join(",");
    }
  }
};
</script>

<style scoped lang="scss">
.date-box{
  margin: -20rpx -30rpx;
}
</style>
