<template>
	<div class="numDetail">
		<transition  name='detailShow'>
			<div class="numDetail_cont"   v-clickoutside="handleClose"  v-if="show">
				<div class="detailHeader">
					<p>详情-{{detail_data.bno}}</p>
					<i @click="closeNumDetail"  class="el-icon-circle-close-outline"></i>
				</div>
				<div>
					<el-tabs class='tabs' v-model="activeName"  @tab-click="handleClick">
				    <el-tab-pane label="基本信息" :class="{ 'active': layout == 'baseMsg'}" name="first" @click.native="layout='baseMsg'"></el-tab-pane>
				    <!--<el-tab-pane label="信息采集" :class="{ 'active': layout == 'getMsg'}" name="second" @click.native="layout='getMsg'"></el-tab-pane>-->
				  </el-tabs>
				</div>
				<div v-if="layout=='baseMsg'" class="baseMsg tabs">
					<el-row>
						<el-col :span='12'>
							<table>
							<tr>
								<td class="blue">电话号码：</td>
								<td>{{detail_data.bno}}</td>
								<td colspan="2">广东 广州 移动</td>
							</tr>
							<tr>
								<td class="blue">客户姓名：</td>
								<td></td>
								<td class="blue">客户公司：</td>
								<td></td>
							</tr>
							<tr>
								<td class="blue">时长(秒)：</td>
								<td>{{detail_data.duration}}</td>
								<td class="blue">时间：</td>
								<td>{{detail_data.begtime|fn}}</td>
							</tr>
							<tr>
								<td class="blue">拨出号码：</td>
								<td>{{detail_data.ano}}</td>
								<td class="blue">拨打状态：</td>
								<td>{{detail_data.isCallOK}}</td>
							</tr>
							<tr>
								<td class="blue">接通/听完/转接：</td>
								<td colspan="3">已接通 未听完 未转接</td>
							</tr>
							<tr>
								<td class="blue">通话质量等级：</td>
								<td>E</td>
								<td class="blue">号码标签：</td>
								<td></td>
							</tr>
							<tr>
								<td class="blue">客户类型：</td>
								<td>无意向客户</td>
								<td class="blue">负责人：</td>
								<td></td>
							</tr>
							<tr>
								<td  class="blue">入海原因：</td>
								<td  colspan="3"></td>
							</tr>
							<tr>
								<td class="blue">关键字：</td>
								<td  colspan="3"></td>
							</tr>
							<tr>
								<td class="blue">备注：</td>
								<td  colspan="3"></td>
							</tr>
							<tr>
								<td class="blue">完整录音：</td>
								<td  colspan="3">
									<audio controls>
									  <source :src="detail_data.recFile|audio" type="audio/ogg">
										您的浏览器不支持 audio 元素。
									</audio></td>
							</tr>
						</table>
						</el-col>
						<el-col :span='12'>
							<div class="talkMsg">
								<div :class="{'left':item.split(':')[0]=='Amain1-kaichangbai','right':item.split(':')[0]=='Amain2-chanpinmiaoshu'}" v-for="item of txtArr"><img :src="item.split(':')[0]=='Amain1-kaichangbai'?'./static/img/touxiang.png':'./static/img/service.png'"/><div class="chatCont"><p><i></i>{{item.split(':')[1]}}</p></div></div>
							</div>
						</el-col>
					</el-row>
				</div>
				<!--<div v-if="layout=='getMsg'" class="getMsg tabs">
					xxxx
				</div>-->
				
			</div>
		</transition>
	</div>
</template>

