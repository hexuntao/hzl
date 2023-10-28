<template>
  <view class="reform-group">
    <!-- #ifdef H5 -->
    <component
      :is="'tpl_' + item.id"
      v-for="item in items"
      :key="item.timestamp"
      :items="item"
      :type="type"
      @event="event"
    />
    <!--  #endif -->
    <!-- #ifndef H5 -->
    <block v-if="show">
      <block v-for="(item, index) in items" :key="index">
        <tpl_title
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'title'"
        />
        <tpl_line
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'line'"
        />
        <tpl_blank
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'blank'"
        />
        <tpl_picture
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'picture'"
        />
        <tpl_goods
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'goods'"
        />
        <tpl_listmenu
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'listmenu'"
        />
        <tpl_richtext
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'richtext'"
        />
        <tpl_drawregion
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'drawregion'"
        />
        <tpl_search
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'search'"
        />
        <tpl_menu
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'menu'"
        />
        <tpl_notice
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'notice'"
        />
        <tpl_banner
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'banner'"
        />
        <tpl_picturew
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'picturew'"
        />
        <tpl_seckill
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'seckill'"
        />
        <tpl_shop
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'shop'"
        />
        <tpl_goodsCps
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'goodsCps'"
        />
        <tpl_goodsIntegral
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'goodsIntegral'"
        />
        <tpl_assemble
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'assemble'"
        />
        <tpl_limitbuy
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'limitbuy'"
        />
        <tpl_bargain
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'bargain'"
        />
        <tpl_presell
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'presell'"
        />
        <tpl_luckyspell
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'luckyspell'"
        />
        <tpl_video
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'video'"
        />
        <tpl_coupon
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'coupon'"
        />

        <tpl_form
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'form'"
        />

        <tpl_mplive
          :items="item"
          :type="type"
          :key="item.timestamp"
          @event="event"
          v-if="item.id === 'mplive'"
        />
      </block>
    </block>
    <!--  #endif -->
  </view>
</template>

<script>
import tpl_title from "@/components/custom/reform/title";
import tpl_line from "@/components/custom/reform/line";
import tpl_blank from "@/components/custom/reform/blank";
import tpl_picture from "@/components/custom/reform/picture";
import tpl_goods from "@/components/custom/reform/goods";
import tpl_listmenu from "@/components/custom/reform/listmenu";
import tpl_richtext from "@/components/custom/reform/richtext";
import tpl_drawregion from "@/components/custom/reform/drawregion";
import tpl_search from "@/components/custom/reform/search";
import tpl_menu from "@/components/custom/reform/menu";
import tpl_notice from "@/components/custom/reform/notice";
import tpl_banner from "@/components/custom/reform/banner";
import tpl_picturew from "@/components/custom/reform/picturew";
import tpl_seckill from "@/components/custom/reform/seckill";
import tpl_shop from "@/components/custom/reform/shop";
import tpl_goodsCps from "@/components/custom/reform/goodsCps";
import tpl_goodsIntegral from "@/components/custom/reform/goodsIntegral";
import tpl_assemble from "@/components/custom/reform/assemble";
import tpl_limitbuy from "@/components/custom/reform/limitbuy";
import tpl_bargain from "@/components/custom/reform/bargain";
import tpl_presell from "@/components/custom/reform/presell";
import tpl_luckyspell from "@/components/custom/reform/luckyspell";
import tpl_video from "@/components/custom/reform/video";
import tpl_coupon from "@/components/custom/reform/coupon";

import tpl_form from "@/components/custom/reform/form";

import tpl_mplive from "@/components/custom/reform/mplive";

export default {
  data() {
    return {
      cname: "reform-group",
      type: 2 //店铺首页装修
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    items: [Object, Array]
  },
  computed: {},
  methods: {
    event(event, item) {
      this.$emit("event", event, item);
    }
  },
  components: {
    tpl_title,
    tpl_line,
    tpl_blank,
    tpl_picture,
    tpl_goods,
    tpl_listmenu,
    tpl_richtext,
    tpl_drawregion,
    tpl_search,
    tpl_menu,
    tpl_notice,
    tpl_banner,
    tpl_picturew,
    tpl_seckill,
    tpl_shop,
    tpl_goodsCps,
    tpl_goodsIntegral,
    tpl_assemble,
    tpl_limitbuy,
    tpl_bargain,
    tpl_presell,
    tpl_luckyspell,
    tpl_video,
    tpl_coupon,

    tpl_form,

    tpl_mplive
  }
};
</script>

<style scoped lang="scss"></style>
