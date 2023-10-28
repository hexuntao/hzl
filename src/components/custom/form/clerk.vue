<template>
  <view>
    <lk-cell
      :title="items.label"
      :required="items.required"
      :value="value"
      is-link
      @click="click"
    />
    <lk-popup
      v-model="show"
      position="bottom"
      round
      closeable
      :title="items.label"
    >
      <lk-radio-group v-model="active">
        <view class="cell-group">
          <lk-cell
            clickable
            :title="item.title"
            :label="item.label"
            v-for="(item, index) in list"
            :key="index"
            @click="select(item)"
          >
            <lk-radio
              slot="rightIcon"
              :name="item.id"
              :active-color="theme.color"
              @click="select(item)"
            />
          </lk-cell>
        </view>
      </lk-radio-group>
    </lk-popup>
  </view>
</template>

<script>
import form from "../../mixin/form";
export default {
  data() {
    return {
      show: false,
      value: "",
      active: "",
      list: []
    };
  },
  mixins: [form],
  computed: {},
  mounted() {
    this.active = this.items.assistant_id || "";
    this.value = this.items.value || "";
  },
  methods: {
    click() {
      if (this.items.storeInfo && this.items.storeInfo.store_id) {
        let arr = this.items.clerk || [];
        let list = [];
        arr.forEach(e => {
          if (e.store_id == this.items.storeInfo.store_id) {
            list.push({
              id: e.assistant_id,
              name: e.assistant_name,
              title: `${e.assistant_name} (${e.store_name})`,
              label: `${e.jobs_name || ""}`,
              ...e
            });
          }
        });
        this.list = list;
        this.show = true;
      } else {
        this.$Prompt.toast("请先选择门店");
      }
    },
    select(e) {
      this.items.assistant_id = e.id;
      this.items.value = e.name;
      this.value = e.name;
      this.active = e.id;
      this.show = false;
    },
	reselect(){
		console.log('abdfdfd13434');
		this.items.assistant_id = "";
		this.items.value = "";
		this.value = "";
		this.active = "";
		this.show = false;
	}
  }
};
</script>

<style scoped lang="scss">
.cell-group {
  width: 100%;
  background: #fff;
  position: relative;
  padding-bottom: 160rpx;
  overflow-y: auto;
  height: 70vh;
}
</style>
