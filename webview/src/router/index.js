import { createWebHistory, createRouter } from "vue-router";

import store from "@/store";
import routes from "./routes";

import api from '@/api'
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
const notLogged = [process.env.VUE_APP_LOGIN, process.env.VUE_APP_REGISTER, process.env.VUE_APP_CHANGEPASS, process.env.VUE_APP_FINDPASS, process.env.VUE_APP_FINDPASS_OK];
router.beforeEach(async (to, from, next) => {
	let token = store.getters["info/infoToken"]; // 좀 더 복잡하게 가질 수 있지만, 현재는 토큰의 유무 정도로 로그인의 유무를 확인한다고 생각합니다.
	let path = to?.matched[to?.matched?.length - 1].path ?? to.path; //절대 위치 path값 가져오기.
	let tokenRequired = !notLogged.includes(path); // 토큰이 필요한, 로그인이 필요한 페이지인지 확인해주는 value입니다.
	let title = to?.meta?.title ?? ''
	let back = to?.meta?.back ?? ''
	store.dispatch("layout/setMenuTitle", title)
	store.dispatch("url/setUrlBack", back)

	if(tokenRequired) { // 인증 필요 사이트
		if(stringUtils.isEmptyBool(token)) {
			return next(process.env.VUE_APP_LOGIN); // 로그인 화면으로 보내기.
		} else {
			return next();
		}
	} else { // 인증 불필요 사이트
		if(stringUtils.isEmptyBool(token)) {
			return next();
		} else {
			return next(process.env.VUE_APP_HOME); // 일단 로그인한 유저가 로그인 화면 등으로 접근하려고 하면 홈 화면으로 보내버림.
		}

	}

});
export default router;
