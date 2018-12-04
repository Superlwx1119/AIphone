<template>
	<div class="numDetail">
		<div class="numDetail_cont"  v-clickoutside="handleClose">
			<div class="detailHeader">
				<p>详情-{{detail_data.bno}}</p>
				<i @click="closeNumDetail"  class="el-icon-circle-close-outline"></i>
			</div>
			<div>
				<el-tabs class='tabs' v-model="activeName"  @tab-click="handleClick">
			    <el-tab-pane label="基本信息" :class="{ 'active': layout == 'baseMsg'}" name="first" @click.native="layout='baseMsg'"></el-tab-pane>
			    <el-tab-pane label="信息采集" :class="{ 'active': layout == 'getMsg'}" name="second" @click.native="layout='getMsg'"></el-tab-pane>
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
							<td>{{detail_data.begtime}}</td>
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
								  <source src="../../../assets/audio/Cff99de6cb23d497e80d1ea6f9b866589.wav" type="audio/ogg">
									您的浏览器不支持 audio 元素。
								</audio></td>
						</tr>
					</table>
					</el-col>
					<el-col :span='12'>
						<div class="talkMsg">
							<p :class="{'left':item.split(':')[0]=='Amain1-kaichangbai','right':item.split(':')[0]=='admin2'}" v-for="item of txtArr"><img src="../../../assets/img/touxiang.png"/><span>{{item.split(':')[1]}}</span></p>
						</div>
					</el-col>
				</el-row>
			</div>
			<div v-if="layout=='getMsg'" class="getMsg tabs">
				xxxx
			</div>
			
		</div>
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
		data(){
			return {
				close:false,
				activeName:'first',
				layout:'baseMsg'
			}
		},
		props:{
			detail_data:Object,
			txtArr:Array
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
			}
		}
	}
</script>

<style scoped="scoped">
	*{
		padding: 0;
		margin: 0;
		list-style: none;
	}
	.right{
		float: right;
		clear: both;
		height: 40px;
		line-height: 40px;
	}
	.right img{
		float: right;
		clear: both;
	}
	.left{
		height: 40px;
		line-height: 40px;
		float: left;
		clear: both;
	}
	.numDetail{
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.5);
		position: fixed;
		top: 0;
		left: 0;
	}
	.numDetail_cont{
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
		cursor: move;
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
		border: 1px solid black;
		padding: 5px;
		height: 30px;
	}
	.baseMsg table{
		border-collapse:collapse;
		font-size: 14px;
		width: 95%;
	}
	.blue{
		background: lavender;
	}
	.talkMsg{
		overflow: overlay;
		height: 600px;
	}
	.talkMsg img{
		width: 30px;
		height: 30px;
		vertical-align: middle;
		padding: 5px;
	}
	.talkMsg p{
		margin: 10px 0;
	}
	.talkMsg span{
		background: lightblue;
		padding: 10px;
	}
</style>