<template>
  <v-navigation-drawer>
    <v-divider></v-divider>
    <v-container class="bar">
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
    </v-container>
  </v-navigation-drawer>
</template>
<script>
import { menuItems } from "@/components/side-menu";
import stringUtils from "@/utils/stringUtils";
import store from '@/store';

export default {
  name: "SideMenu",
  components: {},
  setup() {},
  data() {
    return {
      isAdmin: store.getters["info/infoUser"].role.includes('ADMIN'),
      menuItems: menuItems,
    };
  },
	methods: {
    onClickMenuItem(item) {
      // console.log("[onClickMenuItem] ", item);
      this.$store.dispatch('info/setPageState', {});
      if (item && item.url) {
        this.$router.replace(item.url);
      }
      else if (item.value === 9) {
        this.$store.dispatch('info/setInfoListBlank');
        this.$router.push(process.env.VUE_APP_LOGIN);
      }
    },
  }

};
</script>
<style scoped>
.bar{
  padding-right: 16px !important;  
  padding-left: 16px !important; 
  padding-bottom: 16px !important; 
  padding-top: 0px !important; 
}
</style>