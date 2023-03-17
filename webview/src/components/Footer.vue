<template>
  <div>
    <v-footer fixed app>
      <v-bottom-navigation bg-color="teal" color="white" v-model="nowMenu" @update:modelValue="callLink">
        <v-row no-gutters>
          <v-col v-for="(item,index) of menuItems" :key="index" cols="4">
            <v-btn :value="item.index" block>
              <v-icon>{{item.icon}}</v-icon>
              <span>{{item.title}}</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-bottom-navigation>
    </v-footer>
  </div>
</template>
<script>
import { menuItems } from "./footer-menu";
import { computed, ref } from "vue";
import { useStore } from "vuex";
export default {
  data() {
    return {
      menuItems: menuItems,
    }
  },
  setup(){
    let nowMenu = ref(0)
    return { nowMenu };
  },
	methods: {
    async callLink(index){
      console.log('index', index)
      console.log(menuItems[index])
      this.$router.replace(menuItems[index].link);
    }
  }

}
</script>
