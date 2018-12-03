<template>
	<div class="slide_cont">
		<h2 class="callout">拨出记录</h2>
		<div class="msgCont">
			<form action="">
				<table>
					<tr>
						<td class="tag">被查号码</td>
						<td><el-input
							  v-model='keyword'
							  placeholder="支持模糊搜索"
							  ref='searchnum'
							  clearable>
							</el-input>
						</td>
						<td class="tag">开始时间</td>
						<td><el-date-picker
									class='widfull'
						            v-model="filters.column.create_start_date"
						            type="date"
						            :picker-options="pickerBeginDateBefore"
						            format="yyyy-MM-dd"
						            placeholder="">
						    </el-date-picker>
						</td>
					</tr>
					<tr>
						<td class="tag">结束时间</td>
						<td><el-date-picker
									class='widfull'
						            v-model="filters.column.create_end_date"
						            type="date"
						            format="yyyy-MM-dd"
						            :picker-options="pickerBeginDateAfter"
						            placeholder="">
						    </el-date-picker>
						</td>
						<td class="tag">通话时长</td>
						<td>
							<el-select v-model="optionDuraValue" class='widfull' @change='changeDura' placeholder="不限">
								<el-option v-for='item of optionDura' :value='item'>
								{{item}}
								</el-option>
							</el-select>
						</td>
					</tr>
					<tr>
						<td class="tag">任务计划</td>
						<td>
							<el-select @change="changePlan" v-model="planValue"class='widfull' placeholder="请选择计划">
								<el-option v-for='item of plan' :value="item">
								{{item}}
								</el-option>
							</el-select>
						</td>
						<td class="tag">呼叫结果</td>
						<td>
							<el-select @change="callRes" v-model="resultValue"class='widfull' placeholder="--请选择--">
								<el-option v-for='item of callResult' :value='item'>
								{{item}}
								</el-option>
							</el-select>
						</td>
					</tr>
					<tr>
						<td class="tag">意向标签</td>
						<td class="quan">
							<label for="all"><input v-model="checkAll" type="checkbox" @click="checkedAll"  id="all" />所有</label>
							<label v-for="item of tagData" :for="item"><input  :value="item" @click="check($event)" v-model="checkValue" type="checkbox" name="" :id="item" />{{item}}</label>
						</td>
						<td class="tag">对话轮次</td>
						<td><el-input
							v-model='calltimes'
							class='calltimes'
							ref='callround'
							  clearable>
							</el-input><el-button @click='Search' class='search' type="primary" icon="el-icon-search">查询</el-button></td>
					</tr>
		</table>
			</form>
		</div>
		<p v-for="item of list">{{item}}</p>
		<table class="selectCont" v-for="(page,index) of pages" >
			<tr v-if="index+1==pageNumber">
				<th>被叫信息</th>
				<th>对应计划</th>
				<th>意向标签</th>
				<th>对话轮次</th>
				<th>呼叫时间</th>
				<th>通话时长</th>
				<th>使用线路</th>
				<th>呼叫结果</th>
				<th>操作</th>
			</tr>
			<tr v-for="SearchList of page" v-if="index+1==pageNumber">
				<td>{{SearchList.bno}}</td>
				<td></td>
				<td>{{SearchList.intentTag}}</td>
				<td>{{SearchList.talkRound}}</td>
				<td>{{SearchList.outbegintime}}</td>
				<td>0<span class="mint">分</span>{{SearchList.outduration}}<span class="mint">秒</span></td>
				<td>{{SearchList.lineNumber}}</td>
				<td>{{SearchList.outresult}}</td>
				<td class="details" @click="showDetail($event)" :id='SearchList.recid'>详情</td>
			</tr>
		</table>
		<div class="pages" >
			<span>当前页数：[{{pageNumber}}/{{pages.length}}]</span>
			<span class="changepage" @click="firstPage">首页</span>
			<span class="changepage" @click="prePage">上一页</span>
			<span class="changepage" @click="nextPage">下一页</span>
			<span class="changepage" @click="lastPage">末页</span>
			<span>跳到第<input v-model="pagenum" ref='pageNum' class="pagesNum" type="text"  />页</span>
			<button @click="jampPage" class="go">GO</button>
			<span>总共1条，共1页，每页<select name="" v-model="changPagenum" ref='changPage' @change="changPageNum" id=""><option v-for="item of pageListNum">{{item}}</option></select></span>
		</div>
		<!--<Datails @close='closeDetail' v-if='detail_onoff' />-->
		<NumDatails @close='closeDetail' v-if='detail_onoff' :detail_data='detail_data' />
	</div>
</template>

