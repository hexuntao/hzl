<template>
  <view class="pages">
    <!-- <view class="header-search">
      <lk-search
        v-model="params.search_text"
        placeholder="请输入搜索关键字"
        action="搜索"
        @search="onSearch"
      />
    </view> 
    <view class="placeholder"></view>-->
	
	<view class="cell-group">
	  <lk-cell title="不参与任何话题" clickable @click="onSelect(0,'')">
	    <view slot="icon" class="left-icon"></view>
	  </lk-cell>
	  
	</view>
	
    <view class="tabs" v-if="topicType == 2">
      <view class="box">
        <view
          class="item"
          v-for="(item, index) in tabs"
          :key="index"
          @click="onTabChange(index)"
        >
          
          <view class="text">
			  <image class="image" :src="item.topic_pic" style="width:40rpx;height:40rpx;vertical-align: middle;margin-right:20rpx;" />
			  {{ item.topic_title }}
		</view>
		  
		  <view class="list">
			  <view class="listitem" v-for="(item1, index1) in item.children" @click="onSelect(item1.topic_id,item1.topic_title)">{{item1.topic_title}}</view>
		  </view>
		  
		  
        </view>
      </view>
    </view>
    
  </view>
</template>

<script>
import {
  GET_TOPICLIST,
  GET_NEXTTOPICLIST,
  GET_TOPICLISTTREE
} from "@/common/interface/thingcircletwo";
import loadMixin from "@/mixins/load-list";
export default {
  name: "packages-thingcircletwo-release-topic",
  data() {
    return {
      topicType: 0, //话题类型 ， 1级话题，2级话题
      tabs: [],
      params: {
        page_index: 1,
        page_size: 20,
        search_text: "",
        superiors_id: ""
      },
      upOption: {
        auto: false,
        empty: {
          tip: "暂无话题"
        }
      }
    };
  },
  mixins: [loadMixin],
  onLoad() {
    this.getData();
  },
  methods: {
	  getData() {
	    GET_TOPICLISTTREE().then(({ data }) => {
this.topicType=2;
	      this.tabs = data;
	    });
	  },
	  
    getDataOld() {
      GET_TOPICLIST({
        search_text: this.params.search_text
      }).then(({ data }) => {
        this.tabs = data.data || [];
        this.topicType = data.topic_state == 1 ? 2 : 1;
        if (this.topicType == 1) {
          this.concatList(this.tabs, this.tabs.length);
        } else {
          this.$load.triggerUpScroll();
        }
      });
    },
    loadInitEnd() {},
    upCallback(page) {
      this.params.page_index = page.num;
      GET_NEXTTOPICLIST(this.params)
        .then(({ data }) => {
          let list = data.data;
          this.concatList(list, data.total_count);
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    onSearch(e) {
      this.params.params = e;
      this.resetList();
    },
    onTabChange(index) {
      this.params.superiors_id = this.tabs[index].topic_id;
      this.resetList();
    },
    onSelect(topic_id,topic_title) {

      uni.$emit("get-release-topic", {
        title: topic_title,
        id: topic_id
      });
      this.$Navigate.back();
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.header-search {
  width: 100%;
  position: fixed;
  left: 0;
  height: 108rpx;
  z-index: 10;
}
.placeholder {
  width: 100%;
  height: 108rpx;
}
.tabs {
  padding: 20rpx 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    flex-flow: column;
    width: 100%;
    margin: 40rpx 16rpx;
	
    .image {
      border-radius: 8rpx;
      background-color: $image-background;
    }
    .text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 48rpx;
    }
  }
}
.cell-group {
  margin: 20rpx 0;
}
.item-topic-f {
  font-size: $font-size-lg;
  width: 40rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
}
.left-icon {
  width: 30rpx;
  height: 30rpx;
  border-radius: 50%;
  border: 1px solid #494848;
  margin-top: 8rpx;
  position: relative;
  margin-right: 10rpx;
}

.left-icon::before {
  content: "";
  width: 100%;
  height: 2rpx;
  background-color: #494848;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}
.list{
	margin-top:40rpx;
}
.listitem {
	margin:10rpx 15rpx;
	border-radius: 8rpx;
	border:1rpx solid #eee;
	padding:8rpx 12rpx;
	display:inline-block;
}
</style>
