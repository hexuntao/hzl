export default {
  props: {
    url: String,
    replace: Boolean,
    to: [String, Object]
  },

  methods: {
    toNavigate() {
      if (this.to) {
        if (this.replace) {
          this.$Navigate.replace(this.to);
        } else {
          this.$Navigate.push(this.to);
        }
      }
      if (this.url) {
        this.$Navigate.push(this.url);
      }
    }
  }
};
