<template>
    <view class="burst-wrap">
        <view class="burst-wrap-bg">
            <view>
				<view
				  v-if="showUploadList"
				  class="u-list-item u-preview-wrap"
				  v-for="(item, index) in lists"
				  :key="index"
				  :style="{
				    width: width + 'rpx',
				    height: height ? height : width + 'rpx'
				  }"
				>
				  <view v-if="deletable" class="u-delete-icon"@tap.stop="deleteItem(index)">
				    <lk-icon class="u-icon" name="cross" size="14" color="#ffffff" />
				  </view>
				  
				  <lk-line-progress
				    v-if="showProgress && item.progress > 0 && !item.error"
				    :show-percent="false"
				    height="16"
				    class="u-progress"
				    :percent="item.progress"
				  />
				  <view @tap.stop="retry(index)" v-if="item.error" class="u-error-btn">点击重试</view>
				  <image
				    @tap.stop="doPreviewImage(item.url || item.path, index)"
				    class="u-preview-image"
				    v-if="!item.isImage"
				    :src="item.url || item.path"
				    :mode="imageMode"
				  ></image>
				</view>
				<slot name="file" :file="lists"></slot>
				
				
				
				<view
				  v-if="showUploadList"
				  class="u-list-item u-preview-wrap"
				  v-for="(item, index) in listsNewVideo"
				  :key="index"
				  :style="{
				    width: widthNewVideo + 'rpx',
				    height: (heightNewVideo ? heightNewVideo : widthNewVideo) + 'rpx'
				  }"
				>
				  <view v-if="deletable" class="u-delete-icon" @tap.stop="deleteItemNewVideo(index)">
				    <lk-icon class="u-icon" name="cross" size="14" color="#ffffff" />
				  </view>
				  
				  <lk-line-progress
				    v-if="showProgress && item.progress > 0 && !item.error"
				    :show-percent="false"
				    height="16"
				    class="u-progress"
				    :percent="item.progress"
				  />
				  <view @tap.stop="retryNewVideo(index)" v-if="item.error" class="u-error-btn">点击重试</view>

				
				  <video :src="item.url" class="video" ></video>
				</view>

				
				
                <!-- 信息提交 -->
                <view class="burst-info">
                    <view class="uni-uploader-body">
                        <view class="uni-uploader__files">
                            <view class="uni-uploader__input-box" >
								<view
								  style="display: inline-block;flex:auto;"
								  @tap="chooseVideoImage"
									v-if="maxCount > lists.length && maxCountNewVideo > listsNewVideo.length"
								>
								  <slot name="addBtn"></slot>
								  <view
								    class="u-list-item u-add-wrap"
								    hover-class="u-add-wrap__hover"
								    hover-stay-time="150"
								  >
								    <lk-icon name="plus" class="u-add-btn" size="24" />
								    <view class="u-add-tips">上传素材</view>
								  </view>
								</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
	import { UPLOAD_IMAGES } from "@/common/interface/config";
    var sourceType = [
            ['camera'],
            ['album'],
            ['camera', 'album']
        ]
		
    export default {
		props: {
		  //是否显示组件自带的图片预览功能
		  showUploadList: {
		    type: Boolean,
		    default: true
		  },
		  // 最大上传数量
		  maxCount: {
		    type: [String, Number],
		    default: 9
		  },
		  // 最大上传数量
		  maxCountNewVideo: {
		    type: [String, Number],
		    default: 9
		  },
		  
		  //  是否显示进度条
		  showProgress: {
		    type: Boolean,
		    default: true
		  },
		  // 是否启用
		  disabled: {
		    type: Boolean,
		    default: false
		  },
		  // 预览上传的图片时的裁剪模式，和image组件mode属性一致
		  imageMode: {
		    type: String,
		    default: "aspectFill"
		  },
		  // 头部信息
		  header: {
		    type: Object,
		    default() {
		      return {};
		    }
		  },
		  // 额外携带的参数
		  formData: {
		    type: Object,
		    default() {
		      return {};
		    }
		  },
		  // 上传的文件字段名
		  name: {
		    type: String,
		    default: "file"
		  },
		  // 所选的图片的尺寸, 可选值为original compressed
		  sizeType: {
		    type: Array,
		    default() {
		      return ["original", "compressed"];
		    }
		  },
		  
		  // 是否在点击预览图后展示全屏图片预览
		  previewFullImage: {
		    type: Boolean,
		    default: true
		  },
		  // 是否开启图片多选，部分安卓机型不支持
		  multiple: {
		    type: Boolean,
		    default: true
		  },
		  multipleNewVideo: {
		    type: Boolean,
		    default: true
		  },
		  // 是否展示删除按钮
		  deletable: {
		    type: Boolean,
		    default: true
		  },
		  // 文件大小限制，单位为byte
		  maxSize: {
		    type: [String, Number],
		    default: Number.MAX_VALUE
		  },
		  
		  maxSizeNewVideo: {
		    type: [String, Number],
		    default: Number.MAX_VALUE
		  },
		  // 显示已上传的文件列表
		  fileList: {
		    type: Array,
		    default() {
		      return [];
		    }
		  },
		  // 上传区域的提示文字
		  uploadText: {
		    type: String,
		    default: "选择图片"
		  },
		  // 是否自动上传
		  autoUpload: {
		    type: Boolean,
		    default: true
		  },
		  // 是否显示toast消息提示
		  showTips: {
		    type: Boolean,
		    default: true
		  },
		  // 是否通过slot自定义传入选择图标的按钮
		  customBtn: {
		    type: Boolean,
		    default: false
		  },
		  // 内部预览图片区域和选择图片按钮的区域宽度，高等于宽
		  width: {
		    type: [String, Number],
		    default: 160
		  },
		  height: {
		    type: [String, Number],
		    default: ""
		  },
		  // 内部预览图片区域和选择图片按钮的区域宽度，高等于宽
		  widthNewVideo: {
		    type: [String, Number],
		    default: 300
		  },
		  heightNewVideo: {
		    type: [String, Number],
		    default: 225
		  },
		  // 自定义name，用于区别for循环N个
		  customName: [String, Number]
		},
        data() {
            return {
                imageList:[],//图片
                src:"",//视频存放
                sourceTypeIndex: 2,
                checkedValue:true,
                checkedIndex:0,
                sourceType: ['拍摄', '相册', '拍摄或相册'],
                cameraList: [{
                        value: 'back',
                        name: '后置摄像头',
                        checked: 'true'
                    },
                    {
                        value: 'front',
                        name: '前置摄像头'
                    },
                ],
                cameraIndex: 0,
				// 是否启用
				default: false,
				lists: [],
				listsNewVideo: [],
				srcVideo:'',
            }
        },
        onUnload() {
            this.src = '',
            this.sourceTypeIndex = 2,
            this.sourceType = ['拍摄', '相册', '拍摄或相册'];
        },
        methods: {
            chooseVideoImage(){
                uni.showActionSheet({
                    title:"选择上传类型",
                    itemList: ['图片','视频'],
                    success: (res) => {
                        console.log(res)
                        if(res.tapIndex == 0){
                            this.chooseImages()
                        } else {
                            this.chooseImagesNewVideo()
                        }
                    }
                })
            },
			chooseImages(){
				if (this.disabled) return;
				  const {
					name = "",
					maxCount,
					multiple,
					maxSize,
					sizeType,
					lists,
					camera,
					compressed,
					maxDuration,
					sourceType
				  } = this;
				  let chooseFile = null;
				  const newMaxCount = maxCount - lists.length;
				  // 设置为只选择图片的时候使用 chooseImage 来实现
				  chooseFile = new Promise((resolve, reject) => {
					uni.chooseImage({
					  count: multiple ? newMaxCount : 1,
					  sourceType: ['album','camera'],
					  sizeType,
					  success: resolve,
					  fail: reject
					});
				  });
				  chooseFile
					.then(res => {
					  let file = null;
					  let listOldLength = this.lists.length;
					  res.tempFiles.map((val, index) => {
						// 如果是非多选，index大于等于1或者超出最大限制数量时，不处理
						if (!multiple && index >= 1) return;
						if (val.size > maxSize) {
						  this.$emit("on-oversize", val, this.lists);
						  this.showToast("超出允许的文件大小");
						} else {
						  if (maxCount <= lists.length) {
							this.$emit("on-exceed", val, this.lists);
							this.showToast("超出最大允许的文件个数");
							return;
						  }
						  lists.push({
							url: val.path,
							progress: 0,
							error: false
						  });
						  
						  this.srcVideo = '';
						  this.listsNewVideo = [];
						  this.$emit(
						    "on-successnewvideo",
						    [],
						    0,
						    this.listsNewVideo,
						    this.customName
						  );
						  
						  // 列表发生改变，发出事件，第二个参数为当前发生变化的项的索引
						  this.$emit("on-list-change", this.lists);
						}
					  });
					  // 每次图片选择完，抛出一个事件，并将当前内部选择的图片数组抛出去
					  this.$emit("on-choose-complete", this.lists);
					  if (this.autoUpload) this.uploadFile(listOldLength);
					})
					.catch(error => {
					   this.$emit('on-error', error);
					});
			},
			// 提示用户消息
			showToast(message, force = false) {
			  if (this.showTips || force) {
			    uni.showToast({
			      title: message,
			      icon: "none"
			    });
			  }
			},
			// 该方法供用户通过ref调用，手动上传
			upload() {
			  this.uploadFile();
			},
			// 对失败的图片重新上传
			retry(index) {
			  this.lists[index].progress = 0;
			  this.lists[index].error = false;
			  this.lists[index].response = null;
			  uni.showLoading({
			    title: "重新上传"
			  });
			  this.uploadFile(index);
			},
			// 上传图片
			uploadFile(index = 0) {
				console.log('aa');
			  if (this.disabled) return;
			  if (this.uploading) return;
			  // 全部上传完成
			  if (index >= this.lists.length) {
			    this.$emit("on-uploaded", this.lists, this.customName);
			    return;
			  }
			  if (this.lists[index].progress == 100) {
			    if (this.autoUpload == false) this.uploadFile(index + 1);
			    return;
			  }
			  this.lists[index].error = false;
			  this.uploading = true;
			
			  // 创建上传对象
			  UPLOAD_IMAGES({
			    filePath: this.lists[index].url,
			    name: this.name,
			    formData: this.formData,
			    isShowLoading: true,
			    loadingText: "上传中",
			    onProgressUpdate: res => {
			      // 上传进度
			      if (res.progress > 0) {
			        this.lists[index].progress = res.progress;
			        this.$emit("on-progress", res, index, this.lists, this.customName);
			      }
			    }
			  })
			    .then(res => {
			      // 上传成功
			      this.lists[index].response = res.data;
			      this.lists[index].progress = 100;
			      this.lists[index].error = false;
			      this.uploading = false;
			      this.$emit(
			        "on-success",
			        res.data,
			        index,
			        this.lists,
			        this.customName
			      );
			      this.uploadFile(index + 1);
			    })
			    .catch(e => {
			      this.uploading = false;
			      this.uploadError(index, e);
			      this.uploadFile(index + 1);
			    });
			},
			// 上传失败
			uploadError(index, err) {
			  this.lists[index].progress = 0;
			  this.lists[index].error = true;
			  this.lists[index].response = null;
			  this.$emit("on-error", err, index, this.lists, this.customName);
			 // this.showToast("上传失败，请重试");
			  this.showToast(err.message);
			},
			// 删除一个图片
			deleteItem(index) {
			  uni.showModal({
			    title: "提示",
			    content: "您确定要删除此项吗？",
			    success: res => {
			      if (res.confirm) {
			        if (
			          this.lists[index].process < 100 &&
			          this.lists[index].process > 0
			        ) {
			          typeof this.lists[index].uploadTask != "undefined" &&
			            this.lists[index].uploadTask.abort();
			        }
			        this.lists.splice(index, 1);
			        this.$forceUpdate();
			        this.$emit("on-remove", index, this.lists, this.customName);
			        this.showToast("移除成功");
			        // 列表发生改变，发出事件
			        this.$emit("on-list-change", this.lists, this.customName);
			      }
			    }
			  });
			},
			// 用户通过ref手动的形式，移除一张图片
			remove(index) {
			  // 判断索引的合法范围
			  if (index >= 0 && index < this.lists.length) {
			    this.lists.splice(index, 1);
			    this.$emit("on-list-change", this.lists, this.customName);
			  }
			},
			
			// 预览图片
			doPreviewImage(url, index) {
			  if (!this.previewFullImage) return;
			  const images = this.lists.map(item => item.url || item.path);
			  uni.previewImage({
			    urls: images,
			    current: url,
			    success: () => {
			      this.$emit("on-preview", url, this.lists, this.customName);
			    },
			    fail: () => {
			      uni.showToast({
			        title: "预览图片失败",
			        icon: "none"
			      });
			    }
			  });
			},
			
			
			
			
			chooseImagesNewVideo(){
				if (this.disabled) return;
				  const {
					name = "",
					maxCountNewVideo,
					multipleNewVideo,
					maxSizeNewVideo,
					listsNewVideo,
				  } = this;
				  let chooseFileNewVideo = null;
				  const newMaxCount = maxCountNewVideo - listsNewVideo.length;
				  // 设置为只选择图片的时候使用 chooseImage 来实现
				  chooseFileNewVideo = new Promise((resolve, reject) => {
					uni.chooseVideo({
					    maxDuration:60, 
						compressed:false,
					    count: multipleNewVideo ? newMaxCount : 1,
					    sourceType: ['album','camera'],
						camera: this.cameraList[this.cameraIndex].value,
						success: resolve,
						fail: reject
					});
					
				  });
				  chooseFileNewVideo
					.then(res => {
						console.log('压缩前大小---', res.size / 1024 /1024 + 'M');
				
						let file = null;
						let listOldLength = this.listsNewVideo.length;
						
						
						if (res.size > maxSizeNewVideo) {
						  this.$emit("on-oversize", res, this.listsNewVideo);
						  this.showToast("超出允许的文件大小");
						  return;
						} else {
						  if (maxCountNewVideo <= listsNewVideo.length) {
								this.$emit("on-exceed", val, this.listsNewVideo);
								this.showToast("超出最大允许的文件个数");
								return;
							}
						  
						  listsNewVideo.push({
							url: res.tempFilePath,//path
							progress: 0,
							error: false
						  });
												
							this.lists = [];
												
						  console.log('aa111');
						  // 列表发生改变，发出事件，第二个参数为当前发生变化的项的索引
						  this.$emit("on-list-change", this.listsNewVideo);
					  }
					  // 每次图片选择完，抛出一个事件，并将当前内部选择的图片数组抛出去
					  this.$emit("on-choose-complete", this.listsNewVideo);
					  console.log('aa222');
					  if (this.autoUpload) console.log('aa333'); this.uploadFileNewVideo(listOldLength);
					})
					.catch(error => {
						console.log(error);
					   //this.$emit('on-error', error);
					   this.showToast(error);
					   this.showToast(error.Msg);
					   return;
					});
			},
			
			videoCompress(tempFilePath){
				const {
					name = "",
					maxCountNewVideo,
					multipleNewVideo,
					maxSizeNewVideo,
					listsNewVideo,
				} = this;
				let chooseFileNewVideo = null;
				const newMaxCount = maxCountNewVideo - listsNewVideo.length;
				uni.showLoading({
					title: '上传中...'
				});
				var that = this;
				console.log(tempFilePath);
				uni.compressVideo({
					src: tempFilePath,  
					quality: 'high', //'low':低，'medium':中，'high':高  
					success: function (res){   
						// 压缩后的大小 大于10MB,继续压缩
						console.log('压缩后大小---', res.size / 1024  + 'M');
						console.log('压缩后大小---', res.size   + 'K');
						
						let listOldLength = that.listsNewVideo.length;
						
						if ( res.size/1024 > 30) {
							console.log('再次压缩')
							that.videoCompress(res.tempFilePath)
						}else{
							console.log(res.tempFilePath);
							listsNewVideo.push({
								url: res.tempFilePath,//path
								progress: 0,
								error: false
							});
							uni.hideLoading();											
							//that.lists = [];
																				
							console.log('aa111');
							// 列表发生改变，发出事件，第二个参数为当前发生变化的项的索引
							that.$emit("on-list-change", that.listsNewVideo);
							
							// 每次图片选择完，抛出一个事件，并将当前内部选择的图片数组抛出去
							that.$emit("on-choose-complete", that.listsNewVideo);
							console.log('aa222');
							
							if (that.autoUpload) console.log('aa333'); that.uploadFileNewVideo(listOldLength);
							
							/* let tempVideo = {
								type: 'video',
								imagePath: res.tempFilePath
							}
							that.imageList.push(tempVideo)
							that.uploadVideo(res.tempFilePath) */
						}
						
					},
					fail: function (err) {
						console.log(err)
						uni.showToast({  
							title:'视频压缩失败',  
							icon:'none'
						},2000)
					}
				})
			},

			// 该方法供用户通过ref调用，手动上传
			uploadNewVideo() {
			  this.uploadFileNewVideo();
			},
			// 对失败的图片重新上传
			retryNewVideo(index) {
			  this.listsNewVideo[index].progress = 0;
			  this.listsNewVideo[index].error = false;
			  this.listsNewVideo[index].response = null;
			  uni.showLoading({
			    title: "重新上传"
			  });
			  this.uploadFileNewVideo(index);
			},
			// 上传图片
			uploadFileNewVideo(index = 0) {
				console.log('aa');
				console.log(this.listsNewVideo);
			  if (this.disabled) return;
			  if (this.uploading) return;
			  // 全部上传完成
			  if (index >= this.listsNewVideo.length) {
			    this.$emit("on-uploaded", this.listsNewVideo, this.customName);
			    return;
			  }
	
			  this.listsNewVideo[index].error = false;
			  this.uploading = true;
			
			  // 创建上传对象
			  UPLOAD_IMAGES({
			    filePath: this.listsNewVideo[index].url,
			    name: this.name,
			    formData: this.formData,
			    isShowLoading: true,
			    loadingText: "上传中",
				timeout:1200000,
			    onProgressUpdate: res => {
			      // 上传进度
			      if (res.progress > 0) {
			        this.listsNewVideo[index].progress = res.progress;
			        this.$emit("on-progress", res, index, this.listsNewVideo, this.customName);
			      }
			    }
			  })
			    .then(res => {
			      // 上传成功
			      this.listsNewVideo[index].response = res.data;
			      this.listsNewVideo[index].progress = 100;
			      this.listsNewVideo[index].error = false;
			      this.uploading = false;
			      this.$emit(
			        "on-successnewvideo",
			        res.data,
			        index,
			        this.listsNewVideo,
			        this.customName
			      );
				  
				  this.$emit(
				    "on-success",
				    [],
				    0,
				    this.lists,
				    this.customName
				  );
				  
			    })
			    .catch(e => {
					if(e.errMsg=="uploadFile:fail timeout"){
						uni.showToast({
							title:'上传超时，请压缩后再上传',  
							icon:'none'
						},2000)
					}
					
					console.log(e);
			      this.uploading = false;
			      this.uploadErrorNewVideo(index, e);
			    });
			},
			// 上传失败
			uploadErrorNewVideo(index, err) {
			  this.listsNewVideo[index].progress = 0;
			  this.listsNewVideo[index].error = true;
			  this.listsNewVideo[index].response = null;
			  this.$emit("on-error", err, index, this.listsNewVideo, this.customName);
			  this.showToast(err.message);
			},
			// 删除一个图片
			deleteItemNewVideo(index) {
			  uni.showModal({
			    title: "提示",
			    content: "您确定要删除此项吗？",
			    success: res => {
			      if (res.confirm) {
			        if (
			          this.listsNewVideo[index].process < 100 &&
			          this.listsNewVideo[index].process > 0
			        ) {
			          typeof this.listsNewVideo[index].uploadTask != "undefined" &&
			            this.listsNewVideo[index].uploadTask.abort();
			        }
			        this.listsNewVideo.splice(index, 1);
			        this.$forceUpdate();
			        this.$emit("on-removenewvideo", index, this.listsNewVideo, this.customName);
			        this.showToast("移除成功");
			        // 列表发生改变，发出事件
			        this.$emit("on-list-change", this.listsNewVideo, this.customName);
			      }
			    }
			  });
			},
			// 用户通过ref手动的形式，移除一张图片
			removeNewVideo(index) {
			  // 判断索引的合法范围
			  if (index >= 0 && index < this.listsNewVideo.length) {
			    this.listsNewVideo.splice(index, 1);
			    this.$emit("on-list-change", this.listsNewVideo, this.customName);
			  }
			},

        }
    }
