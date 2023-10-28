import { mapActions } from "vuex";

export default {
  mounted() {
    this.getConfig().then(() => {
      this.getBonusTexts();
    });
  },
  methods: {
    ...mapActions(["getBonusTexts"])
  }
};
