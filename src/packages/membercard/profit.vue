<template>
  <view>
    <view class="goods">
      <view class="goods-list">
        <view class="item" v-for="(item, index) in list" :key="index" @click="headtitle(index)">
          <view class="img">
            <view class="imgbgc">
              <image :src="basepath+item.images" />
            </view>
            <view class="goods-title">{{ item.name }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="hidden"></view>
    <scroll-view
      scroll-y="true"
      class="scroll-Y"
      scroll-with-animation
      :scroll-into-view="cutindex"
    >
      <view class="plusitem1" v-if="listdata.is_member_discount" id="po0">
        <view class="plustitle">
          <text class="plustitleitem">专属价格</text>
        </view>
        <view class="plusimg">
          <image :src="basepath+'membercardplus1.png'" mode="widthFix" class="priceimg" />
        </view>
        <view>
          <view>权益介绍</view>
          <view class="titlebottm">1.凡带有PLUS标签的商品都享受专属会员折扣。</view>
          <view class="titlebottm">2.PLUS会员折扣可同时享受其它满足条件的优惠，例如：优惠劵， 满赠，积分抵扣等</view>
        </view>
      </view>
      <view class="plusitem" v-if="listdata.is_free_shipping" id="po1">
        <view class="plustitle">
          <text class="plustitleitem">全场包邮</text>
        </view>
        <view class="plusimg-2">
          <image :src="basepath+'membercardplus2.png'" mode="widthFix" class="exemption" />
        </view>
        <view>
          <view>权益介绍</view>
          <view class="titlebottm">享受商城所有商品免运费</view>
        </view>
      </view>
      <view class="plusitem" v-if="listdata.is_give_coupon" id="po2">
        <view class="plustitle">
          <text class="plustitleitem">专属礼券</text>
        </view>
        <view class="plusimg-3" v-for="(item,index) in coupon_list " :key="index">
          <view class="plusimg-3-item" v-if="item!==null">
            <image :src="basepath+'membercardplus3.png'" mode="widthFix" />
            <view class="plusimg-3-name">
              <view class="coupon_name" >{{item.coupon_name}}</view>
              <view class="coupon_genre">
                  {{coupongenre(item.coupon_genre)}}  
               <text v-if="item.coupon_genre==2">{{item.at_least}}元</text>
                <text v-if="item.coupon_genre==3">{{item.discount}}折</text>  
              </view>
            </view>
          </view>
        </view>
        <view>
          <view>权益介绍</view>
          <view class="titlebottm">开通PLUS即赠送上述优惠券礼包</view>
        </view>
      </view>
      <view class="plusitem" v-if="listdata.is_circle_coupon" id="po3">
        <view class="plustitle">
          <text class="plustitleitem">每月礼券</text>
        </view>
        <view class="pl4">
          <view v-for="(item5,index) in circle_coupon_list " :key="index">
            <view class="plusimg-4-item" v-if="item5!==null">
              <image :src="basepath+'membercardplus4.png'" mode="widthFix" />
              <view class="plusimg-4-name">
                <view class="coupon_name">{{item5.coupon_name}}</view>
                <view class="coupon_genre">
                    {{coupongenre(item5.coupon_genre)}}  
                 <text v-if="item5.coupon_genre==2">{{item5.at_least}}元</text>
                  <text v-if="item5.coupon_genre==3">{{item5.discount}}折</text> 
                </view>
              </view>
            </view>
          </view>
        </view>
        <view>
          <view>权益介绍</view>
          <view class="titlebottm">PLUS会员，每月1日将会自动获得上述礼劵</view>
        </view>
      </view>
      <view class="plusitem" v-if="listdata.is_give_point" id="po4">
        <view class="plustitle">
          <text class="plustitleitem">额外积分</text>
        </view>
        <view class="plusimg-6">
          <image :src="basepath+'membercardplus6.png'" mode="widthFix" class="plusimgpoint" />
          <view class="point_num">
            额外赠送{{point_num}}
            <text v-if="point_type==1">倍</text>积分
          </view>
        </view>
        <view>
          <view>权益介绍</view>
          <view class="titlebottm">
          PLUS会员购物额外赠送{{point_num}}
            <text v-if="point_type==1">倍</text>积分
          </view>
        </view>
      </view>
      <view class="plusitem" v-if="listdata.is_become_distributor" id="po5">
        <view class="plustitle7">
          <text class="plustitleitem">成为分销商</text>
        </view>
        <view class="plusimg-2">
          <image :src="basepath+'membercardplus7.png'" mode="widthFix" class="distributionimg" />
        </view>
        <view>
          <view>权益介绍</view>
          <view class="titlebottm">购买后即成为分销商身份</view>
        </view>
      </view>
      <view class="plusitem" v-if="listdata.is_give_commission" id="po6">
        <view class="plustitle">
          <text class="plustitleitem">额外分佣</text>
        </view>
        <view class="plusimg-8">
          <image :src="basepath+'membercardplus8.png'" mode="widthFix" />
        </view>
        <view class="commission">
          <view class="commissionA">
            {{commissionA}}
            <text v-if="listdata.commission_type==2">%</text>
            佣金
          </view>
          <view class="commissionB">
            {{commissionB}}
            <text v-if="listdata.commission_type==2">%</text>
            佣金
          </view>
          <view class="commissionC">
            {{commissionC}}
            <text v-if="listdata.commission_type==2">%</text>
            佣金
          </view>
        </view>
        <view>
          <view>权益介绍</view>
          <view class="titlebottm">
            1.PLUS会员的分销商可获得一级订单佣金再用额外赠送{{commissionA}}
            <text v-if="listdata.commission_type==2">%</text>
            佣金。
          </view>
          <view class="titlebottm">
            2.PLUS会员的分销商可获得二级订单佣金再用额外赠送{{commissionB}}
            <text v-if="listdata.commission_type==2">%</text>
            佣金。
          </view>
          <view class="titlebottm">
            3.PLUS会员的分销商可获得三级订单佣金再用额外赠送{{commissionC}}
            <text v-if="listdata.commission_type==2">%</text>
            佣金。
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { GET_UPGRADEMEMBERCARD } from "@/common/interface/membercard";
export default {
  name: "packages-membercard-profit",
  data() {
    return {
      list: [],
      listdata: {},
      cutindex: "po1",
      coupon_list: [], //专属礼券
      circle_coupon_list: [], //每月礼券
      point_num: "",
      point_type: "",
      commissionA: "",
      commissionB: "",
      commissionC: "",
      heigth: "",
    };
  },
  computed: {
    basepath() {
      return this.$store.getters.static.baseImgPath;
    },
  },
  onLoad(query) {
    GET_UPGRADEMEMBERCARD().then(({ data }) => {
      this.list = this.headtabarr(data.membercard_list[query.tabindex]);
      this.listdata = data.membercard_list[query.tabindex];
      this.coupon_list = data.membercard_list[query.tabindex].coupon_list;
      this.circle_coupon_list = data.membercard_list[query.tabindex].circle_coupon_list;
      this.point_num = parseInt(data.membercard_list[query.tabindex].point_num);
      this.point_type = parseInt(data.membercard_list[query.tabindex].point_type);
      this.commissionA = parseInt(data.membercard_list[query.tabindex].commissionA);
      this.commissionB = parseInt(data.membercard_list[query.tabindex].commissionB);
      this.commissionC = parseInt(data.membercard_list[query.tabindex].commissionC);
    });
  },
  methods: {
    coupongenre(v) {
      if (v == 1) return "无门槛优惠券";
      if (v == 2) return "订单金额满";
      if (v == 3) return "折扣";
    },
    headtitle(index) {
      this.cutindex = "po" + index;
    },

    headtabarr(item) {
      let obj = {};
      obj["is_member_discount"] = item.is_member_discount;
      obj["is_free_shipping"] = item.is_free_shipping;
      obj["is_give_coupon"] = item.is_give_coupon;
      obj["is_circle_coupon"] = item.is_circle_coupon;
      obj["is_give_point"] = item.is_give_point;
      obj["is_become_distributor"] = item.is_become_distributor;
      obj["is_give_commission"] = item.is_give_commission;
      let arr = [];
      for (let key in obj) {
        if (obj[key] !== 0) {
          let obj = {};
          switch (key) {
            case "is_member_discount":
              obj.name = "专属价格";
              obj.images = "memberequity1.png";
              break;

            case "is_become_distributor":
              obj.name = "分销权益";
              obj.images = "memberequity2.png";
              break;

            case "is_circle_coupon":
              obj.name = "每月礼券";
              obj.images = "memberequity6.png";
              break;

            case "is_free_shipping":
              obj.name = "全场包邮";
              obj.images = "memberequity8.png";
              break;

            case "is_give_commission":
              obj.name = "额外分佣";
              obj.images = "memberequity3.png";
              break;

            case "is_give_coupon":
              obj.name = "专属礼券";
              obj.images = "memberequity7.png";
              break;

            case "is_give_point":
              obj.name = "额外积分";
              obj.images = "memberequity4.png";
              break;
          }

          arr.push(obj);
        }
      }
      return arr;
    },
  },
};
</script>

<style scoped lang="scss">
.scroll-Y {
  height: 1200rpx;
}
.hidden {
  width: 100%;
  height: 150rpx;
}
.goods {
  width: 100%;
  background: #ffe5ac;
  padding: 10rpx;
  position: fixed;
  z-index: 99;
  ::-webkit-scrollbar {
    display: none;
  }
}

.goods-list {
  text-align: center;
  overflow: hidden;
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  overflow-x: auto;

  .item {
    position: relative;
    width: calc(33% - 105rpx);
    font-size: $font-size-sm;
    flex: none;
    text-align: center;
    .goods-title {
      white-space: nowrap;
      overflow: hidden;
      width: 100%;
      padding: 4rpx;
      color: #7c7870;
      margin-top: 7rpx;
    }
  }
}
.imgbgc {
  width: 80rpx;
  height: 80rpx;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10rpx;
}
.img {
  width: 100rpx;
  height: 100%;

  image {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
  }
}
.plusitem1 {
  width: 95%;
  height: auto;
  background-color: #fff;
  border-radius: 30rpx;
  // margin-top: 160rpx;
  margin-left: 20rpx;
  padding: 40rpx;
}
.plusitem {
  width: 95%;
  height: auto;
  background-color: #fff;
  border-radius: 30rpx;
  margin: 20rpx auto;
  padding: 40rpx;
}
.plustitle {
  font-weight: 800;
  position: relative;
  font-size: 32rpx;
}
.plusimg {
  margin: 30rpx 0;
  image {
    width: 96%;
  }
}
.priceimg {
  margin-left: 15rpx;
}
.titlebottm {
  color: #999999;
  font-size: 22rpx;
  margin: 6rpx 0;
}
.plusimg-2 {
  width: 350rpx;
  height: 200rpx;
  margin: 30rpx auto;
}
.exemption {
  width: 350rpx;
  height: 200rpx;
}

.plusimg-3 {
  image {
    width: 90%;
    margin-left: 40rpx;
  }
}

.plusimg-3-item {
  position: relative;
}
.plusimg-3-name {
  position: absolute;
  top: 20%;
  left: 16%;
}

.coupon_name {
  font-size: 30rpx;
  color: #d0323d;
}

.coupon_genre {
  font-size: 30rpx;
  color: #aa7742;
}

.plusimg-5 {
  width: 90%;
  height: 150rpx;
  margin: 10rpx auto;
  image {
    width: 90%;
    height: 150rpx;
    margin: 30rpx auto;
  }
}

.point_num {
  position: absolute;
  right: -40rpx;
  top: 50%;
  font-size: 20rpx;
  color: #d34951;
}

.plusimgpoint {
  width: 400rpx;
  height: 200rpx;
}

.plusimg-6 {
  position: relative;
  margin: 30rpx 30rpx;
}

.distributionimg {
  width: 280rpx;
  height: 226rpx;
  margin-left: 40rpx;
}

.plusimg-7 {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.commission {
  display: flex;
  width: 100%;
  justify-content: space-between;

  margin: 10rpx 0;
}
.commissionB {
  color: #ffae02;
  font-size: 20rpx;
  
}
.commissionA {
  color: #d0323d;
  font-size: 20rpx;
  margin-left: 22rpx;
}
.commissionC {
  color: #7087ff;
  font-size: 20rpx;
  margin-right: 22rpx;
}
.plusimg-8 {
  text-align: center;
  margin-top: 14rpx;
  font-size: 10rpx;
  image {
    width: 99%;
  }
}
.plustitle::before {
  content: "";
  width: 125rpx;
  height: 14rpx;
  position: absolute;
  background-color: #ffe5ac;
  bottom: 0;
  opacity: 0.5;
}

.plustitle7 {
  font-weight: 800;
  position: relative;
  font-size: 32rpx;
}

.plustitle7::before {
  content: "";
  width: 155rpx;
  height: 14rpx;
  position: absolute;
  background-color: #ffe5ac;
  bottom: 0;
  opacity: 0.5;
}
.plusimg-4-item {
  position: relative;
  margin-left: 10rpx;
  image {
    width: 300rpx;
    height: 150rpx;
  }
}

.pl4 {
  display: flex;
  overflow-x: auto;
  margin: 14rpx;
}

.plusimg-4-name {
  width: 180rpx;
  overflow: hidden;
  position: absolute;
  top: 35rpx;
  text-align: center;
  left: 32rpx;
  .coupon_name{
  color: #d0323d;
  }
  .coupon_genre{
    font-size: 25rpx;
  }
}
</style>

