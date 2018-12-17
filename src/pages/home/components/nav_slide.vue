<template>
	<div class="left_slide">
		<div class="AIuser">
			<h3>AI客户</h3>
			<ul>
				<li v-for="(item,index) of AIuser" :class="{nav_checked:index==tabIndex}" @click="tabCheck(index)">{{item}}</li>
			</ul>
		</div>
		<div class="AIsetting">
			<h3>AI设置</h3>
			<ul>
				<li v-for="(item,index) of AIsetting" :class="{nav_checked:index==settabIndex}" @click="tabsetCheck(index)">{{item}}</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default{
		name:"Nav_slide",
		data(){
			return{
				AIuser:['客户列表','呼叫计划','结果记录'],
				AIsetting:['黑名单','云账号','外呼线路','短信模块审查'],
				tabIndex:0,
				settabIndex:null
			}
		},
		methods:{
			tabCheck(index){
				if(this.settabIndex!=null){
					this.settabIndex=null
					this.tabIndex=index
				}else{
					this.tabIndex=index
				}
				this.$emit('changeTab',this.AIuser[index])
			},
			tabsetCheck(index){
				if(this.tabIndex!=null){
					this.tabIndex=null
					this.settabIndex=index
				}else{
					this.settabIndex=index
				}
				this.$emit('changeTab',this.AIsetting[index])
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
	.left_slide{
		height: 100vh;
		box-sizing: border-box;
		background: #383e4b;
		color: white;
		padding-top: 10px;
	}
	h3{
		font-weight: normal;
		font-size: 16px;
		background: #3e4d59;
		height: 40px;
		line-height: 40px;
		padding-left: 24px;
	}
	li{
		text-indent: 10px;
		height: 40px;
		line-height: 40px;
		cursor: pointer;
		font-size: 14px;
		padding-left: 24px;
	}
	li:hover{
		background: #39afea;
	}
	.nav_checked{
		background: #39afea;
	}
</style>