<template>
  <view class="content">
    <share-poster :info="posterInfo" ref="share-poster" />
    <!-- <view class="top_picture"></view> -->
    <lk-load-list
      ref="load"
      @init="loadInit"
      :down="downOption"
      @down="downCallback"
      :up="upOption"
      @up="upCallback"
      @emptyclick="emptyClick"
    >
      <view class="relative_live" v-for="(item, index) in list" :key="index">
        <view class="live-box">
          <view class="wrap">
            <view class="bg">
              <image class="image" :src="item.headUrl" />
            </view>
            <view
              class="info"
              @click="openLvie(item.live_id, item.reservable, item.noticeId)"
            >
              <view class="head">
                <view class="tags">
                  <view class="box">
                    <view class="text" v-if="item.status == 2">直播中</view>
                    <view class="text" v-if="item.status == 3">直播结束</view>
                    <view class="same" v-if="item.status == 2">
                      <text class="line1"></text>
                      <text class="line2"></text>
                      <text class="line3"></text>
                    </view>
                    <view class="text-icon" v-if="item.reservable == true">
                      <lk-icon name="clock-o" size="12" />
                      <view>预告</view>
                    </view>
                  </view>
                  <!-- <view class="box box-extra" v-if="stateText">
                    <view class="text">{{ stateText }}</view>
                  </view> -->
                </view>
              </view>
            </view>
            <view class="foot">
              <view>
                <view class="title">{{ item.description }}</view>
                <view class="bottom">
                  <view class="avatar-name">
                    <!-- <image class="avatar" :src="avatar" mode="aspectFit" /> -->
                    <!-- <image class="avatar" mode="aspectFit" /> -->
                    <view class="name">{{ item.nickname }}</view>
                  </view>
                  <!-- <view class="like-text" v-if="likeText || likeText === 0"> -->
                  <view class="like-text">
                    <lk-icon
                      v-if="state == 'ing'"
                      name="like"
                      size="12"
                      color="#ffffff"
                    />
                    <!-- <view class="text">{{ likeText }}</view> -->
                  </view>
                </view>
              </view>
              <view class="shareLive" @click="shareLive(item, index)">
                <lk-icon
                  class-prefix="v-icon"
                  name="v-icon-share-03"
                  color="inherit"
                  size="15"
                />
                <view class="share_button">分享</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </lk-load-list>
    <lk-popup v-model="showShareType" position="bottom" round closeable>
      <view style="height: 40vh; padding-top: 60rpx; text-align: center">
        <view style="font-size: 40rpx; margin-bottom: 30rpx"
          >立即分享给好友</view
        >
        <!-- <button class="weibutton" data-name="shareBtn" open-type="share" style="width: 100%; background: #fff;">微信</button> -->
        <view
          style="
            width: 100%;
            padding: 30rpx 0;
            text-align: center;
            font-size: 35rpx;
          "
          @click="sharePoster"
          >海报分享</view
        >
      </view>
    </lk-popup>
  </view>
</template>

