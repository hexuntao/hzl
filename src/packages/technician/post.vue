<template>
  <view class="pages">
    <view class="banner">
      <image
        :src="bannerInfo.src"
        mode="widthFix"
        @click="toLink(bannerInfo.link)"
      />
    </view>
		<block v-if="tec_status == 2 ">
			<view class="label-title" >审核中</view>
		</block>
		<block v-else-if="tec_status == 0 ||tec_status">
			<view class="account-login" >
			  <lk-field
			    label="姓名"
			    v-model="form.name"
			    type="text"
			    placeholder="请输入姓名"
			  />
			  <lk-field
			    label="手机号"
			    v-model="form.mobile"
			    type="text"
					disabled
			    placeholder="请输入手机号"
          maxlength="11"
			  />
				<lk-cell title="工作类型" center field>
				  <radio-group class="block " name="distribution_type" @change="RadioChange">
				  	<view class="">
				  		<radio class='radio'   value="1" ><text>全职</text></radio>
				  		<radio class='radio'   value="2" ><text>兼职</text></radio>
				  	</view>
				  </radio-group>
				</lk-cell>
				<lk-cell
				  title="选择项目"
				  required
				  is-link
				  :value="category_names"
				  @click="jumpPage('/pages/technician/professional')"
				/>
				<view class="field-msg-code" slot="button" @click="getImgCode">
					<image :src="captcha_src" mode="widthFix" />
				</view>
			</view>
			<view class="foot-btn-group">
			  <lk-button
			    block
			    round
			    type="danger"
			    theme-color
			    :loading="isLoading"
			    @click="postData"
			  >
			    申请
			  </lk-button>
			</view>
		</block>
		<block v-else-if="tec_status == 1">
			<view class="account-login" >
			  <lk-field
			    label="技师端链接"
			    value="=/technician/"
					disable="disable"
			    type="text"
			  />
			</view>
			<view class="foot-btn-group">
			  <lk-button
			    block
			    round
			    type="danger"
			    theme-color
			    :loading="isLoading"
			    @click="copy"
			  >
			    复制
			  </lk-button>
			</view>
		</block>
		<block  v-else-if="tec_status == 3">
			<view class="account-login" >
			  <view class="label-title" >已拒绝</view>
			</view>
			<view class="foot-btn-group">
			  <lk-button
			    block
			    round
			    type="danger"
			    theme-color
			    :loading="isLoading"
			    @click="again"
			  >
			    重新申请
			  </lk-button>
			</view>
		</block>
		
  </view>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { isWeixin } from "@/common/utils";
	import {
		APPLY,
	} from "@/common/interface/goods";
	import {
		GET_MEMBERINFO
	} from "@/common/interface/member";
	import {
	  validMobile,
	} from "@/common/utils/validator";
export default {
  name: "packages-login-index",
  data() {
    let canIUseGetUserProfile = false;
    // #ifdef MP-WEIXIN
    if (wx.getUserProfile) {
      canIUseGetUserProfile = true;
    }
    // #endif
    return {
      form: {
        name: "",
        mobile: "",
        category_ids: "",
				type:'',
				uid:'',
      },
      captcha_src: "",
      show_captcha_code: false,
      isLoading: false,
      canIUseGetUserProfile: canIUseGetUserProfile,
			pagetype:'1',
			selected:[],
			category_ids:[],
			category_names:'',
			tec_status:0,
    };
  },
  computed: {
    ...mapState({
      config: ({ config }) => config,
      mallInfo: ({ config }) => config.mallInfo,
      loginBeforePath: state => state.loginBeforePath
    }),
    ...mapGetters(["static"]),
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
        qq: this.static.baseImgPath + "qq-login-icon.png",
        wx: this.static.baseImgPath + "wx-login-icon.png"
      };
    },
    bannerInfo() {
      return {
        src:
          this.config.wap_login_adv ||
          this.static.baseImgPath + "login-head-default-01.png",
        link: this.config.wap_login_jump
      };
    }
  },
  onLoad(e) {
		this.memberIndex()
  },
	onShow: function () {
		if(uni.getStorageSync('selected')){
			this.selected=uni.getStorageSync('selected')
			uni.removeStorageSync('selected');
			let arrname=[]
			this.selected.filter((item)=>{
				this.category_ids.push(item.category_id)
				arrname.push(item.category_name)
				this.category_names=arrname.toString()
				this.form.category_ids=this.category_ids.toString()
			})
		}
	 },
  methods: {
		postData(){
			if(validMobile(this.form.mobile)){
				APPLY(this.form).then((data)=>{
					uni.showToast({
						title:data.message,
						icon:'none',
					})
				})
			}
			
			
		},
		memberIndex(){
			GET_MEMBERINFO().then((res)=>{
				this.tec_status=res.data.tec_status
				this.form.uid=res.data.uid
				this.form.mobile=res.data.user_tel
			})
		},
		RadioChange(e){
			this.form.type=e.detail.value
		},
		copy(){
			uni.setClipboardData({
			    data: '/technician/',
			    success: function () {
			        console.log('success');
			    }
			});
		},
		again(){
			this.tec_status=0
		},
		jumpPage(url){
			uni.navigateTo({
				url:url
			})
		},
  }
};
</script>

<style lang="scss" scoped>
	@import "../../colorui/main.css";
	@import "../../colorui/icon.css";
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
.label-title{
	text-align: center;
	line-height: 200rpx;
	font-size: 36rpx;
	font-weight: bold;
}
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
/* #endif */
</style>
