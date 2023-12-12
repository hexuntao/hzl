<template>
  <view class="form-group">
    <!-- #ifdef H5 -->
    <component
      :is="'form-' + item.tag"
      v-for="(item, index) in list"
      :key="index"
      :items="item"
      :ref="'form_' + item.tag"
    />
    <!--  #endif -->
    <!-- #ifndef H5 -->
    <block v-for="(item, index) in list" :key="index">
      <form-area
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'area'"
      />
      <form-card
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'card'"
      />
      <form-textarea
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'textarea'"
      />
      <form-checkbox
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'checkbox'"
      />
      <form-date
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'date'"
      />
      <form-date_range
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'date_range'"
      />
      <form-img
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'img'"
      />
      <form-input
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'input'"
      />
      <form-phone
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'phone'"
      />
      <form-radio
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'radio'"
      />
      <form-select
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'select'"
      />
      <form-schedule
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'schedule'"
      />
      <form-store
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'store'"
		@on-shopselect="shopselect"
      />
      <form-clerk
        :items="item"
        :ref="'form_' + item.tag"
        v-if="item.tag === 'clerk'"

      />
    </block>
    <!--  #endif -->
  </view>
</template>

<script>
import formArea from "./form/area";
import formCard from "./form/card";
import formTextarea from "./form/textarea";
import formCheckbox from "./form/checkbox";
import formDate from "./form/date";
import formDate_range from "./form/date_range";
import formImg from "./form/img";
import formInput from "./form/input";
import formPhone from "./form/phone";
import formRadio from "./form/radio";
import formSelect from "./form/select";
import formSchedule from "./form/schedule";
import formStore from "./form/store";
import formClerk from "./form/clerk";

import { validMobile, validCard } from "@/common/utils/validator";

export default {
  data() {
    return {
      cname: "form-group",
      list: []
    };
  },
  props: {
    items: Array
  },
  computed: {},
  mounted() {
    let list = [];
    let storeItem = "";
    list = this.items.map(e => {
      if (e.tag == "input" || e.tag == "textarea") {
        e.value = e.value ? e.value : e.default;
      }
      if (e.tag == "store") {
        storeItem = e;
      }
      return e;
    });
    if (storeItem) {
      list.forEach(e => {
        if (e.tag == "clerk") {
          e.storeInfo = storeItem;
        }
      });
    }
    this.list = list;
  },
  methods: {
	shopselect(store_id) {
		let list = this.list;
		list.forEach(e => {
		  if (e.tag == "clerk") {
		    e.storeInfo = {
				store_id:store_id
			};
		  }
		});
		
      this.list = list;
	  this.$refs["form_clerk"][0].reselect();
	  //console.log(form_clerk);
//.reselect()
	},
	  
    /**
     * 可通过$refs调用getFormData方法
     */
    getFormData() {
      let falg = true;
      let arr = [];
      for (let tag in this.$refs) {
        if (falg) {
          this.$refs[tag].some(({ items }) => {
            if (!this.formValidator(items)) {
              falg = false;
              return true;
            }
            arr.push(items);
          });
        }
      }
      return this.list.length && arr.length == this.list.length ? arr : false;
    },
    // 验证表单
    formValidator(item) {
      let result = true;
      const value = String(item.value || "").trim();
      if (value) {
        if (item.tag == "phone" && !validMobile(item.value)) {
          result = false;
        } else if (item.tag == "card" && !validCard(item.value)) {
          result = false;
        }
      } else {
        if (item.required) {
          result = false;
          this.$Prompt.toast(item.label + "为必填项");
        }
      }
      return result;
    }
  },
  components: {
    formArea,
    formCard,
    formTextarea,
    formCheckbox,
    formDate,
    formDate_range,
    formImg,
    formInput,
    formPhone,
    formRadio,
    formSelect,
    formSchedule,
    formStore,
    formClerk
  }
};
</script>

<style scoped lang="scss"></style>
