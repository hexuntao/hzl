<template>
  <view class="pages">
    <view class="cell-group">
      <lk-cell title="真实姓名" field :value="info.real_name" />
      <lk-cell title="手机号码" field :value="info.user_tel" />
      <lk-cell title="身份证号" field :value="info.id_card" />
      <lk-cell title="手持身份证照" field>
        <lk-cell-image-panel :list="[info.hand_card]" />
      </lk-cell>
      <lk-cell title="身份证正照" field>
        <lk-cell-image-panel :list="[info.front_card]" />
      </lk-cell>
      <lk-cell title="身份证反照" field>
        <lk-cell-image-panel :list="[info.back_card]" />
      </lk-cell>
    </view>
  </view>
</template>

<script>
import { GET_LIVEAPPLYANCHORINFO } from "../interface";
export default {
  name: "packages-live-mine-info",
  data() {
    return {
      info: {
        real_name: "",
        user_tel: "",
        id_card: "",
        front_card: "",
        back_card: "",
        hand_card: ""
      }
    };
  },
  computed: {},
  onLoad() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      GET_LIVEAPPLYANCHORINFO().then(({ data }) => {
        this.info.real_name = data.real_name;
        this.info.user_tel = data.user_tel;
        this.info.id_card = data.id_card;
        this.info.front_card = data.front_card;
        this.info.back_card = data.back_card;
        this.info.hand_card = data.hand_card;
      });
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped></style>
