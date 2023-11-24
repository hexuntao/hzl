<template>
  <view class="header" :style="fixedTop" style="background-color: #fff">
    <view class="icon-tabs-group">
      <!-- <view class="icon-box"> </view> -->
      <view class="tabs-box">
        <view class="tabs">
          <lk-tabs
            v-model="active"
            active-color="#000"
            :line-color="theme.color"
            color="#acacac"
            slot-title
            nav-per-view="3"
            @change="onChange"
          >
            <lk-tab v-for="(tab, index) in tabs" :key="index">
              <text style="color: 28rpx">{{ tab.name }}</text>
            </lk-tab>
          </lk-tabs>
        </view>
      </view>

      <!-- <view class="icon-box">
        <lk-icon
          name="chat-o"
          size="20"
          @click="toLink('/pages/message/index')"
        />
      </view> -->
    </view>

    <view v-if="is_show_search == 1" style="position: relative">
      <lk-search
        v-model="search_text"
        placeholder="大家都在搜"
        @confirm="onSearch"
      />

      <lk-icon
        name="close"
        size="20"
        @click="showSearch1()"
        style="position: absolute; right: 40rpx; bottom: 30rpx; z-index: 10"
      />
    </view>

    <view
      class="icon-tabs-group"
      v-if="is_show_search == 0"
      style="position: relative"
    >
      <view
        class="tabs-box"
        style="
          width: 700rpx;
          margin-right: 25rpx;
          margin-left: 25rpx;
          display: block;
        "
      >
        <view class="tabs" v-if="tabs2.length">
          <lk-tabs
            v-model="active2"
            active-color="#000"
            color="#acacac"
            line-color="#fff"
            :height="44"
            slot-title
            :nav-per-view="6"
            @change="onChange2"
          >
            <lk-tab v-for="(tab, index) in tabs2" :key="index">
              <text style="color: 24rpx">{{ tab.topic_title }}</text>
            </lk-tab>
          </lk-tabs>
        </view>
      </view>
      <view class="icon-box">
        <lk-icon name="search" size="20" @click="showSearch()" />
      </view>

      <!-- <view class="icon-box" style="position:absolute;right:0rpx;z-index:100;top:0rpx;">
	      <lk-icon
	        name="arrow-down"
	        size="20"
	        @click="toLink('/pages/message/index')"
	      />
	    </view> -->
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
import { GET_TOPICLISTSECOND } from '@/common/interface/thingcircle';
import { formatStyle } from '@/common/utils/stringify';
let systemInfo = uni.getSystemInfoSync();
export default {
  data() {
    return {
      active: 1,

      tabs: [
        {
          name: '关注',
        },
        {
          name: '发现',
        },
        {
          name: '附近',
        },
      ],
      tabs2: [],
      tabs2count: 0,
      active2: 0,
      is_show_search: 0,
      search_text: '',
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    // 自定义导航栏高度
    navbarHeight() {
      // #ifdef APP-PLUS || H5
      return 44 + systemInfo.statusBarHeight;
      // #endif
      // #ifdef MP
      let height = systemInfo.platform == 'ios' ? 44 : 48;
      return systemInfo.statusBarHeight;
      //return height + systemInfo.statusBarHeight;
      // #endif
    },
    fixedTop() {
      let height = systemInfo.platform == 'ios' ? 44 : 48;

      return formatStyle({
        paddingTop: systemInfo.statusBarHeight + 'px',

        //top: this.navbarHeight + "px"
      });
    },
  },

  methods: {
    ...mapActions(['getLocation']),

    getData() {
      GET_TOPICLISTSECOND().then(({ data }) => {
        this.tabs2count = data.count;
        this.tabs2 = data.list;
      });
    },
    onChange(index) {
      if (index === 2) {
        this.getLocation().then(res => {
          this.$emit('change', {
            follow: index === 0 ? 1 : 0,
            lat: res.lat,
            lng: res.lng,
            type: '',
          });
        });
      } else {
        this.$emit('change', {
          follow: index === 0 ? 1 : 0,
          lat: '',
          lng: '',
          type: '',
        });
      }
    },
    onChange2(index) {
      let topic_title = this.tabs2[index]['topic_title'];

      if (topic_title == '直播') {
        this.$Navigate.push('/pages/live/index');
      } else if (this.active === 2) {
        this.getLocation().then(res => {
          this.$emit('change', {
            follow: this.active === 0 ? 1 : 0,
            lat: res.lat,
            lng: res.lng,
            type: topic_title,
          });
        });
      } else {
        this.$emit('change', {
          follow: this.active === 0 ? 1 : 0,
          lat: '',
          lng: '',
          type: topic_title,
        });
      }
    },
    showSearch() {
      this.is_show_search = 1;
    },
    showSearch1() {
      this.is_show_search = 0;
    },
    onSearch(e) {
      this.$emit('change', { search_text: e });
      this.is_show_search = 0;
    },

    toLink(to) {
      this.$Navigate.push(to);
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-flow: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
}
.icon-tabs-group {
  display: flex;
  flex-flow: row;
  background: #ffffff;
  .tabs-box {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .tabs {
  }
  .icon-box {
    width: 88rpx;
    height: 88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    right: -10rpx;
  }
}
</style>
