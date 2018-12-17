<template>
	<div class="slide_cont" v-loading="$store.state.showLoading" element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
		<h2 class="callout">拨出记录</h2>
		<div class="msgCont" @keyup.enter='Search'>
				<table>
					<tr>
						<td class="tag">被查号码</td>
						<td><el-input
							    v-model='keyword'
							    placeholder="支持模糊搜索"
							    auto-complete='on'
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
								<el-option value="">不限</el-option>
								<el-option v-for='item of optionDura' :value='item' :key='item'>
								小于{{item}}秒
								</el-option>
							</el-select>
						</td>
					</tr>
					<tr>
						<td class="tag">任务计划</td>
						<td>
							<el-select @change="changePlan" v-model="planValue"class='widfull' placeholder="请选择计划">
								<el-option v-for='item of plan' :value="item" :key='item'>
								{{item}}
								</el-option>
							</el-select>
						</td>
						<td class="tag">呼叫结果</td>
						<td>
							<el-select @change="callRes" v-model="resultValue"class='widfull' placeholder="--请选择--">
								<el-option v-for='item of callResult' :value='item' :key='item'>
								{{item}}
								</el-option>
							</el-select>
						</td>
					</tr>
					<tr>
						<td class="tag">意向标签</td>
						<td class="quan">
							<label for="all"><input v-model="checkAll" type="checkbox" @click="checkedAll"  id="all" />所有</label>
							<label v-for="item of tagData" :for="item"><input @click="fn"  :value="item"  v-model="checkValue" type="checkbox" name="" :id="item" />{{item}}</label>
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
	</div>
		<p v-show="DataNull" class="dataNull">无 匹 配 数 据 !</p>
		<table  class="selectCont" v-for="(page,index) of pages" >
			<thead>
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
			</thead>
			<tbody v-if="index+1==pageNumber">
				<tr v-for="(SearchList,indexSea) of page" :style="indexSea%2==0?'background:white':'background:#edf8fe'">
					<td >{{SearchList.bno}}</td>
					<td ></td>
					<td >{{SearchList.intentTag}}</td>
					<td >{{SearchList.talkRound}}</td>
					<td >{{SearchList.outbegintime|fn}}</td>
					<td ><span>{{SearchList.outduration|mint}}</span>分<span>{{SearchList.outduration|sec}}</span>秒</td>
					<td >{{SearchList.lineNumber}}</td>
					<td >{{SearchList.outresult}}</td>
					<td  class="details" @click="showDetail($event)" :id='SearchList.recid'>详情</td>
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
			<button @click="jampPage" class="go">GO</button>
			<span>总共<i>{{this.result.length==0?this.formData.rows.length:this.result.length}}</i>条，共<i>{{pages.length}}</i>页，每页<select name="" v-model="changPagenum" ref='changPage' @change="changPageNum" id=""><option v-for="item of pageListNum">{{item}}</option></select></span>
		</div>
		<!--<Datails @close='closeDetail' v-if='detail_onoff' />-->
		<NumDatails @close='closeDetail' v-if='detail_onoff' :txtArr='txtArr' :detail_onoff='detail_onoff' :detail_data='detail_data' />
		<div class="whiteSpace" v-if="formData.rows.length==0"></div>
	</div>
</template>

