<template>
  <view class="pages">
    <lk-tabs
      v-if="tabs.length"
      :nav-per-view="tabs.length"
      :active-color="theme.color"
      :line-color="theme.color"
    >
      <lk-tab v-for="(item, index) in tabs" :key="index" :title="item.name">
        <lk-credential-group type="2" :role-type="item.type" />
      </lk-tab>
    </lk-tabs>
  </view>
</template>

<script>
import bonusMixin from "@/mixins/bonus";
import { mapState } from "vuex";
export default {
  name: "packages-bonus-credential",
  data() {
    return {
      types: ""
    };
  },
  mixins: [bonusMixin],
  computed: {
    ...mapState({
      texts: ({ bonus }) => bonus.texts
    }),
    tabs() {
      let list = [];
      if (this.types) {
        let arr = this.types.split(",");
        let obj = {
          1: {
            name: this.texts.team.team_agreement,
            type: 1
          },
          2: {
            name: this.texts.area.area_agreement,
            type: 2
          },
          3: {
            name: this.texts.global.global_agreement,
            type: 3
          }
        };
        arr.forEach(e => {
          list.push(obj[e]);
        });
      }
      return list;
    }
  },
  onLoad(query) {
    this.types = query.types;
  },
  methods: {},
  components: {}
};
</script>

<style lang="scss" scoped></style>