<script>
	import Datails from './datails'
	import NumDatails from './number_detail'
	import qs from 'qs'
	import axios from 'axios'
	export default{
		name:'slide_cont',
		components:{
			Datails,NumDatails
		},
		data(){
			    return {
			    	pagenum:1,
			    	changPagenum:10,
			    	pageNumber:1,
			    	pageListNum:['5','10','15','20'],
			    	checkAll:false,
			    	checkData:[],
			    	tagData:['A','B','C','D','E'],
			    	detail_onoff:false,
			    	checkValue:[],
			    	value:'',
			    	//通话起止时间
			        filters: {
			            column: {
			                create_start_date: '',
			                create_end_date: ''
			            },
			        },
			        pickerBeginDateBefore:{
			            disabledDate: (time) => {
			                let beginDateVal = this.filters.column.create_end_date;
			                if (beginDateVal) {
			                    return time.getTime() > beginDateVal;
			                }
			            }
			        },
			        pickerBeginDateAfter:{
			            disabledDate: (time) => {
			                let beginDateVal = this.filters.column.create_start_date;
			                if (beginDateVal) {
			                    return time.getTime() < beginDateVal;
			                }
			            }
			        },
			        druChecked:'',
			        planChecked:'',
			        callresult:'',
			        optionDura:['30','60','90','120'],
			        optionDuraValue:'',
			        plan:['aaaa','sssss','xxxxx'],
			        planValue:'',
			        callResult:['成功','未接通','挂断'],
			        resultValue:'',
			        keyword:'',
			        calltimes:'',
			        //分页查询数据
			        formData:{
			        	rows:[],
				        pageCount:'',
				        size:'',
				        numSearch:'',
			        },
			        searchResult:{
			        	phoneNumber:[],
				        pageCount:'',
				        size:'',
			        },
			        detail_data:{},
			        list:[]
			    }
		},
		computed:{
			checktag(){
				//意向标签选择
				return this.checkValue.map(item => item);
			},
//			searchNum(){
//				if(this.keyword===''){
//					return this.keyword
//				}else{
//					var numRes=[];
//					for(let i=0;i<this.formData.rows.length;i++){
//						if(this.formData.rows[i].bno.indexOf(this.keyword)>-1){
//							numRes.push(this.formData.rows[i])
//						}
//						console.log(numRes[i].bno)
//					}
//					
//					return numRes
//				}
//			},
			pages(){
				//每页显示数据
		  		const pages = []; // pages是为二维数组
		        this.formData.rows.forEach((item, index) => {
		          const page = Math.floor(index / this.changPagenum); 
		          if (!pages[page]) {
		            pages[page] = [];
		          }
		          pages[page].push(item);
		        });
		        console.log(pages)
		        return pages;
		  	}
		},
		methods:{
			jampPage(){
				//数据分页跳转
		  		if(this.$refs.pageNum.value.trim()==''||this.$refs.pageNum.value.trim()>this.pages.length){
		  			return
		  		}else{
		  			this.pageNumber=this.$refs.pageNum.value.trim()
		  			this.pagenum=''
		  		}
		  		
		  	},
			changPageNum(){
				//改变每页数据个数
		  		this.changPagenum=this.$refs.changPage.value.trim()
		  		console.log(this.changPagenum)
		  	},
			firstPage(){
				//数据首页
				this.pageNumber=1
			},
			lastPage(){
				//数据末页
				this.pageNumber=this.pages.length
			},
			prePage(){
				if(this.pageNumber==1){
		  			return
		  		}else{
		  			this.pageNumber=this.pageNumber-1
		  		}
			},
			nextPage(){
				if(this.pageNumber==this.pages.length){
		  			return
		  		}else{
		  			this.pageNumber=this.pageNumber+1
		  		}
			},
			closeDetail(val){
				console.log(val)
				this.detail_onoff=val
			},
			showDetail(event){
				//查看详情
				var el = event.currentTarget;
				var id=el.id
				console.log(id)
				this.detail_onoff=true;
//				axios({
//					method:'post',
//					url:'http://172.16.1.101:8080/AICALL2018/getSheetRecordByRecId',
//					data: {recid:id}
//				}).then((data)=>{
//					console.log(data)
//				})


				this.$http.post('http://172.16.1.101:8080/AICALL2018/getSheetRecordByRecId',{
					recid:id
				}, {
	              emulateJSON: true
	            }).then((data)=>{
	            	this.detail_data=data.body;
//	            	console.log(this.detail_data)
	            })
			},
			Search(){
				//查询匹配操作
				this.formData.rows.forEach((value,index)=>{
					this.searchResult.phoneNumber.push(value.bno)
				})
				var fool=this.searchResult.phoneNumber.filter(
					function(item){
						return item<16666666666
					}
				)
				console.log(fool)
//				console.log(this.$refs.callround.value.trim())
//				console.log(this.checktag)
//				console.log(this.$refs.searchnum.value.trim())
//				console.log(this.formData.rows)
//				console.log(Number(this.filters.column.create_start_date))
//				console.log(Number(this.filters.column.create_end_date))
//				console.log(this.druChecked)
//				console.log(this.planChecked)
//				console.log(this.callresult);
			},
			changeDura(val){
				//通话时间
				this.druChecked=val
			},
			callRes(val){
				this.callresult=val
			},
			changePlan(val){
				//对应计划
				this.planChecked=val
			},
			getListPages(){
				//获取分页数据
				var data = qs.stringify({
				  currentPage: "0",
				  pageSize: "20",
				  type: "1",
				});
				axios.post('http://172.16.1.101:8080/AICALL2018/queryOutresultinfoListPage', data)
				.then((res)=>{
					res=res.data;
					console.log(res)
					this.formData.pageCount=res.pageCount
					this.formData.size=res.size
					this.formData.rows=res.rows
					this.formData.query1 = this.$refs.searchnum.value.trim();
					console.log(this.formData.query1)
					})
				.catch(function (error) {
					console.log(error)
				});
				
			},
			checkedAll(){
				//意向标签全选
				var _this = this;
				this.checkAll=!this.checkAll
                if (!_this.checkAll) { //实现反选
                    _this.checkValue = [];
                } else { //实现全选
                    _this.checkValue = [];
                    this.tagData.forEach(function(item, index) {
                        _this.checkValue.push(item);
                        
                    });
                }
            },
			check(e){
				if(e.target.checked){
					console.log(e.target.defaultValue)
				}
				
			}
		},
		watch:{
			'checkValue': {
                handler: function(val, oldVal) {
                    if (val.length === this.tagData.length) {
                        this.checkAll = true;
                    } else {
                        this.checkAll = false;
                    }
                },
                deep: true
            },
            keyword () {
//          	console.log(this.$refs.searchnum.value.trim())
		      if (this.timer) {
		        clearInterval(this.timer)
		      }
		      if (!this.keyword) {
		        this.list = []
		        return
		      }
		      this.timer = setTimeout(() => {
		        const result = []
		        for (let i in this.searchResult.phoneNumber) {
		          this.searchResult.phoneNumber.forEach((value) => {
		            if (value.indexOf(this.keyword) > -1 ) {
		              result.push(value)
		            }
		          })
		        }
		        this.list = result
		      }, 100)
		      console.log(this.list)
		    }
		},
		mounted(){
				this.getListPages();
			},
	}
