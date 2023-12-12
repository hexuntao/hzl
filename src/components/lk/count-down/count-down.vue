<template>
  <view class="count-down">
    <slot>
      <view class="box" v-html="str" v-if="str"></view>
      <block v-else>
        <text
          class="t"
          :style="timeStyle"
          v-if="timeData.d && timeData.d != '00'"
          >{{ timeData.d }}</text
        >
        <text
          class="i"
          :style="{ color: background }"
          v-if="timeData.d && timeData.d != '00'"
        >
          {{ format.d }}
        </text>
        <text class="t" :style="timeStyle">{{ timeData.h }}</text>
        <text class="i" :style="{ color: background }">{{ format.h }}</text>
        <text class="t" :style="timeStyle">{{ timeData.m }}</text>
        <text class="i" :style="{ color: background }">{{ format.m }}</text>
        <text class="t" :style="timeStyle">{{ timeData.s }}</text>
      </block>
    </slot>
  </view>
</template>

<script>
import { getServerTime, formatDate } from "@/common/utils";
import { formatClass, formatStyle } from "@/common/utils/stringify";
export default {
  data() {
    return {
      str: "",
      timer: null,
      tempFormat: "",
      flag: true,
      timeData: {
        d: 0,
        h: 0,
        m: 0,
        s: 0
      }
    };
  },
  props: {
    time: {
      type: [String, Number, Date]
    },
    format: {
      type: Object,
      default: () => {
        return {
          d: "天",
          h: ":",
          m: ":",
          s: ":"
        };
      }
    },
    timetype: {
      validator(value) {
        return ["datetime", "second", "timestamp"].indexOf(value) > -1;
      },
      default: "datetime"
    },
    doneText: {
      type: String,
      default: "已结束"
    },
    background: String,
    color: String
  },
  watch: {
    time(val) {
      clearInterval(this.timer);
      val && this.run();
    }
  },
  computed: {
    timeStyle() {
      return formatStyle({
        background: this.background,
        color: this.color
      });
    }
  },
  methods: {
    run() {
      if (!this.time) return;
      if (this.timetype === "second") {
        this.lastTime = Math.floor(new Date() / 1000) + ~~this.time;
      } else if (this.timetype === "timestamp") {
        this.lastTime = Math.floor(new Date(this.time).getTime());
      } else {
        this.lastTime = Math.floor(new Date(this.time).getTime() / 1000);
      }
      getServerTime().then(serverTime => {
        this.dateDiff =
          Math.floor(serverTime / 1000) - Math.floor(new Date() / 1000); //请求时间戳与本地时间戳 时间差
        if (this.dateDiff < 0) {
          this.dateDiff = Math.abs(this.dateDiff);
        }
        if (this.time instanceof Date) {
          this.lastTime = Math.floor(this.time.getTime() / 1000);
        }
        this.doRun();
        this.timer = setInterval(this.doRun, 1000);
      });
    },
    doRun() {
      let leftTime =
        this.lastTime - Math.floor(new Date().getTime() / 1000) + this.dateDiff;
      if (leftTime > 0) {
        // this.str = this.timestampTotime(leftTime);
        this.timeData = this.timestampTotime(leftTime);
        this.$emit("change", this.timeData);
      } else {
        if (this.flag) {
          this.flag = false;
          this.$emit("finish");
          this.str = this.doneText;
          clearInterval(this.timer);
        }
      }
    },
    timestampTotime(time) {
      let format = "{%d}天{%h}时{%m}分{%s}秒";
      let t = {};
      t.s = time % 60;
      time = Math.floor(time / 60);
      t.m = time % 60;
      time = Math.floor(time / 60);
      t.h = time % 24;
      t.d = Math.floor(time / 24);
      const ment = function(a) {
        if (a <= 0) return "00";
        return a < 10 ? "0" + a : a;
      };
      const arr = ["d", "h", "m", "s"];
      arr.forEach(val => {
        const day = ment(t[val])
          .toString()
          .split("");
        format = format.replace("{%" + val + "}", ment(t[val]));
        format = format.replace(
          "{%" + val + "0}",
          ~~day[day.length - 3] !== 0 ? day[day.length - 3] : ""
        );
        format = format.replace("{%" + val + "1}", ~~day[day.length - 2]);
        format = format.replace("{%" + val + "2}", ~~day[day.length - 1]);
      });

      return {
        s: ment(t.s),
        m: ment(t.m),
        h: ment(t.h),
        d: ment(t.d)
      };
      // return format;
    },
    clearTimer() {
      clearInterval(this.timer);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.run();
    });
  },
  beforeDestroy() {
    this.clearTimer();
  }
};
</script>

<style lang="scss" scoped>
.count-down {
  display: inline-block;
  color: $text-light;
  font-size: $font-size-sm;
  .t {
    padding: 0px 4rpx;
    background: #f8f8f8;
    border-radius: 8rpx;
    margin: 0 4rpx;
  }
  .i {
    color: inherit;
  }
}
</style>
