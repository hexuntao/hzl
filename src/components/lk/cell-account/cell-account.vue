<template>
  <view>
    <lk-cell
      title="账户类型"
      field
      :value="accountInfo || '请选择账户类型'"
      is-link
      @click="onActionSheet"
    />
	
    <lk-popup
      v-model="isShowSheet"
      title="账户类型"
      position="bottom"
      round
      closeable
    >
      <lk-radio-group v-model="accountId" :active-color="theme.color">
        <view class="list">
          <lk-cell-account-item
            v-for="(item, index) in accountList"
            :key="index"
            :title="item.title"
            :image="item.logo"
            :label="item.label"
            @click="onSelect(item)"
          >
            <lk-radio
              slot="rightIcon"
              :name="item.id"
              :disabled="item.disabled"
            />
          </lk-cell-account-item>
        </view>
      </lk-radio-group>
      
    </lk-popup>
  </view>
</template>

<script>
import { GET_ACCOUNTHANG } from "@/common/interface/property";
import property from "@/mixins/property";
export default {
  data() {
    return {
      onbackevent: "on-back-addbank",
      isShowSheet: false,
      accountInfo: "",
      accountList: []
    };
  },
  props: {
    accounttype: [Number, String],
	handletype: [Number, String],

  },
  mixins: [property],

  mounted() {
    uni.$on(this.onbackevent, data => {
      if (data) {
        this.getAccountList();
      }
    });
  },
  beforeDestroy() {
    uni.$off(this.onbackevent);
  },
  methods: {
    onActionSheet() {
      this.isShowSheet = true;
    },
    getAccountList() {
      GET_ACCOUNTHANG({accounttype:this.accounttype,handletype:this.handletype}).then(({ code, data }) => {
        for(var i in data){
			data[i].logo = `${this.$store.getters.static.baseImgPath}withdraw.png`;
			if(this.accounttype==data[i].id){
				this.onSelect(data[i]);
			}
		}
		this.accountList = data;
      });
    },
    onSelect(item) {
      if (item.disabled) return;
      this.accountInfo = item.title;
      this.$emit("select", item);
      this.isShowSheet = false;
    },
    onClose() {
      this.isShowSheet = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  width: 100%;
  height: 65vh;
  overflow-y: auto;
  padding-bottom: 160rpx;
}
</style>
