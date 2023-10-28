<template>
  <view class="cell-item">
    <view class="image-box" @click="toDetail" style="position:relative;">
		
      <image
        :src="imageList[0] ? imageList[0].src : ''"
        class="image"
        style="height:450rpx;width:346rpx"
		
      />
	  <!-- :style="{ height: imageList[0] ? imageList[0].height : '' }" -->
	  <lk-icon v-if="items.thing_type==2" name="video-o" square size="18" color="#fff" style="position:absolute;left:5rpx;bottom:5rpx;" />
	</view>
    <view class="info">
      <view class="title" v-if="items.title" @click="toDetail">
        <text>{{ items.title }}</text>
      </view>
      <view class="foot">
        <view class="avatar-name" @click="toDetail">
          <lk-avatar class="avatar" :src="items.user_headimg" size="40" />
          <view class="name">{{ items.thing_user_name }}</view>
        </view>
        <view class="like">
          <lk-button
            square
            bing-mobile
            type="text"
            icon-size="12"
            icon-prefix="v-icon"
            :icon="likeIcon.name"
            :custom-style="{
              color: likeIcon.color
            }"
            @click="onLike"
          >
            <view class="text">{{ likesText }}</view>
          </lk-button>
		  
		  <!-- <view @click="bianji(items.id)">编辑</view> -->
        </view>
		
		
      </view>
    </view>
  </view>
</template>

<script>
import { GET_THINGCIRCLETWOLIKES } from "@/common/interface/thingcircletwo";
import { wan, timeText } from "@/common/utils";
let likeFlag = true;
function countSize(size) {
  var _size = size || "345,345";
  var a = _size.split(",");
  var w = a[0] || 0;
  var h = a[1] || 0;
  var s = w / 345;
  return h / s;
}
export default {
  data() {
    return {
      likes: this.items.likes || 0,
      isLike: this.items.is_like
    };
  },
  props: {
    items: Object
  },
  computed: {
	  
	  
    imageList() {
      let arr = [];
      if (this.items.thing_type == 2) {
        arr.push({
          src: this.items.video_img.pic_cover,
          height: countSize(this.items.video_img.pic_size) + "rpx"
        });
      } else {
        arr = this.items.img_temp_array.map(e => {
          e.src = e.pic_cover;
          e.height = countSize(e.pic_size) + "rpx";
          return e;
        });
      }
      return arr;
    },
    contentAll() {
      return {
        height: this.showAll ? "height:100px" : "",
        text: this.showAll ? "全文" : "收起"
      };
    },
    likeIcon() {
      return {
        name: this.isLike ? "v-icon-love-02-f" : "v-icon-love-02",
        color: this.isLike ? "#f44" : "#666"
      };
    },
    likesText() {
      return wan(this.likes);
    }
  },
  mounted() {},
  methods: {
	  bianji(thing_id) {
	  		  console.log('abdfdf'+thing_id);
	    this.$Navigate.push("/packages/thingcircletwo/release/index?thing_id="+thing_id);
	  },
	  
    onLike() {
      if (!likeFlag) {
        return;
      }
      likeFlag = false;
      GET_THINGCIRCLETWOLIKES({
        thing_id: this.items.id
      })
        .then(res => {
          this.likes = res.count;
          this.isLike = !this.isLike;
          likeFlag = true;
        })
        .catch(() => {
          likeFlag = true;
        });
    },
    toDetail() {
      this.$Navigate.push({
        path: "/packages/thingcircletwo/detail",
        query: {
          type: this.items.thing_type == 2 ? "video" : "imgtext",
          thing_id: this.items.id
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.cell-item {
  margin: 20rpx 10rpx;
  background: #fff;
  border-radius: 10rpx;
  overflow: hidden;
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
}
.image-box {
  width: 100%;
  .image {
    overflow: hidden;
    display: block;
    width: 100%;
    height: 100%;
    border-top-left-radius: 10rpx;
    border-top-right-radius: 10rpx;
  }
}
.info {
  padding: 10rpx;
  .title {
    line-height: 40rpx;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    max-height: 80rpx;
  }
  .foot {
    display: flex;
    flex-flow: row;
    font-size: $font-size-sm;
    color: $text-gray;
    margin-top: 10rpx;
    .avatar-name {
      display: flex;
      flex-flow: row;
      align-items: center;
      width: 70%;
      overflow: hidden;
    }
    .avatar {
      margin-right: 10rpx;
    }
    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 160rpx;
      height: 40rpx;
      line-height: 40rpx;
    }
    .like {
      width: 30%;
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: flex-end;
      color: $text-light;
      .text {
        padding-left: 6rpx;
        display: block;
        max-width: 60rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
      }
    }
  }
}
</style>
