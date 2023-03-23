export const menuItems = [
  {
    id: 1,
    action: "mdi-home",
    icon: "mdi-home",
    title: "홈",
    url : process.env.VUE_APP_HOME,
  },
  {
    id: 2,
    icon: 'mdi-format-list-bulleted',
    title: "게시판",
    url : process.env.VUE_APP_BOARD,
  },
  {
    id: 3,
    icon: 'mdi-pencil',
    title: "게시판 작성",
    items: [
      {
        id: 4,
        title: "Q&A 작성",
        url : process.env.VUE_APP_BOARD_QNA_WRITE,
      },
      {
        id: 5,
        title: "자유게시판 작성",
        url : process.env.VUE_APP_BOARD_FREE_WRITE,
      }
    ],
  },
  {
    id: 6,
    icon: 'mdi-account',
    title: "마이페이지",
    url : process.env.VUE_APP_MYPAGE,
  },
];
