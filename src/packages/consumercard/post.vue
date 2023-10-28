<template>
  <view class="pages">
    <view class="cell-group">
      <lk-cell
        title="预约技师"
        required
        is-link
        :value="tec_name"
				:to="'/packages/consumercard/technician?card_id='+this.card_id"
      />
      <lk-cell
        title="到店时间"
        required
        is-link
				:value="time"
        @tap="showModal"
				data-target="ChooseModal"
      />
    </view> 
    <view class="foot-btn-group">
      <lk-button
        block
        round
        theme-color
        @click="reserveTechnician"
      >
        保存
      </lk-button>
    </view>
		<view class="cu-modal bottom-modal " :class="modalName=='ChooseModal'?'show':''" @tap="hideModal" v-if="timeData.length>0">
			<view class="cu-dialog" @tap.stop="">
				<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
					<view class="cu-item lk-item" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in timeData" :key="index" @tap="tabSelect" :data-id="index">
						<view>{{item.title}}</view>
						<view>{{item.date}}</view>
					</view>
				</scroll-view>
				
				<view class="grid col-3 padding-sm">
					<view v-for="(item,index) in checkbox" class="padding-xs" :key="index">
						<button class="cu-btn orange lg block" :class="values == index ?'bg-orange':'line-orange'" @tap="ChooseCheckbox"
						 :data-value="index"> {{item.name}}
						</button>
						
					</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="btn bg-gray" @tap="hideModal">取消</view>
					<view class="btn bg-blue" @tap="confirm">确定({{timeData[TabCur].year}}-{{timeData[TabCur].date}} {{checkbox[values].name}})</view>
				</view>
			</view>
		</view>
  </view>
</template>

<script>
import { GET_RESERVELIST , RESERVETECHNICIAN } from "@/common/interface/consumercard";


export default {
  data() {
    return {
			modalName:null,
			checkbox: [],
			timeData:[],
			TabCur: 0,
			scrollLeft: 0,
			card_id:'',
			tec_name:'',
			tec_id:'',
			values:0,
			time:'',
    };
  },
  computed: {
   
  },
  onLoad(options) {
    this.card_id = options.card_id;
  },
	onShow: function () {
		var that = this;
		var pages = getCurrentPages();
		var currPage = pages[pages.length - 1];
		this.tec_name=currPage.tec_name
		this.tec_id=currPage.tec_id
	 },

  methods: {
    showModal(e) {
			this.reserveList()
    },
    hideModal(e) {
    	this.modalName = null
    },
		confirm(){
			let date = new Date()
			let time=this.timeData[this.TabCur].year+'-'+this.timeData[this.TabCur].date+' '+this.checkbox[this.values].name
			let selectedTime = new Date(time);
			let currentTimestemp = date.getTime();
			let timestemp = selectedTime.getTime();
			if(timestemp > currentTimestemp){
				this.modalName = null
				this.time=time
			}else{
				uni.showToast({
					title:'当前时间已过',
					icon:'none',
				})
			}
			
		},
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60,
			this.checkbox = this.timeData[this.TabCur].time
		},
		ChooseCheckbox(e) {
			let items = this.checkbox;
			let values = e.currentTarget.dataset.value;
			this.values = e.currentTarget.dataset.value;
			// for (let i = 0, lenI = items.length; i < lenI; ++i) {
			// 	if (i == values) {
			// 		items[i].checked = !items[i].checked;
			// 		break
			// 	}else{
			// 		items[i].checked = false
			// 	}
			// }
		},
    //获取时间数据
		reserveList(){
			if(this.tec_id){
				GET_RESERVELIST({tec_id:this.tec_id}).then(({ data })=>{
					this.modalName = 'ChooseModal'
					this.timeData=data
					this.TabCur = 0
					this.checkbox = this.timeData[0].time
				}).catch((res)=>{
				})
			}else{
				uni.showToast({
					title:'请选择技师',
					icon:'none',
				})
			}
		},
   //提交表单
	 reserveTechnician(){
		 let data={
			 card_id:this.card_id,
			 tec_id:this.tec_id,
			 time:this.time,
		 }
		 RESERVETECHNICIAN(data).then((res)=>{
			 if(res.code == 1 ){
				 uni.showToast({
				 	title:res.message,
				 	icon:'none',
				 })
				 uni.navigateBack()
			 }
		 })
	 },
  }
};
</script>

<style lang="scss" scoped>
	@import "../../colorui/main.css";
	@import "../../colorui/icon.css";
.cell-group {
  margin: 20rpx 0;
}
.radio{
	margin: 0 10rpx;
}
.cu-bar{
	.btn{
		flex: 1;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
.nav .lk-item{
	line-height: normal;
}
.cu-modal{
	z-index: 120;
}
</style>
