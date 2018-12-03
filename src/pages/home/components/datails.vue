<template>
	<div class="detailsBody">
		<div class="detail">
			<div class="detailHeader">
				<p>详情</p>
				<i @click="closeDetail"  class="el-icon-circle-close-outline"></i>
			</div>
			<div class="screen">
				<el-select class='screenWid'  v-model="callState"  placeholder="请选择状态">
					<el-option v-for='item of callStates' :value="item">
					{{item}}
					</el-option>
				</el-select>
				<el-select class='screenWid'  v-model="online" >
					<el-option v-for='item of onlines' :value="item">
					{{item}}
					</el-option>
				</el-select><br />
				<el-input class='screenWid'
				  placeholder="请输入完整的手机号"
				  clearable>
				</el-input>
				<el-input class='screenWid'
				  placeholder="请输入时长下限(秒)"
				  clearable>
				</el-input>
				<el-date-picker
			            v-model="filters.column.create_start_date"
			            type="date" class='screenWid'
			            :picker-options="pickerBeginDateBefore"
			            format="yyyy-MM-dd"
			            placeholder="请选择开始日期">
			    </el-date-picker>
			    <el-date-picker
			            v-model="filters.column.create_end_date"
			            type="date" class='screenWid'
			            format="yyyy-MM-dd"
			            :picker-options="pickerBeginDateAfter"
			            placeholder="请选择结束日期">
			    </el-date-picker>
			    <el-button class='sreenButton'  plain icon="el-icon-search">筛选</el-button>
			    <el-button class='sreenButton' plain icon="el-icon-zoom-out">重置筛选</el-button>
			</div>
			<div class="detail_table">
				<el-table
				  :data='tableData'
			      height="250"
			      border
			      style="width: 100%；text-align:center">
			      <el-table-column
			        prop="date"
			        label="手机号"
			        align='center'
			        >
			      </el-table-column>
			      <el-table-column
			        prop="name"
			        label="通话"
			        align='center'
			        >
			      </el-table-column>
			      <el-table-column
			        prop="address"
			        align='center'
			        label="时长(秒)"
			        >
			      </el-table-column>
			      <el-table-column
			      	align='center'
			        prop="name"
			        label="关键字"
			        >
			      </el-table-column>
			      <el-table-column
			        prop="beizhu"
			        align='center'
			        label="备注"
			      	>
			      </el-table-column>
			      <el-table-column
			      	align='center'
			        prop="calltime"
			        label="呼出时间"
			        >
			      </el-table-column>
			      <el-table-column
			      	align='center'
			        label="操作">
			        <template scope="scope">
		                <el-button type="success" @click='showNumDetail' >详情</el-button>
		                <el-button type="primary" >事件</el-button>
		                <el-button type="danger" >删除</el-button>
		            </template>
			      </el-table-column>
			    </el-table>
			</div>
		</div>
		<NumDatails @closeNum='closeNumDetail' v-if='Numdetail_onoff' />
	</div>
</template>

<script>
	import NumDatails from './number_detail'
	export default{
		name:'datails',
		components:{
			NumDatails
		},
		data(){
			return{
				Numdetail_onoff:false,
				callState:'',
				callStates:['等待拨打','拨打中','已拨打'],
				online:'不限(是否接通)',
				onlines:['不限(是否接通)','未接通','已接通'],
				close:false,
				tableData:[{date:'13333333333',name:1,address:30,name:'none',beizhu:'none',calltime:'22222222'}],
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
			}
		},
		methods:{
			closeDetail(){
				this.$emit('close',this.close)
			},
			closeNumDetail(val){
				this.Numdetail_onoff=val
			},
			showNumDetail(){
				this.Numdetail_onoff=true;
			}
		}
	}
</script>

<style scoped>
	*{
		padding: 0;
		margin: 0;
		list-style: none;
	}
	.detailsBody{
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.5);
		position: fixed;
		top: 0;
		left: 0;
	}
	.detail{
		position: fixed;
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
	.detail_table button{
		border-radius: 0;
		width: 35px;
		height: 20px;
		margin: 0;
	}
	.screen{
		width: 1200px;
		padding-left: 10px;
	}
	.screenWid{
		width: 160px;
		font-size: 12px;
		box-sizing: border-box;
	}
	.sreenButton{
		width: 80px;
		height: 40px;
		margin: 0;
	}
</style>