</script>

<style scoped>
	*{
		padding: 0;
		margin: 0;
		list-style: none;
	}
	.slide_cont{
	}
	.callout{
		font-size: 14px;
		color: #39afea;
		border-bottom: 1px solid #e6e6e6;
		padding: 17px 0px ;
		margin: 0 10px;
		text-indent: 20px;
	}
	.msgCont{
		border: 1px solid #cacaca;
		margin: 12px 10px;
		font-size: 12px;
	}
	.msgCont td{
		width: 320px;
		padding: 6px 0px;
		height: 30px;
		line-height: 30px;
	}
	.msgCont .tag{
		width: 254px;
		text-align: center;
	}
	.widfull{
		width: 100%;
		height: 40px;
		box-sizing: border-box;
		border-radius: 5px;
		border: 1px solid gainsboro;
	}
	.widfull input{
		height: 30px;
	}
	label{
		
	}
	.msgCont input[type='checkbox']{
		width: 30px;
		
	}
	.selectCont{
		width: 100%;
		margin: 0 auto;
		border-collapse: collapse;
	}
	.selectCont th{
		background: #edf8fe;
		font-weight: normal;
		font-size: 12px;
		height: 40px;
		line-height: 40px;
	}
	.search{
		width: 65px;
		height: 40px;
		background: #36a9e1;
	}
	.calltimes{
		width: 250px;
		height: 36px;
		margin-right: 5px;
	}
	.selectCont td{
		text-align: center;
		font-size: 12px;
		color: #383e4b;
		height: 48px;
		line-height: 48px;
	}
	.pages{
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Chrome/Safari/Opera */
		-khtml-user-select: none; /* Konqueror */
		-moz-user-select: none; /* Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently
		not supported by any browser */
		background: #edf8fe;
		height: 40px;
		line-height: 40px;
		margin: 0 auto;
		text-align: center;
		font-size: 12px;
	}
	.details{
		cursor: pointer;
	}
	.go{
		height: 26px;
		width: 32px;
		background: #2092c1;
		border: none;
		color: white;
		outline: none;
		cursor: pointer;
		border-radius: 3px;
	}
	.mint{
		color: blue;
	}
	.pagesNum{
		width: 30px;
		height: 20px;
		text-align: center;
		border: #e4e6eb 1px solid;
	}
	.changepage{
		border-right: 1px solid;
		padding-right: 3px;
		cursor: pointer;
	}
</style>