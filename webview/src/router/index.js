import { createWebHistory, createRouter } from "vue-router";

import store from "@/store";
import routes from "./routes";

import stringUtils from '@/utils/stringUtils';
const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return { x: 0, y: 0 };
		}
	},
});
/**
 * Vue router의 권한 및 title을 설정해주는 script 입니다.
 */
// 로그인이 되지 않았을때만 들어가져야합니다.
const notLogged = [process.env.VUE_APP_LOGIN, process.env.VUE_APP_REGISTER, process.env.VUE_APP_CHANGEPASS_ALERT, process.env.VUE_APP_CHANGEPASS,
process.env.VUE_APP_CHANGEPASS_OK, process.env.VUE_APP_FINDPASS, process.env.VUE_APP_FINDPASS_OK];

router.beforeEach(async (to, from, next) => {
	store.dispatch('info/setInfoWaitingNum', 0)
	let accessToken = store.getters['info/infoListByKey']('accessToken')
	let accessTokenValue = (typeof accessToken == 'undefined') ? '':accessToken.value
	const absolutePath = to.path.startsWith('/') ? to.path : `/${to.path}`
	let tokenRequired = !notLogged.includes(absolutePath); 
	let title = to?.meta?.title ?? ''
	let back = to?.meta?.back ?? false 
	
	store.dispatch("layout/setMenuTitle", title)
	store.dispatch("url/setUrlBack",back)

	if (!back){
		store.dispatch("url/setUrlQuery", {})
	}

	console.log(tokenRequired)
	if(tokenRequired) { // 인증 필요 사이트
		if(stringUtils.isEmptyBool(accessTokenValue)) {
			return next(process.env.VUE_APP_LOGIN); // 로그인 화면으로 보내기.
		} else {
			return next();
		}
	} else { // 인증 불필요 사이트
		if(stringUtils.isEmptyBool(accessTokenValue)) {
			return next();
		} else {
			return next(process.env.VUE_APP_HOME); // 일단 로그인한 유저가 로그인 화면 등으로 접근하려고 하면 홈 화면으로 보내버림.
		}

	}

});
export default router;
