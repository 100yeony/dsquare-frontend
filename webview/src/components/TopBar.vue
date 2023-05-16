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
        <v-btn icon size="medium" @click="onclickBackBtn()" v-if="back">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>
          <span class="mr-1">
            <img cover src="@/assets/images/logo.jpeg" width="30" height="30">
          </span>
          <span>
            <router-link to="/home" class="n_td" @click="deactivateItem">DSquare</router-link>
          </span>
        </v-toolbar-title>
        <!--
      아래 내용들을 이용해서, 검색, push를 custom 진행하세요.
       -->
        <!-- <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn> -->

        <!-- 아래는 테스트로, 만약 push notifications가 0보다 큰 경우네는 notification의 color가 primary로 하는 예시입니다. -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" @click="goToIndex">
              <v-badge :content="4" color="orange" text-color="white"> 
                <v-icon>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
        </v-menu>
        <v-app-bar-nav-icon v-if="isMobile" variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-app-bar>
    </div>
  </div>
</template>

<script>
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
    const query = computed(() => store.getters["url/urlQuery"]);
    const user = computed(() => store.getters["info/infoUser"]);
    let isMobile = ref(false);

    return { menuTitle, back, query, user, isMobile };
  },
  data: () => ({
    isAdmin: store.getters["info/infoUser"].role.includes('ADMIN'),
    drawer: false,
    group: null,
    menuItems: menuItems,
    userName: '',
    profileImage: null,
  }),
  mounted() {
    const userAgent = navigator.userAgent.toLowerCase();
    if ( //아직은 이 값을 통해서, mobile인지 확인한다고만 생각하세요.
      userAgent.indexOf("android") > -1 ||
      userAgent.indexOf("iphone") > -1 ||
      userAgent.indexOf("ipad") > -1 ||
      userAgent.indexOf("ipod") > -1
    ) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }

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
    async requestUserData() {
      var res = await api.get('member/members/' + this.user.userId, '');
      return res;
    },
    onclickBackBtn() {
      if (!stringUtils.isEmptyBool(this.back)) {
        this.$router.replace({
          path: this.back,
          query: this.query
        });
      }
    },
    onClickMenuItem(item) {
      console.log("[onClickMenuItem] ", item);
      this.$store.dispatch('info/setPageState', {});
      if (item && item.url) {
        this.$router.replace(item.url);
      }
      else if (item.value === 9) {
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
</style>
