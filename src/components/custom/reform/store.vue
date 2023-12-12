<template>
  <view :class="items.id + ' ' + items.key">
    <view class="reform-box">
      <view class="reform-loading-box" v-if="viewLoading">
        <lk-loading><text class="text">加载中</text></lk-loading>
      </view>
      <block v-if="viewLoaded">
        <view v-for="(item, index) in list" :key="index">
          <shop-panel-group
            :to="item.to"
            :logo="item.logo"
            :title="item.title"
            :score="item.score"
            :distance="item.distance"
            :desc="item.desc"
            :time="item.time"
            :tel="item.store_tel"
            :lng="item.lng"
            :lat="item.lat"
            :goods="item.goods"
          >
          </shop-panel-group>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
import reform from '../../mixin/reform';
import { formatStyle } from '@/common/utils/stringify';
import { pxTorpx, addImgSrcDomain } from '@/common/utils';
import { GET_STORELIST } from '@/common/interface/store';
import shopPanelGroup from '@/pages/store/component/panel-group';

export default {
  data() {
    return {
      isShopStore: false,
      params: {
        page_index: 1,
        page_size: 20,
        order: 'distance',
        sort: 'ASC',
        lng: '',
        lat: '',
        search_text: '',
      },
      list: [],
    };
  },
  mixins: [reform],
  computed: {},
  created() {
    this.viewLoading = true;
  },
  mounted() {
    this.initIntersection().then(() => {
      this.getLocation().then(res => {
        this.params.lat = res.lat;
        this.params.lng = res.lng;
        this.getStoreList()
          .then(list => {
            this.viewLoading = false;
            this.list = list;

            this.viewLoaded = true;
          })
          .catch(() => {
            this.viewLoading = false;
            this.viewError = true;
          });
      });
    });
  },
  methods: {
    ...mapActions(['getLocation']),
    getStoreList() {
      return new Promise((resolve, reject) => {
        GET_STORELIST(this.params, { isShopStore: this.isShopStore })
          .then(({ data }) => {
            let num = parseInt(this.items.params.recommendnum);
            let list = [];
            data.store_list.forEach((e, i) => {
              let goods = [];
              if (this.items.params.show_goods == 1) {
                e.goods.forEach(g => {
                  goods.push({
                    goods_id: g.goods_id,
                    image: g.goods_img,
                    price: g.price,
                  });
                });
              }
              if (i < num) {
                list.push({
                  to: '/packages/store/home?store_id=' + e.store_id,
                  title: e.shop_name + '(' + e.store_name + ')',
                  logo: e.store_img,
                  score: e.score,
                  time: e.time,
                  store_tel: e.store_tel,
                  lng: e.lng,
                  lat: e.lat,
                  goods: goods,
                  desc: `${e.province_name}${e.city_name}${e.dictrict_name}${e.address}`,
                  distance: e.distance ? e.distance + 'km' : '',
                });
              }
            });
            resolve(list);
          })
          .catch(() => {
            reject();
          });
      });
    },
  },
  components: {
    shopPanelGroup,
  },
};
</script>

<style scoped lang="scss"></style>
