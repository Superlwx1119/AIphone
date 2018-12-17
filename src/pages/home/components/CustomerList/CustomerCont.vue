<template>
	<div class="customerCont" v-loading="$store.state.showLoading" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
		<h2 class="customerList">客户列表
<el-button @click='openAddMany' type="success"><i class="el-icon-upload2 el-icon--right"></i>批量导入</el-button><el-button @click='openAddOne' type="primary" icon="el-icon-plus">单个新增</el-button></h2>
		<div class="msgCont">
			<table>
				<tr>
					<td class="tag">按项目</td>
					<td>
						<el-select v-model="projects" placeholder="请选择项目">
							<el-option value=''>请选择</el-option>
							</el-option>
						</el-select>
					</td>
					<td class="tag">任务计划</td>
					<td>
						<el-select v-model="plans" placeholder="请选择计划">
							<el-option value="">请选择计划</el-option>
							<el-option v-for='item of planList' :value="item.batchno" :key='item.batchno'>{{item.batchno}}</el-option>
						</el-select>
					</td>
				</tr>
				<tr>
					<td class="tag">手机号码</td>
					<td>
						<el-input
						    v-model='keyword'
						    placeholder="支持模糊搜索"
						    ref='searchnum'
						    clearable>
						</el-input>
					</td>
					<td class="tag">计划状态</td>
					<td>
						<el-select v-model="planStates" >
							<el-option v-for='(item,index) of planStatesList' :value="item" :key='index'>{{item}}</el-option>
							
						</el-select>
					</td>
				</tr>
				<tr>
					<td class="tag">添加时间</td>
					<td class="addtime">
						<el-date-picker
				            v-model="addtime.column.create_start_date"
				            type="date"
				            :picker-options="addpickerBeginDateBefore"
				            format="yyyy-MM-dd"
				            placeholder="">
					   </el-date-picker>
					   <span>到</span>
					   <el-date-picker
				            v-model="addtime.column.create_end_date"
				            type="date"
				            :picker-options="addpickerBeginDateBefore"
				            format="yyyy-MM-dd"
				            placeholder="">
					    </el-date-picker>
					</td>
					<td class="tag">意向标签</td>
					<td>
						<label for="all"><input id="all" v-model="checkAll" @click="checkedAll" type="checkbox" />所有</label>
						<label v-for="item of tagData" :for="item"><input  :value="item"  v-model="checkValue" type="checkbox" name="" :id="item" />{{item}}</label>
					</td>
				</tr>
				<tr>
					<td class="tag">最后拨打</td>
					<td class="addtime">
						<el-date-picker
				            v-model="lasttime.column.create_start_date"
				            type="date"
				            :picker-options="lastpickerBeginDateBefore"
				            format="yyyy-MM-dd"
				            placeholder="">
					   </el-date-picker>
					   <span>到</span>
					   <el-date-picker
				            v-model="lasttime.column.create_end_date"
				            type="date"
				            :picker-options="lastpickerBeginDateBefore"
				            format="yyyy-MM-dd"
				            placeholder="">
					    </el-date-picker>
					</td>
					<td  class="tag" colspan="2"><el-button class='search' @click='Search' type="primary" icon="el-icon-search">查询</el-button></td>
				</tr>
			</table>
		</div>
		<p v-show="DataNull" class="dataNull">无 匹 配 数 据 !</p>
		<table class="selectCont" v-for='(page,index) of pages'>
			<thead v-if="index+1==pageNumber">
				<tr>
					<th>客户信息</th>
					<th>意向</th>
					<th>当前计划</th>
					<th>计划状态</th>
					<th>最后拨打</th>
					<th>通话次数</th>
					<th>最近拜访</th>
					<th>计划时间</th>
					<th>添加时间</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody v-if="index+1==pageNumber" >
				<!--<AddTr :bno='bno' :username='username' :remark='remark' :apprecid='apprecid' :batchno='batchno' />-->
				<tr v-for="(item,index) of page" >
					<td>{{item.bno}}【{{item.username}}】</td>
					<td>{{item.intentTag}}</td>
					<td>{{item.batchno}}</td>
					<td>{{item.dealflag}}</td>
					<td>{{item.lastCalloutTime|fn}}</td>
					<td>{{item.callCount}}</td>
					<td>777777</td>
					<td>{{item.planTime|fn}}</td>
					<td>{{item.batchdate|fn}}</td>
					<td class="dosomething">
						<el-button type="primary"  @click='openEditPlan(item.recid,item.batchno)'>计划</el-button>
						<el-button type="success">拜访</el-button>
						<el-button type="danger" @click='delate(item.recid)'>删除</el-button>
					</td>
				</tr>
			</tbody>
		</table>
		<div class="pages" v-if="!DataNull" v-show='pages.length'>
			<span>当前页数：[{{pages.length==0?0:pageNumber}}/{{pages.length}}]</span>
			<span class="changepage" @click="firstPage">首页</span>
			<span class="changepage" @click="prePage">上一页</span>
			<span class="changepage" @click="nextPage">下一页</span>
			<span class="changepage" @click="lastPage">末页</span>
			<span>跳到第<input v-model="pagenum" ref='pageNum' class="pagesNum" type="text"  />页</span>
			<button class="go" @click="jampPage">GO</button>
			<span>总共<i>{{this.SearchResult.length==0?this.CustomerList.map(item=>item).length:this.SearchResult.length}}</i>条，共<i>{{pages.length}}</i>页，每页<select name="" v-model="changPagenum" ref='changPage' @change="changPageNum" id=""><option v-for="item of pageListNum">{{item}}</option></select></span>
		</div>
		<div class="whiteSpace" v-if="CustomerList.length==0"></div>
		<AddOne @close='closeAdd' @add-msg='addMsg' :reicd='reicd' v-if='closeAddOne'/>
		<AddMany @close='closeAdd' v-if='closeAddMany' />
		<EditPlan :planId='planId' :defaultPlan='defaultPlan' @close='closeAdd' v-if='closeEditplan' />
	</div>
	
