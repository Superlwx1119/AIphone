<template>
	<div class="callPlan">
		<h2 class="callPlanHeader">呼叫计划<el-button @click='' type="success"><i class="el-icon-upload2 el-icon--right"></i>启动所有计划</el-button><el-button @click='addplan' type="primary" icon="el-icon-plus">新建计划</el-button></h2>
		<div class="callCont">
			<table>
				<tr>
					<td class="tag">计划名称</td>
					<td>
						<el-input
						    v-model='keyword'
						    placeholder="任务批次,支持模糊搜索"
						    ref='searchnum'
						    clearable>
						</el-input>
					</td>
					<td class="tag">计划状态</td>
					<td>
						<el-select v-model="plans" placeholder="全部">
							<el-option value="">全部</el-option>
							</el-option>
						</el-select>
					</td>
					<td><el-button class='search' type="primary" icon="el-icon-search">查询</el-button></td>
				</tr>
			</table>
		</div>
		<table class="planSelectCont">
			<thead>
				<tr>
					<th>计划名称</th>
					<th>任务状态</th>
					<th>号码总数</th>
					<th>未呼叫数</th>
					<th>呼叫成功数</th>
					<th>呼叫失败数</th>
					<th>创建时间</th>
					<th>短信标志</th>
					<th>时段</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="item of planList">
					<td>{{item.batchno}}</td>
					<td>222222</td>
					<td>333333</td>
					<td>444444</td>
					<td>555555</td>
					<td>666666</td>
					<td>777777</td>
					<td>888888</td>
					<td>999999</td>
					<td class="dosomething">
						<el-button type="primary">启动</el-button>
						<el-button type="success">停止</el-button>
						<el-button type="danger">删除</el-button>
					</td>
				</tr>
			</tbody>
		</table>
		<div class="pages">
			<span>当前页数：[1/2]</span>
			<span class="changepage">首页</span>
			<span class="changepage">上一页</span>
			<span class="changepage">下一页</span>
			<span class="changepage">末页</span>
			<span>跳到第<input v-model="pagenum" ref='pageNum' class="pagesNum" type="text"  />页</span>
			<button class="go">GO</button>
			<span>总共<i>2</i>条，共<i>3</i>页，每页<select name="" v-model="changPagenum" ref='changPage' ><option v-for="item of pageListNum">{{item}}</option></select></span>
		</div>
		<addPlan v-if='closeAdd' @close='closeadd'/>
	</div>
</template>

<script>
	import axios from 'axios'
	import addPlan from './addPlan'
	export default{
		name:'callPlan',
		data(){
			return{
				closeAdd:false,
				pagenum:1,
				ss:3,
				changPagenum:10,
				keyword:'',
				plans:'',
				planList:[],
				pageListNum:['5','10','15','20']
			}
		},
		components:{
			addPlan
		},
		methods:{
			addplan(){
				this.closeAdd=true
			},
			closeadd(val){
				this.closeAdd=val
			},
			getOuttaskListPage(){
				//获取计划列表
				axios.post('http://172.16.10.101:8080/AICALL2018/queryOuttaskListPage','')
				.then(res=>{
					console.log(res.data.rows)
					this.planList=res.data.rows
				})
			}
		},
		created(){
			this.getOuttaskListPage();
		}
	}
</script>

<style scoped>
	*{
		padding: 0;
		margin: 0;
		list-style: none;
	}
	.callPlanHeader{
		font-size: 16px;
		color: #39afea;
		border-bottom: 1px solid #e6e6e6;
		height: 4vh;
		line-height: 4vh;
		margin: 0 10px;
		text-indent: 20px;
	}
	.callPlanHeader .el-button{
		float: right;
		height: 3vh;
		margin-top: .5vh;
		margin-right: 1vh;
		padding: 5px 10px;
	}
	.callCont .tag{
		padding-left: 5vh;
		width: 150px;
		text-align: center;
	}
	.callCont{
		border: 1px solid #cacaca;
		margin: 12px 10px;
		font-size: 14px;
		padding-bottom: 5px;
	}
	.callCont tr{
		margin: 0 auto;
		font-size: 14px;
	}
	.callCont td{
		width: 320px;
		padding: 3px 0px;
		height: 30px;
		line-height: 30px;
		font-size: 14px;
	}
	.search{
		width: 7vh;
		height: 30px;
		background: #36a9e1;
	}
	.planSelectCont{
		width: 100%;
		margin: 0 auto;
		border-collapse: collapse;
	}
	.planSelectCont span{
		color: blue;
	}
	tbody{
		display: block;
		overflow-y: auto;
		height: 74vh;
	}
	thead,table tbody tr {
        display: table;
        width: 100%;
        border-bottom: 1px solid #e6e6e6;
        table-layout: fixed;
        text-align: center;
    }
	.planSelectCont th{
		background: #d0e9f3;
		font-weight: normal;
		font-size: 14px;
		height: 40px;
		line-height: 40px;
	}
	.planSelectCont tbody tr:hover{
		background: #d0e9f3 !important;
	}
	.planSelectCont td{
		box-sizing: border-box;
		text-align: center;
		font-size: 14px;
		color: #383e4b;
		height: 48px;
		line-height: 48px;
	}
	.dosomething button{
		margin: 0;
		padding: 5px;
		font-size: 12px;
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
</style>