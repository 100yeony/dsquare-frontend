<template>
  <v-navigation-drawer>
    <v-divider></v-divider>
    <v-list>
      <div v-for="(item, i) in menuItems" :value="i">
        <div v-if="item.items != null">
          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :value="item.id"
                :key="item.id"
                :title="item.title"
                :prepend-icon="item.icon"
              ></v-list-item>
            </template>
            <v-list-item
              v-for="(child, i) in item.items"
              :key="child.id"
              :value="child.id"
              :title="child.title"
              :prepend-icon="child.icon"
              @click="callLink(child.url)"
            ></v-list-item>
          </v-list-group>
        </div>
        <div v-else>
          <v-list-item
            v-bind="props"
            :value="item.id"
            :key="item.id"
            :title="item.title"
            :prepend-icon="item.icon"
            @click="callLink(item.url)"
          ></v-list-item>
        </div>
      </div>
    </v-list>
    <!-- 아직은 메뉴가 난잡할 수 있으니 side-menu.js의 값만 바꿔서 해보세요. -->
  </v-navigation-drawer>
</template>
<script>
import { menuItems } from "@/components/side-menu";
import stringUtils from "@/utils/stringUtils";
export default {
  name: "SideMenu",
  components: {},
  setup() {},
  data() {
    return {
      menuItems: menuItems,
    };
  },
	methods: {
    async callLink(url){
      console.log(url)
      if(!stringUtils.isEmptyBool(url)){
        this.$router.replace(url);
      }
    }
  }

};
</script>
