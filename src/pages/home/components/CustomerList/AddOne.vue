<template>
	<div class="addone">
		<transition name='detailShow'>
		<div class="addCont" v-clickoutside="handleClose" v-if="show">
			<h3>新增客户</h3>
			<form action="http://172.16.10.101:8080/AICALL2018/insertOutnumberinfo" method="post">
				<label for="phonenumber"><span><i>* </i>电话号码</span><input type="text" v-model="bno" required name="bno" id="phonenumber" value="" /></label>
				<label for="username"><span><i>* </i>客户姓名</span><input type="text" required v-model='username' name="username" id="username" value="" /></label>
				<label for="username"><span>备注</span><input type="text" v-model="remark" name="remark" id="username" value="" /></label>
				<div class="check">
				<label  for="joinProject"><input type="checkbox" @click="checkproject($event)"  id="joinProject" value="" />按项目加入</label>
				<el-select v-if='checkProject' @change='changeProject' v-model='projectName' name="projectName"  placeholder="不限">
					<el-option value="">不限</el-option>
					<el-option v-for='item of projectList' :key='item' :value="item">{{item}}</el-option>
				</el-select>
				</div>
				<div class="check">
				<label  for="joinPlan"><input type="checkbox" @click="checkplan($event)" name="" id="joinPlan" value="" />同时加入到计划</label>
				<el-select v-if='checkPlan' @change='changeplan' v-model='planName' name="planName" placeholder="不限">
					<el-option value=''>不限</el-option>
					<el-option v-for='(item,index) of planList' :key='index' :value="item.batchno">{{item.batchno}}</el-option>
				</el-select>
				</div>
				<div class="addButton">
					<input type="button" @click="postCustomerOne" class="addUser" value="确定新增"/>
					<input type="button" class='cancel' value="关闭" @click="handleClose"/>
				</div>
				
			</form>
			<transition name='detailShow'>
				<div class="tip" v-if="tip">
					<h2><i class="el-icon-warning"></i>提示!</h2>
					<p>{{tipTxt}}</p>
					<el-button type="primary" @click='closeTip'>确定</el-button>
				</div>
			</transition>
		</div>
		</transition>
	</div>
</template>

<script>
	import axios from 'axios'
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
	export default{
		name:'AddOne',
		directives: {clickoutside},
		props:{
			reicd:Number
		},
		data(){
			return{
				tip:false,
				tipTxt:'请填写完整信息!',
				bno:'',
				username:'',
				remark:'',
				projectName:'',
				planName:'',
				show:false,
				close:false,
				checkPlan:false,
				checkProject:false,
				planList:[],
				projectList:[]
			}
		},
		methods:{
			closeTip(){
				this.tip=false;
			},
			changeplan(val){
				this.planName=val
			},
			changeProject(val){
				this.projectName=val
			},
			handleClose(e) {
				setInterval(()=>{
					this.$emit('close',this.close)
				},100)
		    },
		    checkplan(e){
		    	//获取计划下拉框
		    	this.checkPlan=e.target.checked
		    	if(e.target.checked){
		    		axios.post('http://172.16.10.101:8080/AICALL2018/getOuttaskSelect','')
			    	.then(res=>{
			    		this.planList=res.data
			    		console.log(res)
			    	})
		    	}
		    },
		    checkproject(e){
		    	//获取项目下拉框
		    	this.checkProject=e.target.checked
		    	if(e.target.checked){
		    		axios.post('http://172.16.10.101:8080/AICALL2018/getAIProjectSelect','')
			    	.then(res=>{
			    		this.projectList=res.data
			    	})
		    	}
		    },
		    postCustomerOne(){
		    	//新增单个客户
		    	var reg=/^1[3456789]\d{9}$/;
		    	if(this.bno!=''&&this.username!=''){
		    		if(reg.test(this.bno)==false){
		    			this.tipTxt='请填写正确的手机号码!'
		    			this.tip=true;
		    			return
		    		}
		    		let CallTime=new Date();
			    	function add0(m){return m<10?'0'+m:m };
			    	let y = CallTime.getFullYear();
					let m = CallTime.getMonth()+1;
					let d = CallTime.getDate();
					let h = CallTime.getHours();
					let mm = CallTime.getMinutes();
					let s = CallTime.getSeconds();
					let lastCalloutTime=y+''+add0(m)+''+add0(d)+''+add0(h)+''+add0(mm)+''+add0(s)
		    		console.log(lastCalloutTime)
		    		let data={
			    		bno:this.bno,
			    		recid:this.reicd,
			    		username:this.username,
			    		remark:this.remark,
			    		apprecid:this.projectName,
			    		batchno:this.planName,
			    		lastCalloutTime:lastCalloutTime,
			    		planTime:lastCalloutTime,
			    		batchdate:lastCalloutTime
			    	}
//			    	console.log(data)
			    	this.$http.post('http://172.16.10.101:8080/AICALL2018/insertOutnumberinfo',data,{emulateJSON:true})
			    	.then((res)=>{
//			    		console.log(res);
			    		this.$confirm('确认添加客户, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				     }).then(() => {
				     	  //前端页面添加假数据
				     	  this.$emit('add-msg',data);
				          this.$message({
				            type: 'success',
				            message: '添加成功!'
				          });
				          this.handleClose();
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消添加'
				          });          
				        });
				       	
			    	})
			    	.catch(error=>{
			    		console.log(error)
			    	})
		    	}else{
		    		this.tipTxt='请填写完整信息!'
					this.tip=true
			    }
		    }
		},
		mounted(){
			this.show=true;
		}
	}
</script>

<style scoped="scoped">
	*{
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.el-icon-warning{
		color: orange;
		margin-right: 10px;
		padding: 10px 0;
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
		width: 500px;
		height: 400px;
		left: 50%;
		top: 50%;
		margin-left: -250px;
		margin-top: -200px;
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
		text-align: center;
		font-size: 14px;
	}
	form span{
		width: 90px;
		text-align: center;
		display: inline-block;
	}
	form i{
		color: red;
	}
	label{
		display: block;
		height: 40px;
		line-height: 40px;
	}
	label input[type='text']{
		height: 25px;
		width: 250px;
		line-height: 25px;
	}
	.check{
		text-align: left;
		margin-left: 100px;
	}
	.check label{
		display: inline-block;
		width: 117px;
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
	.tip{
		position: absolute;
		left: 50%;
		top: 50%;
		height: 150px;
		background: white;
		text-align: center;
		width: 300px;
		margin-left: -150px;
		margin-top: -75px;
		box-shadow: 0px 0px 15px 15px rgba(0,0,0,.2);
	}
	.tip h2{
		font-size: 16px;
		background: #2092c1;
		font-weight: normal;
	}
	.tip p{
		margin: 30px 0;
	}
	.tip button{
		padding: 5px 10px;
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