<script>
// -1-拒绝 0-待审核 1-直播预告 2-直播中 3-已审核 4-已下播
// const tagsObj = {
//   "-1": {
//     text: "拒绝"
//   },
//   "0": {
//     text: "待审核"
//   },
//   "1": {
//     text: "预告"
//   },
//   "2": {
//     text: "直播中"
//   },
//   "3": {
//     text: "已审核"
//   },
//   "4": {
//     text: "已下播"
//   }
// };
import {
  GET_VIDEOLIST,
  UPDATEVIDEOLIVE,
  UPDATEVIDEOTRAILER,
} from '@/common/interface/mplive';
import loadMixin from '@/mixins/load-list';
import { mapGetters } from 'vuex';
import sharePoster from './component/share-poster';
export default {
  data() {
    return {
      state: 'ing',
      params: {
        page_index: 1,
        page_size: 20,
      },
      upOption: {
        auto: false,
        empty: {
          type: 'shop',
          tip: '暂无直播',
        },
      },
      showShareType: false,
      posterInfo: '',
      videoItem: '',
      indexItem: '',
    };
  },
  // props: {
  //   image: String,
  //   title: [String, Number],
  //   avatar: String,
  //   name: [String, Number],
  //   // state: String, // ing直播中，ed 已下播 ,pre 预告
  //   stateText: String,
  //   likeText: [Number, String],
  //   to: [String, Object]
  // },
  mixins: [loadMixin],
  mounted() {
    wx.getChannelsShareKey({
      success(res) {
        console.log('分享员', res);
        var sharerOpenId = res.sharerOpenId;
        var promoterInfo = res.promoter;
        console.log('sharerOpenId', sharerOpenId);
        console.log('promoterInfo', promoterInfo);
      },
      fail(res) {
        console.log('getChannelsShareKey fail', res);
      },
    });
  },
  computed: {
    ...mapGetters({
      extendCode: 'extendCode',
      shareParams: 'shareParams',
      token: 'token',
    }),
    boxStateClass() {
      return this.state ? `box-state-${this.state}` : '';
    },
    tagText() {
      let obj = {
        ing: '直播中',
        pre: '预告',
        ed: '已下播',
      };
      return obj[this.state] || '';
    },
  },
  methods: {
    loadInitEnd() {
      this.$load.triggerUpScroll();
    },
    upCallback(page) {
      console.log('page', page);
      this.params.page_index = page.num;
      GET_VIDEOLIST(this.params)
        .then(res => {
          console.log('视频号id', res);
          if (res.data.data != '') {
            let sp_id = res.data.data;
            let list = [];
            for (let i = 0; i < sp_id.length; i++) {
              wx.getChannelsLiveInfo({
                finderUserName: sp_id[i].live_id,
                success: res => {
                  if (res.errMsg === 'getChannelsLiveInfo:ok') {
                    console.log('视频号直播信息', res);
                    let liveInfo = res;
                    console.log('res', res);
                    // res['live_id'] = sp_id[i].live_id;
                    liveInfo.live_id = sp_id[i].live_id;
                    liveInfo.reservable = '';
                    liveInfo.noticeId = '';
                    list.push(liveInfo);
                    console.log('list', list);
                    console.log('spid', sp_id[i].live_id);
                    UPDATEVIDEOLIVE({
                      live_id: sp_id[i].live_id,
                      status: liveInfo.status,
                      description: liveInfo.description,
                      head_url: liveInfo.headUrl,
                      nickname: liveInfo.nickname,
                      feed_id: liveInfo.feedId,
                      nonce_id: liveInfo.nonceId,
                    }).then(res => {
                      console.log('更新直播信息', res);
                    });
                    // 返回内容
                    // feedId:直播 feedId
                    // nonceId:直播 nonceId
                    // description:直播主题
                    // status:直播状态，2直播中，3直播结束
                    // headUrl:直播封面
                    // nickname:视频号昵称
                  }
                },
                fail: res => {
                  console.log('视频号报错', res);
                },
              });
              wx.getChannelsLiveNoticeInfo({
                finderUserName: sp_id[i].live_id,
                success: res => {
                  if (res.errMsg === 'getChannelsLiveNoticeInfo:ok') {
                    console.log('视频号直播预约', res);
                    let previewList = [];
                    let previewPro = {};
                    let preview = res;
                    preview.live_id = sp_id[i].live_id;
                    previewPro.live_id = sp_id[i].live_id;
                    previewPro.headUrl = preview.headUrl;
                    previewPro.nickname = preview.nickname;
                    previewPro.noticeId = preview.noticeId;
                    previewPro.reservable = preview.reservable;
                    previewPro.startTime = preview.startTime;
                    previewPro.status = preview.status;
                    previewList.push(previewPro);
                    let other_infos = res.otherInfos;
                    for (let k = 0; k < other_infos.length; k++) {
                      other_infos[k].live_id = sp_id[i].live_id;
                      UPDATEVIDEOTRAILER({
                        live_id: other_infos[k].live_id,
                        status: other_infos[k].status,
                        head_url: other_infos[k].headUrl,
                        nickname: other_infos[k].nickname,
                        reservable: other_infos[k].reservable,
                        start_time: other_infos[k].startTime,
                        noticeId: other_infos[k].noticeId,
                      }).then(res => {
                        console.log('更新后面的预告直播', res);
                      });
                    }
                    UPDATEVIDEOTRAILER({
                      live_id: sp_id[i].live_id,
                      status: preview.status,
                      head_url: preview.headUrl,
                      nickname: preview.nickname,
                      reservable: preview.reservable,
                      start_time: preview.startTime,
                      noticeId: preview.noticeId,
                    }).then(res => {
                      console.log('更新就近的预告直播', res);
                    });
                    previewList = previewList.concat(other_infos);
                    for (let j = 0; j < previewList.length; j++) {
                      list.push(previewList[j]);
                    }
                    console.log('other_infos', other_infos);
                    console.log('previewList', previewList);
                    console.log('======listlist========', list);
                    // 返回内容
                    // noticeId:预告 id
                    // status:预告状态：0可用 1取消 2已用
                    // startTime:开始时间(时间戳)
                    // headUrl:直播封面
                    // nickname:视频号昵称
                    // reservable:是否可预约
                    // console.log('sp_id[i].live_id',sp_id[i].live_id);
                    // UPDATEVIDEOTRAILER({live_id: sp_id[i].live_id, status: preview.status, head_url: preview.headUrl,
                    // nickname: preview.nickname, reservable: preview.reservable, start_time: preview.startTime, notice_id: preview.noticeId}).then( res => {
                    //   console.log('更新就近一个预告直播',res);
                    // });
                    // for (let j = 0; j < other_infos.length; i++) {
                    //   other_infos[j].live_id = sp_id[i].live_id;
                    //   console.log('other_infos',other_infos);
                    //   // UPDATEVIDEOTRAILER({live_id: sp_id[i].live_id, status: other_infos[j].status, head_url: other_infos[j].headUrl,
                    //   // nickname: other_infos[j].nickname, reservable: other_infos[j].reservable, start_time: other_infos[j].startTime, notice_id: other_infos[j].noticeId}).then( res => {
                    //   //   console.log('更新后面的预告直播',res);
                    //   // });
                    // }
                  }
                },
                fail: res => {
                  console.log('视频号直播预约报错', res);
                },
              });
            }
            setTimeout(() => {
              this.concatList(list, res.data.total_count);
              console.log('list====', this.list);
            }, 1500);
          }
        })
        .catch(() => {
          this.$load.endErr();
        });
    },
    openLvie(live_id, reservable, noticeId) {
      if (reservable == '' && noticeId == '') {
        wx.openChannelsLive({
          finderUserName: live_id,
          success: res => {
            console.log('打开直播', res);
          },
        });
      } else if (reservable != '' && reservable == true) {
        wx.reserveChannelsLive({
          noticeId: noticeId,
          success: res => {
            console.log('预约直播', res);
          },
        });
      }
    },
    shareLive(item, index) {
      console.log('分享直播', item, index);
      // if (!this.token) {
      //   this.$Navigate.push("/packages/login/index").then(() => {
      //     this.$Prompt.toast("您未登录，请先登录！");
      //   });
      //   return;
      // };
      this.videoItem = item;
      this.indexItem = index;
      this.showShareType = !this.showShareType;
      // let customParams = encodeURIComponent(
      //   JSON.stringify({
      //     path: this.shareParams.pagePath,
      //     extend_code: this.extendCode
      //   })
      // );
      // console.log('customParams',customParams);
    },
    click(e) {
      if (this.to) {
        this.$Navigate.push(this.to);
      } else {
        this.$emit('click');
      }
    },
    // sharePoster(){
    //   console.log('点击分享海报');
    //   this.posterInfo = this.videoItem;
    //   console.log('this.posterInfo====',this.posterInfo);
    //   // 生成分享海报
    //   this.$refs["share-poster"].buildPoster();
    // },
  },
  components: {
    sharePoster,
  },
};
</script>