</script>

<style lang="scss" scoped>
.burst-wrap{
    width: 750rpx;
}
 .burst-wrap .burst-wrap-bg{
    position: relative;
    width: 100%;
/*    height: 320rpx; */
   background-color:#fff;
} 
.burst-wrap .burst-wrap-bg>view{
    width: 90%;
    height: 100%;
    margin: 0 auto;
    /* position: absolute;
    top: 65rpx; */
    left: 0;
    right: 0;
}
.burst-info {
	/* height:300rpx; */
}
.uni-uploader__input {
	/* height:300rpx; */
}
.form-item{
    width: 100%;
}
.form-item textarea{
    display: block;
    height: 220rpx;
    width: 100%;
    color: #AAAAAA;
    font-size: 28rpx;
}
.uni-uploader__file,.uploader_video{
    position: relative;
    z-index: 1;
    width: 200rpx;
    height: 200rpx;
}
.uni-uploader__img {
    width: 200rpx;
    height: 200rpx;
}
.icon-cuo {
    position: absolute;
    right: 0;
    top: 5rpx;
    background: linear-gradient(90deg,rgba(251,91,80,1) 0%,rgba(240,45,51,1) 100%);
    color: #FFFFFF;
    z-index: 999;
    border-top-right-radius: 20rpx;
    border-bottom-left-radius: 20rpx;
}
.video{
    width: 100%;
    height: 100%;
}

