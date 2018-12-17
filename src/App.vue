<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
	
export default {
  name: 'App',
  components:{
  }
}
</script>

<style>
*{
	margin: 0;
	padding: 0;
}
#app{
	height: 100vh;
	overflow-y: hidden;

}
.callDate .el-input__inner{
	width:300px !important;
}
.callDate .el-date-editor.el-input, .el-date-editor.el-input__inner{
	width: 300px;
}
.el-input__inner{
	font-size: 14px;
	width: 45vh;
	box-sizing: border-box;
		height: 30px !important;
		line-height: 30px !important;
		border: 1px solid #3e4d59 !important;
}
.callCont .el-input__inner{
	width: 30vh;
}
.calltimes .el-input__inner {
	width: 37vh;
}
.addtime .el-input__inner{
	width:21.2vh;
}
.addCont .el-input__inner{
	width: 200px;
	display: inline-block;
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
.addtime .el-date-editor.el-input, .el-date-editor.el-input__inner{
	width: 21.2vh;
}
.el-input__inner:hover{
	border: 1px solid #36a9e1 !important;
	box-shadow:2px 2px rgba(54,168,225,.5);
}
.widfull[data-v-51319d26]{
	height: 30px !important;
	border: none;
}
.el-input__icon{
	line-height: 30px !important;
}
.el-popper[x-placement^=bottom]{
	margin-top:8px !important ;
}
</style>
