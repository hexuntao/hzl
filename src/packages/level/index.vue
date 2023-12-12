<template>
  <view class="pages">
    <!--会员付费等级-->
    <view v-show="!isNoData">
      <view class="swiper">
      <paylevel v-if="list.length" :list="list" :paygrade_info="paygrade_info" @onchage="onchage"/>
      </view>
      <!--会员等级-->
      <paytype
        v-if="spec_list.length"
        :spec_list="spec_list"
        :content_title="gradeintroduce.agreement_name"
        :content="gradeintroduce.agreement_content"
        :level_name="level_name"
        :chage_data="chage_data"
        :tabindex="setIndex"
      />
      <!--会员等级权益-->
      <view class="cell-group" id="cell-group"> 
        <view class="cell-warp">
          <view class="cell-title" v-if="equity_list.length" >等级权益</view>
          <lk-table :th="levelHead" :tr="equity_list" />
        </view>  
      </view>
      <paygradeintroduce :gradeintroduce="gradeintroduce" />
      <lk-shortcut-entry />
    </view>
    <view v-show="isNoData">
      <lk-empty :image="image" :message="message" />
      <view class="btn-center">
      <lk-button
          size="small"
          :custom-style="{ width: '200rpx', margin: '20rpx' }"
          :color="theme.gradient"
          round
          type="danger"
          to="/pages/mall/index"
        >
         去首页
      </lk-button>
      </view>
    </view>
  </view>
</template>

