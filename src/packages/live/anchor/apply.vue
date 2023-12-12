<template>
  <view class="pages">
    <block v-if="pageType == 1">
      <view class="notice" v-if="notice">{{ notice }}</view>
      <view class="cell-group">
        <lk-cell title="房号" field :value="room_no" />
        <lk-cell title="直播时段" field>
          <view class="date-box">
            <view class="item">
              <datetime-picker
                placeholder="请选择开播开始时间"
                :start="defaultStartValue"
                :end="defaultEndValue"
                fields="minute"
                @change="onStartConfirm"
              />
            </view>
            <view class="item">
              <datetime-picker
                placeholder="请选择开播结束时间"
                :start="defaultEndStartValue"
                :end="defaultEndValue"
                fields="minute"
                @change="onEndConfirm"
              />
            </view>
          </view>
        </lk-cell>
        <lk-cell-picker-group
          v-model="cateActive"
          label="直播分类"
          placeholder="请选择分类"
          :columns="cateItems"
          @confirm="onSelectCate"
        />
      </view>
      <view class="foot-btn-group">
        <lk-button
          round
          block
          theme-color
          bing-mobile
          :loading="isLoading"
          @click="onSubmit"
        >
          提交申请
        </lk-button>
      </view>
    </block>
    <block v-if="pageType == 2">
      <view class="result-box" v-if="resultInfo">
        <image class="image" :src="resultInfo.image" />
        <view class="result-text">
          <view>{{ resultInfo.text }}</view>
          <view class="text-msg" v-if="resultInfo.message">
            {{ resultInfo.message }}
          </view>
          <view v-if="resultInfo.text1">{{ resultInfo.text1 }}</view>
        </view>
      </view>
      <view class="foot-btn-group" v-if="resultInfo.btnText">
        <lk-button
          round
          block
          theme-color
          :plain="!!resultInfo.btnPlain"
          @click="onResultAction(resultInfo.btnAction)"
        >
          {{ resultInfo.btnText }}
        </lk-button>
      </view>
    </block>
  </view>
</template>

