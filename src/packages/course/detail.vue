<template>
  <view class="pages">
    <video-panel v-if="info.type == 1" :info="info" :key="info.id" :getActive="active"/>
    <audio-panel v-if="info.type == 2" :key="info.id" :info="info" :getActive="active" :src="info.content" :duration="info.content.duration" :play.sync="audioPlay" @prev="prev" @next="next"/>
    <image-panel v-if="info.type == 3" :info="info" :key="info.id" :getActive="active"/>
    <view class="cell-group">
      <!-- 此处修改课程目录 -->
      <view class="cell-title">
        <text class="title">课程列表</text>
        <text class="text" @click="showCatalog = true"><text class="tisp-tit">共{{ info.total_count }}节</text><text class="icons tisp-i icons-arrow"></text></text>
      </view>
      <catalogue
        v-if="catelogList.length > 0"
        :list="catelogList"
        @changeData="changeData"
        :getActive="active"
        :info="info"
      />
    </view>
    <!--课程-->
    <view class="course-group" v-if="!info.is_buy">
      <view class="course-image-group" v-if="info.goods_picture">
        <image class="course-image" :src="info.goods_picture"></image>
      </view>
      <view class="course-image-group" v-else></view>
      <view class="course-title-group">
        <view class="course-title">{{ info.goods_name }}</view>
        <view class="course-item">
          <text class="v-icon v-icon-applicat"></text>
          <text class="tit">共{{ info.total_count }}节</text>
          <text class="tsp" v-if="info.sales != 0">
            <text class="tisp-icons icons icons-play"></text>
            {{ info.sales }}人学习
          </text>
          <view class="buy-btn">
            <lk-button
              size="small"
              round
              :color="theme.color"
              :to="'/packages/goods/detail?goods_id=' + info.goods_id"
            >
              购买课程
            </lk-button>
          </view>
        </view>
      </view>
    </view>
    <!--评价-->
    <lk-tabs :active-color="theme.color" :line-color="theme.color">
      <lk-tab title="详情">
        <view class="shop-detalis">
          <lk-parser
            v-if="info.description"
            show-with-animation
            lazy-load
            :html="info.description"
          ></lk-parser>
        </view>
      </lk-tab>
      <lk-tab title="评价">
        <evaluate v-if="goods_id" :info="{ goods_id }" />
      </lk-tab>
    </lk-tabs>
    <lk-popup
      v-model="showCatalog"
      title="课程目录"
      round
      position="bottom"
      closeable
    >
      <view class="catalog-list" v-if="info.id">
        <catalog
          v-if="catelogList.length > 0"
          :info="catelogList"
          :getActive="active"
          @fnData="fnData"
          :showTag="showTag"
        />
      </view>
    </lk-popup>
    <lk-shortcut-entry />
  </view>
</template>

