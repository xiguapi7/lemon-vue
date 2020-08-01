export default {
	state: {
		appName: "Lemon Platform",
		themeColor: '#FF6666',// 当前主题颜色
		oldThemeColor: '#FF6666',// 旧主题颜色
		collapse: false,// 导航栏收缩状态
		menuRoteLoaded: false // 菜单和路由是否已经加载
	},
	
	getters: {
		collapse(state) {
			return state.collapse
		}
	},
	
	mutations: {
		onCollapse(state) {
			state.collapse = !this.state.collapse
		}
	},
	
	setThemeColor(state, themeColor) {
		state.oldThemeColor = state.themeColor
		state.themeColor = themeColor
	},
	
	menuRoteLoaded(state, menuRouteLoaded) {
		state.menuRouteLoaded = menuRouteLoaded
	}
}