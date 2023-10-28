<template>
 <view >
    <image :src="items.background_pic?items.background_pic:palaceBgImg" class="palace"  mode='widthFix'>
    <view class="rotate-wrap" >
      <view v-if="items.prize" class="newUl">
        <view class="newLi" v-for="(item ,index) in items.prize" :key="index" :style="{transform: 'rotate(' + index * styledeg.deg + 'deg)',width: styledeg.wd + '%',left: styledeg.lf + '%',paddingTop: styledeg.pt + '%'}">
          <view>
            <image :src="item.prize_pic?item.prize_pic:defaultImg(item.prize_type)" >
            <text>{{item.prize_name }} </text>
          </view>
        </view>
      </view>
    </view>
  </view>

</template>
<script>
export default {
  props: {
    items: {},
  },
  computed: {
       
    palaceBgImg() {
      let imgSrc = null;
      var that =this
      if (that.items.prize) {
        let prizes = that.items.prize;
        let path = that.$store.getters.static.baseImgPath;
        
        if (prizes.length == 6) {
          imgSrc = path + "wheels-bg-palace-6.png" ;
        } else if (prizes.length == 8) {
          imgSrc = path + "wheels-bg-palace-8.png";
        } else if (prizes.length == 10) {
          imgSrc = path + "wheels-bg-palace-10.png" ;
        } else if (prizes.length == 12) {
          imgSrc = path + "wheels-bg-palace-12.png" ;
        }
      }
     
      return imgSrc;
    },
    styledeg() {
      const $this = this;
      const prizes = $this.items.prize;
      let deg = 60;
      let wd = null,
        lf = null,
        pt = null;
      if (prizes.length == 6) {
        $this.deg = 60;
        $this.wd = 41.555;
        $this.lf = 29.555;
        $this.pt = 10;
      } else if (prizes.length == 8) {
        $this.deg = 45;
        $this.wd = 32.888;
        $this.lf = 32.333;
        $this.pt = 10;
      } else if (prizes.length == 10) {
        $this.deg = 36;
        $this.wd = 27;
        $this.lf = 36;
        $this.pt = 12;
      } else if (prizes.length == 12) {
        $this.deg = 29.8;
        $this.wd = 25;
        $this.lf = 38;
        $this.pt = 10;
      }
      return {
        deg: $this.deg,
        wd: $this.wd,
        lf: $this.lf,
        pt:$this.pt
      };
    },
    defaultImg(type) {
      let imgSrc = null;
      let path =  this.$store.getters.static.baseImgPath;
      return type => {
          if (type == 0) {
            // 0 => 未中奖
            imgSrc =  path + "default-no.jpg" ;
          } else if (type == 1) {
            // 1 => 余额
            imgSrc =  path + "default-balance.png" ;
          } else if (type == 2) {
            // 2 => 积分
            imgSrc =  path + "default-integral.png" ;
          } else if (type == 3) {
            // 3 => 优惠券
            imgSrc =  path + "default-coupon.png" ;
          } else if (type == 4) {
            // 4 => 礼品券
            imgSrc =  path + "default-giftvoucher.png" ;
          } else if (type == 5) {
            // 5 => 商品
            imgSrc =  path + "default-goods.png" ;
          } else if (type == 6) {
            // 6 => 赠品
            imgSrc =  path + "default-gift.png";
          }
        return imgSrc;
      };
    }
  },

}

</script>

<style scoped lang="scss">
.palace {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  z-index: 10;
}
.rotate-wrap {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
.newUl {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.newUl .newLi {
  display: block;
  position: absolute;
  top: 0;
  -webkit-transform-origin: 50% 100%;
  transform-origin: 50% 100%;
  height: 50%;
}
.newUl .newLi view {
  position: relative;
  width: 100%;
}
.newUl .newLi view text {
  display: block;
  font-size: 24rpx;
  color: #c30b29;
  overflow: hidden;
  height: 40rpx;
  line-height: 40rpx;
  text-align: center;
  width: 60%;
  margin: auto;
}
.newUl .newLi view image {
  width: 70rpx;
  height: 70rpx;
  display: block;
  margin: auto;
}
</style>
