<template>
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
            <v-btn icon
              :color="notifications.length > 0 ? 'primary' : ''"
              v-bind="props"
            >
              <v-badge :content="notifications.length">
                <v-icon>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(notification, index) in notifications"
              :key="id"
              :value="id"
            >
              <v-list-item-title>{{ notification.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

      </v-app-bar
    >
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import stringUtils from "@/utils/stringUtils";
export default {
  name: "TopBar",
  components: {},
  setup() {
    const store = useStore();
    const menuTitle = computed(() => store.getters["layout/menuTitle"]);
    const back = ref('');
    return { menuTitle, back };
  },
  data: () => ({
    notifications : [
      { title: '테스트 push 01', id: 0 },
      { title: '테스트 push 02', id: 1 },
      { title: '테스트 push 03', id: 2 },
      { title: '테스트 push 04', id :3 },
    ],
  }),
  watch:{
      $route (to, from){
        this.back = to.meta.back;
      }
  },
  methods: {
    onclickBackBtn() {
      if(!stringUtils.isEmptyBool(this.back)){
        this.$router.replace(this.back);
      }
    },
  },
};
</script>
<style></style>
