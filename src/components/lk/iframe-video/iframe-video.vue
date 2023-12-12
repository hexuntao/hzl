<template>
  <view v-if="src">
    <iframe
      id="videoIframe"
      ref="videoIframe"
      style="position: absolute;width:100%;height: 100%;border: none;"
      frameborder="0"
      scrolling="no"
      marginwidth="0"
      marginheight="0"
      :src="iframeSrc"
      :data-source="src"
      :data-controls="controls ? 1 : 0"
      :data-autoplay="autoplay ? 1 : 0"
      :data-loop="loop ? 1 : 0"
      :data-muted="muted ? 1 : 0"
      :data-objectFit="objectFit"
      :data-poster="poster"
    >
    </iframe>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      iframeSrc: `hybrid/html/video.html?t=${new Date().getTime()}`
    };
  },
  props: {
    src: {
      type: String,
      default: ""
    },
    controls: {
      type: [Boolean, String],
      default: true
    },
    autoplay: {
      type: [Boolean, String],
      default: false
    },
    loop: {
      type: [Boolean, String],
      default: false
    },
    muted: {
      type: [Boolean, String],
      default: false
    },
    objectFit: {
      type: String,
      default: "contain"
    },
    poster: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState(["domain"])
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped></style>
