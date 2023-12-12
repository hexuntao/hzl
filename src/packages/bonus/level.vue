<template>
  <view class="pages">
    <lk-header-panel
      :avatar="info.user_headimg"
      :name="info.user_name"
      :custom-style="{ padding: '30rpx', minHeight: 'auto' }"
    >
      <view class="info">
        <view>{{ info.level_name }}</view>
      </view>
    </lk-header-panel>
    <view class="cell-group" v-if="areaLevelList.length">
      <view class="tabel-title">代理地区</view>
      <view class="tabel">
        <lk-table :th="areaLevelHead" :tr="areaLevelList" />
      </view>
    </view>
    <view class="cell-group">
      <view class="tabel-title">等级权益介绍</view>
      <view class="tabel">
        <lk-table :th="levelHead" :tr="levelList" />
      </view>
    </view>
    <view class="cell-group" v-if="upgrade.levelName">
      <view class="tips">
        <view class="title">
          {{ upgrade.label1 }}
          <text>{{ upgrade.levelName }}</text>
          {{ upgrade.label2 }}
          <text class="light">{{ upgrade.conditeText }}</text>
        </view>
        <view v-for="(item, index) in upgrade.items" :key="index">
          {{ item.index }}
          {{ item.label1 }}
          <text>{{ item.numText }}</text>
          {{ item.label2 }}
          <text class="light">{{ item.labelLight }}</text>
        </view>
      </view>
    </view>
    <view class="cell-group" v-if="downgrade.levelName">
      <view class="tips">
        <view class="title">
          {{ downgrade.label1 }}
          <text>{{ downgrade.levelName }}</text>
          {{ downgrade.label2 }}
          <text class="light">{{ downgrade.conditeText }}</text>
        </view>
        <view v-for="(item, index) in downgrade.items" :key="index">
          {{ item.index }}
          {{ item.label1 }}
          <text>{{ item.days }}</text>
          {{ item.label2 }}
          <text>{{ item.down_number }}</text>
          {{ item.label3 }}
          <text class="light">{{ item.labelLight }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { GET_UPBONUESLEVEL } from "@/common/interface/distribute";
import bonusMixin from "@/mixins/bonus";
const levelHeadBbj = {
  1: [
    {
      value: "等级"
    },
    {
      value: "分红比例"
    }
  ],
  2: [
    {
      value: "等级"
    },
    {
      value: "省分红"
    },
    {
      value: "市分红"
    },
    {
      value: "区分红"
    }
  ],
  3: [
    {
      value: "等级"
    },
    {
      value: "分红比例"
    }
  ]
};
function ratio(value) {
  return value ? parseFloat(value) + "%" : "--";
}
export default {
  name: "packages-bonus-level",
  data() {
    return {
      types: 0,
      info: {},

      areaLevelHead: [
        {
          value: "地区"
        },
        {
          value: "分红比例"
        }
      ],
      areaLevelList: [],

      levelHead: [],
      levelList: [],

      //升级条件
      upgrade: {
        label1: "升级",
        label2: "条件",
        levelName: "",
        conditeText: "",
        items: []
      },
      //降级条件
      downgrade: {
        label1: "降级",
        label2: "条件",
        levelName: "",
        conditeText: "",
        items: []
      }
    };
  },
  mixins: [bonusMixin],
  computed: {},
  onLoad(query) {
    this.types = query.type || "";
    if (this.types) {
      this.levelHead = levelHeadBbj[this.types];
    }
    this.getData();
  },
  methods: {
    getData() {
      GET_UPBONUESLEVEL({ types: this.types }).then(({ data }) => {
        this.info = data.user || {};
        this.upgrade.levelName = data.levelCondition.levelname;
        this.upgrade.conditeText = `(${
          data.levelCondition.upgrade_condition == 1 ? "满足所有" : "满足一条"
        })`;
        this.upgrade.items = this.getUpgrade(data.levelCondition.result);

        this.downgrade.levelName = data.downlevelCondition.levelname;
        this.downgrade.conditeText = `(${data.downlevelCondition.starttime}至${
          data.downlevelCondition.endtime
        }，${
          data.downlevelCondition.downgrade_condition == 1
            ? "满足所有"
            : "满足一条"
        })`;
        this.downgrade.items = this.getDowngrade(
          data.downlevelCondition.result
        );

        this.levelList = this.getLevelList(data.levels);
        if (data.user.area_data) {
          this.areaLevelList = this.getAreaLevelList(data.user.area_data);
        }
      });
    },
    getLevelList(items = []) {
      let arr = [];
      items.forEach(e => {
        let td = [
          {
            value: e.level_name
          }
        ];
        if (this.types == 2) {
          td.push(
            {
              value: ratio(e.province_ratio)
            },
            {
              value: ratio(e.city_ratio)
            },
            {
              value: ratio(e.area_ratio)
            }
          );
        } else {
          td.push({
            value: ratio(e.ratio)
          });
        }
        arr.push({ td });
      });
      return arr;
    },
    getAreaLevelList(items = []) {
      let arr = [];
      items.forEach(e => {
        let td = [
          {
            value: e.area_name
          },
          {
            value: e.area_ratio ? parseFloat(e.area_ratio) + "%" : "--"
          }
        ];
        arr.push({ td });
      });
      return arr;
    },
    getUpgrade(items = []) {
      let arr = [];
      items.forEach((e, i) => {
        let obj = {};
        obj.index = `${i + 1}、`;
        obj.labelLight = `(${parseFloat(e.number)}/${parseFloat(e.up_number)})`;
        obj.label1 = e.condition_type == 7 ? "购买商品" : e.condition_name;
        obj.label2 = e.condition_type == 7 ? "" : e.unit;
        obj.numText =
          e.condition_type == 7 ? e.condition_name : parseFloat(e.up_number);
        arr.push(obj);
      });
      return arr;
    },
    getDowngrade(items = []) {
      let arr = [];
      const conditeObj = {
        1: {
          label1: "团队订单量在",
          label2: "天内，少于",
          label3: "单"
        },
        2: {
          label1: "团队订单金额在",
          label2: "天内，少于",
          label3: "元"
        },
        3: {
          label1: "",
          label2: "天内，需要消费",
          label3: "元"
        }
      };
      items.forEach((e, i) => {
        let obj = {};
        obj.index = `${i + 1}、`;
        obj.labelLight = `(${parseFloat(e.number)}/${parseFloat(
          e.down_number
        )})`;
        obj.label1 = conditeObj[e.condition_type].label1;
        obj.label2 = conditeObj[e.condition_type].label2;
        obj.label3 = conditeObj[e.condition_type].label3;
        obj.days = parseFloat(e.days);
        obj.down_number = parseFloat(e.down_number);
        arr.push(obj);
      });
      return arr;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.info {
  font-size: $font-size-sm;
  line-height: 40rpx;
}
.cell-group {
  margin: 20rpx 0;
}
.tabel {
  padding: $cell-padding;
  background-color: #ffffff;
}
.tabel-title {
  padding: 20rpx 30rpx 0;
  background-color: #ffffff;
}
.tips {
  padding: $cell-padding;
  line-height: 40rpx;
  background-color: #ffffff;
  font-size: $font-size-sm;
  .title {
    font-size: $font-size;
    line-height: 48rpx;
  }
  text {
    color: $red;
    padding: 0 8rpx;
  }
  .light {
    color: $text-light;
    font-size: $font-size-sm;
  }
}
</style>
