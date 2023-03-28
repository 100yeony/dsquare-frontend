//import store from "@/state/store";

export default [
  {
    path: process.env.VUE_APP_PATH,
    name: "base",
    component: () => import("@/layout/BaseLayout"),
    children: [
      { // '/' 으로 들어오면 '/home/'으로 redirect 한다.
        path: process.env.VUE_APP_PATH,
        redirect: process.env.VUE_APP_HOME,
      },
      {
        path: process.env.VUE_APP_HOME,
        name: "home",
        meta: {
          title: "홈",
        },
        component: () => import("@/pages/home"),
      },
      {
        path: process.env.VUE_APP_BOARD,
        name: "board",
        meta: {
          title: "게시판",
        },
        component: () => import("@/pages/board"),
      },
      {
        path: process.env.VUE_APP_BOARD_QNA_WRITE,
        name: "qna-write",
        meta: {
          title: "Q&A작성",
          back: process.env.VUE_APP_BOARD
        },
        component: () => import("@/pages/board/qna/editor"),
      },
			{
				path:  process.env.VUE_APP_BOARD_QNA_DETAIL,
				name: "qna-detail",
				meta: {
          title: "Q&A상세",
          back: process.env.VUE_APP_BOARD
				},
				component: () => import("@/pages/board/qna/_id"),
			},
			{
				path:  process.env.VUE_APP_BOARD_FREE_WRITE,
				name: "free-write",
				meta: {
          title: "자유게시판 작성",
          back: process.env.VUE_APP_BOARD
				},
				component: () => import("@/pages/board/free/editor"),
			},
			{
				path:  process.env.VUE_APP_BOARD_FREE_DETAIL,
				name: "free-detail",
				meta: {
          title: "자유게시판 상세",
          back: process.env.VUE_APP_BOARD
				},
				component: () => import("@/pages/board/free/_id"),
			},
      {
        path: process.env.VUE_APP_MYPAGE,
        name: "mypage",
        meta: {
          title: "마이페이지",
        },
        component: () => import("@/pages/mypage"),
      },
    ],
  },
  {
    path: process.env.VUE_APP_ACCOUNT,
    name: "auth",
    component: () => import("@/layout/AuthLayout"),
    children: [
      {
        path: process.env.VUE_APP_LOGIN,
        name: "login",
        meta: {
          title: "로그인",
        },
        component: () => import("@/pages/account/login"),
      },
      {
        path: process.env.VUE_APP_REGISTER,
        name: "register",
        meta: {
          title: "회원가입",
          back: process.env.VUE_APP_LOGIN
        },
        component: () => import("@/pages/account/register"),
      },
      {
        path: process.env.VUE_APP_CHANGEPASS,
        name: "changepass",
        meta: {
          title: "비밀번호변경",
          back: process.env.VUE_APP_LOGIN
        },
        component: () => import("@/pages/account/changepass"),
      },
      {
        path: process.env.VUE_APP_FINDPASS,
        name: "findpass",
        meta: {
          title: "비밀번호찾기",
          back: process.env.VUE_APP_LOGIN
        },
        component: () => import("@/pages/account/findpass"),
      },
      {
        path: process.env.VUE_APP_FINDPASS_OK,
        name: "findpass_ok",
        meta: {
          title: "비밀번호찾기성공",
          back: process.env.VUE_APP_FINDPASS
        },
        component: () => import("@/pages/account/findpass_ok"),
      },
    ],
  },
];
