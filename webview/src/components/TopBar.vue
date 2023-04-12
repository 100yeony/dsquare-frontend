<template>
  <!-- 나중에 시간나면 drawer도 분리해보세요. -->
  <div class="topbar">
    <v-navigation-drawer class="right-navigation-drawer pa-4" v-model="drawer" location="right" temporary width="90vw">
      <v-list>
        <v-row justify="center">
          <v-col cols="2">
            <img src="@/assets/images/icons/icon_cat.png" />
          </v-col>
          <v-col cols="8">
            <span class="text-body font-bold">dsweeee</span>
          </v-col>
          <v-col cols="2" @click="drawer = false">
            <img src="@/assets/images/icons/icon_back.png" />
          </v-col>
        </v-row>
      </v-list>
      <v-list>
        <v-list-item v-for="(item, i) in menuItems" :key="i" :value="item" active-color="primary"
          @click="onClickMenuItem(item)" :disabled="item.type === 'subheader'">
          <template v-slot:prepend>
            <img cover :src="item.icon" class="mr-2" />
          </template>
          <template v-slot:append>
            <v-chip v-if="item.chip">{{ item.chip }}</v-chip>
          </template>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div>
      <v-app-bar absolute dense color="#ffffff">
        <v-btn icon size="x-large" @click="onclickBackBtn()" v-if="back">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>{{ menuTitle }}</v-toolbar-title>
        <!--
      아래 내용들을 이용해서, 검색, push를 custom 진행하세요.
       -->
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <!-- 아래는 테스트로, 만약 push notifications가 0보다 큰 경우네는 notification의 color가 primary로 하는 예시입니다. -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-badge :content="notifications.length" color="orange" text-color="white">
                <v-icon>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(notification, index) in notifications" :key="id" :value="id">
              <v-list-item-title>{{ notification.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-app-bar>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import stringUtils from "@/utils/stringUtils";
import { menuItems } from "@/components/right-menu";
export default {
  name: "TopBar",
  components: {},
  setup() {
    const store = useStore();
    const menuTitle = computed(() => store.getters["layout/menuTitle"]);
    const back = computed(() => store.getters["url/urlBack"]);
    return { menuTitle, back };
  },
  data: () => ({
    notifications: [
      { title: "테스트 push 01", id: 0 },
      { title: "테스트 push 02", id: 1 },
      { title: "테스트 push 03", id: 2 },
      { title: "테스트 push 04", id: 3 },
    ],
    drawer: false,
    group: null,
    menuItems: menuItems,
  }),
  methods: {
    onclickBackBtn() {
      if (!stringUtils.isEmptyBool(this.back)) {
        this.$router.replace(this.back);
      }
    },
    onClickMenuItem(item) {
      console.log("[onClickMenuItem] ", item);
      if (item && item.url) {
        this.$router.replace(item.url);
      }
    },
  },
};
</script>
<style>
.right-navigation-drawer {
  width: 70%;
  max-width: 400px; 
}
</style>