<script>
import {
  GET_GOODSDETAIL,
  GET_GOODSDETAIL_LIST
} from "@/common/interface/course";
import videoPanel from "./component/video-panel";
import audioPanel from "./component/audio-panel";
import imagePanel from "./component/image-panel";
import evaluate from "./component/evaluate";
import catalog from "./component/catalog";
import catalogue from "./component/catalogue";
import $Storage from "@/api/storage";
export default {
  name: "packages-course-detail",
  data() {
    return {
      goods_id: 0, //商品id
      knowledge_payment_id: 0, //课程id
      info: {
        is_buy: true,
        description: ""
      },
      catelogList: [],
      showCatalog: false,
      showTag: false,
      active: 0,
      audioPlay: true,
    };
  },
  onLoad(query) {
    this.goods_id = query.goods_id;
    if('knowledge_payment_id' in query) {
      this.knowledge_payment_id = query.knowledge_payment_id;
    } 
    this.getData();
    this.loadData();
  },
  methods: {
    getData() {
      let params = {};
      if (this.goods_id) {
        params.goods_id = this.goods_id;
      }
      if (this.knowledge_payment_id) {
        params.knowledge_payment_id = this.knowledge_payment_id;
      }
      GET_GOODSDETAIL(params).then(({ data }) => {
        this.info = data || {};
      });
    },
    loadData() {
      GET_GOODSDETAIL_LIST({ goods_id: this.goods_id }).then(({ data }) => {
        this.catelogList = data.konwledge_payment_list || [];
        this.catelogList.map((item, index) => {
          item.knowledge_payment_id = item.knowledge_payment_id;
          item.isPlain = item.knowledge_payment_is_see == -1;
          item.text = item.knowledge_payment_is_see == -1 ? "" : "试学";
          return item;
        });
        let index = this.catelogList.findIndex(item =>{
           if(this.knowledge_payment_id==0){
             return item.knowledge_payment_id == item.knowledge_payment_id;
           } else {
             return item.knowledge_payment_id == this.knowledge_payment_id;
           } 
        });
        this.active = index;
        this.showTag = !data.is_buy;
      });
    },
    changeData(index) {
      let params = {};
      if (this.goods_id) {
        params.goods_id = this.goods_id;
      }
      params.knowledge_payment_id = this.catelogList[index].knowledge_payment_id;
      this.active = index;
      GET_GOODSDETAIL(params).then(({ data }) => {
        this.info = data || {};
      });
    },
    fnData(index) {
      this.changeData(index);
      this.showCatalog = false;
    },
    prev() {
      if(this.active<=this.catelogList.length-1) {
        if(this.active-1!=-1) {
          this.changeData(this.active-1);
        } else {
          return this.$Prompt.toast("当前为第一节")
        }
      }
    },
    next() {
      if(this.active<this.catelogList.length-1) {
        this.changeData(this.active+1);
      } else  if(this.active==this.catelogList.length-1) {
        return this.$Prompt.toast("当前为最后一节")
      }
    }
  },
  components: {
    videoPanel,
    audioPanel,
    imagePanel,
    evaluate,
    catalog,
    catalogue
  }
};
</script>

<style lang="scss" scoped>
.cell-group {
  background: $white;
  width: 100%;
  position: relative;
  overflow-x: hidden;

  .cell-title {
    padding: 35rpx 30rpx 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 32rpx;
    }
    .text {
      position: relative;
    }
    .tisp-tit {
      margin-right: 30rpx;
    }
    .tisp-i {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(0,-50%);
    }
  }
}

.icon-catalog {
  position: fixed;
  background-color: #ffffff;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  color: $text-gray;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-shadow: 0 0 12rpx rgba(0, 0, 0, 0.12);
  z-index: 102;
  opacity: 0.7;
  right: 30rpx;
  bottom: 60rpx;

  .text {
    font-size: $font-size-sm;
  }
}

.catalog-list {
  max-height: 65vh;
  overflow-y: auto;
}

/*修改我的课程内容*/
.course-group {
  display: flex;
  background: $white;
  padding: 40rpx 30rpx;
  border-top: 1px solid #e5e5e5;
  .course-image-group {
    width: 150rpx;
    height: 150rpx;
    border-radius: 6rpx;
    background: #f5f9ff;
    margin-right: 30rpx;

    .course-image {
      width: 100%;
      height: 100%;
    }
  }

  .course-title-group {
    flex: 1;

    .course-title {
      font-size: 26rpx;
      overflow: hidden;
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2; /*要显示的行数*/
      -webkit-box-orient: vertical;
      margin-bottom: 34rpx;
    }

    .course-item {
      display: flex;
      align-items: center;
      position: relative;
      color: #b4b4b4;

      .tisp {
        flex: 1;
        margin-right: 64rpx;
      }

      .tisp-icons {
        font-size: 12rpx;
      }

      .buy-btn {
        position: absolute;
        right: 0;
      }
    }
  }
}
.shop-detalis {
  background: $white;
  padding: 30rpx 30rpx 0 30rpx;
}
.active {
  background: #169af3;
  color: #fff;
}
</style>
