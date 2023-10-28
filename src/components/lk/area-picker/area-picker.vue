<template>
  <view>
    <view v-if="stateText">{{ stateText }}</view>
    <picker
      v-else
      mode="multiSelector"
      :value="multiIndex"
      :range="multiArray"
      @change="handleValueChange"
      @columnchange="handleColumnChange"
    >
      <slot
        ><text :class="selectText ? 'active-text' : ''">{{
          multiText
        }}</text></slot
      >
    </picker>
  </view>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      loading: true,
      loadErr: false,
      selectText: "",
      regionList: [
        { city_list: [{ district_list: [] }] },
        { city_list: [{ district_list: [] }] },
        { city_list: [{ district_list: [] }] }
      ],
      cityArr: [],
      districtArr: [],
      multiIndex: [0, 0, 0],
      isInitMultiArray: true
    };
  },
  props: {
    /**
     * 地区范围
     * 1 ==> 省
     * 2 ==> 省市
     * 3 ==> 省市区
     */
    type: {
      type: [String, Number],
      default: 3
    },
    code: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "请选择"
    }
  },
  watch: {
    code(e) {
      this.handleDefaultRegion(e);
    }
  },
  computed: {
    stateText() {
      if (this.loadErr) {
        return "省市区加载出错";
      }
      return this.loading ? "省市区加载中" : "";
    },
    multiText() {
      return this.selectText || this.placeholder;
    },
    multiArray() {
      const arrs = [];
      if (this.type == 1) {
        arrs.push(this.pickedArr[0]);
      }
      if (this.type == 2) {
        arrs.push(this.pickedArr[0], this.pickedArr[1]);
      }
      if (this.type == 3) {
        arrs.push(this.pickedArr[0], this.pickedArr[1], this.pickedArr[2]);
      }
      return arrs.map(arr =>
        arr.map(
          item =>
            item.province_name || item.city_name || item.district_name || ""
        )
      );
    },
    pickedArr() {
      // 进行初始化
      if (this.isInitMultiArray) {
        return [
          this.regionList,
          this.regionList[0].city_list,
          this.regionList[0].city_list[0].district_list
        ];
      }
      return [this.regionList, this.cityArr, this.districtArr];
    }
  },
  created() {
    this.getAreaList({
      url: "/goods/areaInfo",
      isShowLoading: false
    })
      .then(list => {
        if (list.length) {
          this.regionList = list;
          this.cityArr = list[0].city_list;
          this.districtArr = list[0].city_list[0].district_list;
          this.handleDefaultRegion(this.code);
          this.loading = false;
        } else {
          this.loadErr = true;
        }
      })
      .catch(() => {
        this.loadErr = true;
      });
  },
  methods: {
    ...mapActions(["getAreaList"]),
    handleColumnChange(e) {
      // console.log(e);
      this.isInitMultiArray = false;
      const that = this;
      let col = e.detail.column;
      let row = e.detail.value;
      that.multiIndex[col] = row;
      try {
        switch (col) {
          case 0:
            if (this.regionList[that.multiIndex[0]].city_list.length == 0) {
              that.cityArr = that.districtArr = [
                this.regionList[that.multiIndex[0]]
              ];
              break;
            }
            that.cityArr = this.regionList[that.multiIndex[0]].city_list;
            that.districtArr = this.regionList[that.multiIndex[0]].city_list[
              that.multiIndex[1]
            ].district_list;
            break;
          case 1:
            that.districtArr = this.regionList[that.multiIndex[0]].city_list[
              that.multiIndex[1]
            ].district_list;
            break;
          case 2:
            break;
        }
      } catch (e) {
        that.districtArr = this.regionList[
          that.multiIndex[0]
        ].city_list[0].district_list;
      }
    },
    handleValueChange(e) {
      // 结构赋值
      let [index0, index1, index2] = e.detail.value;
      const info = this.handleMultiInfo([index0, index1 || 0, index2 || 0]);
      this.$emit("confirm", info);
    },
    // 组装返回信息
    handleMultiInfo(arr = []) {
      let [index0, index1, index2] = arr;
      let [arr0, arr1, arr2] = this.pickedArr;
      let indexs = [index0, index1, index2];
      let ids = [];
      let names = [];
      let item = [];
      if (this.type == 1) {
        ids = [arr0[index0].province_id];
        names = [arr0[index0].province_name];
        item = [{ id: ids[0], label: names[0] }];
      }
      if (this.type == 2) {
        ids = [arr0[index0].province_id, arr1[index1 || 0].city_id];
        names = [arr0[index0].province_name, arr1[index1 || 0].city_name];
        item = [
          { id: ids[0], label: names[0] },
          { id: ids[1], label: names[1] }
        ];
      }
      if (this.type == 3) {
        ids = [
          arr0[index0].province_id,
          arr1[index1 || 0].city_id,
          arr2[index2 || 0].district_id
        ];
        names = [
          arr0[index0].province_name,
          arr1[index1 || 0].city_name,
          arr2[index2 || 0].district_name
        ];
        item = [
          { id: ids[0], label: names[0] },
          { id: ids[1], label: names[1] },
          { id: ids[2], label: names[2] }
        ];
      }
      let code = ids.join(",");
      let text = names.join("/");
      this.selectText = text;
      return { indexs, ids, names, text, code, item };
    },
    handleDefaultRegion(region) {
      if (!region) {
        return false;
      }
      if (region.indexOf(",") == -1 || region.split(",").every(e => e == 0)) {
        return false;
      }
      const ids = region.split(",");
      this.isInitMultiArray = false;
      let children = this.regionList;
      for (let i = 0; i < this.type; i++) {
        for (let j = 0; j < children.length; j++) {
          children[j].id =
            children[j].province_id ||
            children[j].city_id ||
            children[j].district_id ||
            0;
          let condition = children[j].id == ids[i];
          if (condition) {
            // 匹配成功进行赋值
            // console.log(i,j,children.length-1);
            children =
              children[j].province_list ||
              children[j].city_list ||
              children[j].district_list ||
              [];
            if (i == 0) {
              this.cityArr = children;
            } else if (i == 1) {
              this.districtArr = children;
            }
            this.$set(this.multiIndex, i, j);
            this.handleMultiInfo(this.multiIndex);
            break;
          } else {
            // 首次匹配失败就用默认的初始化
            // console.log(i,j,children.length-1);
            if (i == 0 && j == children.length - 1) {
              this.isInitMultiArray = true;
            }
          }
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.active-text {
  color: $text-color;
}
</style>
