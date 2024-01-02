<template>
  <view class="pages"> </view>
</template>

<script>
import { mapGetters } from 'vuex';
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
  onLoad(query) {},
  methods: {
    callLoad(query) {
      const { room_id } = query;
      let customParams = encodeURIComponent(
        JSON.stringify({
          path: this.shareParams.pagePath,
          extend_code: this.extendCode,
        })
      );
      console.log(room_id, customParams);
      uni.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${room_id}&custom_params=${customParams}`,
      });
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped></style>
