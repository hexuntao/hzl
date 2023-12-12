<template>
  <page-meta>
    <navigation-bar
      front-color="#000000"
      background-color="#FFFFFF"
      :title="pageStyle.title"
    />
  </page-meta>
  <view class="pages">
    <view class="banner" v-if="banner">
      <image :src="banner" mode="widthFix" />
    </view>
    <view class="cell-group" v-if="formList.length">
      <form-group :items="formList" ref="formGroup" />
    </view>
    <view class="foot-btn-group fixed">
      <lk-button block round theme-color :loading="isLoading" @click="onSubmit">
        提交预约
      </lk-button>
    </view>
  </view>
</template>

<script>
import {
  GET_GOODSSCHEDLEIFNO,
  SET_GOODSSCHEDLEIFNO
} from "@/common/interface/goods";
import formGroup from "@/components/custom/form-group";
export default {
  name: "packages-goods-schedule",
  data() {
    return {
      pageStyle: {
        background: "",
        title: ""
      },
      banner: "",
      isLoading: false,
      formList: [],
      params: {
        custom_id: ""
      }
    };
  },
  onLoad(query) {
    this.params.custom_id = query.custom_id || "";
    if (query.goods_id) {
      this.params.goods_id = query.goods_id;
    }
    this.getData();
  },
  methods: {
    getData() {
      GET_GOODSSCHEDLEIFNO(this.params).then(({ data }) => {
        this.banner = data.pic || "";
        this.formList = data.value || [];
        if (data.custom_name) {
          this.pageStyle.title = data.custom_name;
          this.setWxShare({
            title: data.custom_name,
            imgUrl: this.banner,
            desc: `赶快来看看${data.custom_name}。`
          });
        }
      });
    },
    onSubmit() {
      const form_data = this.$refs["formGroup"]
        ? this.$refs["formGroup"].getFormData()
        : "";
      if (!form_data) return false;
      this.params.content = JSON.stringify(form_data);
      if (form_data) {
        let day_time = "";
        let hours_time = "";
        form_data.forEach(e => {
          if (e.tag == "schedule") {
            let val = e.value.split(",");
            day_time = val[0] || "";
            hours_time = val[1] || "";
          }
        });
        if (day_time) {
          this.params.day_time = day_time;
        }
        if (hours_time) {
          this.params.hours_time = hours_time;
        }
      }
      // return console.log(form_data);
      this.isLoading = true;
      SET_GOODSSCHEDLEIFNO(this.params)
        .then(({ message }) => {
          this.$Prompt.toast({ title: message, icon: "success" }).then(() => {
            this.$Navigate.replace("/pages/mall/index").then(() => {
              this.isLoading = false;
            });
          });
        })
        .catch(() => {
          this.isLoading = false;
        });
    }
  },
  components: {
    formGroup
  }
};
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  min-height: 200rpx;
  background: $image-background;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.cell-group {
  margin: 20rpx 0;
  padding-bottom: 180rpx;
}
</style>
