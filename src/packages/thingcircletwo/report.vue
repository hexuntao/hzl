<template>
  <view class="pages">
    <result-state state="success" message="举报成功" v-if="isReportSuccess">
      <view slot="footer" class="result-tip">受理结果将会在消息通知中告知</view>
    </result-state>
    <block v-else>
      <view class="cell-group">
        <view class="cell-group-title">违规类型</view>
        <lk-radio-group
          v-model="params.violation_id"
          :active-color="theme.color"
          flex-flow="column"
        >
          <lk-cell
            v-for="(item, index) in formItems"
            :key="index"
            :title="item.name"
            clickable
            @click="onSelect(item.violation_id)"
          >
            <lk-radio slot="rightIcon" :name="item.violation_id"> </lk-radio>
          </lk-cell>
        </lk-radio-group>
        <lk-field
          v-model="params.report_reason"
          type="textarea"
          placeholder="请描述你的举报内容"
        />
        <lk-cell>
          <lk-upload
            :max-count="3"
            @on-success="onUploadSuccess"
            @on-remove="onRemove"
          />
        </lk-cell>
      </view>
      <view class="foot-btn-group">
        <lk-button
          round
          block
          :color="theme.gradient"
          type="danger"
          :loading="isLoading"
          @click="onSubmit"
        >
          举报
        </lk-button>
      </view>
    </block>
  </view>
</template>

<script>
import thingcircletwoMixin from "@/mixins/thingcircletwo";
import {
  GET_VIOLATIONLIST,
  ADD_VIOLATION
} from "@/common/interface/thingcircletwo";
import resultState from "./component/result-state";
function getListValue(list = []) {
  let a = [];
  list.forEach(e => {
    if (e.response) {
      a.push(e.response.src);
    }
  });
  return a.join(",");
}
export default {
  name: "packages-thingcircletwo-report",
  data() {
    return {
      isReportSuccess: false,
      formItems: [],
      params: {
        comment_id: "",
        report_reason: "",
        violation_id: "",
        report_photo: ""
      },
      isLoading: false
    };
  },
  mixins: [thingcircletwoMixin],
  onLoad(query) {
    this.params.comment_id = query.comment_id || "";
    this.getData();
  },
  methods: {
    getData() {
      GET_VIOLATIONLIST().then(({ data }) => {
        this.formItems = data.data || [];
      });
    },
    onSelect(e) {
      this.params.violation_id = e;
    },
    onUploadSuccess(data, i, list) {
      this.params.report_photo = getListValue(list);
    },
    onRemove(index, list) {
      this.params.report_photo = getListValue(list);
    },
    onSubmit() {
      if (!this.params.violation_id) {
        return this.$Prompt.toast("请选择违规类型");
      }
      if (!this.params.report_reason) {
        return this.$Prompt.toast("请填写举报内容");
      }
      if (!this.params.report_photo) {
        return this.$Prompt.toast("请上传举报图片");
      }
      this.isLoading = true;
      ADD_VIOLATION(this.params)
        .then(() => {
          this.isReportSuccess = true;
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    resultState
  }
};
</script>

<style lang="scss" scoped>
.result-tip {
  text-align: center;
  padding: $cell-padding;
  font-size: $font-size-sm;
  color: $text-light;
}
.cell-group-title {
  color: $text-gray;
  padding: 30rpx 30rpx 10rpx;
  line-height: 32rpx;
}
</style>
