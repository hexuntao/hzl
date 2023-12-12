<template>
  <view class="pages">
    <!-- #ifndef MP-WEIXIN -->
    <view class="banner" v-if="canUseGetUserProfileOne">
      <image
        :src="bannerInfo.src"
        mode="widthFix"
        @click="toLink(bannerInfo.link)"
      />
    </view>
    <lk-tabs
      :nav-per-view="config.mobile_verification ? 2 : 1"
      :active-color="theme.color"
      :line-color="theme.color"
      :line="false"
      @change="onTabChange"
      v-if="canUseGetUserProfileOne"
    >
      <lk-tab title="账号密码登录">
        <view class="account-login">
          <lk-field
            label="账号"
            v-model="form.account"
            type="text"
            placeholder="请输入手机/用户名"
          />
          <lk-field
            label="密码"
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
          />
          <lk-field
            label="图片验证码"
            v-model="form.captcha_code"
            type="number"
            maxlength="4"
            placeholder="请输入图片验证码"
            v-if="show_captcha_code"
          >
            <view class="field-msg-code" slot="button" @click="getImgCode">
              <image :src="captcha_src" mode="widthFix" />
            </view>
          </lk-field>
        </view>
      </lk-tab>
      <lk-tab title="短信验证码登录" v-if="config.mobile_verification">
        <view class="msg-login">
          <lk-field-areacode
            v-model="form.account"
            @get-areacode="getAreacode"
          />
          <lk-field-msgcode
            v-model="form.verification_code"
            :mobile="form.account"
            :areacode="form.country_code"
            type="login"
          />
          <lk-field
            label="图片验证码"
            v-model="form.captcha_code"
            type="number"
            maxlength="4"
            placeholder="请输入图片验证码"
            v-if="show_captcha_code"
          >
            <view class="field-msg-code" slot="button" @click="getImgCode">
              <image :src="captcha_src" mode="widthFix" />
            </view>
          </lk-field>
        </view>
      </lk-tab>
    </lk-tabs>
    <view class="cell-link" v-if="canUseGetUserProfileOne">
      <text
        class="register-link text-link"
        @click="toLink('/packages/login/register')"
      >
        快速注册>
      </text>
      <text class="forget-link" @click="toLink('/packages/login/forget')">
        忘记密码?
      </text>
    </view>
    <view class="foot-btn-group" v-if="canUseGetUserProfileOne">
      <lk-button
        block
        round
        type="danger"
        theme-color
        :loading="isLoading"
        @click="onLogin"
      >
        登录
      </lk-button>
    </view>
    <view class="other-login" v-if="showOtherLogin && canUseGetUserProfileOne">
      <view class="divider">
        <text>其他登录方式</text>
      </view>
      <view class="other-img">
        <!-- <image :src="otherLoginImage.qq" /> -->
        <image :src="otherLoginImage.wx" @click="onOtherLogin('WCHAT')" />
      </view>
    </view>
    <!--  #endif -->

    <!-- #ifdef MP-WEIXIN -->
    <view class="mp-login" v-if="canUseGetUserProfileOne">
      <view class="logo">
        <image :src="mallInfo.logo" mode="aspectFill"></image>
      </view>
      <view class="text">
        <view class="name">欢迎来到{{ mallInfo.name }}</view>
        <view class="title">
          为提供优质的服务，{{ mallInfo.name }}需要获取以下信息
        </view>
        <view class="info">· 你的公开信息(昵称、头像等）</view>
      </view>
      <view class="foot-btn-group">
        <lk-button
          v-if="canIUseGetUserProfile"
          block
          round
          theme-color
          :loading="isLoading"
          @click="getUserProfile"
        >
          微信授权登录
        </lk-button>

        <lk-button
          v-else
          block
          round
          theme-color
          open-type="getUserInfo"
          @getuserinfo="onGetuserinfo"
        >
          微信授权登录
        </lk-button>
      </view>
      <view class="home-link">
        <text class="text-link" @click="toLink('/pages/mall/index')">
          返回首页
        </text>
      </view>
    </view>

    <view class="containar" v-if="canUseGetUserProfileThree">
      <view class="avatarUrl">
        <button
          type="balanced"
          open-type="chooseAvatar"
          @chooseavatar="onChooseavatar"
        >
          <image :src="params.avatarUrl" class="refreshIcon"></image>
        </button>
        <button
          class="attext"
          open-type="chooseAvatar"
          @chooseavatar="onChooseavatar"
        >
          请上传头像
        </button>
      </view>
      <!--      <view class="nickname">
        <text>昵称：</text>
        <input type="nickname" class="weui-input" :value="params.nickName" @blur="bindblur"
               placeholder="请输入昵称" @input="bindinput"/>
      </view>-->

      <view class="btn">
        <lk-button block round theme-color @click="onSubmit"> 保存 </lk-button>
      </view>
    </view>

    <!--  #endif -->
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import $Plugins from '@/api/plugins';
import { UPLOAD_IMAGES } from '@/common/interface/config';
import { GET_IMGCODE } from '@/common/interface/login';
import {
  validMobile,
  validUsername,
  validMsgcode,
  validImgcode,
  validPassword,
} from '@/common/utils/validator';
import { isWeixin } from '@/common/utils';

export default {
  name: 'packages-login-index',
  data() {
    let canIUseGetUserProfile = false;
    // #ifdef MP-WEIXIN
    if (wx.getUserProfile) {
      canIUseGetUserProfile = true;
    }
    // #endif
    return {
      mincode: '',
      formType: 'account', // account账号登录/ msg短信登录
      form: {
        account: '',
        captcha_code: '',
        country_code: '',
      },
      captcha_src: '',
      show_captcha_code: false,
      isLoading: false,
      canIUseGetUserProfile: canIUseGetUserProfile,

      canUseGetUserProfileOne: true,
      canUseGetUserProfileThree: false,

      oldavatarUrl: '',
      params: {
        code: '',
        iv: '',
        encrypted_data: '',
        type: '',
        nickName: '',
        spread_account: '',
        avatarUrl: '',
        is_newlogin: 0,
      },
    };
  },
  computed: {
    ...mapState({
      config: ({ config }) => config,
      mallInfo: ({ config }) => config.mallInfo,

      loginBeforePath: state => state.loginBeforePath,
    }),
    ...mapGetters(['static']),
    showOtherLogin() {
      // #ifdef H5
      return this.config.wechat_login && isWeixin();
      // #endif

      // #ifdef APP-PLUS
      return this.config.wechat_login;
      // #endif
    },
    otherLoginImage() {
      return {
        qq: this.static.baseImgPath + 'qq-login-icon.png',
        wx: this.static.baseImgPath + 'wx-login-icon.png',
      };
    },
    bannerInfo() {
      return {
        src:
          this.config.wap_login_adv ||
          this.static.baseImgPath + 'login-head-default-01.png',
        link: this.config.wap_login_jump,
      };
    },
  },
  onLoad() {
    if (this.token) {
      return uni.switchTab({ url: '/pages/mall/index' });
    }
  },
  methods: {
    ...mapActions(['login', 'authLogin', 'getMemberInfo']),
    onTabChange(index) {
      this.formType = index == 1 ? 'msg' : 'account';
      this.form = {
        account: '',
        captcha_code: '',
      };
    },
    toLink(link) {
      if (link) {
        this.$Navigate.push(link);
      }
    },
    //获取图片验证码
    getImgCode() {
      GET_IMGCODE().then(({ data }) => {
        this.captcha_src = data.captcha_src + '?' + new Date().getTime();
      });
    },
    getAreacode(code) {
      this.form.account = '';
      this.form.country_code = code;
    },
    // 验证输入
    vaildForm() {
      let form = this.form;
      if (this.formType === 'account') {
        if (
          !validUsername(form.account) ||
          !validPassword(form.password) ||
          (this.show_captcha_code ? !validImgcode(form.captcha_code) : false) //判断并验证图片验证码
        ) {
          return false;
        }
      }
      if (this.formType === 'msg') {
        if (
          !validMobile(form.account, this.form.country_code) ||
          !validMsgcode(form.verification_code) ||
          (this.show_captcha_code ? !validImgcode(form.captcha_code) : false) //判断并验证图片验证码
        ) {
          return false;
        }
      }
      return form;
    },
    // 登录
    onLogin() {
      // return console.log(this.vaildForm());
      const form = this.vaildForm();
      if (form) {
        this.isLoading = true;
        this.login(form)
          .then(({ code, data, message }) => {
            if (code === 0) {
              this.show_captcha_code = true;
              this.getImgCode();
              this.$Prompt.toast(message);
              this.isLoading = false;
            } else {
              this.$Prompt
                .toast({ icon: 'success', title: message })
                .then(() => {
                  this.$Navigate.replace(this.loginBeforePath);
                });
            }
          })
          .catch(() => {
            this.isLoading = false;
            // 登录失败重新获取图片验证码
            if (this.show_captcha_code) {
              this.getImgCode();
            }
          });
      }
    },
    //第三方登录
    onOtherLogin(action) {
      // #ifdef H5
      let params = {
        type: action,
        redirect_url: this.loginBeforePath,
      };
      this.authLogin(params);
      // #endif

      // #ifdef APP-PLUS
      const actionObj = {
        WCHAT: 'weixin',
        QQLOGIN: 'qq',
      };
      let provider = actionObj[action];
      let params = {
        type: action,
      };
      $Plugins.authLogin(provider, params).then(res => {
        this.getMemberInfo({ update: true }).then(() => {
          this.$Navigate.replace(this.loginBeforePath);
        });
      });
      // #endif
    },
    checkSession() {
      return new Promise((resolve, reject) => {
        uni.login({
          provider: 'weixin',
          complete(res) {
            if (!res.code) {
              this.$Prompt.modal({
                content: '微信登录失败',
                showCancel: false,
              });
            }
            resolve({ code: res.code });
          },
        });
        // }
        // });
      });
    },
    wxGetUserProfile() {
      return new Promise((resolve, reject) => {
        wx.getUserProfile({
          desc: this.config.mp_getuserinfo_desc,
          success: res => {
            resolve(res);
          },
          // 失败回调
          fail: err => {
            console.log(err, '授权失败');
            this.$Prompt.modal({ content: '授权失败', showCancel: false });
          },
        });
      });
    },
    onGetuserinfo({ detail }) {
      console.log(detail);
      if (detail.userInfo) {
        this.checkSession().then(({ code }) => {
          let params = {
            type: 'MP',
            iv: detail.iv,
            encrypted_data: detail.encryptedData,
          };
          if (code) {
            params.code = code;
          }
          this.authLogin(params)
            .then(({ message }) => {
              this.$Prompt
                .toast({ icon: 'success', title: message })
                .then(() => {
                  this.$Navigate.replace(this.loginBeforePath);
                  console.log(this.loginBeforePath);
                });
            })
            .catch(error => {
              console.log(error);
            });
        });
      } else {
        console.log('拒接授权');
        this.$Prompt.modal({ content: '您取消了授权', showCancel: false });
      }
    },

    bindblur(e) {
      this.params.nickName = e.detail.value; // 获取微信昵称
    },
    bindinput(e) {
      this.params.nickName = e.detail.value; //这里要注意如果只用blur方法的话用户在输入玩昵称后直接点击保存按钮，会出现修改不成功的情况。
    },
    onChooseavatar(e) {
      let self = this;
      let { avatarUrl } = e.detail;
      uni.showLoading({
        title: '加载中',
      });

      // 创建上传对象
      UPLOAD_IMAGES({
        filePath: avatarUrl,
        name: 'file',
        //formData: this.formData,
        isShowLoading: true,
        loadingText: '上传中',
      })
        .then(res => {
          self.params.avatarUrl = res.data.src;
        })
        .catch(e => {
          uni.showToast({
            title: e,
            duration: 2000,
          });
        });
    },
    onSubmit() {
      this.params.is_newlogin = 0;
      const $this = this;
      this.params.nickName = '微信用户';
      /*if(this.params.nickName === ''){
        uni.showToast({
          title: "请输入昵称",
          duration: 2000
        });
        return false;
      }*/
      console.log(this.params.avatarUrl);
      if (
        this.params.avatarUrl === '' ||
        this.params.avatarUrl == this.oldavatarUrl
      ) {
        uni.showToast({
          title: '请上传头像',
          duration: 2000,
        });
        return false;
      }

      this.authLogin(this.params)
        .then(({ message }) => {
          this.$Prompt.toast({ icon: 'success', title: message }).then(() => {
            $this.$Navigate.replaceAll($this.loginBeforePath);
            $this.isLoading = false;
          });
        })
        .catch(error => {
          console.log(error);
          this.isLoading = false;
        });
    },
    // 场景推广码(分享进来的code)
    /*sceneCode: state => {
      let sceneCode =  state.sceneCode || $Storage.get("sceneCode") || "";
      console.log(sceneCode);
    },*/
    // 获取小程序用户资料
    getUserProfile() {
      //this.sceneCode();
      const $this = this;
      this.isLoading = true;
      let p2 = this.wxGetUserProfile();
      let p1 = this.checkSession();

      Promise.all([p2, p1])
        .then(res => {
          console.log(res);
          this.params.code = res[0].code;
          this.params.iv = res[1].iv;
          this.params.encrypted_data = res[1].encryptedData;
          this.params.type = 'MP';
          this.params.is_newlogin = 1;
          /*let params = {
              type: "MP",
              iv,
              encrypted_data,
              code
            };*/
          this.authLogin(this.params)
            .then(({ code, message }) => {
              if (code == 9725) {
                this.twologin();
              } else {
                console.log(message);
                this.$Prompt
                  .toast({ icon: 'success', title: message })
                  .then(() => {
                    $this.$Navigate.replaceAll($this.loginBeforePath);
                    $this.isLoading = false;
                  });
              }
            })
            .catch(error => {
              console.log(error);
              this.isLoading = false;
            });
        })
        .catch(err => {
          this.isLoading = false;
        });
    },
    twologin() {
      this.canUseGetUserProfileOne = false;
      this.params.avatarUrl = this.mallInfo.logo;
      this.avatarUrl = this.mallInfo.logo;
      this.canUseGetUserProfileThree = true;
    },
  },
};
</script>

<style lang="scss" scoped>
/* #ifndef MP-WEIXIN */
page {
  background: #fff;
}
.banner {
  width: 100%;
  min-height: 200rpx;
  background: $image-background;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.field-msg-code {
  width: 200rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  image {
    width: 100%;
    height: 100%;
  }
}
.other-img {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
  image {
    width: 118rpx;
    height: 118rpx;
    margin: 40rpx 80rpx;
  }
}
.cell-link {
  display: flex;
  justify-content: space-between;
  padding: $cell-padding;
  background: #fff;
  .register-link {
  }
  .forget-link {
    color: $text-light;
  }
}
/* #endif */

/* #ifdef MP-WEIXIN */
.mp-login {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  background: #fff;
  .logo {
    display: flex;
    justify-content: center;
    image {
      width: 200rpx;
      height: 200rpx;
      border-radius: 100%;
      background-color: $image-background;
    }
  }
  .text {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    line-height: 48rpx;
    margin-top: 40rpx;
  }
  .name {
    font-size: $font-size-lg;
  }
  .title {
  }
  .info {
    font-size: $font-size-sm;
    color: $text-light;
    margin: 20rpx 0;
  }
  .home-link {
    margin: 20rpx 0;
    text-align: center;
  }
}

.containar button::after {
  border: 0px;
}
.containar .attext {
  text-align: center;
  font-size: 26rpx;
  color: #333;
  padding: 10rpx 0;
  line-height: 40rpx;
}

.avatarUrl {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 80rpx 0 40rpx;
  background: #fff;
  button {
    background: #fff;
    line-height: 80rpx;
    height: auto;
    width: auto;
    padding: 20rpx 30rpx;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .refreshIcon {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
    }
    .jt {
      width: 14rpx;
      height: 28rpx;
    }
  }
}

.nickname {
  background: #fff;
  padding: 20rpx 30rpx;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

  display: flex;
  align-items: center;
  justify-content: center;
  .weui-input {
    padding-left: 60rpx;
  }
}
.btn {
  width: 670rpx;
  margin: 0 auto;
  margin-top: 50rpx;
}

/* #endif */
</style>
