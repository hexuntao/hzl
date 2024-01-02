<template>
  <view class="pages"> </view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  data() {
    return {};
  },
  mixins: [],
  computed: {
    ...mapGetters({
      extendCode: 'extendCode',
      shareParams: 'shareParams',
    }),
  },
  onLoad(query) {
    this.$Prompt.loading();
  },
  methods: {
    ...mapActions(['getMemberInfo']),
    async callLoad(query) {
      const { room_id, extend_code } = query;
      await this.getMemberInfo();

      let customParams = encodeURIComponent(
        JSON.stringify({
          path: this.shareParams.pagePath,
          extend_code: this.extendCode,
        })
      );
      console.log('extend_code', extend_code, customParams);
      this.$Prompt.clear();
      uni.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${room_id}&custom_params=${customParams}`,
      });
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped></style>
