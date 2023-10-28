import { mapActions } from "vuex";

export default {
  computed: {},
  onShow() {
    this.setThingcircleShare();
  },
  methods: {
    ...mapActions(["getThingcircleShareInfo", "getThingcircleTexts"]),
    setThingcircleShare() {
      setTimeout(() => {
        let params = {};
        if (this.thing_id) {
          params.thing_id = this.thing_id;
        }
        this.getThingcircleShareInfo(params).then(data => {
          const keys = {
            title: this.thing_id ? "thing_title" : "other_title",
            imgUrl: this.thing_id ? "thing_pic" : "other_pic",
            desc: this.thing_id ? "thing_describe" : "other_describe"
          };
          let shareParams = {
            title: data[keys.title] || "社交圈",
            imgUrl: data[keys.imgUrl],
            desc:
              data[keys.desc] ||
              "我刚刚发现了一个很不错的社交圈，赶快来看看吧。",
            shareUid: true
          };
          if (this.thing_id) {
            shareParams.query = {
              thing_id: this.thing_id
            };
          }
          if (!this.thing_id) {
            shareParams.path = "pages/thingcircle/index";
          }
          this.setWxShare(shareParams);
        });
      });
    }
  }
};