.login-input-box{
    position: relative;
    border-bottom: 1rpx solid #EEEEEE;
}
.login-input-box .forget,.login-input-box .phone{
    position: absolute;
    top: 0;
    height: 100%;
    z-index: 100;
}
.login-input-box .phone{
    width: 100rpx;
    left: 0;
    color: #666666;
    font-weight: bold;
}
.login-input-box .phone-input{
    padding-left: 100rpx;
}
.address-wrap,.open-info{
    margin-top: 20rpx;
}
.open-info>view:last-child{
    font-size: 28rpx;
    color: #999999;
}
.address-wrap .address {
    background: #F2F2F2;
    border-radius: 40rpx;
    padding: 0 20rpx;
}
.user-set-btn{
    margin: 40rpx;
    background: linear-gradient(90deg,rgba(251,91,80,1) 0%,rgba(240,45,51,1) 100%);
    color: #FFFFFF;
    text-align: center;
    height: 88rpx;
    line-height: 88rpx;
}
.u-upload {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: -8rpx;
}

.u-list-item {
  width: 160rpx;
  height: 160rpx;
  overflow: hidden;
  margin: 8rpx;
  background: rgb(244, 245, 246);
  position: relative;
  border-radius: 10rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.u-preview-wrap {
  border: 1px solid rgb(235, 236, 238);
}

.u-add-wrap {
  flex-direction: column;
  color: $text-gray;
  font-size: $font-size-sm;
  line-height: 1.2;
}

.u-add-tips {
  margin-top: 20rpx;
}

.u-add-wrap__hover {
  background-color: rgb(235, 236, 238);
}

.u-preview-image {
  display: block;
  width: 100%;
  height: 100%;
}

.u-delete-icon {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 100rpx;
  width: 44rpx;
  height: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.u-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.u-progress {
  position: absolute;
  bottom: 10rpx;
  left: 8rpx;
  right: 8rpx;
  z-index: 9;
  width: auto;
}

.u-error-btn {
  color: #ffffff;
  background-color: red;
  font-size: 20rpx;
  padding: 4px 0;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  line-height: 1;
}
</style>