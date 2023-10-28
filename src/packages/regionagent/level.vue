<template>
  <view class="pages">
    <lk-header-panel
      :avatar="info.user_headimg"
      :name="info.nick_name"
      :custom-style="{ padding: '30rpx', minHeight: 'auto' }"
    >
      <view class="info">
        <view>{{ info.level_name }}</view>
		<view>{{ info.extend_code }}</view>
      </view>
    </lk-header-panel>
    <view class="cell-group">
      <view class="tabel-title">身份达成情况</view>
      <view class="tabel">
		  
        <lk-table :th="levelHead" :tr="levelList" />
      </view>
    </view>
    <!-- <view class="cell-group" v-if="upgrade.levelName">
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
    </view> -->
  </view>
</template>

<script>
import { GET_REGIONUPBONUESLEVEL } from "@/common/interface/regionagent";
function ratio(value) {
  return value ? parseFloat(value) + "%" : "--";
}
// 比例
function recommendRatio(commission, point) {
  let text = null;
  let com = parseFloat(commission);
  let pot = parseFloat(point);
  if (com > 0 && pot > 0) {
    text = com + "%佣金 + " + pot + "%积分";
  } else if (com > 0 && pot == 0) {
    text = com + "%佣金";
  } else if (com == 0 && pot > 0) {
    text = pot + "%积分";
  } else {
    text = "--";
  }
  return text;
}
// 固定
function recommendFixed(commission, point) {
  let text = null;
  let com = parseFloat(commission);
  let pot = parseFloat(point);
  if (com > 0 && pot > 0) {
    text = com + "元佣金 + " + pot + "积分";
  } else if (com > 0 && pot == 0) {
    text = com + "元佣金";
  } else if (com == 0 && pot > 0) {
    text = pot + "积分";
  } else {
    text = "--";
  }
  return text;
}
export default {
  name: "packages-agent-level",
  data() {
    return {
		pageStyle: {
		  background: "",
		  title: ""
		},
	level_id:1,
      info: {},
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
  onLoad(query) {
	this.level_id = query.level_id;
    this.getData();
  },
  methods: {
    getData() {
      GET_REGIONUPBONUESLEVEL({ level_id: this.level_id })
        .then(({ data }) => {
			uni.setNavigationBarTitle({
						　　title:data.level_name
						})
			this.pageStyle.title = data.level_name;
			
          this.info = data.user || {};
		  
		  
          /* this.upgrade.levelName = data.levelCondition.levelname;
          this.upgrade.conditeText = `(${
            data.levelCondition.upgrade_condition == 1 ? "满足所有" : "满足一条"
          })`;
          this.upgrade.items = this.getUpgrade(data.levelCondition.result);

          this.downgrade.levelName = data.downlevelCondition.levelname;
          this.downgrade.conditeText = `(${
            data.downlevelCondition.starttime
          }至${data.downlevelCondition.endtime}，${
            data.downlevelCondition.downgrade_condition == 1
              ? "满足所有"
              : "满足一条"
          })`;
          this.downgrade.items = this.getDowngrade(
            data.downlevelCondition.result
          ); */

          this.levelList = this.getLevelList(data.levelInfoShow);
		  this.levelHead = this.levelTitle(data.levelTitle);
        })
        .catch(error => {});
    },
	
	levelTitle(items = []) {
	  let arr = [
		  {value: items.value1},
		  {value: items.value2},
		  {value: items.value3},
		  {value: items.value4},
		  {value: items.value5},
	  ];
	  
	  return arr;
	},
	
    getLevelList(items = []) {
      let arr = [];
      items.forEach(e => {
		  
		  console.log(e);
		  
        let td = [
          {value: e.value1},
		  {value: e.value2},
		  {value: e.value3},
		  {value: e.value4},
		  {value: e.value5},
        ];
        
        arr.push({ td });
      });
	  console.log(arr);
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