<script>
import {
  GET_PAYGRADELIST,
  GET_PAYGRADEINFO,
  CREATEPURCHASEORDER,
} from "@/common/interface/level";
import paygradeintroduce from "./component/levelintroduction";
import paylevel from "./component/paylevel";
import paytype from "./component/paytype";
import benefitGroupVue from '../microshop/component/apply/benefit-group.vue';
import { formatDate } from "@/common/utils";
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
  name: "packages-level-index",
  data() {
    return {
      level_name: null, //当前等级
      equity_list: [],
      spec_list: [],
      levelHead: [],
      text: "会员",
      gradeintroduce: {
        agreement_name: '',
        agreement_content: '',
        introduce_name: '' ,
        introduce_content: '',
      },
      list: [],
      pay_grade_id:[],
      paygrade_info: {
        end_time:'',
      },
      setIndex: 0,
      chage_data: {
        gradeId: 0,
        loaded:false,
        isShowBtn: false,
        top: false,
      },
      message:'暂无数据',
      isNoData: false,
    };
  },
  onLoad() {
    this.paygraelist(); //等级类型
  },
  onPageScroll() {
    this.handleScrollTop();
  },
  methods: {
    handleScrollTop() {
      const query = uni.createSelectorQuery().in(this);
      query.select('#cell-group').boundingClientRect(data => {
         if(data.top>0) {
            this.chage_data.isShowBtn = false;
          } else {
            this.chage_data.isShowBtn = true;
          }
      }).exec();
    },
    getData() {
      this.$Prompt.loading();
      GET_PAYGRADEINFO({ pay_grade_id: this.chage_data.gradeId }).then(
          (res) => {
            this.$Prompt.clear();
            this.spec_list = res.data.setmeal_list; //购买套餐类型
            this.gradeintroduce.agreement_name = res.data.agreement_name;
            this.gradeintroduce.agreement_content = res.data.agreement_content;
            this.gradeintroduce.introduce_name = res.data.introduce_name;
            this.gradeintroduce.introduce_content = res.data.introduce_content;
            this.paygrade_info = res.data.paygrade_info
            if(res.data.paygrade_info.end_time!=''){
              this.paygrade_info.end_time = formatDate(res.data.paygrade_info.end_time)
            }
            this.chage_data.top = res.data.level_info.top
            this.equity_list = this.gethanlist(res.data.equity_list,res.data.level_info.grade_type);
            this.level_name = res.data.level_info.level_name;
            this.chage_data.loaded = true
          }
        );
    },
    paygraelist() {
      this.$Prompt.loading();
      GET_PAYGRADELIST().then((res) => {
        this.$Prompt.clear();
        if(res.data.length) {
        this.chage_data.gradeId = res.data[0].pay_grade_id
        this.list = res.data.map((item,index) => {
          item["title"] = item.grade_name;
          this.pay_grade_id.push(item.pay_grade_id)
          switch(item.grade_type) {
            case 0:
            item["image"] = `${this.$store.getters.static.baseImgPath}paygrade-01.png`;
            item['color'] = '#9A4202';
            item['dateColor'] = '#9A4202';
            item['bgColor'] = '#BA870C'; 
            break;
            case 1:
            item["image"] = `${this.$store.getters.static.baseImgPath}paygrade-02.png`
            item['color'] = '#142536';
            item['dateColor'] = '#5C5F66';
            item['bgColor'] = '#99A4BC';
            break;
            case 2:
            item["image"] = `${this.$store.getters.static.baseImgPath}paygrade-03.png`;
            item['color'] = '#2B2089';
            item['dateColor'] = '#2B2089';
            item['bgColor'] = '#6854E9';
            break;
            case 3:
            item["image"] = `${this.$store.getters.static.baseImgPath}paygrade-04.png`;
            item['color'] = '#2F2B29';
            item['dateColor'] = '#AB7223';
            item['bgColor'] = '#3D3634';
            break;
            case 4:
            item["image"] = `${this.$store.getters.static.baseImgPath}paygrade-05.png`;
            item['color'] = '#FFFFFF';
            item['dateColor'] = '#5E6791';
            item['bgColor'] = '#565B73';
            break;
            case 5:
            item["image"] = `${this.$store.getters.static.baseImgPath}paygrade-06.png`;
            item['color'] = '#4F688F';
            item['dateColor'] = '#6C87AF';
            item['bgColor'] = '#6C87AF';
            break;
            case 6:
            item["image"] = `${this.$store.getters.static.baseImgPath}paygrade-07.png`;
            item['color'] = '#FFFFFF';
            item['dateColor'] = '#629AF9';
            item['bgColor'] = '#5493FC';
            break;
            case 7:
            item["image"] = `${this.$store.getters.static.baseImgPath}paygrade-08.png`;
            item['color'] = '#9A4202';
            item['dateColor'] = '#6A6A6A';
            item['bgColor'] = '#2E2A2A';
          }
          return item;
        });
        this.getData();
        } else {
          this.isNoData = true;
        }
      });
    },
    onchage(event) {
       this.setIndex = event.detail.current;
       this.chage_data.gradeId = this.pay_grade_id[event.detail.current];
       this.getData();  
    },
    gethanlist(items,type= []) {
      let arr = [];
      switch(type) {
        case 0:
        let levelHead = [
        {
          value: "会员类型",
          style: { backgroundColor: "#d7ab82", color: "#fff" },
        },
        {
          value: "成长值",
          style: { backgroundColor: "#d7ab82", width: "300px", color: "#fff" },
        },
        { value: "折扣", style: { backgroundColor: "#d7ab82", color: "#fff" } },
        ];
        this.levelHead = levelHead;
        items.forEach((e) => {
          let td = [
            {
              value: e.level_name,
            },
          ];
          td.push({ value: e.growth_num });
          td.push({ value: e.goods_discount+'折' });
          arr.push({ td });
        });
        return arr;
        break;
        case 1:
        let textData = [
        {
          value: "会员类型",
          style: { backgroundColor: "#d7ab82", color: "#fff" },
        },
        {
          value: "一级返佣",
          style: { backgroundColor: "#d7ab82",  color: "#fff" },
        },
        { value: "二级返佣", 
          style: { backgroundColor: "#d7ab82", color: "#fff" } 
        },
        { value: "三级返佣",
          style: { backgroundColor: "#d7ab82", color: "#fff" } 
        },
        {
          value: "一级推荐",
          style: { backgroundColor: "#d7ab82",  color: "#fff" },
        },
        { value: "二级推荐", 
          style: { backgroundColor: "#d7ab82", color: "#fff" } 
        },
        { value: "三级推荐",
          style: { backgroundColor: "#d7ab82", color: "#fff" } 
        },
        ];
        this.levelHead = textData;
        items.forEach(e => {
        let td = [
          {
            value: e.level_name
          }
        ];
        if (e.recommend_type == 1) {
          td.push(
            {
              value: recommendRatio(e.commission1, e.commission_point1)
            },
            {
              value: recommendRatio(e.commission2, e.commission_point2)
            },
            {
              value: recommendRatio(e.commission3, e.commission_point3)
            }
          );
        } else {
          td.push(
            {
              value: recommendFixed(e.commission11, e.commission_point11)
            },
            {
              value: recommendFixed(e.commission22, e.commission_point22)
            },
            {
              value: recommendFixed(e.commission33, e.commission_point33)
            }
          );
        }
        td.push(
          {
            value: recommendFixed(e.recommend1, e.recommend_point1)
          },
          {
            value: recommendFixed(e.recommend2, e.recommend_point2)
          },
          {
            value: recommendFixed(e.recommend3, e.recommend_point3)
          }
        );
        arr.push({ td });
        });
        return arr;
        break;
        case 2:
        let arrData = [
        {
          value: "会员类型",
          style: { backgroundColor: "#d7ab82", color: "#fff" },
        },
        {
          value: "分红比例",
          style: { backgroundColor: "#d7ab82",  color: "#fff" },
        },
        ];
        this.levelHead = arrData;
        items.forEach((e) => {
          let td = [
            {
              value: e.level_name,
            },
          ];
          td.push({ value: e.ratio });
          arr.push({ td });
        });
        return arr;
        break;
        case 3:
        let levelHeadData = [
        {
          value: "会员类型",
          style: { backgroundColor: "#d7ab82", color: "#fff" },
        },
        {
          value: "省级分红",
          style: { backgroundColor: "#d7ab82",  color: "#fff" },
        },
        {
          value: "市级分红",
          style: { backgroundColor: "#d7ab82",  color: "#fff" },
        },
        {
          value: "区级分红",
          style: { backgroundColor: "#d7ab82",  color: "#fff" },
        },
        ];
        this.levelHead = levelHeadData;
        items.forEach((e) => {
          let td = [
            {
              value: e.level_name,
            },
            {
              value: e.province_ratio,
            },
            {
              value: e.city_ratio,
            },
            {
              value: e.area_ratio,
            },
          ];
          arr.push({ td });
        });
        return arr;
        break;
        case 4:
        let levelData = [
        {
          value: "会员类型",
          style: { backgroundColor: "#d7ab82", color: "#fff" },
        },
        {
          value: "分红比例",
          style: { backgroundColor: "#d7ab82",  color: "#fff" },
        },
        ];
        this.levelHead = levelData;
        items.forEach((e) => {
          let td = [
            {
              value: e.level_name,
            },
          ];
          td.push({ value: e.ratio });
          arr.push({ td });
        });
        return arr;
        break;
        case 5:
        let leData = [
        {
          value: "会员类型",
          style: { backgroundColor: "#d7ab82", color: "#fff" },
        },
        {
          value: "分红比例",
          style: { backgroundColor: "#d7ab82",  color: "#fff" },
        },
        ];
        this.levelHead = leData;
        items.forEach((e) => {
          let td = [
            {
              value: e.level_name,
            },
          ];
          td.push({ value: e.ratio });
          arr.push({ td });
        });
        return arr;
        break;
        case 6:
        let lData = [
        {
          value: "会员类型",
          style: { backgroundColor: "#d7ab82", color: "#fff" },
        },
        {
          value: "分红比例",
          style: { backgroundColor: "#d7ab82",  color: "#fff" },
        },
        ];
        this.levelHead = lData;
        items.forEach((e) => {
          let td = [
            {
              value: e.level_name,
            },
          ];
          td.push({ value: e.ratio });;
          arr.push({ td });
        });
        return arr;
        break;
        case 7:
        let headData = [
        {
          value: "会员类型",
          style: { backgroundColor: "#d7ab82", color: "#fff" },
        },
        {
          value: "分红比例",
          style: { backgroundColor: "#d7ab82",  color: "#fff" },
        },
        ];
        this.levelHead = headData;
        items.forEach((e) => {
          let td = [
            {
              value: e.level_name,
            },
          ];
          td.push({ value: e.ratio });
          arr.push({ td });
        });
        return arr;
        
      }
    },
  },

  computed: {
    basepath() {
      return this.$store.getters.static.baseImgPath;
    },
    image() {
      return this.basepath+'no-leve.png'
    }
  },
  components: {
    paygradeintroduce,
    paytype,
    paylevel
  }
};
</script>

<style lang="scss" scoped>
.swiper {
  padding-top: 20rpx;
}
.cell-group {
  margin: 25rpx;
  background: #ffffff;
  border-radius: 20rpx;
  .cell-warp {
    padding: 0 20rpx 32rpx;
  }
  .cell-title {
    font-size: 32rpx;
    color: #333333;
    padding: 36rpx 0 30rpx;
  }
}
.btn-center {
  text-align: center;
}
</style>
