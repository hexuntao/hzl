<template>
  <view class="pages" style="padding-top: 30rpx">
    <view
      style="
        background-size: 100% 100%;
        background-repeat: no-repeat;
        width: 750rpx;
        height: 420rpx;
      "
      :style="{ backgroundImage: 'url(' + info.wap_member_index_adv + ')' }"
    >
      <lk-header-panel
        top-bar
        :num1="info.sc_num"
        :num3="info.kq_num"
        :avatar="info.member_img"
        :name="info.name"
        :name-tag="info.shop_level_name"
        :name-tag2="info.group_name"
        :shopid="shop_id"
        name-tag-link="/packages/member/level"
      >
        <block>
          <view class="info">
            <view class="uid-referee">
              <view v-if="info.uid" class="uid"> ID: {{ info.uid }} </view>
              <!-- <view v-if="info.referee_name" class="referee">
            推荐人: <view class="referee-name">{{ info.referee_name }}</view>
            </view> -->
            </view>
            <view class="item btn-set" @tap="toLink('/packages/member/set')">
              <text
                class="text"
                style="
                  padding: 5rpx 25rpx;
                  border: 1rpx solid #fff;
                  color: #fff;
                  font-size: 18rpx;
                  border-radius: 20rpx;
                "
                >设置</text
              >
            </view>
            <!-- <view class="code" v-if="info.extend_code">
            推荐码：
            <text class="text">{{ info.extend_code }}</text>
            <lk-icon
            @click="onCopy(info.extend_code)"
            name="v-icon-copy"
            size="10"
            color="inherit"
            class-prefix="v-icon"
            />
          </view> -->
          </view>
          <view class="btn-right" slot="right" style="marign-top: 30rpx">
            <view class="item btn-set" @tap="toLinkYQM()">
              <lk-icon name="qr" square size="20" color="#fff" />
              <text class="text" style="color: #fff">邀请码</text>
            </view>
            <!-- <view
            class="item btn-card"
            @tap="toLink('/packages/membercard/index')"
            v-if="addons.membercard"
          >
            <lk-icon name="qr" square size="20" color="#ffffff" />
            <text class="text">{{ memberTexts.membercard }}</text>
          </view> -->
          </view>
        </block>
      </lk-header-panel>
    </view>

    <view class="reform-view">
      <member-bind :items="memberItems.member_bind_fixed" />
    </view>

    <view style="margin-top: 20rpx">
      <view v-for="(item, index) in member_index_list" :key="index">
        <view
          style="
            border-bottom: 1rpx solid #c7c7c7;
            margin: 0 20rpx;
            height: auto;
          "
        >
          <view style="height: 80rpx" @click="showupmenu(index)">
            <view style="float: left; width: 50%; color: #333">
              <view
                style="margin-left: 30rpx; line-height: 80rpx; font-size: 26rpx"
              >
                <image
                  v-if="showindex != index"
                  style="
                    vertical-align: middle;
                    margin-top: -8rpx;
                    width: 36rpx;
                    height: 36rpx;
                    margin-right: 20rpx;
                  "
                  :src="item.category_pic1"
                ></image>
                <image
                  v-if="showindex == index"
                  style="
                    vertical-align: middle;
                    margin-top: -8rpx;
                    width: 36rpx;
                    height: 36rpx;
                    margin-right: 20rpx;
                  "
                  :src="item.category_pic"
                ></image>

                {{ item.short_name }}
              </view>
            </view>
            <view
              style="
                width: 50%;
                float: right;
                text-align: right;
                padding-top: 20rpx;
              "
            >
              <view style="margin-right: 30rpx">
                <lk-icon
                  name="arrow"
                  v-if="showindex != index"
                  color="#c7c7c7"
                />
                <lk-icon
                  name="arrow-down"
                  v-if="showindex == index"
                  color="#c7c7c7"
                />
              </view>
            </view>
            <text style="clear: both"></text>
          </view>

          <view v-if="showindex == index">
            <view
              @click="toLink(item1.url)"
              v-for="(item1, index1) in item.child_list"
              :key="index1"
              style="float: left; text-align: center; padding: 30rpx 0"
              :style="'width:' + item.bili + '%'"
            >
              <view
                ><image
                  style="width: 50rpx; height: 50rpx"
                  :src="item1.category_pic2"
                ></image
              ></view>
              <view style="font-size: 24rpx; margin-top: 8rpx">{{
                item1.short_name
              }}</view>
            </view>
            <view style="clear: both"></view>
          </view>
        </view>
      </view>
    </view>

    <view class="reform-view">
      <!-- <member-order :searchtext="shop_name" :items="memberItems.member_order_fixed" /> -->
      <!-- <member-assets :items="memberItems.member_assets_fixed" /> -->
      <member-reform-group :show="show" :items="items" />
    </view>

    <!-- #ifndef MP-WEIXIN -->

    <!--  #endif -->
    <lk-tabbar :show="showtabbar" :shopfooter="shopfooter" :shopid="shopid" />
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import $System from '@/api/system';
import { formatStyle } from '@/common/utils/stringify';
import { getShopLevelName } from '@/common/interface/member';
import memberBind from '@/components/custom/reform/member_bind_fixed';
// import memberAssets from "@/components/custom/reform/member_assets_fixed";
// import memberOrder from "@/components/custom/reform/member_order_fixed";
import memberReformGroup from '@/components/custom/member-reform-group';
import reformLoad from '@/mixins/reform-load';
import navbarStyle from '@/mixins/navbar-style';
import { memberCustomData } from './data';
export default {
  name: 'pages-member-index',
  data() {
    return {
      wap_member_index_adv: '',
      showindex: -1,
      show: false,
      pageStyle: {
        background: '',
        title: '',
      },
      memberItems: {
        ...memberCustomData.items,
      },
      member_index_list: [],
      shopfooter: {},
      shop_id: 0,
      shopid: 0,
      showtabbar: true,
      shop_name: '',
    };
  },
  mixins: [reformLoad, navbarStyle],
  computed: {
    itemStyle() {
      return formatStyle({
        backgroundUrl: this.info.wap_member_index_adv,
      });
    },

    ...mapState({
      info: ({ member }) => member.info,
      addons: ({ config }) => config.addons,
      memberTexts: ({ member }) => member.texts,
    }),
    ...mapGetters(['token']),
  },
  onPullDownRefresh() {
    this.getShopLevelName();
    if (this.token) {
      this.getMemberInfo({ update: true }).then(() => {
        this.getItems('refresh');
      });
    } else {
      this.getItems('refresh');
    }
  },
  onLoad(query) {
    this.shop_id = query.shop_id;
    this.shopid = query.shop_id;
    this.getShopLevelName();
    this.getItems();
  },
  onShow() {
    if (this.token) {
      this.getShopLevelName();
      this.getMemberInfo({ update: true });
    }
  },
  methods: {
    ...mapActions(['getCustom', 'getMemberInfo']),

    getShopLevelName() {
      getShopLevelName({ shop_id: this.routeQuery.shop_id }).then(
        ({ data }) => {
          this.shop_name = data.shop_name;
          this.info.shop_level_name = data.shop_level_name;
        }
      );
    },

    showupmenu(index) {
      //this.member_index_list[index].is_del = this.member_index_list[index].is_del==1?0:1;

      let showindex = this.showindex;
      if (index == showindex) {
        this.showindex = -1;
      } else {
        this.showindex = index;
      }
    },

    getItems(refresh) {
      if (refresh) {
        this.show = false;
      }
      this.getCustom({ type: 4, shop_id: this.routeQuery.shop_id })
        .then(({ items, page, member_index_list }) => {
          this.show = true;
          this.shopfooter = page.shop_footer;

          refresh && this.resetItems();
          const newItems = this.initCustomData(items);
          this.initLoadItems(newItems, 4);
          this.pageStyle.background = page.background;
          this.pageStyle.title = page.title;

          this.member_index_list = page.member_index_list;
          console.log('abcd');
          console.log(this.member_index_list);
          this.setWxShare({
            title: page.title,
          });
        })
        .catch(err => {});
    },
    initCustomData(templateItems = {}) {
      const { items } = memberCustomData; // 默认装修数据
      let newItems = {};
      const arr = [
        'member_fixed',
        'member_bind_fixed',
        'member_assets_fixed',
        'member_order_fixed',
      ];
      for (let key in templateItems) {
        const item = templateItems[key];
        if (arr.indexOf(item.id) != -1) {
          this.memberItems[item.id] = item;
        } else {
          newItems[key] = item;
        }
      }
      return newItems;
    },
    toLink(link) {
      if (link.indexOf('http') === 0) {
        /*return this.$Router.push(
		      "/component/web-view/web-view?url=" + item.linkurl
		  );*/

        return this.$Navigate.push({
          path: '/packages/property/webview',
          query: {
            linkurl: link,
          },
        });
      } else {
        this.$Navigate.push(link);
      }
    },

    toLinkYQM() {
      var link = '/packages/distribute/qrcode?shop_id=' + this.shop_id;
      this.$Navigate.push(link);
    },

    toLink1(url) {
      uni.navigateTo({
        url: url,
      });
    },
    onCopy(data) {
      $System.setClipboardData(data);
    },
  },
  components: {
    memberBind,
    // memberAssets,
    // memberOrder,
    memberReformGroup,
  },
};
</script>

<style lang="scss" scoped>
.pages {
  background-color: #fff;
}
.info {
  padding-bottom: 40rpx;
  height: 120rpx;
  font-size: $font-size-sm;
  line-height: 40rpx;
}
.info .code {
  display: inline-flex;
  flex-flow: row;
  align-items: center;
  border-radius: 999rpx;
  font-size: $font-size-xs;
  padding: 0.1em 0.2em;
  line-height: normal;
  vertical-align: middle;
  background: rgba(255, 255, 255, 0.2);
  padding: 4rpx 16rpx;
}
.info .code .text {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 180rpx;
  vertical-align: middle;
}
.info .uid-referee {
  display: flex;
  align-items: center;
  font-size: $font-size-sm;
  white-space: nowrap;
  .referee {
    margin-left: 20rpx;
    display: flex;
  }
  .referee-name {
    max-width: 140rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.btn-right {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 20rpx;
  width: 160rpx;
  justify-content: flex-end;
  flex: none;
  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    margin-left: 20rpx;
  }
  .text {
    line-height: 1;
    font-size: $font-size-xs;
  }
}
</style>
