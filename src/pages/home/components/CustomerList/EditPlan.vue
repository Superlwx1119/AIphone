<template>
	<div class="addone">
		<transition name='detailShow'>
			<div  class="addCont" v-clickoutside="handleClose" v-if="show">
				<h3>加入计划</h3>
				<form action="http://172.16.10.101:8080/AICALL2018/updateOutnumberinfo" method="post">
					<table>
						<tr>
							<td class="tag">计划名称<i>*</i></td>
							<td>
								<select  class="inp plan" v-model="planName"  name="planName">
									<option v-for="(item,index) of planList" :value="item" :key='index'>{{item.batchno}}</option>
								</select>
							</td>
						</tr>
						<tr>
							<td class="tag">拨打日期</td>
							<td class="callDate">
								<el-date-picker
						            v-model="addtime.column.create_start_date"
						            type="date"
						            :picker-options="addpickerBeginDateBefore"
						            format="yyyy-MM-dd"
						            placeholder="不填表示今天">
							   </el-date-picker>
							</td>
						</tr>
						<tr>
							<td class="tag">外呼时段</td>
							<td class="checkHidden">
								<span v-for="(item,index) of outcall">
									<input :id="index" type="checkbox" :value='item' v-model="checkClass" @click="checkTime($event)"/><label :for="index">{{item}}</label>
								</span>
							</td>
						</tr>
						<tr>
							<td class="tag">短信开关</td>
							<td  class="callDate">
								<el-select v-model='msg_OnOff' disabled placeholder="">
								    <!--<el-option>
								    </el-option>-->
							    </el-select>
							</td>
						</tr>
						<tr>
							<td class="tag">计划类型</td>
							<td  class="callDate">
								<el-select v-model='kindOfPlan' disabled placeholder="机器人">
								    <!--<el-option>
								    </el-option>-->
							    </el-select>
							</td>
						</tr>
						<tr>
							<td class="tag">话术模板</td>
							<td class="callDate">
								<el-select v-model='talkway'  disabled placeholder="">
								    <!--<el-option>
								    </el-option>-->
							    </el-select>
							</td>
						</tr>
						<tr>
							<td class="tag" rowspan="11" align="top">号码线路</td>
							<td class="callDate">
								<el-input
								  placeholder="请输入内容"
								  :disabled="true">
								</el-input>
							</td>
						</tr>
					</table>
					<div class="addButton">
					<input type="button" class="addUser" @click="confirmAdd(defaultPlan,planId)" value="确定"/>
					<input type="button" class='cancel' value="关闭" @click="handleClose"/>
				</div>
				</form>
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
	import qs from 'qs'
	import axios from 'axios'
	export default{
		name:'EditPlan',
		directives: {clickoutside},
		props:{
			defaultPlan:String,
			planId:Number
		},
		data(){
			return{
				planName:'test',
				DefaultPlan:'',
				checkClass:[],
				show:false,
				close:false,
				planList:[],
				plan:'',
				msg_OnOff:'',
				kindOfPlan:'',
				talkway:'',
				outcall:['9:00','10','11','12','13','14','15','16','17','18','19','20:00'],
				addtime: {
			            column: {
			                create_start_date: '',
			                create_end_date: ''
			            },
			        },
			        addpickerBeginDateBefore:{
			            disabledDate: (time) => {
			                let beginDateVal = this.addtime.column.create_end_date;
			                if (beginDateVal) {
			                    return time.getTime() > beginDateVal;
			                }
			            }
			        },
			        addpickerBeginDateAfter:{
			            disabledDate: (time) => {
			                let beginDateVal = this.addtime.column.create_start_date;
			                if (beginDateVal) {
			                    return time.getTime() < beginDateVal;
			                }
			            }
			        },
			}
		},
		methods:{
			handleClose(e) {
		      this.$emit('close',this.close)
		    },
		    confirmAdd(){
		    	//确认修改计划
		    	if(this.addtime.column.create_start_date==''||this.addtime.column.create_start_date==null){
		    		this.addtime.column.create_start_date=new Date()
		    	}
		    	let CallTime=this.addtime.column.create_start_date;
		    	function add0(m){return m<10?'0'+m:m };
		    	let y = CallTime.getFullYear();
				let m = CallTime.getMonth()+1;
				let d = CallTime.getDate();
				let h = CallTime.getHours();
				let mm = CallTime.getMinutes();
				let s = CallTime.getSeconds();
				let time=y+''+add0(m)+''+add0(d)+''+add0(h)+''+add0(mm)+''+add0(s)
		    	let data={
		    		recid:this.planId,
		    		planTime:time,
		    		batchno:this.planName.batchno
		    	}
		    	this.$http.post('http://172.16.10.101:8080/AICALL2018/updateOutnumberinfo',data,{emulateJSON:true})
		    	.then(res=>{
		    		console.log(res)
		    	})
		    	.catch(error=>{
		    		console.log(error)
		    	})
		    },
		    checkTime(e){
//		    	this.outcall.forEach((item,index)=>{
//		    		if(e.target.defaultValue==item&&this.checkClass.indexOf(item)<0){
//		    			this.checkClass.push(item)
//		    		}
//	    	})
//		    	console.log(this.checkClass)
		   },
		   getPlanlist(){
		   	 this.$http.post('http://172.16.10.101:8080/AICALL2018/getOuttaskSelect')
		   	 .then(res=>{
		   	 	this.planList=res.data
		   	 })
		   }
		},
		mounted(){
			this.show=true;
			this.DefaultPlan=this.defaultPlan;
			this.getPlanlist();
		}
	}
