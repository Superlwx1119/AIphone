<template>
	<div class="addMany">
		<transition name='detailShow'>
		<div class="addCont" v-clickoutside="handleClose" v-if="show">
			<h3>批量导入</h3>
			<form>
				<p class="tips">操作提示:下载模板后将批量导入的客户信息填写完成后批量上传</p>
				<label class="upload"><span>上传</span><input  type="file" name="" id=""  accept="application/vnd.ms-excel" /></label>
				<p class="download"><span @click="openExl">自定义模板下载</span></p>
				<div class="addButton">
					<input type="submit" class="addUser" value="确定上传"/>
					<input type="button" class='cancel' value="关闭" @click="handleClose"/>
				</div>
			</form>
			<transition name='ExlShow'>
			<div class="downloadExl" v-if="Exl_onoff">
				<h3>客户信息自定义导出模板</h3>
				<table>
					<thead>
						<tr>
							<th><input v-model="checkAll" @click="checkedAll" type="checkbox" name="" /></th>
							<th>字段名称</th>
							<th>字段</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item,index) of Exl_cont">
							<td><input v-model="checkValue"  :value="item"  type="checkbox" name="" /></td>
							<td>{{item.key}}</td>
							<td>{{item.val}}</td>
						</tr>
					</tbody>
				</table>
				<div class="downButton">
					<button class="addUser" @click="makeExl">确定生成</button>
					<button class="cancel" @click="closeExl">关闭</button>
				</div>
			</div>
			</transition>
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
		name:'AddMany',
		directives: {clickoutside},
		data(){
			return{
				checkValue:[],
				checkAll:false,
				show:false,
				close:false,
				sels:[],
				Exl_onoff:false,
				Exl_cont:[
				{'key':'外呼被叫号码','val':'bno'},
				{'key':'被叫对应的用户姓名','val':'userName'},
				{'key':'扩展字段1','val':'exp1'},
				{'key':'扩展字段2','val':'exp2'},
				{'key':'扩展字段3','val':'exp3'},
				{'key':'说明备注','val':'remark'},
				{'key':'自定义信息项1','val':'custData1'},
				{'key':'自定义信息项2','val':'custData2'},
				{'key':'自定义信息项3','val':'custData3'},
				{'key':'播放内容','val':'playFile'},
				{'key':'中继组号，多号码逗号分隔','val':'gid'},
				{'key':'客户意向','val':'intentTag'},
				{'key':'最近呼叫时间','val':'lastCalloutTime'},
				{'key':'通话次数','val':'callCount'},
				{'key':'计划拨打时间','val':'planTime'},
				]
			}
		},
		computed:{
			checktag(){
				//模板标签选择
				return this.checkValue.map(item => item);
			},
		},
		watch:{
			checkValue: {
                handler: function(val, oldVal) {
                    if (val.length === this.Exl_cont.length) {
                        this.checkAll = true;
                    } else {
                        this.checkAll = false;
                    }
                },
            },
		},
		methods:{
			handleClose(e) {
		        this.$emit('close',this.close)
		    },
		    makeExl() {
		    	//导出Exl
		    	 this.$confirm('确认生成模板?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'success'
		        }).then(()=>{
		        	require.ensure([], () => {　　
					const { export_json_to_excel } = require('@/vendor/Export2Excel');　　//引入文件　　　　　　 
					const tHeader = []; //将对应的属性名转换成中文 
					this.checkValue.forEach(item=>{
						tHeader.push(item.key)
					})
					const filterVal = [];//table表格中对应的属性名　　
					this.checkValue.forEach(item=>{
						filterVal.push(item.val)
					})
					const list = this.sels;　　　　　　　　 
					const data = this.formatJson(filterVal, list);　　　　　　　　 
					export_json_to_excel(tHeader, data, '客户信息');　　　　　　 
					}) 
		        })
				
			},
		    formatJson(filterVal, jsonData) {
		    	//导出EXl
		   		 return jsonData.map(v => filterVal.map(j => v[j]))
		    },
		    closeExl(){
		    	this.Exl_onoff=false
		    },
		    openExl(){
		    	this.Exl_onoff=true
		    },
		    checkedAll(){
		    	//字段名称全选
		    	var _this = this;
				this.checkAll=!this.checkAll
                if (!_this.checkAll) { //实现反选
                    _this.checkValue = [];
                } else { //实现全选
                    _this.checkValue = [];
                    _this.Exl_cont.forEach(function(item, index) {
                        _this.checkValue.push(item);
                    });
                }
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
	.addMany{
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
		height: 300px;
		left: 50%;
		top: 50%;
		margin-left: -250px;
		margin-top: -150px;
		background: white;
		box-shadow: 0px 0px 15px 15px rgba(0,0,0,.2);
	}
	.addCont >h3{
		text-align: center;
		background: #2092c1;
		font-size: 16px;
		color: white;
		font-weight: normal;
		padding: 10px 0;
		margin-bottom: 20px;
	}
	form{
		border: 1px solid gainsboro;
		margin: 8px;
		padding: 5px;
		position: relative;
		text-align: center;
	}
	.upload input{
		opacity: 0;
	}
	.upload span{
		display: block;
		width: 50%;
		font-size: 16px;
		height: 35px;
		line-height: 35px;
		margin: 0 auto;
		cursor: pointer;
		color: white;
		background: #5db734;
		text-align: center;
	}
	.tips{
		color: blue;
		font-size: 14px;
		text-align: center;
		margin-bottom: 20px;
	}
	.download{
		margin-bottom: 20px;
	}
	.download span{
		text-align: center;
		text-decoration: underline;
		font-size: 14px;
		cursor: pointer;
		margin-bottom: 15px;
	}
	.download span:hover{
		color: #08c;
	}
	.addButton{
		position: absolute;
		bottom: -50px;
		left: 50%;
		margin-left: -110px;
		text-align: center;
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
	.downloadExl{
		position: absolute;
		width: 350px;
		height: 250px;
		left: 50%;
		top: 50%;
		margin-left:-175px;
		margin-top: -125px;
		background: white;
		box-shadow: 0px 0px 15px 15px rgba(0,0,0,.2);
		overflow-y: scroll;
	}
	.downloadExl h3{
		text-align: center;
		background: #2092c1;
		font-size: 16px;
		color: white;
		font-weight: normal;
		height: 30px;
		line-height: 30px;
	}
	.downloadExl table{
		font-size: 14px;
		height: 220px;
		width: 100%;
		text-align: center;
		margin-bottom: 60px;
	}
	.downButton{
		width: 350px;
		position: fixed;
		bottom: 57%;
		left: 54%;
		margin: -175px;
	}
	.downButton button{
		outline: none;
		cursor: pointer;
		width: 80px;
		height: 30px;
		line-height: 30px;
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
	.ExlShow-enter-active{
		animation: detailShow-in .15s;
	}
	.ExlShow-leave-active{
		animation: detailShow-in .1s reverse;
	}
</style>