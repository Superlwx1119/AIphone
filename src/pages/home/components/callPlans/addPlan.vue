<template>
	<div class="addone">
		<transition name='detailShow'>
			<div  class="addCont" v-clickoutside="handleClose" v-if="show">
				<h3>新增计划</h3>
				<form action="http://172.16.10.101:8080/AICALL2018/insertOuttask" method="post">
					<table>
						<tr>
							<td class="tag">计划名称<i>*</i></td>
							<td><input class="inp" type="text" name="batchno" v-model="batchno"/></td>
						</tr>
						<tr>
							<td class="tag">短信开关</td>
							<td>
								<select class="inp" v-model="smsFlag" name="smsFlag">
									<option value="1">开</option>
									<option value="0">关</option>
								</select>
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
							<td class="tag">计划类型</td>
							<td>
								<select class="inp" name="">
									<option value="">机器人</option>
								</select>
							</td>
						</tr>
						<tr>
							<td class="tag">话术模板</td>
							<td>
								<select class="inp" v-model="playfile" name="playfile">
									<option value="">asdwqieuoug</option>
								</select>
							</td>
						</tr>
						<tr>
							<td class="tag" rowspan="11" align="top">号码线路</td>
							<td class="lineNum"><label><input type="checkbox" />全部</label></td>
						</tr>
						<tr v-for="item of 10">
							<td class="lineNum"><label><input  type="checkbox" />+8673188595040, 启用</label></td>
						</tr>
					</table>
					<div class="addButton">
					<input type="button" class="addUser" @click="addPlan" value="确定"/>
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
	export default{
		name:'addPlan',
		directives: {clickoutside},
		data(){
			return{
				batchno:'',
				smsFlag:1,
				playfile:'',
				state:2,
				checkClass:[],
				show:false,
				close:false,
				Gid:[],
				outcall:['9:00','10','11','12','13','14','15','16','17','18','19','20:00']
			}
		},
		methods:{
			handleClose(e) {
		      this.$emit('close',this.close)
		    },
		    checkTime(e){
//		    	this.outcall.forEach((item,index)=>{
//		    		if(e.target.defaultValue==item&&this.checkClass.indexOf(item)<0){
//		    			this.checkClass.push(item)
//		    		}
//	    	})
//		    	console.log(this.checkClass)
		   },
		   addPlan(){
		   		let data={
		   			batchno:this.batchno,
		   			smsFlag:this.smsFlag,
		   			state:this.state,
		   			outSpan:this.checkClass,
		   			playfile:this.playfile,
		   			gid:this.Gid
		   		}
		   		console.log(data)
		    	this.$http.post('http://172.16.10.101:8080/AICALL2018/insertOuttask',data,{
	              emulateJSON: true
	           })
		    	.then(res=>{
		    		console.log(res)
		    	})
		   }
		},
		mounted(){
			this.show=true;
		}
	}
</script>

<style scoped>
	*{
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.active{
		background: gainsboro;
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
		width: 100%;
		height: 320px;
		overflow-y: scroll;
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
	.checkHidden input[type='checkbox']:checked+label{
		background: gainsboro;
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