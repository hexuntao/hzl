import { mapGetters, mapState } from "vuex";

/* !
 * 验证及设置支付密码
 * 搭配公共组件modalPayPassword使用；
 * 判断是否需要进行绑定手机状态isBingFlag，false情况则不需要进行支付密码的输入
 */

export default {
  data() {
    return {
      isShowModalPayPassword: false
    };
  },
  computed: {
    ...mapState({
      config: ({ config }) => config,
      memberInfo: ({ member }) => member.info
    }),
    // 支付密码开启情况，默认是开启，
    cpp() {
      return !this.config.cpp;
    },
    // 支付密码长度 ，9位或6位，或保留原先9-20
    ppl() {
      return this.config.ppl;
    },
    // 密码长度发生改变
    pplChanged() {
      let c_ppl = this.config.ppl ? Number(this.config.ppl) : 0; //后台设置的密码长度，默认0
      let m_ppl = this.memberInfo.ppl ? Number(this.memberInfo.ppl) : 0; //会员吱声的密码长度，默认0
      return c_ppl != m_ppl;
    },
    ...mapGetters(["isBingFlag"])
  },
  methods: {
    // 设置支付密码
    showModalPayPassword() {
      return new Promise((resolve, reject) => {
        const content = this.pplChanged
          ? "商城支付密码升级，请重新设置！"
          : "为了您账号安全，建议您立即设置支付密码";
        this.$refs.modalPayPassword.notify({
          message: content,
          confirm: e => {
            resolve();
          },
          cancel: e => {
            reject();
          }
        });
      });
    },
    /**
     * 验证支付密码
     * @param {String} password 支付密码
     * @param {Boolean} valid 为true时则必须验证支付密码，不管isBingFlag
     */
    validPayPassword(password = "", valid) {
      return new Promise((resolve, reject) => {
        // 后台未开启验证支付密码，或者 账号体系不需要绑定手机 情况，则不进行验证支付密码
        if ((!this.cpp || !this.isBingFlag) && !valid) {
          resolve(null);
        } else {
          let flag = true;
          if (!this.memberInfo.is_password_set || this.pplChanged) {
            this.showModalPayPassword()
              .then(() => {
                this.$refs.modalPayPassword.isShowSetPayPassword = true;
                reject();
              })
              .catch(() => {
                reject();
              });
            flag = false;
          } else {
            if (!password) {
              this.isShowModalPayPassword = true;
              flag = false;
            }
            if (flag) {
              this.$store
                .dispatch("checkPayPassword", password)
                .then(() => {
                  resolve();
                  this.$refs.modalPayPassword.clearPassword();
                })
                .catch(() => {
                  reject();
                  this.$refs.modalPayPassword.clearPassword();
                });
            }
          }
        }
      });
    }
  }
};