<script>
	Vue.directive('drag',function(el){
            let oDiv = el;   //当前元素
                let self = this;  //上下文
                oDiv.onmousedown = function (e,binding) {
                 //鼠标按下，计算当前元素距离可视区的距离
                    let disX = e.clientX - oDiv.offsetLeft;
                    let disY = e.clientY - oDiv.offsetTop;

                    document.onmousemove = function (e) {
                      //通过事件委托，计算移动的距离 
                        let l = e.clientX - disX;
                        let t = e.clientY - disY;
                      //移动当前元素  
                        oDiv.style.left = l+600 + 'px';
                        oDiv.style.top = t+350 + 'px';
                         //将此时的位置传出去
//                      binding.value({x:e.pageX,y:e.pageY})
                    };
                    document.onmouseup = function (e) {
                    
                        document.onmousemove = null;
                        document.onmouseup = null;
                     };
        }
	})
	import Vue from 'vue'
	import NumDatails from './number_detail'
	import qs from 'qs'
	import axios from 'axios'
	export default{
		name:'slide_cont',
		components:{
			NumDatails
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
	    	},
	    	mint(s){
	    		//换算分
	    		let m;
	    		m = Math.floor(s/60);
	    		s = s%60;
	    		m += '';
	    		s += '';
	    		m = (m.length==1)?'0'+m:m;
    			s = (s.length==1)?'0'+s:s;
	    		return m
	    	},
	    	sec(s){
	    		//换算秒
	    		s = s%60;
	    		s += '';
    			s = (s.length==1)?'0'+s:s;
	    		return s
	    	},
	    	intentTag(val){
	    		switch(val){
	    			case 'A':return "意向强烈"
	    			break;
	    			case 'B':return "有意向"
	    			break;
	    			case 'C':return "待定"
	    			break;
	    			case 'D':return "潜在客户"
	    			break;
	    			case 'E':return "无意向"
	    			break;
	    		}
	    	},
	    	outresult(val){
	    		switch(val){
	    			case '-1':return '未接通'
	    			break;
	    			case '0':return '挂断'
	    			break;
	    			case '1':return '成功'
	    			break;
	    			case '2':return '待定'
	    			break;
	    		}
	    	}
	    },
		data(){
			    return {
			    	DataNull:false,
			    	sea:false,
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
			        formData:{ //分页查询数据
			        	rows:[],
				        pageCount:'',
				        size:'',
				        numSearch:'',
			        },
			        searchResult:{//查询后新数据存放
			        	phoneNumber:[],
			        	outduration:[],
			        	lineNumber:[],
			        	outresult:[],
				        pageCount:'',
				        size:'',
				        intentTag:[],
			        	talkRound:[],
			        	outbegintime:[],
			        	rows:[]
			        },
			        result:[],
			        detail_data:{},
			        list:[],
			        txtArr:[]
			    }
		},
		computed:{
			checktag(){
				//意向标签选择
				return this.checkValue.map(item => item);
			},
			pages(){
				//每页显示数据
		  		const pages = []; // pages是为二维数组
		  		if(!this.result.length&&this.sea==false){
		  			//初始显示所有数据
		  			this.formData.rows.forEach((item, index) => {
			          const page = Math.floor(index / this.changPagenum); 
			          if (!pages[page]) {
			            pages[page] = [];
			          }
			          pages[page].push(item);
			        });
		  		}else{
		  			//仅显示查询后数据
		  			if(this.result.length==0){
		  				this.DataNull=true
		  			}else{
		  				this.DataNull=false
		  				this.result.forEach((item, index) => {
				          const page = Math.floor(index / this.changPagenum); 
				          if (!pages[page]) {
				            pages[page] = [];
				          }
				          pages[page].push(item);
				        });
		  			}
		  			
		  		}
		        
		        return pages;
		  	}
		},
		methods:{
			fn(){
//				console.log(this.checkValue)
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
			changPageNum(){
				//改变每页数据个数
		  		this.changPagenum=this.$refs.changPage.value.trim()
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
			nextPage(){
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
			closeDetail(val){
				this.detail_onoff=val
			},
			showDetail(event){
				//查看详情
				var el = event.currentTarget;
				var id=el.id
				var _this=this;
				this.$http.post('http://172.16.10.101:8080/AICALL2018/getSheetRecordByRecId',{
					recid:id
				}, {
	              emulateJSON: true
	           }).then((data)=>{
	            	_this.detail_data=data.body;
	            	var str = _this.detail_data.magicCode;
	            	var arr = str.split('|');
	            	_this.detail_onoff=true;
	            	_this.txtArr=arr
	            })
			},
			Search(){
				this.sea=true;
				var _this=this;
				var arr=[];
				for(let i=0;i<_this.checkValue.length;i++){
					//意向标签不为空时查询获得符合条件的新json数据
					var dat=_this.formData.rows.filter(item=>{
						return item.intentTag==_this.checkValue[i]
					})
					arr=arr.concat(dat);
				}
				if(arr.length==0&&_this.checkValue.length==0){
					//意向标签为空或者无标签匹配时查询分页数据
					arr=this.formData.rows
				}
				if(this.$refs.searchnum.value.trim()==''){
					//号码输入为空时
					this.keyword==1
				}
				
				let newData=arr.filter(item=>{
					let callRes=false;
					if(_this.callresult!=''){
						callRes=true
					}
					let numRes=item.bno;
					let phoneNum=numRes.substring(0,_this.keyword.length).indexOf(_this.keyword)//号码模糊搜索
					let res=item.outbegintime.split('');
					res.splice(4,0,'/');
				    res.splice(7,0,'/');
					res.splice(10,0,' ');
					res.splice(13,0,':');
					res.splice(16,0,':');
					res.toString().replace(/,/g,'')
					let timeRes=res.toString().replace(/,/g,'')
					let time = new Date (timeRes).getTime()//转换时间戳
					let timeIfnull=false;
					let duratime=_this.druChecked;
					let now=new Date().getTime()
					if(_this.filters.column.create_start_date==''&&_this.filters.column.create_end_date!=''){
						//通话开始时间为空结束时间不为空
						Number(_this.filters.column.create_start_date)==0
					}
					if(_this.filters.column.create_end_date==''&&_this.filters.column.create_start_date!=''){
						//结束时间为空开始时间不为空
						_this.filters.column.create_end_date=now
					}
					if(Number(_this.filters.column.create_start_date)==0&&Number(_this.filters.column.create_end_date)==0){
						//时间都为空
						timeIfnull=true
					}
					return item.bno.substring(0,_this.keyword.length).indexOf(_this.keyword)>=0&&(this.$refs.callround.value.trim()==''?item.talkRound:item.talkRound==this.$refs.callround.value.trim())&&(timeIfnull==true?item.outbegintime:time>=Number(_this.filters.column.create_start_date)&&time<=Number(_this.filters.column.create_end_date)+86400000)&&(Number(duratime)==0?item.outduration:Number(duratime)>=item.outduration)
				});
//				console.log(newData)
				this.result=newData;
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
				axios.post('http://172.16.10.101:8080/AICALL2018/queryOutresultinfoListPage', data,{timeout:10000})
				.then((res)=>{
					res=res.data;
//					console.log(res)
					this.formData.pageCount=res.pageCount
					this.formData.size=res.size
					this.formData.rows=res.rows
					var _this=this;
					_this.formData.rows.forEach((value,index)=>{
						_this.searchResult.phoneNumber.push(value.bno)
					})
					})
				.catch((error)=>{
					let str=error+''
					if(str.search('timeout')==7){
						this.$message.error('请求超时!');
						this.$store.state.showLoading=false
					}
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
		      if (this.timer) {
		        clearInterval(this.timer)
		      }
		      if (!this.keyword) {
		        this.list = []
		        return
		      }
		      this.timer = setTimeout(() => {
		      	  this.list = []//号码模糊查询数据
		          this.searchResult.phoneNumber.forEach((value,index) => {
		          	let valSub=value.substring(0,this.keyword.length)
		            if (valSub.indexOf(this.keyword) > -1 ) {
		               this.list.push(value)
		            }
		          })
		          this.result.phoneNumber=this.list
		      }, 100)
		    }
		},
		created(){
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
		position: relative;
	}
	.callout{
		font-size: 16px;
		color: #39afea;
		border-bottom: 1px solid #e6e6e6;
		height: 4vh;
		line-height: 4vh;
		margin: 0 10px;
		text-indent: 20px;
	}
	.dataNull{
		text-align: center;
		height: 40px;
		line-height: 40px;
		font-size: 18px;
		color: red;
	}
	.msgCont{
		border: 1px solid #cacaca;
		margin: 12px 10px;
		font-size: 14px;
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
	.widfull{
		height: 30px;
		box-sizing: border-box;
		border-radius: 5px;
		border: 1px solid gainsboro;
	}
	.widfull input{
		height: 30px;
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
	.search{
		width: 7vh;
		height: 30px;
		background: #36a9e1;
	}
	.calltimes{
		width: 37vh;
		height: 36px;
		margin-right: 1vh;
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
	.details{
		cursor: pointer;
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
	.changepage:hover{
		color: blue;
	}
	.changepage{
		border-right: 1px solid;
		padding-right: 3px;
		cursor: pointer;
	}
	.whiteSpace{
		height: 75vh;
	}
</style>