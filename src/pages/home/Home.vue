<template>
	<div class="home">
		<div class="header">
			<p>朗深智能电话机器人平台</p>
			<div class="user">
				<img src="../../assets/img/images/aa_03.jpg"/>
				<div class="welcome">
					<span>欢迎您！</span>
					<span class="name">user</span>
				</div>
			</div>
		</div>
		<div class="content" >
			<el-row>
				<el-col :span='4'>
				<Nav_slide class="left_cont"/>
				</el-col>
				<el-col :span='20'>
				<Slide_cont class='right_cont'  />
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import Nav_slide from './components/nav_slide'
	import Slide_cont from './components/slide_cont'
	import axios from 'axios'
	import qs from 'qs'
	export default{
		name:'Home',
		data(){
			return{
			}
		},
		methods:{
			
		},
		components:{
			Nav_slide,
			Slide_cont,
			
		}
	}
</script>

<style scoped>
	*{
		padding: 0;
		margin:0 ;
		list-style: none;
	}
	.home{
		position: relative;
	}
	.header{
		background: #36a9e1;
		height: 60px;
		width:100%;
		line-height: 60px;
		color: white;
		margin: 0 auto;
	}
	.header >p{
		float: left;
		font-size: 17px;
		width: 414px;
		background: #1e8fc6;
	}
	.user{
		padding-right: 50px;
		cursor: pointer;
		float: right;
		font-size: 12px;
		height: 60px;
		width: 145px;
	}
	.name{
		position: absolute;
		top: 12px;
		left: 0;
	}
	.user img{
		vertical-align: middle;
		width: 24px;
		height: 24px;
		padding-top: 8px;
	}
	.welcome{
		width: 100px;
		position: relative;
		float: right;
	}
	.welcome p{
		font-size: 12px;
	}
	.content{
		overflow: hidden;
		white-space:nowrap; 
		width: 100%;
		margin: 0 auto;
	}
</style>