</template>

<script>
	import Vue from 'vue'
	import AddOne from './AddOne'
	import AddMany from './AddMany'
	import EditPlan from './EditPlan'
	import axios from 'axios'
	import qs from 'qs'
	export default{
		name:'CustomerCont',
		components:{
			AddOne,AddMany,EditPlan,
		},
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
	    	}
		},
		data(){
			return{
				sea:false,
				DataNull:false,
				resultNum:[],
				phoneNum:[],
				reicd:0,
				planList:[],
				planId:1,
				defaultPlan:'',
				closeEditplan:false,
				closeAddMany:false,
				closeAddOne:false,
				pageListNum:['5','10','15','20'],
				changPagenum:10,
				pageNumber:1,
				pagenum:1,
				projects:'',
				plans:'',
				keyword:'',
				planStates:'',
				planStatesList:['全部','未计划','等待提交','已提交'],
				checkAll:'',
				checkValue:[],
				tagData:['A','B','C','D','E'],
				CustomerList:[],
				SearchResult:[],
				addTd:'<td>{{bno}}</td><td>{{username}}</td><td>{{remark}}</td><td>{{apprecid}}</td><td>{{batchno}}</td>',
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
			    lasttime: {
			            column: {
			                create_start_date: '',
			                create_end_date: ''
			            },
			        },
			        lastpickerBeginDateBefore:{
			            disabledDate: (time) => {
			                let beginDateVal = this.lasttime.column.create_end_date;
			                if (beginDateVal) {
			                    return time.getTime() > beginDateVal;
			                }
			            }
			        },
			        lastpickerBeginDateAfter:{
			            disabledDate: (time) => {
			                let beginDateVal = this.lasttime.column.create_start_date;
			                if (beginDateVal) {
			                    return time.getTime() < beginDateVal;
			                }
			            }
			        },
			}
		},
		computed:{
			pages(){
				//每页显示数据
		  		const pages = []; // pages是为二维数组
		  		if(!this.SearchResult.length&&this.sea==false){
		  			//初始显示所有数据
		  			this.CustomerList.forEach((item, index) => {
			          const page = Math.floor(index / this.changPagenum); 
			          if (!pages[page]) {
			            pages[page] = [];
			          }
			          pages[page].push(item);
			        });
		  		}else{
		  			//仅显示查询后数据
		  			if(this.SearchResult.length==0){
		  				this.DataNull=true
		  			}else{
		  				this.DataNull=false
		  				this.SearchResult.forEach((item, index) => {
				          const page = Math.floor(index / this.changPagenum); 
				          if (!pages[page]) {
				            pages[page] = [];
				          }
				          pages[page].push(item);
				        });
		  			}
		  			
		  		}
		        
		        return pages;
			},
			
		},
		methods:{
			addMsg(val){
				this.CustomerList.unshift(val)
			},
			firstPage(){
				//数据首页
				this.pageNumber=1
			},
			lastPage(){
				//数据末页
				this.pageNumber=this.pages.length
			},
			jampPage(){
				//数据分页跳转
		  		if(this.$refs.pageNum.value.trim()==''||this.$refs.pageNum.value.trim()>this.pages.length){
		  			this.$message({
		  				message:'页码不存在!',
		  				type:'warning',
		  				center:true
		  				})
		  		}else{
		  			this.pageNumber=this.$refs.pageNum.value.trim()
//		  			this.pagenum=''
		  		}
		  		
		  	},
			prePage(){
				//上一页
				if(this.pageNumber<=1){
		  			this.$message({
		  				message:'已经是第一页了!',
		  				type:'warning',
		  				center:true
		  				})
		  			
		  		}else{
		  			this.pageNumber=this.pageNumber-1
		  		}
			},
			changPageNum(){
				//改变每页数据个数
		  		this.changPagenum=this.$refs.changPage.value.trim()
		  	},
			nextPage(){
				//下一页
				if(this.pageNumber>=this.pages.length){
		  			this.$message({
		  				message:'已经是最后页了!',
		  				type:'warning',
		  				center:true
		  				})
		  		}else{
		  			this.pageNumber=this.pageNumber+1
		  		}
			},
			closeAdd(val){
				this.closeAddOne=val
				this.closeAddMany=val
				this.closeEditplan=val
			},
			openAddOne(){
				this.closeAddOne=true;
			},
			openAddMany(){
				this.closeAddMany=true;
			},
			openEditPlan(id,plan){
				this.closeEditplan=true;
				this.defaultPlan=plan;
				this.planId=id;
//				this.$http.post('http://172.16.10.101:8080/AICALL2018/updateOutnumberinfo',{batchno:plan,recid:id})
//				.then(res=>{
//					console.log(res)
//				})
			},
			getCustomerList(){
				//获取客户列表信息
				this.$http.post('http://172.16.10.101:8080/AICALL2018/getOuttaskSelect')
			   	 .then(res=>{
			   	 	this.planList=res.data
			   	 })
				axios.post('http://172.16.10.101:8080/AICALL2018/queryOutnumberinfoListPage','',{timeout:10000})
				.then((res)=>{
//					console.log(res.data.rows)
					this.CustomerList=res.data.rows;
					this.CustomerList.forEach((item,index)=>{
						this.phoneNum.push(item.bno)
					})
					//获取数据库最后一条的recid
	    			for(let i=0;i<this.CustomerList.length;i++){
	    				var reicd=this.CustomerList[this.CustomerList.length-1].recid;
	    			}
	    			this.reicd=reicd+1;
				})
				.catch(error=>{
					let str=error+''
					if(str.search('timeout')==7){
						this.$message.error('请求超时!');
						this.$store.state.showLoading=false
					}
				})
			},
			delate(id){
				//删除客户
				this.$confirm('确认删除客户, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				    }).then(() => {
				    	//前端删除页面假数据
				    	let data={recid:id}
				    	let delateId=this.CustomerList.filter((item,index)=>{
							return item.recid==id
						})
				    	this.CustomerList.splice(this.CustomerList.indexOf(delateId[0]),1)
						this.$http.post('http://172.16.10.101:8080/AICALL2018/deleteOutnumberinfo',data,{emulateJSON:true}).then(res=>{
				          this.$message({
				            type: 'success',
				            message: '删除成功!'
				          });
				        }).catch(() => {
				          this.$message({
				            type: 'info',
				            message: '已取消删除'
				          });          
				        });
				})
			},
			Search(){
				//查询操作
				this.sea=true;
				var _this=this;
				var arr=[];
				for(let i=0;i<_this.checkValue.length;i++){
					//意向标签不为空时查询获得符合条件的新json数据
					var dat=_this.CustomerList.filter(item=>{
						return item.intentTag==_this.checkValue[i]
					})
					arr=arr.concat(dat);
				}
				if(arr.length==0&&_this.checkValue.length==0){
					//意向标签为空或者无标签匹配时查询分页数据
					arr=this.CustomerList
				}
				if(this.$refs.searchnum.value.trim()==''){
					//号码输入为空时
					this.keyword==1
				}
				let newData=arr.filter(item=>{
					console.log(item.lastCalloutTime)
					let res=item.lastCalloutTime.split('');
					res.splice(4,0,'/');
				    res.splice(7,0,'/');
					res.splice(10,0,' ');
					res.splice(13,0,':');
					res.splice(16,0,':');
					res.toString().replace(/,/g,'')
					let timeRes=res.toString().replace(/,/g,'')
					let time = new Date (timeRes).getTime()//转换时间戳
					let lastTimeIfnull=false;
					let now=new Date().getTime()
					if(_this.lasttime.column.create_start_date==''&&_this.lasttime.column.create_end_date!=''){
						//通话开始时间为空结束时间不为空
						Number(_this.lasttime.column.create_start_date)==0
					}
					if(_this.lasttime.column.create_end_date==''&&_this.lasttime.column.create_start_date!=''){
						//结束时间为空开始时间不为空
						_this.lasttime.column.create_end_date=now
					}
					if(Number(_this.lasttime.column.create_start_date)==0&&Number(_this.lasttime.column.create_end_date)==0){
						//时间都为空
						lastTimeIfnull=true
					}
					let rest=item.batchdate.split('');
					rest.splice(4,0,'/');
				    rest.splice(7,0,'/');
					rest.splice(10,0,' ');
					rest.splice(13,0,':');
					rest.splice(16,0,':');
					rest.toString().replace(/,/g,'')
					let timeRest=res.toString().replace(/,/g,'')
					let times = new Date (timeRest).getTime()//转换时间戳
					let addTimeIfnull=false;
					if(_this.lasttime.column.create_start_date==''&&_this.lasttime.column.create_end_date!=''){
						//添加开始时间为空结束时间不为空
						Number(_this.lasttime.column.create_start_date)==0
					}
					if(_this.lasttime.column.create_end_date==''&&_this.lasttime.column.create_start_date!=''){
						//添加结束时间为空开始时间不为空
						_this.lasttime.column.create_end_date=now
					}
					if(Number(_this.lasttime.column.create_start_date)==0&&Number(_this.lasttime.column.create_end_date)==0){
						//添加时间都为空
						addTimeIfnull=true
					}
					return item.bno.substring(0,_this.keyword.length).indexOf(_this.keyword)>=0&&(lastTimeIfnull==true?item.lastCalloutTime:time>=Number(_this.lasttime.column.create_start_date)&&time<=Number(_this.lasttime.column.create_end_date)+86400000)&&(addTimeIfnull==true?item.batchdate:time>=Number(_this.addtime.column.create_start_date)&&time<=Number(_this.addtime.column.create_end_date)+86400000)
				})
				this.SearchResult=newData;
				console.log(this.SearchResult)
			},
			checkedAll(){
				//意向标签的全选与反选
				this.checkAll=!this.checkAll
				if(!this.checkAll){
					this.checkValue=[]
				}else{
					this.checkValue=[]
					this.tagData.forEach(item=>{
						this.checkValue.push(item)
					})
				}
			}
		},
		watch:{
			checkValue(){
				//监听意向标签
				if (this.checkValue.length === this.tagData.length) {
                    this.checkAll = true;
                } else {
                    this.checkAll = false;
                }
			},
			CustomerList(){
				this.CustomerList.map(item=>item)
			},
			keyword () {
		      if (this.timer) {
		        clearInterval(this.timer)
		      }
		      if (!this.keyword) {
		        this.list = []
		        return
		      }
		      this.timer = setTimeout(() => {
		      	  this.list = []//号码模糊查询数据
		          this.phoneNum.forEach((value,index) => {
		          	let valSub=value.substring(0,this.keyword.length)
		            if (valSub.indexOf(this.keyword) > -1 ) {
		               this.list.push(value)
		            }
		          })
		          this.resultNum=this.list
		      }, 100)
		    }
			
		},
		created(){
			this.getCustomerList();
		}
	}
