<template>
  <view :class="items.id">
    <lk-grid-panel
      card
      :cols="panelItems.length"
      icon-prefix="v-icon"
      icon-size="22"
      :icon-color="theme.color"
      :items="panelItems"
    >
      <lk-cell
        slot="header"
        is-link
        :title="items.params.title"
        :title-right="items.params.remark"
        :to="toall"
      >
      </lk-cell>
    </lk-grid-panel>
  </view>
</template>

<script>
import reform from '../../mixin/reform';
import { formatStyle } from '@/common/utils/stringify';
import { pxTorpx } from '@/common/utils';
import { mapGetters, mapState } from 'vuex';
export default {
  data() {
    return {
      toall: '',
    };
  },
  props: {
    searchtext: {
      type: [String],
      default: '',
    },
  },
  mixins: [reform],
  computed: {
    ...mapState(['member']),
    panelItems() {
      const { info } = this.member;
      const { data } = this.items;
      const arr = [];

      this.toall = '/pages/order/list' + '?search_text=' + this.searchtext;

      var urlstr = '';
      if (this.searchtext != '') {
        urlstr = '&search_text=' + this.searchtext;
      }

      for (let i in data) {
        if (data[i].is_show == '1') {
          let obj = {};
          switch (data[i].key) {
            case 'unpaid':
              obj = {
                title: data[i].text,
                icon: data[i].iconclass,
                iconInfo: info.unpaidOrder || '',
                link: '/pages/order/list?status=0' + urlstr,
                to: '/pages/order/list?status=0' + urlstr,
                status: 0,
              };
              arr.push(obj);
              break;
            case 'unshipped':
              obj = {
                title: data[i].text,
                icon: data[i].iconclass,
                iconInfo: info.shipmentPendingOrder || '',
                link: '/pages/order/list?status=1' + urlstr,
                to: '/pages/order/list?status=1' + urlstr,
                status: 1,
              };
              arr.push(obj);
              break;
            case 'unreceived':
              obj = {
                title: data[i].text,
                icon: data[i].iconclass,
                iconInfo: info.goodsNotReceivedOrder || '',
                link: '/pages/order/list?status=2' + urlstr,
                to: '/pages/order/list?status=2' + urlstr,
                status: 2,
              };
              arr.push(obj);
              break;
            case 'unevaluated':
              obj = {
                title: data[i].text,
                icon: data[i].iconclass,
                iconInfo: info.un_evaluate_num || '',
                link: '/pages/order/list?status=-2' + urlstr,
                to: '/pages/order/list?status=-2' + urlstr,
                status: -2,
              };
              arr.push(obj);
              break;
            case 'aftersale':
              obj = {
                title: data[i].text,
                icon: data[i].iconclass,
                iconInfo: info.refundOrder || '',
                link: '/pages/order/list?status=-1' + urlstr,
                to: '/pages/order/list?status=-1' + urlstr,
                status: -1,
              };
              arr.push(obj);
              break;
          }
        }
      }
      return arr;
    },
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">
.head-text {
  font-size: $font-size-sm;
}
.box {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  line-height: 40rpx;
  padding: 20rpx 0;
  .title {
  }
  .text {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 40rpx;
  }
}
</style>
