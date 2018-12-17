// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueResource from 'vue-resource';
import {Loading}from 'element-ui' 
import axios from 'axios'
import store from './store';
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueResource);  

axios.interceptors.request.use(function(config){
	//请求开始
	  store.dispatch('show')
    return config
},function(err){
    return Promise.reject(err)
});
axios.interceptors.response.use(function(response){
	//请求结束
	let timer=null
	timer=setInterval(function(){
		clearInterval(timer)
		store.dispatch('show')
	},200)
    
    return response
},function(err){
    return Promise.reject(err)
});

new Vue({
  el: '#app',
	router,
	store,
  components: { App },
  template: '<App/>'
})
