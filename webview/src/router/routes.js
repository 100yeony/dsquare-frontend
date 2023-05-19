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
        path: process.env.VUE_APP_NOTIFICATIONS,
        name: "notifications",
        meta: {
          title: "일림 목록",
          back: process.env.VUE_APP_HOME
        },
        component: () => import("@/pages/notification/index"),
      },
      {
        path: process.env.VUE_APP_BOARD_QNA,
        name: "qna",
        meta: {
          title: "궁금해요",
        },
        component: () => import("@/pages/board/qna/index"),
      },
      {
        path: process.env.VUE_APP_BOARD_QNA_WRITE,
        name: "qna-write",
        meta: {
          title: "궁금해요 작성",
          back: process.env.VUE_APP_BOARD_QNA
        },
        component: () => import("@/pages/board/qna/editor"),
      },
			{
				path:  process.env.VUE_APP_BOARD_QNA_DETAIL,
				name: "qna-detail",
				meta: {
          title: "궁금해요 상세",
          back: process.env.VUE_APP_BOARD_QNA
				},
				component: () => import("@/pages/board/qna/_id"),
			},
      {
        path: process.env.VUE_APP_BOARD_QNA_ANSWER, 
        name: "qna-answer",
        meta: {
          title: "궁금해요 답변",
          back: process.env.VUE_APP_BOARD_QNA_DETAIL
        },
        component: () => import("@/pages/board/qna/answer"),
      },
      {
        path: process.env.VUE_APP_BOARD_QNA_ANSWER_EDIT, 
        name: "qna-answer-edit",
        meta: {
          title: "궁금해요 답변 수정",
          back: process.env.VUE_APP_BOARD_QNA_DETAIL
        },
        component: () => import("@/pages/board/qna/answer_edit"),
      },
      {
        path: process.env.VUE_APP_BOARD_QNA_EDIT, 
        name: "qna-edit",
        meta: {
          title: "궁금해요 수정",
          back: process.env.VUE_APP_BOARD_QNA_DETAIL
        },
        component: () => import("@/pages/board/qna/edit"),
      },
      {
        path: process.env.VUE_APP_BOARD_COMMUNICATION,
        name: "communication",
        meta: {
          title: "소통해요",
        },
        component: () => import("@/pages/board/communication/index"),
      },
      {
        path: process.env.VUE_APP_BOARD_COMMUNICATION_WRITE,
        name: "communication-write",
        meta: {
          title: "소통해요 작성",
          back: process.env.VUE_APP_BOARD_COMMUNICATION
        },
        component: () => import("@/pages/board/communication/editor"),
      },
			{
				path:  process.env.VUE_APP_BOARD_COMMUNICATION_DETAIL,
				name: "communication-detail",
				meta: {
          title: "소통해요 상세",
          back: process.env.VUE_APP_BOARD_COMMUNICATION
				},
				component: () => import("@/pages/board/communication/_id"),
			},
      {
        path: process.env.VUE_APP_BOARD_COMMUNICATION_EDIT, 
        name: "communication-edit",
        meta: {
          title: "소통해요 수정",
          back: process.env.VUE_APP_BOARD_COMMUNICATION_DETAIL
        },
        component: () => import("@/pages/board/communication/edit"),
      },
      {
        path: process.env.VUE_APP_BOARD_DEAL,
        name: "deal",
        meta: {
          title: "당근해요",
        },
        component: () => import("@/pages/board/deal/index"),
      },
      {
        path: process.env.VUE_APP_BOARD_DEAL_WRITE,
        name: "deal-write",
        meta: {
          title: "당근해요 작성",
          back: process.env.VUE_APP_BOARD_DEAL
        },
        component: () => import("@/pages/board/deal/editor"),
      },
			{
				path:  process.env.VUE_APP_BOARD_DEAL_DETAIL,
				name: "deal-detail",
				meta: {
          title: "당근해요 상세",
          back: process.env.VUE_APP_BOARD_DEAL
				},
				component: () => import("@/pages/board/deal/_id"),
			},
      {
        path: process.env.VUE_APP_BOARD_DEAL_EDIT, 
        name: "deal-edit",
        meta: {
          title: "당근해요 수정",
          back: process.env.VUE_APP_BOARD_DEAL_DETAIL
        },
        component: () => import("@/pages/board/deal/edit"),
      },
      {
        path: process.env.VUE_APP_BOARD_CARD,
        name: "card",
        meta: {
          title: "카드주세요",
        },
        component: () => import("@/pages/board/card/index"),
      },
      {
        path: process.env.VUE_APP_BOARD_CARD_WRITE,
        name: "card-write",
        meta: {
          title: "카드주세요 작성",
          back: process.env.VUE_APP_BOARD_CARD
        },
        component: () => import("@/pages/board/card/editor"),
      },
			{
				path:  process.env.VUE_APP_BOARD_CARD_DETAIL,
				name: "card-detail",
				meta: {
          title: "카드주세요 상세",
          back: process.env.VUE_APP_BOARD_CARD
				},
				component: () => import("@/pages/board/card/_id"),
			},
      {
        path: process.env.VUE_APP_BOARD_CARD_EDIT, 
        name: "card-edit",
        meta: {
          title: "카드주세요 수정",
          back: process.env.VUE_APP_BOARD_CARD_DETAIL
        },
        component: () => import("@/pages/board/card/edit"),
      },
      {
        path: process.env.VUE_APP_MYPAGE,
        name: "mypage",
        meta: {
          title: "마이페이지",
        },
        component: () => import("@/pages/mypage"),
      },
      {
        path: process.env.VUE_APP_MYPAGE_MYPOST,
        name: "mypage-mypost",
        meta: {
          title: "내가 등록 한 글",
        },
        component: () => import("@/pages/mypage/myPost"),
      },
      {
        path: process.env.VUE_APP_MYPAGE_MYCOMMENT,
        name: "mypage-mycomment",
        meta: {
          title: "내 답변",
        },
        component: () => import("@/pages/mypage/myComment"),
      },
      {
        path: process.env.VUE_APP_MYPAGE_MYINFO,
        name: "mypage-info",
        meta: {
          title: "개인정보 설정",
        },
        component: () => import("@/pages/mypage/myInfo"),
      },
      {
        path: process.env.VUE_APP_MYPAGE_SETTINGS,
        name: "settings",
        meta: {
          title: "회원정보 관리",
        },
        component: () => import("@/pages/mypage/settings"),
      },
      {
        path: process.env.VUE_APP_MYPAGE_SETTINGS_INFO,
        name: "settings-info",
        meta: {
          title: "회원정보 수정",
          back: process.env.VUE_APP_MYPAGE_SETTINGS
        },
        component: () => import("@/pages/mypage/settingsInfo"),
      },
    ],
  },
  {
    path: process.env.VUE_APP_ACCOUNT,
    name: "auth",
    component: () => import("@/layout/AuthLayout"),
    children: [
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
        path: process.env.VUE_APP_CHANGEPASS_FOR_USER,
        name: "changepass-for-user",
        meta: {
          title: "비밀번호변경회원용",
          back: process.env.VUE_APP_LOGIN
        },
        component: () => import("@/pages/account/changepassForUser"),
      },
      {
        path: process.env.VUE_APP_CHANGEPASS_OK,
        name: "changepass_ok",
        meta: {
          title: "비밀번호변경 완료",
        },
        component: () => import("@/pages/account/changepass_ok"),
      },
      {
        path: process.env.VUE_APP_CHANGEPASS_ALERT,
        name: "changepass_alert",
        meta: {
          title: "비밀번호변경 안내",
        },
        component: () => import("@/pages/account/changepass_alert"),
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
    ],
  },
  {
    path: process.env.VUE_APP_FINDPASS_OK,
    name: "findpass_ok",
    meta: {
      title: "비밀번호찾기 완료"
    },
    component: () => import("@/pages/account/findpass_ok"),
  },
  {
    path: process.env.VUE_APP_LOGIN,
    name: "login",
    meta: {
      title: "로그인",
    },
    component: () => import("@/pages/account/login"),
  },
  {
    path: process.env.VUE_APP_DELETE_MEMBER,
    name: "delete-member",
    meta: {
      title: "회원탈퇴",
    },
    component: () => import("@/pages/mypage/deleteMember"),
  },
];
