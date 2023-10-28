<template>
  <view class="pages">
    <view class="cell-group">
      <lk-field
        v-model="params.thing_title"
        placeholder="加个标题会有更多赞哦！最多20字"
        maxlength="20"
      />
      <lk-field
        v-model="params.content"
        type="textarea"
        maxlength="1000"
        placeholder="说说此刻心情。最多1000字"
      />

       <lk-upload-new 
	   :file-list="imgList" 
	   :max-count="9" 
	   @on-success="onUploadSuccess" 
	   @on-remove="onRemove" 
	   
	   :max-count-new-video="1" 
	   @on-successnewvideo="onUploadSuccessNewVideo"
	   @on-removenewvideo="onRemoveNewVideo" 
	   
	   
	   /> 


      <cell-goods v-model="params.goods_array" />
      <cell-topic v-model="params.topic_id" />
    
	<lk-cell is-link @click="toLink">
	  <view class="icon" slot="icon">
	    <lk-icon class-prefix="v-icon" name="v-icon-location03" size="20" :color="stateStyle.color" />
	  </view>
	  <view class="title" slot="title" :style="{ color: stateStyle.color }">
	    <view class="text">{{ stateStyle.title }}</view>
	    <view class="title-right" v-if="!info.title">让附近更多的人发现你</view>
	  </view>
	</lk-cell>
	
    </view>
    <view class="foot-btn-group">
      <lk-button
        round
        block
        :color="theme.gradient"
        type="danger"
        :loading="isLoading"
        @click="onSubmit"
      >
        发布干货
      </lk-button>
    </view>
  </view>
</template>

<script>
import {
  ADD_RELEASEDRY,
  GET_THINGCIRCLEDETAIL
} from "@/common/interface/thingcircle";
import cellGoods from "../component/release/cell-goods";
import cellTopic from "../component/release/cell-topic";
import thingcircleMixin from "@/mixins/thingcircle";
import { mapActions, mapState, mapGetters } from "vuex";
function getListValue(list = []) {
  let a = [];
  list.forEach(e => {
    if (e.src) {
      a.push(e.src);
    } else if (e.response) {
      a.push(e.response.src);
    } else if (e.url) {
      a.push(e.url);
    }
  });
  return a.join(",");
}
export default {
  name: "packages-thingcircle-release-index",
  data() {
    return {
      isLoading: false,
      params: {
        thing_type: 1, //发布类型
        topic_id: "",
        content: "",
        thing_title: "",
        img_id: "",
		img_id_new_video: "",
        goods_array: "",
        location: "",
        lat: "",
        lng: ""
      },
      imgList: [],
	  info: {
	    title: ""
	  }
    };
  },
  mixins: [thingcircleMixin],
  onLoad(query) {
    this.params.thing_id = query.thing_id || "";
    if (this.params.thing_id) {
      this.getDetail();
    }
	
  },
  computed: {
    stateStyle() {
      let obj = {
        color: this.info.title ? "#f44" : "#909399",
        title: this.info.title || "添加定位"
      };
      return obj;
    },
	...mapState({
	  config: ({ config }) => config,
	}),
  },
  onShow() {
  	  const chooseLocation = requirePlugin('chooseLocation');
  	  const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
  	  console.log("您所选择的位置：", location);
  	  if(location){
 
		  this.info.title = location.name;
		  this.params.location = location.name;
		  this.params.lat = location.latitude;
		  this.params.lng = location.longitude;
  		  
  		  
  	  }
  },
  methods: {
	  toLink() {
		  console.log(this.config);
	    var key = this.config.tengxun_key;
	    var referer = this.config.tengxun_name;
		console.log(referer+' : '+key);
	    wx.navigateTo({
	    	url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer
	    });
	  },
    getDetail() {
      GET_THINGCIRCLEDETAIL({ thing_id: this.params.thing_id })
        .then(({ data }) => {
          this.params.thing_type = data.thing_type;
          this.params.topic_id = data.topic_id;
          this.params.content = data.content;
          this.params.thing_title = data.title;
          this.params.goods_array = data.recommend_goods;
          this.params.location = data.location;
          this.params.lat = data.lat;
          this.params.lng = data.lng;
          let imgArr = [];
          data.img_temp_array.forEach(e => {
            imgArr.push(e.pic_cover);
            this.imgList.push({ url: e.pic_cover, src: e.pic_cover, ...e });
          });
          this.params.img_id = imgArr.join(",");
        })
        .catch(() => {});
    },

    onUploadSuccess(data, i, list) {
      this.params.img_id = getListValue(list);
    },
    onRemove(index, list) {
      this.params.img_id = getListValue(list);
    },
	onUploadSuccessNewVideo(data, i, list) {
	  this.params.img_id_new_video = getListValue(list);
	},
	onRemoveNewVideo(index, list) {
	  this.params.img_id_new_video = getListValue(list);
	},
    onSubmit() {
      if (!this.params.content) {
        return this.$Prompt.toast("请填写话题内容");
      }
      if (!this.params.img_id && !this.params.img_id_new_video) {
        return this.$Prompt.toast("请添加话题素材");
      }
	  if(this.params.img_id_new_video!=""){
		  this.params.img_id = this.params.img_id_new_video;
		  this.params.thing_type = 2;
	  }else{
		  this.params.thing_type = 1;
	  }
      this.isLoading = true;
      ADD_RELEASEDRY(this.params)
        .then(({ message }) => {
          this.$Navigate.push("/pages/thingcircle/index").then(() => {
            this.$Prompt.toast({ title: message, icon: "success" });
          });
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    cellGoods,
    cellTopic
  }
};
</script>

<style lang="scss" scoped>
	.icon {
	  margin-right: 12rpx;
	  display: flex;
	  align-items: center;
	}
	.title {
	  display: flex;
	  flex-flow: row;
	  justify-content: space-between;
	  color: $text-light;
	  .title-right {
	    font-size: $font-size-sm;
	  }
	}
	.list {
	  width: 100%;
	  height: 65vh;
	  overflow-y: auto;
	  padding-bottom: 160rpx;
	}
</style>