<script>
	const clickoutside = {
	  bind(el, binding, vnode) {
	    function documentHandler(e) {
	  // 这里判断点击的元素是否是本身，是本身，则返回
	      if (el.contains(e.target)) {
	        return false;
	  }
	  // 判断指令中是否绑定了函数
	      if (binding.expression) {
	  // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
	        binding.value(e);
	      }
	 }
	 // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
	    el.__vueClickOutside__ = documentHandler;
	    document.addEventListener('click', documentHandler);
	  },
	  update() {},
	  unbind(el, binding) {
	 // 解除事件监听
	    document.removeEventListener('click', el.__vueClickOutside__);
	    delete el.__vueClickOutside__;
	  },
	};
	export default{
		name:'number_detail',
		directives: {clickoutside},
		filters:{
			fn (value){
		    	//转换拨打时间
		    	let res=value.split('');
		        res.splice(4,0,'-')
			    res.splice(7,0,'-')
				res.splice(10,0,' ')
				res.splice(13,0,':')
				res.splice(16,0,':')
				return res.toString().replace(/,/g,'')
	    	},
	    	audio(value){
	    		//获取录音地址
	    		let address=location.href;
	    		let firstaddress = address.split("//");
				let secondaddress = firstaddress[1].split("/");
				let topaddress =  firstaddress[0]+'//'+secondaddress[0];
	    		return 'http://172.16.10.101:8080'+value
	    	}
		},
		data(){
			return {
				close:false,
				activeName:'first',
				layout:'baseMsg',
				show:false
			}
		},
		props:{
			detail_data:Object,
			txtArr:Array,
			detail_onoff:Boolean
		},
		methods:{
			handleClose(e) {
		      this.$emit('close',this.close)
		    },
			closeNumDetail(){
				this.$emit('close',this.close)
			},
			handleClick() {
	        }
		},
		watch:{
			//监听选项卡
			activeName(val){
				if(val=='second'){
					this.layout='getMsg'
				}else{
					this.layout='baseMsg'
				}
			},
		},
		mounted(){
			this.show=true
		}
	}
</script>

<style scoped="scoped">
	*{
		padding: 0;
		margin: 0;
		list-style: none;
	}
	.right .chatCont{
		margin-right: 40px;
	}
	.chatCont{
		width: 360px;
	}
	.right{
		float: right;
		clear: both;
		line-height: 40px;
	}
	.left i{
		display: block;
		position: absolute;
		top: 10px;
		left: 30px;
		width: 0px;
		height: 0px;
		border: 10px solid;
		border-color: transparent gainsboro transparent transparent
	}
	.right i{
		display: block;
		position: absolute;
		top: 10px;
		right: 32px;
		width: 0px;
		height: 0px;
		border: 10px solid;
		border-color: transparent transparent transparent lightskyblue
	}
	.left,.right {
		width: 400px;
		word-break: break-all;
	}
	.right img{
		position: absolute;
		right: 0;
		top: 0;
	}
	.left img{
		float: left;
		clear: both;
	}
	.left p{
		background: gainsboro;
	}
	.right p{
		background: lightskyblue;
		float: right;
	}
	.left{
		line-height: 40px;
		float: left;
		clear: both;
	}
	.numDetail{
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.6);
		position: fixed;
		top: 0;
		left: 0;
	}
	.numDetail_cont{
		box-shadow: 0px 0px 15px 15px rgba(0,0,0,.2);
		position: absolute;
		width: 1200px;
		height: 700px;
		background: white;
		left: 50%;
		top: 50%;
		margin-left: -600px;
		margin-top: -350px;
	}
	.detailHeader{
		/*cursor: move;*/
		height: 40px;
		background: white;
		border-bottom: 1px solid gainsboro;
	}
	.detailHeader p{
		float: left;
		font-size: 14px;
		padding-left: 30px;
		line-height: 40px;
	}
	.detailHeader i{
		float: right;
		font-size: 20px;
		cursor: pointer;
		margin: 10px 0;
		margin-right: 20px;
	}
	.tabs{
		padding:0 15px;
	}
	.baseMsg td{
		border: 1px solid #3e4d59;
		padding: 5px;
		height: 30px;
	}
	.baseMsg table{
		border-collapse:collapse;
		font-size: 14px;
		width: 95%;
	}
	.blue{
		background: #e2edf2;
	}
	.talkMsg{
		height: 600px;
		overflow-x: hidden; 
		overflow-y: auto;
	}
	.talkMsg img{
		width: 30px;
		height: 30px;
		vertical-align: middle;
		padding: 5px;
	}
	.talkMsg >div{
		display: flex;
		margin: 10px 0;
		position: relative;
		clear: both;
	}
	.talkMsg p{
		display: inline-block;
		white-space: normal;
		clear: both;
		word-break: break-all;
		word-wrap: break-word;
		border-radius: 5px;
		font-size: 14px;
		padding: 5px;
		margin: 0px 10px;
	}
	.detailShow-enter-active{
		animation: detailShow-in .15s;
	}
	.detailShow-leave-active{
		animation: detailShow-in .15s reverse;
	}
	@keyframes detailShow-in{
		0%{
			transform: scale(0);
		}
		100%{
			transform: scale(1);
		}
	}
</style>