</script>

<style scoped>
	*{
		padding: 0;
		margin: 0;
		list-style: none;
	}
	.customerList{
		font-size: 16px;
		color: #39afea;
		border-bottom: 1px solid #e6e6e6;
		height: 4vh;
		line-height: 4vh;
		margin: 0 10px;
		text-indent: 20px;
	}
	.customerList .el-button{
		float: right;
		height: 3vh;
		margin-top: .5vh;
		margin-right: 1vh;
		padding: 5px 10px;
	}
	.msgCont{
		border: 1px solid #cacaca;
		margin: 12px 10px;
		font-size: 14px;
		padding-bottom: 5px;
	}
	.msgCont tr{
		margin: 0 auto;
		font-size: 14px;
	}
	.msgCont td{
		width: 320px;
		padding: 3px 0px;
		height: 30px;
		line-height: 30px;
		font-size: 14px;
	}
	.msgCont .tag{
		padding-left: 5vh;
		width: 150px;
		text-align: center;
	}
	.msgCont input[type='checkbox']{
		width: 30px;
		
	}
	.selectCont{
		width: 100%;
		margin: 0 auto;
		border-collapse: collapse;
	}
	.selectCont span{
		color: blue;
	}
	tbody{
		display: block;
		overflow-y: auto;
		height: 61.5vh;
	}
	thead,table tbody tr {
        display: table;
        width: 100%;
        border-bottom: 1px solid #e6e6e6;
        table-layout: fixed;
        text-align: center;
    }
	.selectCont th{
		background: #d0e9f3;
		font-weight: normal;
		font-size: 14px;
		height: 40px;
		line-height: 40px;
	}
	.pages{
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Chrome/Safari/Opera */
		-khtml-user-select: none; /* Konqueror */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently
		not supported by any browser */
		background: #d0e9f3;
		height: 45px;
		line-height: 45px;
		text-indent: 35vh;
		font-size: 14px;
		position: fixed;
		bottom: 0;
		width: 100%;
	}
	.pages i{
		font-style: normal;
		color: red;
	}
	.pagesNum{
		width: 30px;
		height: 20px;
		text-align: center;
		border: #e4e6eb 1px solid;
	}
	.selectCont tbody tr:hover{
		background: #d0e9f3 !important;
	}
	.selectCont td{
		box-sizing: border-box;
		text-align: center;
		font-size: 14px;
		color: #383e4b;
		height: 48px;
		line-height: 48px;
	}
	.search{
		width: 92%;
		margin-left: 8%;
		height: 100%;
	}
	.dosomething button{
		margin: 0;
		padding: 5px;
		font-size: 12px;
	}
	.whiteSpace{
		height: 75vh;
	}
	.changepage:hover{
		color: blue;
	}
	.changepage{
		border-right: 1px solid;
		padding-right: 3px;
		cursor: pointer;
	}
</style>