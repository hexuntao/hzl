<template>
  <view>
    <view class="head-list">
      <view class="label">我的技能</view>
      <scroll-view scroll-x class="bg-white nav" scroll-with-animation>
        <view class="value">
          <view
            class="select-btn"
            v-for="(item, index) in selected"
            :key="index"
          >
            <button class="cu-btn orange block bg-orange">
              {{ item.category_name }}
            </button>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="VerticalBox">
      <scroll-view
        class="VerticalNav nav"
        scroll-y
        scroll-with-animation
        :scroll-top="verticalNavTop"
      >
        <view
          class="cu-item"
          :class="index == tabCur ? 'text-green cur' : ''"
          v-for="(item, index) in tabList"
          :key="index"
          @tap="TabSelect"
          :data-id="index"
        >
          {{ item.category_name }}
        </view>
      </scroll-view>
      <scroll-view
        class="VerticalMain"
        scroll-y
        scroll-with-animation
        :scroll-into-view="'main-' + mainCur"
        @scroll="VerticalMain"
      >
        <view
          class="padding-top padding-lr"
          v-for="(item, index) in categoryList"
          :key="index"
        >
          <view class="cu-bar solid-bottom bg-white">
            <view class="action">
              <text class="cuIcon-title text-green"></text>
              {{ item.category_name }}
            </view>
          </view>
          <view class="cu-list menu-avatar">
            <view class="cu-item btn-list">
              <view
                v-for="(but, index1) in item.third_category"
                class=""
                :key="index1"
              >
                <button
                  class="cu-btn orange block"
                  :class="but.checked ? 'bg-orange' : 'line-orange'"
                  @tap="ChooseCheckbox"
                  :data-value="but.category_id"
                >
                  {{ but.category_name }}
                </button>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <view class="foot-btn-group fixed">
      <lk-button block round type="danger" theme-color @click="returnPage">
        保存
      </lk-button>
    </view>
  </view>
</template>

<script>
import {
  GET_GOODSCATEGORY,
  UPDATECATEGORY,
  TECHNICIANCATEGORY,
} from '@/common/interface/goods';

export default {
  data() {
    return {
      tabList: [],
      tabCur: 0,
      mainCur: 0,
      verticalNavTop: 0,
      load: true,
      category_id: '',
      categoryList: [],
      selected: [],
    };
  },

  created() {
    this.getCategoryInfo();
  },
  onUnload() {
    uni.setStorageSync('selected', this.selected);

    // 		var pages = getCurrentPages();
    // 		var prevPage = pages[pages.length - 2]; //上一个页面
    // 		 //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    // 		// 上一个页面最后设置userdata
    // 		prevPage.$vm.selected=this.selected

    // 		console.log(prevPage.$vm.selected,this.selected,777)
  },
  methods: {
    returnPage() {
      uni.setStorageSync('selected', this.selected);
      uni.navigateBack();
    },
    TabSelect(e) {
      this.tabCur = e.currentTarget.dataset.id;
      this.mainCur = e.currentTarget.dataset.id;
      this.category_id = this.tabList[e.currentTarget.dataset.id].category_id;
      this.categoryList = this.tabList[this.tabCur].second_category;
      // this.getTechnicianCategory()
    },
    // 选择技能
    ChooseCheckbox(e) {
      let that = this;
      let items = this.categoryList;
      let values = e.currentTarget.dataset.value;
      items.forEach((val, index, items) => {
        val.third_category.forEach((v, i) => {
          if (val.third_category[i].category_id == values) {
            items[index].third_category[i].checked =
              !items[index].third_category[i].checked;
            if (items[index].third_category[i].checked) {
              this.selected.push(items[index].third_category[i]);
            } else {
              this.selected.forEach((a, j) => {
                if (
                  a.category_id == items[index].third_category[i].category_id
                ) {
                  this.selected.splice(j, 1);
                }
              });
            }
          }
        });
      });
    },
    // 获取一级分类
    getCategoryInfo() {
      GET_GOODSCATEGORY()
        .then(res => {
          this.tabList = res.data;
          // this.category_id = res.data[0].category_id
          // this.getTechnicianCategory()
          this.categoryList = res.data[0].second_category;
        })
        .catch(() => {});
    },
    //编辑职业技能
    updateCategory(category_id, select) {
      UPDATECATEGORY({ category_id: category_id, select: select })
        .then(res => {
          if (res.data.code === 1) {
            this.getTechnicianCategory();
          }
        })
        .catch(() => {});
    },
    // 获取二三级分类
    getTechnicianCategory() {
      TECHNICIANCATEGORY({ category_id: this.category_id })
        .then(res => {
          this.categoryList = res.data;
          this.selected = res.selected;
        })
        .catch(res => {});
    },
  },
};
</script>

<style lang="scss">
@import '../../colorui/main.css';
@import '../../colorui/icon.css';
.fixed {
  position: fixed;
  z-index: 99;
}
.VerticalBox {
  position: absolute;
  left: 0;
  right: 0;
  top: 114rpx;
  bottom: 0;
}
.VerticalNav.nav {
  width: 200upx;
  white-space: initial;
  background-color: #ffffff;
}

.VerticalNav.nav .cu-item {
  width: 100%;
  text-align: center;
  background-color: #fff;
  margin: 0;
  border: none;
  position: relative;
}

.VerticalNav.nav .cu-item.cur {
  background-color: #f1f1f1;
}

.VerticalNav.nav .cu-item.cur::after {
  content: '';
  width: 8upx;
  height: 30upx;
  border-radius: 10upx 0 0 10upx;
  position: absolute;
  background-color: currentColor;
  top: 0;
  right: 0upx;
  bottom: 0;
  margin: auto;
}

.VerticalBox {
  display: flex;
}

.VerticalMain {
  background-color: #f1f1f1;
  flex: 1;
}
.btn-list {
  flex-wrap: wrap;
  height: auto;
  justify-content: space-between;
  padding: 20rpx 0;
  .cu-btn {
    margin: 0 10rpx 10rpx 10rpx;
    width: 130rpx;
    padding: 0;
  }
}
.cu-list {
  .cu-item {
    height: auto;
    justify-content: flex-start;
  }
}

.head-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 10rpx;
  background-color: #fff;
  .label {
    width: 130rpx;
    text-align: center;
  }
  .nav {
    width: 520rpx;
  }
  .value {
    margin: 0 0 0 20rpx;
    display: flex;
    align-items: center;
  }
  .select-btn {
    display: inline-block;
    white-space: normal;
    .cu-btn {
      width: 130rpx;
      margin: 0 10rpx;
      padding: 0;
      word-break: break-all;
    }
  }
}
.cu-list.menu-avatar > .cu-item {
  justify-content: flex-start;
}
</style>
