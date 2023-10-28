<template>
  <view class="pages">
	  <view>
	  <view class="reform-box">
		  <view class="vui-goods-group goods-group-2" 

		  style="background:#ffffff;"
		  
		  >
			  <lk-load-list
			  flex-direction="row"
				ref="load"
				@init="loadInit"
				:down="downOption"
				@down="downCallback"
				:up="upOption"
				@up="upCallback"
				style="width:710rpx;"
			  >
				<view class="item" v-for="(item, index) in list" :key="index">
				  <lk-goods-box
					flex-direction="row"
					:image="item.image"
					:goods-id="item.goods_id"
					:title="item.goods_name"
				  >
	
					<view class="label" slot="label">
					  <view >
						<lk-progress-bar :value="item.percent_num">
						  <view slot="progress-text">{{ item.percent_num_text }}</view>
						</lk-progress-bar>
					  </view>
					</view>
					<view class="desc" slot="desc">
					  <view class="price-label">
						<view class="price first-letter">{{ item.price_text }}</view>
						<view class="origin-price first-letter">{{
						  item.market_price_text
						}}</view>
					  </view>
					  <view class="avatar-label" v-if="item.avatars">
						<image
						  class="img"
						  :src="a.user_img"
						  v-for="(a, i) in item.avatars"
						  :key="i"
						/>
					  </view>
					</view>
				  </lk-goods-box>
				  <view class="footer-box">
					<image class="bg" :src="footerBgSrc" mode="aspectFill" />
					<view class="texts">
					  <image class="left-img" :src="footerTextSrc" mode="aspectFill" />
					  <view class="txt">
						<view
						  >{{ item.group_num }}人拼团，{{ item.win_num }}人拼中</view
						>
						<view v-if="item.text"
						  >未拼中立得<text class="text-red">{{
							item.failure_reward_text
						  }}</text></view
						>
					  </view>
					  <view class="right-txt" @click="toDetail(item.goods_id)">
						<text>立即拼团</text
						><lk-icon name="arrow" size="12" color="#ffffff" />
					  </view>
					</view>
				  </view>
				</view>
			  </lk-load-list>
		  </view>
	  </view>
    </view>
    <lk-shortcut-entry />
  </view>
</template>

<script>

import loadMixin from "@/mixins/load-list";
import { pxTorpx, yuan } from "@/common/utils";
import { formatStyle, formatClass } from "@/common/utils/stringify";
import { mapGetters } from "vuex";
import mixinPriceText from "@/mixins/price-text";
import { GET_GOODSLIST, GET_GOODSPROMOTELIST } from "@/common/interface/goods";
export default {
  name: "packages-assemble-list",
  data() {
    return {
      params: {
        page_index: 1,
        page_size: 30,
        promotion_type: 6, //表示幸运拼团
		goods_type:0,
		recommend_type:0,
        order: "1",
        sort: "ASC",
      },
      upOption: {
        empty: {
          type: "goods",
          tip: "没有相关拼团商品"
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      routeInfo: "route",
      static: "static"
    }),
    footerBgSrc() {
      let src = this.static.baseImgPath + "style/luckyspell-bg-2.png";
      return src;
    },
    footerTextSrc() {
      let src = this.static.baseImgPath + "hongbao.png";
      return src;
    }
  },
  mixins: [loadMixin, mixinPriceText],
  onLoad(query) {
    this.params.shop_id = query.shop_id || "";
  },
  methods: {
    upCallback(page) {
      this.params.page_index = page.num;
      GET_GOODSPROMOTELIST(this.params)
        .then(({ data }) => {
          let list = data.data || [];
		  list.forEach((e, i) => {
		    e.image = e.pic_cover;
		    e.price_text = yuan(e.group_price);
		    let market_price =
		      parseFloat(e.price) < parseFloat(e.market_price)
		        ? yuan(e.market_price)
		        : "";
		    e.market_price_text = market_price;
		    let percent_num =
		      (parseInt(e.now_num || 0) / parseInt(e.group_num || 0)) * 100;
		    e.percent_num = parseFloat(percent_num.toFixed(2));
		    e.percent_num_text = `${e.percent_num}%`;
		    e.failure_reward_text = e.text;
		    e.group_num = e.group_num || 0;
		    e.win_num = e.win_num || 0;
		    let userArr = e.user || [];
		    e.avatars = userArr.filter((e, i) => i < 2);
		  });
		  console.log();
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    toDetail(goods_id) {
      this.$Navigate.push({
        path: "/packages/goods/detail",
        query: {
          goods_id: goods_id
        }
      });
    }
  },
  components: {}
};
</script>


<style scoped lang="scss">
.vui-goods-group {
  height: auto;
  overflow: hidden;
  background: #f3f3f3;
  padding: 10rpx;
  display: flex;
  flex-wrap: wrap;
}
.item {
  position: relative;
  width: calc(50% - 20rpx);
  margin: 10rpx;
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;
  -webkit-box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
}
.image-tag {
  position: absolute;
  top: 0;
  left: 20rpx;
  z-index: 1;
  text-align: center;
  line-height: 40rpx;
  height: 40rpx;
  background: linear-gradient(to top, #ff6034, #ee0a24);
  padding: 0 8rpx;
  border-bottom-left-radius: 8rpx;
  border-bottom-right-radius: 8rpx;
}

.image-tag .image-tag-text {
  color: #ffffff;
  font-size: $font-size-xs;
  position: relative;
  z-index: 1;
}

.vui-goods-group .item {
  width: 710rpx;
  font-size: $font-size-lg;
  margin-bottom:40rpx;
}
.desc {
  display: flex;
  justify-content: space-between;
}
.price-label {
  display: flex;
  align-items: center;
  .price {
    font-size: $font-size-lg;
    color: $red;
    font-weight: 700;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .origin-price {
    text-decoration: line-through;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: $font-size-sm;
    color: $text-light;
    margin-left: 20rpx;
  }
}
.avatar-label {
  display: flex;
  position: relative;
  padding-left: 20rpx;
  // margin-top: 10rpx;
  height: 50rpx;
  .img {
    width: 50rpx;
    height: 50rpx;
    border-radius: 50rpx;
    position: relative;
    margin-left: -16rpx;
    background: $image-background;
  }
}
.bottom-box {
  display: flex;
  position: relative;
  width: 100%;
  height: 76rpx;
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 8rpx;
  }
  .texts {
    display: flex;
    width: 100%;
    padding: 0 30rpx;
    color: #fff;
    position: relative;
    font-size: $font-size-sm;
    align-items: center;
    .txt {
      flex: 1;
    }
  }
}
.footer-box {
  display: flex;
  position: relative;
  width: 100%;
  height: 92rpx;
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    border-bottom-left-radius: 8rpx;
    border-bottom-right-radius: 8rpx;
  }
  .texts {
    display: flex;
    width: 100%;
    padding: 0 30rpx;
    color: #fff;
    position: relative;
    font-size: $font-size-sm;
    align-items: center;
    .left-img {
      width: 50rpx;
      height: 56rpx;
      margin-right: 20rpx;
    }
    .txt {
      flex: 1;
      color: #bc7834;
    }
    .right-txt {
      display: flex;
      align-items: center;
    }
  }
}
</style>