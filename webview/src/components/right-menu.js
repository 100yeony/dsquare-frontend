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

export const menuItems = [
  {
    type: "subheader",
    title: "DSquare",
    url: "",
  },
  {
    value: 0,
    title: "Dashboard",
    icon: iconDash,
    url: process.env.VUE_APP_HOME,
  },
  {
    value: 1,
    title: "궁금해요",
    icon: iconBoxes,
    url: process.env.VUE_APP_BOARD_QNA,
  },
  {
    value: 2,
    title: "소통해요",
    icon: iconCoffe,
    url: process.env.VUE_APP_BOARD_COMMUNICATION,
  },
  {
    value: 3,
    title: "당근해요",
    icon: iconCarrot,
    url: process.env.VUE_APP_BOARD_DEAL,
  },
  {
    value: 4,
    title: "카드주세요",
    icon: iconWallet,
    url: process.env.VUE_APP_BOARD_CARD,
  },
  {
    type: "subheader",
    title: "My page",
    url: "",
  },
  {
    value: 5,
    title: "내가 등록한 글",
    icon: iconLayoutList,
    chip: 4,
    url: process.env.VUE_APP_MYPAGE_MYPOST,
  },
  {
    value: 6,
    title: "내 답변/댓글",
    icon: iconSmile,
    url: process.env.VUE_APP_MYPAGE_MYCOMMENT,
  },
  {
    value: 7,
    title: "Mention",
    icon: iconAtSign,
    chip: 2,
    url: process.env.VUE_APP_MYPAGE_MYMENTION,
  },
  {
    value: 8,
    title: "회원정보 관리",
    icon: iconUsers,
    url: process.env.VUE_APP_MYPAGE_MYINFO,
  },
];
