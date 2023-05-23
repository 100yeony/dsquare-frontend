<template>
  <!-- 나중에 시간나면 drawer도 분리해보세요. -->
  <div class="topbar">
    <v-navigation-drawer class="right-navigation-drawer pa-4" v-model="drawer" location="right" temporary width="90vw">
      <v-list>
        <v-row justify="center">
          <v-col cols="2">
            <span v-if="profileImage == null">
              <v-avatar color="grey" size="40">
                <v-img cover src="@/assets/images/users/profile_default.png"></v-img>
              </v-avatar>
            </span>
            <span v-if="profileImage != null">
              <v-avatar color="grey" size="40">
                <v-img cover :src="profileImage"></v-img>
              </v-avatar>
            </span>
          </v-col>
          <v-col cols="7" class="d-flex align-self-center pl-5">
            <span class="text-body font-bold">{{ this.userName }}</span>
          </v-col>
          <v-col cols="2" class="d-flex align-self-center" @click="drawer = false">
            <img src="@/assets/images/icons/icon_back.png" />
          </v-col>
        </v-row>
      </v-list>
      <v-list>
        <div v-for="(item, i) in menuItems">
        <v-divider v-if="item.type === 'subheader'" :key="i" class="mt-2 mb-2"></v-divider>
        <v-list-item v-if="(item.title!='회원정보 관리'||isAdmin) && item.type !== 'subheader'" :key="i" :value="item" 
          :active="false" @click="onClickMenuItem(item)">
          <template v-slot:prepend>
            <img cover :src="item.icon" class="mr-2" />
          </template>
          <!-- <template v-slot:append>
            <v-chip v-if="item.chip">{{ item.chip }}</v-chip>
          </template> -->
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
      </div>
      </v-list>
    </v-navigation-drawer>
    <div>
      <v-app-bar absolute dense color="#ffffff" :elevation="0" class="top">
        <v-container class="d-flex justify-space-between" style="align-items: center;">
        <div class="d-flex">
          <v-btn icon size="medium" @click="onclickBackBtn()" v-if="back" class="isHamburg display_ham mr-2">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>
            <span class="mr-1">
              <img cover @click="goToHome" src="@/assets/images/logo.jpeg" width="30" height="30">
            </span>
            <span>
              <router-link to="/home" class="n_td">DSquare</router-link>
            </span>
          </v-toolbar-title>
        </div>
        <div class="isMobile">
          <router-link to="/board/qna" class="n_td mr-14">궁금해요</router-link>
          <router-link to="/board/communication" class="n_td mr-14" >소통해요</router-link>
          <router-link to="/board/deal" class="n_td mr-14">당근해요</router-link>
          <router-link to="/board/card" class="n_td mr-14">카드주세요</router-link>
        </div>
        <!-- <div style="width: 15vw;"></div> -->
        <!--
      아래 내용들을 이용해서, 검색, push를 custom 진행하세요.
       -->
        <!-- <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn> -->

        <div>
          <!-- 아래는 테스트로, 만약 push notifications가 0보다 큰 경우네는 notification의 color가 primary로 하는 예시입니다. -->
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props" @click="goToIndex">
                <!-- <v-badge :content="0" color="orange" text-color="white">  -->
                  <v-icon>mdi-bell</v-icon>
                <!-- </v-badge> -->
              </v-btn>
            </template>
          </v-menu>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props" class="avatar_button isMobile">
                <span v-if="profileImage == null">
                  <v-avatar color="grey" size="40">
                    <v-img cover src="@/assets/images/users/profile_default.png"></v-img>
                  </v-avatar>
                </span>
                <span v-if="profileImage != null">
                  <v-avatar color="grey" size="40">
                    <v-img cover :src="profileImage"></v-img>
                  </v-avatar>
                </span>
              </v-btn>
            </template>
            <v-list width="150">
              <div v-for="(item, index) in items">
                <v-list-item v-if="(item.title!='회원정보 관리'||isAdmin)" :key="index" :value="index"
                @click="onClickMenuItem(item)">
                <template v-slot:prepend>
                  <img cover :src="item.icon" class="mr-2" />
                </template>
                  <v-img></v-img>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </div>
                <v-divider></v-divider>
                <v-list-item @click="onClickMenuItem('logout')">
                  <template v-slot:prepend>
                    <img cover src="@/assets/images/icons/icon_logout.png" class="mr-2" />
                  </template>
                  <v-list-item-title>로그아웃</v-list-item-title>
                </v-list-item>
            </v-list>
          </v-menu>
          <v-app-bar-nav-icon class="isHamburg display_ham" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </div>
      </v-container>
      </v-app-bar>
    </div>
  </div>
</template>

<script>
import iconLayoutList from "@/assets/images/icons/icon_layout-list.png";
import iconSmile from "@/assets/images/icons/icon_smile.png";
import iconUsers from "@/assets/images/icons/icon_users.png";
import iconSettings from "@/assets/images/icons/settings.png";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import stringUtils from "@/utils/stringUtils";
import { menuItems } from "@/components/right-menu";
import api from '@/api'
import store from '@/store';

export default {
  name: "TopBar",
  components: {},
  setup() {
    const store = useStore();
    const menuTitle = computed(() => store.getters["layout/menuTitle"]);
    const back = computed(() => store.getters["url/urlBack"]);
    const user = computed(() => store.getters["info/infoUser"]);

    return { menuTitle, back, query, user };
  },
  data: () => ({
    isAdmin: store.getters["info/infoUser"].role.includes('ADMIN'),
    drawer: false,
    group: null,
    menuItems: menuItems,
    userName: '',
    profileImage: null,
    items: [
        { title: '내가 등록한 글', icon: iconLayoutList, url: process.env.VUE_APP_MYPAGE_MYPOST},
        { title: '내 답변/댓글', icon: iconSmile, url: process.env.VUE_APP_MYPAGE_MYCOMMENT},
        { title: '개인정보 설정', icon: iconUsers, url: process.env.VUE_APP_MYPAGE_MYINFO},
        { title: '회원정보 관리', icon: iconSettings, url: process.env.VUE_APP_MYPAGE_SETTINGS },
      ],
  }),
  mounted() {
    const userData = this.requestUserData();
    userData.then(
      (response) => {
        console.log('user infooooooo', response)
        this.userName = response.data.name 
        this.profileImage = response.data.profileImage
      }
    );
  },
  methods: {
    goToHome(){
      this.$router.push(process.env.VUE_APP_HOME);
    },
    async requestUserData() {
      var res = await api.get('member/members/' + this.user.userId, '');
      return res;
    },
    onclickBackBtn() {
      if (this.back) {
        this.$router.go(-1)
        // this.$router.replace({
        //   path: this.back,
        //   query: this.query
        // });
      }
    },
    onClickMenuItem(item) {
      console.log("[onClickMenuItem] ", item);
      this.$store.dispatch('info/setPageState', {});
      if (item && item.url) {
        this.$router.replace(item.url);
      }
      else if (item.value === 9 || item=='logout') {
        this.$store.dispatch('info/setInfoListBlank');
        this.$router.push(process.env.VUE_APP_LOGIN);
      }
    },
    goToIndex() {
      this.$router.push(process.env.VUE_APP_NOTIFICATIONS);
    }
  },
};
</script>
<style>
.right-navigation-drawer {
  width: 70%;
  max-width: 400px;
}

a {
  color: black !important; 
}

.top{
  border-bottom: 1px !important;
  border-style: solid !important; 
  border-color: lightgray !important;
}

.avatar_button{
  margin-inline-start: 5px !important;
}

.display_ham{
  display: none; 
}

</style>
