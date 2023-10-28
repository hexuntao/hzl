<template>
  <view class="pages">
    <view class="title">
      <view>PLUS会员权益</view>
      <view @click="equityintroduce">权益介绍>></view>
    </view>
    <view class="content">
      <block v-for="(item,index) in listarr" :key="index" class="upgeadlist">
        <view class="upgrade">
          <view class="img">
            <image :src="basepath+item.images" />
          </view>
          {{item.name}}
        </view>
      </block>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      listarr: [],
    };
  },
  props: {
    title: {},
    list: {},
    tabindex:{}
  },
  watch: {
    list(e) {
      if (e) this.returnarr();
    },
  },
  computed: {
basepath(){
  return this.$store.getters.static.baseImgPath
}

  },
  methods: {
    equityintroduce() {
      this.$Navigate.push("/packages/membercard/profit?tabindex="+ this.tabindex);
    },
    returnarr() {
      const item = this.list;
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
      this.listarr = arr;
    },
  },
};
</script>

<style scoped lang="scss">
.pages {
  margin: 30rpx auto;
  width: 95%;
  height: 400rpx;
  background: linear-gradient(to right, #f9e174, #ffc342);
  border-radius: 20rpx;
  overflow: hidden;
}
.img {
  image {
    width: 60rpx;
    height: 60rpx;
  }
}
.title {
  display: flex;
  justify-content: space-between;
  color: #5d3809;
  padding: 20rpx;
  font-weight: 600;
}
.content {
  width: 95%;
  height: 80%;
  background-color: #fff;
  border-radius: 20rpx;
  margin: 2rpx auto;
  display: flex;
  flex-wrap: wrap;
}
.upgrade {
  display: block;
  width: 120rpx;
  height: 100rpx;
  margin: 20rpx 20rpx;
  text-align: center;
}
</style>