<style lang="scss" scoped>
.weibutton::after {
  border: none;
}
.content {
  padding: 20rpx;
  .top_picture {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 300rpx;
    background: red;
    z-index: 1000;
  }
  .relative_live {
    // height: 100%;
    // padding: 20rpx;
    border-radius: 20rpx;
    background: #ededed;
  }
  .live-box {
    position: relative;
    border-radius: 20rpx;
    overflow: hidden;
    width: 100%;
    height: 460rpx;
    box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.05);
    margin-top: 20rpx;
    .wrap {
      width: 100%;
      height: 75%;
      position: absolute;
    }
    .bg {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      overflow: hidden;
      .image {
        position: relative;
        width: 100%;
        height: 100%;
        display: block;
        border-radius: 20rpx;
      }
    }
    .info {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 30%;
        background: linear-gradient(
          to top,
          rgba(0, 0, 0, 0.2),
          rgba(0, 0, 0, 0.001)
        );
      }
    }
    .head {
      position: absolute;
      width: 100%;
      top: 0;
      z-index: 2;
      padding: 10rpx;
    }
    .foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 16rpx;
      background: #fff;
      .title {
        height: 40rpx;
        margin-bottom: 10rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #000;
      }
      .bottom {
        display: flex;
        justify-content: space-between;
      }
      .avatar-name {
        display: flex;
        align-items: center;
        font-size: $font-size-sm;
        color: #000;
        .avatar {
          width: 40rpx;
          height: 40rpx;
          display: block;
          border-radius: 999rpx;
        }
        .name {
          // padding: 0 10rpx;
          width: 160rpx;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .like-text {
        display: flex;
        align-items: center;
        font-size: $font-size-sm;
        color: #000;
        .text {
          max-width: 140rpx;
          padding-left: 6rpx;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .shareLive {
        display: flex;
        align-items: center;
        padding: 4rpx 20rpx;
        border: 1rpx solid #000;
        border-radius: 50rpx;
        .share_button {
          margin-left: 10rpx;
        }
      }
    }
    .tags {
      display: flex;
      .box {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: $font-size-xs;
        padding: 4rpx 12rpx;
        border-radius: 9999rpx;
        background: rgba(0, 0, 0, 0.15);
        color: #fff;
        height: 32rpx;
      }
      .text {
        height: 20rpx;
        line-height: 1.3;
      }
      .box.box-state-ing {
        background: linear-gradient(to right, #fb454f, #ff5187);
      }
      .box.box-state-pre {
        background: linear-gradient(to right, #18b118, #69cd83);
      }
      .box.box-state-ed {
        background: linear-gradient(to right, #ccc, #e5e5e5);
      }
      .text-icon {
        display: flex;
        width: 80rpx;
        height: 28rpx;
        align-items: center;
        // justify-content: center;
        margin-left: 8rpx;
        color: #fb454f;
      }
      .box.box-extra {
        position: relative;
        left: -24rpx;
        padding-left: 36rpx;
        z-index: 1;
      }
    }
  }
  .same {
    display: inline-block;
    height: 20rpx;
    overflow: hidden;
    margin-left: 10rpx;
  }
  .same text {
    display: inline-block;
    width: 4rpx;
    height: 20rpx;
    margin-bottom: 0;
    background-color: #ffffff;
    margin-left: 4rpx;
  }
  .same text.line1 {
    -webkit-animation: line 0.6s infinite ease-in-out alternate;
    -moz-animation: line 0.6s infinite ease-in-out alternate;
    animation: line 0.6s infinite ease-in-out alternate;
  }
  .same text.line2 {
    -webkit-animation: line 0.6s 0.2s infinite ease-in-out alternate;
    -moz-animation: line 0.6s 0.2s infinite ease-in-out alternate;
    animation: line 0.6s 0.2s infinite ease-in-out alternate;
  }
  .same text.line3 {
    -webkit-animation: line 0.6s 0.3s infinite ease-in-out alternate;
    -moz-animation: line 0.6s 0.3s infinite ease-in-out alternate;
    animation: line 0.6s 0.3s infinite ease-in-out alternate;
  }
  .same text.line4 {
    -webkit-animation: line 0.6s 0.15s infinite ease-in-out alternate;
    -moz-animation: line 0.6s 0.15s infinite ease-in-out alternate;
    animation: line 0.6s 0.15s infinite ease-in-out alternate;
  }
  @keyframes line {
    0% {
      height: 2rpx;
    }

    to {
      height: 20rpx;
    }
  }

  @-webkit-keyframes line {
    0% {
      height: 2rpx;
    }

    to {
      height: 20rpx;
    }
  }
}
</style>