</script>

<style scoped>
	*{
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.plan:hover{
		border: 1px solid #36a9e1 !important;
		box-shadow:2px 2px rgba(54,168,225,.5);
	}
	.addone{
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background: rgba(0,0,0,.6);
	}
	.addCont{
		position: absolute;
		width: 600px;
		height: 450px;
		left: 50%;
		top: 50%;
		margin-left: -300px;
		margin-top: -225px;
		background: white;
		box-shadow: 0px 0px 15px 15px rgba(0,0,0,.2);
	}
	.addCont h3{
		text-align: center;
		background: #2092c1;
		font-size: 16px;
		color: white;
		font-weight: normal;
		padding: 10px 0;
		margin-bottom: 20px;
	}
	form{
		width: 100%;
		height: 340px;
		text-align: center;
		font-size: 14px;
	}
	table{
		font-size: 14px;
		text-align: center;
		margin: 0 auto;
	}
	form i{
		color: red;
	}
	td{
		padding: 5px 0px;
	}
	.tag{
		width: 120px;
	}
	.lineNum{
		width: 300px;
		text-align: left;
	}
	.inp{
		border-radius: 5px;
		border: 1px solid #36a9e1;
		outline: none;
		width: 300px;
		box-sizing: border-box;
		height: 30px;
	}
	.checkHidden input{
		position: absolute;
		opacity: 0;
	}
	.checkHidden label{
		background: lightskyblue;
		padding: 1px;
		display: inline-block;
		margin: 0 2px;
		cursor: pointer;
	}
	label{
		text-align: left;
		display: block;
		height: 25px;
		line-height: 25px;
	}
	.addButton{
		margin-top: 20px;
		margin: 0 auto;
	}
	.addButton input{
		width: 90px;
		margin: 0 10px;
		outline: none;
		cursor: pointer;
		height: 30px;
	}
	.addUser{
		background: #78cd51;
		border-radius: 5px;
		color: white;
		border: none;
	}
	.addUser:hover{
		background: #5db734;
	}
	.cancel:hover{
		background: #bd362f;
	}
	.cancel{
		color: white;
		border: none;
		background: #ff5454;
		border-radius: 5px;
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