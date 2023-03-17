//import store from "@/state/store";

export default [
  {
    path: process.env.VUE_APP_PATH,
    name: "base",
    component: () => import("@/pages/BasePage"),
    children: [
      {
        path: process.env.VUE_APP_HOME,
        name: "home",
        meta: {
          title: "홈",
        },
        component: () => import("@/pages/home"),
      },
      {
        path: process.env.VUE_APP_FAQ,
        name: "faq",
        meta: {
          title: "faq",
        },
        component: () => import("@/pages/faq"),
      },
      {
        path: process.env.VUE_APP_MYPAGE,
        name: "mypage",
        meta: {
          title: "mypage",
        },
        component: () => import("@/pages/mypage"),
      },
    ],
  },
];
