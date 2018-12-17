
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
	state:{
		showLoading:false
	},
	actions:{
		show(ctx){
			//loading状态显示
			ctx.commit('show')
		}
	},
	mutations:{
		show(state){
			state.showLoading=!state.showLoading
		}
	}
})