<script>
import {
  GET_LIVEANCHORAPPLYINFO,
  APPLY_LIVEANCHORAPPLYPLAY
} from "../interface";
import { dateToTimestamp, formatDate } from "@/common/utils";
import datetimePicker from "../component/datetime-picker/datetime-picker";
import { mapGetters } from "vuex";
// 获取未来n天
function getFutureDate(n) {
  var s = "";
  var n = n;
  var d = new Date();
  var year = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  if (day > n) {
    if (mon > 1) {
      mon = mon + 1;
    } else {
      year = year + 1;
      mon = 12;
    }
  }
  d.setDate(d.getDate() + n);
  year = d.getFullYear();
  mon = d.getMonth() + 1;
  day = d.getDate();
  s =
    year +
    "-" +
    (mon < 10 ? "0" + mon : mon) +
    "-" +
    (day < 10 ? "0" + day : day);
  return s;
}
// 当前时间是否在指定时间范围内
function isDuringDate(beg = 0, end = 0) {
  const curDate = Math.round(new Date() / 1000); //当前时间
  return curDate >= beg && curDate <= end;
}
export default {
  name: "packages-live-anchor-apply",
  data() {
    return {
      pageType: 0, // 页面类型 1==> 申请状态 2==> 审核状态
      notice: "",
      room_no: "",
      resultInfo: "",
      defaultStartValue: formatDate(new Date().getTime(), "YYYY-MM-DD hh:mm"), //默认开播时间
      defaultEndStartValue: formatDate(
        new Date().getTime(),
        "YYYY-MM-DD hh:mm"
      ), //默认结束开播时间
      defaultEndValue: getFutureDate(10), //默认结束时间,未来3天
      params: {
        anchor_id: 0,
        predict_start_time: "",
        predict_end_time: "",
        cate_id: "",
        status: 0 //默认无审核状态
      },
      cateActive: -1,
      cateItems: [],
      isLoading: false
    };
  },
  computed: {
    ...mapGetters(["static"])
  },
  onLoad(query) {
    this.params.anchor_id = query.anchor_id || 0;
    this.getData();
  },
  methods: {
    getData() {
      GET_LIVEANCHORAPPLYINFO({
        anchor_id: this.params.anchor_id
      }).then(({ data }) => {
        let is_apply = parseInt(data.live_info.is_apply); //是否申请过
        let status = data.live_info.status || 0; //审核状态
        this.live_id = data.live_info.live_id;

        this.room_no = data.room_no || "";
        let cateList = data.cate_list || [];
        this.cateItems = cateList.map((e, i) => {
          if (e.cate_id == data.live_info.live_cate) {
            this.cateActive = i;
          }
          e.name = e.cate_name;
          return e;
        });

        if (is_apply == 1) {
          if (status == 1) {
            //前往直播预告
            return this.$Navigate.replace({
              path: "/packages/live/anchor/notice",
              query: {
                anchor_id: this.params.anchor_id,
                live_id: data.live_info.live_id
              }
            });
          }
          if (status == 2) {
            //前往主播间
            return this.$Navigate.replace({
              path: "/packages/live/anchor/player",
              query: {
                anchor_id: this.params.anchor_id,
                live_id: data.live_info.live_id
              }
            });
          }
          if (status == 4) {
            //直播统计
            return this.$Navigate.replace({
              path: "/packages/live/anchor/end",
              query: {
                anchor_id: this.params.anchor_id,
                live_id: data.live_info.live_id
              }
            });
          }
          // 已申请，查看申请结果
          this.pageType = 2;
          this.resultInfo = this.setResultInfo(data.live_info); //设置审核返回信息状态
        } else {
          // 需要审核
          if (data.is_play_checked == 1) {
            if (status == 4) {
              // 开播过，但已下播，重新申请开播
              if (
                data.predict_start_time &&
                data.predict_end_time &&
                isDuringDate(data.predict_start_time, data.predict_end_time)
              ) {
                console.log("在开播时间范围内，无需重新申请");
                return this.$Navigate.replace({
                  path: "/packages/live/anchor/info",
                  query: {
                    anchor_id: this.params.anchor_id,
                    live_id: this.live_id
                  }
                });
              }
            }
            this.pageType = 1;
            this.notice = "当前平台开启了直播审核，审核通过后才能开启直播。";
          } else {
            // 无需审核，直接填写开播信息
            this.$Navigate.replace({
              path: "/packages/live/anchor/info",
              query: {
                anchor_id: this.params.anchor_id,
                live_id: this.live_id
              }
            });
          }
        }

        this.isLoading = false;
      });
    },
    setResultInfo({
      status,
      uncheck_reason,
      before_play_min,
      predict_start_time,
      predict_end_time,
      advance_limit_time
    }) {
      let info = "";
      const startTime = formatDate(predict_start_time, "YYYY-MM-DD hh:mm");
      const endTime = formatDate(predict_end_time, "YYYY-MM-DD hh:mm");
      const advanceFlag =
        Math.round(new Date() / 1000) >= parseInt(advance_limit_time); //是否已到开播时间临界点
      const obj = {
        "0": {
          text: "您的申请已提交至平台审核，请耐心等待！",
          image: this.static.baseImgPath + "empty-live.png"
        },
        "-1": {
          text: "您的直播申请不通过，原因：",
          message: uncheck_reason,
          btnText: "重新申请",
          btnAction: "anew",
          image: this.static.baseImgPath + "empty-live.png"
        },
        "3": {
          text: "您的直播申请已审核通过，",
          message: startTime + "~" + endTime,
          text1:
            "内开播无需再次审核，可提前" +
            (before_play_min || 0) +
            "分钟开播。",
          btnText: advanceFlag ? "前往开播" : "直播预告",
          btnAction: advanceFlag ? "player" : "advance",
          btnPlain: !advanceFlag,
          image: this.static.baseImgPath + "empty-live.png"
        }
      };
      info = obj[status] || "";
      console.log(info);
      return info;
    },
    onStartConfirm(e) {
      this.defaultEndStartValue = e.f3;
      this.params.predict_start_time = dateToTimestamp(e.f3);
    },
    onEndConfirm(e) {
      this.params.predict_end_time = dateToTimestamp(e.f3);
    },
    onSelectCate(e) {
      this.cateActive = e;
      this.params.cate_id = this.cateItems[e].cate_id;
    },
    onResultAction(action) {
      if (action == "anew") {
        //重新申请
        this.pageType = 1;
        this.params.status = 0;
      }
      if (action == "player") {
        //前往开播
        this.$Navigate.replace({
          path: "/packages/live/anchor/info",
          query: {
            anchor_id: this.params.anchor_id,
            live_id: this.live_id,
            status: 2
          }
        });
      }
      if (action == "advance") {
        //直播预告
        this.$Navigate.replace({
          path: "/packages/live/anchor/info",
          query: {
            anchor_id: this.params.anchor_id,
            live_id: this.live_id,
            status: 1
          }
        });
      }
    },
    onSubmit() {
      if (!this.params.predict_start_time) {
        return this.$Prompt.toast("请选择开播开始时间");
      }
      if (!this.params.predict_end_time) {
        return this.$Prompt.toast("请选择开播结束时间");
      }
      if (this.params.predict_end_time < this.params.predict_start_time) {
        return this.$Prompt.toast("结束时间不能在开始时间之前");
      }
      if (!this.params.cate_id) {
        return this.$Prompt.toast("请选择直播分类");
      }
      // return console.log(this.params);
      this.isLoading = true;
      APPLY_LIVEANCHORAPPLYPLAY(this.params)
        .then(({ data, message }) => {
          this.$Prompt.toast({ title: message, icon: "success" });
          this.getData();
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    datetimePicker
  }
};
</script>

<style lang="scss" scoped>
.notice {
  padding: 20rpx;
  color: #f56723;
  font-size: $font-size-sm;
  line-height: 1.5;
  background-color: #fff7cc;
}
.date-box {
  margin: -20rpx -30rpx;
  display: flex;
  flex-flow: column;
  .item {
    padding: $cell-padding;
    flex: 1;
    text-align: left;
  }
}
.result-box {
  display: flex;
  flex-flow: column;
  align-items: center;
  width: 100vw;
  min-height: 100vw;
  justify-content: center;
  .image {
    display: block;
    width: 514rpx;
    height: 258rpx;
  }
  .result-text {
    padding: $cell-padding;
    line-height: 40rpx;
    color: $text-light;
    text-align: center;
    margin: 40rpx;
    .text-msg {
      color: $red;
    }
  }
}
</style>
