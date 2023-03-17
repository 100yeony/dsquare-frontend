<template>
  <v-app>
	  <router-view />
  </v-app>
</template>

<script>
import { ref } from "vue";
import cryptoUtils from "@/utils/cryptoUtils"
import api from '@/api'
export default {
  name: "App",
  components: {
  },
  setup(){
  },
  created(){
    if(process.env.VUE_APP_NODE_ENV === 'local-dev') {
    } else {
    }

  },
  mounted() {
  },
  beforeDestroy() {
  },
};
</script>


<style>
</style>
