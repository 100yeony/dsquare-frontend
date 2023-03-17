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

export default router;
