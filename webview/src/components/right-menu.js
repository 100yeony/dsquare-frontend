/**
 * @author kkw
 * right menu 값.
 * T는 title, M는 기본 메뉴 형식.
 */
import iconDash from "@/assets/images/icons/icon_dash.png";
import iconBoxes from "@/assets/images/icons/icon_boxes.png";
import iconWallet from "@/assets/images/icons/icon_wallet.png";
import iconCoffe from "@/assets/images/icons/icon_coffee.png";
import iconCarrot from "@/assets/images/icons/icon_carrot.png";
import iconLayoutList from "@/assets/images/icons/icon_layout-list.png";
import iconSmile from "@/assets/images/icons/icon_smile.png";
import iconAtSign from "@/assets/images/icons/icon_at_sign.png";
import iconUsers from "@/assets/images/icons/icon_users.png";
import iconLogout from "@/assets/images/icons/icon_logout.png";
import iconSettings from "@/assets/images/icons/settings.png";
import store from "@/store";

export const menuItems = [
  {
    type: "subheader",
    title: "DSquare",
    url: "",
    valid: true
  },
  {
    value: 0,
    title: "Dashboard",
    icon: iconDash,
    url: process.env.VUE_APP_HOME,
    valid: true
  },
  {
    value: 1,
    title: "궁금해요",
    icon: iconBoxes,
    url: process.env.VUE_APP_BOARD_QNA,
    valid: true
  },
  {
    value: 2,
    title: "소통해요",
    icon: iconCoffe,
    url: process.env.VUE_APP_BOARD_COMMUNICATION,
    valid: true
  },
  {
    value: 3,
    title: "당근해요",
    icon: iconCarrot,
    url: process.env.VUE_APP_BOARD_DEAL,
    valid: true
  },
  {
    value: 4,
    title: "카드주세요",
    icon: iconWallet,
    url: process.env.VUE_APP_BOARD_CARD,
    valid: true
  },
  {
    type: "subheader",
    title: "My page",
    url: "",
    valid: true
  },
  {
    value: 5,
    title: "내가 등록한 글",
    icon: iconLayoutList,
    chip: 4,
    url: process.env.VUE_APP_MYPAGE_MYPOST,
    valid: true
  },
  {
    value: 6,
    title: "내 답변/댓글",
    icon: iconSmile,
    url: process.env.VUE_APP_MYPAGE_MYCOMMENT,
    valid: true
  },
  {
    value: 7,
    title: "개인정보 설정",
    icon: iconUsers,
    url: process.env.VUE_APP_MYPAGE_MYINFO,
    valid: true
  },
  {
    value: 8,
    title: "회원정보 관리",
    icon: iconSettings,
    url: process.env.VUE_APP_MYPAGE_SETTINGS,
    valid: store.getters["info/infoUser"].role.include('ADMIN'), 
  },
  {
    type: "subheader",
    title: "Logout",
    url: "",
    valid: true
  },
  {
    value: 9,
    title: "로그아웃", 
    icon: iconLogout,
    valid: true
  },
];
