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
router.beforeEach(async (to, from, next) => {
	let title = to?.meta?.title ?? ''
	let back = to?.meta?.back ?? ''
	store.dispatch("layout/setMenuTitle", title)
	store.dispatch("url/setUrlBack", back)

	return next();
});
export default router;
