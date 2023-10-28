<template>
  <view>
    <lk-cell
      :title="items.label"
      :required="items.required"
      :value="value"
      is-link
      @click="click"
    />
    <lk-popup-store
      v-model="show"
      :store_id="store_id"
      :list="store_list"
      @select="select"
    />
  </view>
</template>

<script>
import form from "../../mixin/form";
import { mapActions } from "vuex";
import { GET_STOREIDLIST } from "@/common/interface/store";
export default {
  data() {
    return {
      show: false,
      value: "",
      store_id: "",
      store_list: [],
      params: {
        store_id: "",
        lng: "",
        lat: ""
      }
    };
  },
  mixins: [form],
  mounted() {
    this.params.store_id = this.items.options;
    this.store_id = this.items.store_id || "";
    this.value = this.items.value || "";
  },
  methods: {
    ...mapActions(["getLocation"]),
    getStoreList() {
      this.$Prompt.loading();
      return new Promise((resolve, reject) => {
        this.getLocation().then(res => {
          this.params.lng = res.lng;
          this.params.lat = res.lat;
          if (this.store_list.length) {
            this.$Prompt.clear();
            resolve();
          } else {
            GET_STOREIDLIST(this.params)
              .then(({ data }) => {
                this.store_list = data || [];
                this.$Prompt.clear();
                resolve();
              })
              .catch(() => {
                this.$Prompt.clear();
                resolve();
              });
          }
        });
      });
    },
    click() {
      this.getStoreList().then(() => {
        this.show = true;
      });
    },
    select(e) {
      this.items.value = e.store_name;
      this.items.store_id = e.store_id;
      this.store_id = e.store_id;
      this.value = e.store_name;
      this.show = false;
	  
	  this.$emit("on-shopselect", e.store_id,e.store_name);
	  
    }
  }
};
</script>

<style scoped lang="scss"></style>
