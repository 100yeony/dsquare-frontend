<template>
  <div>
    <TopBar/>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    <Footer/>
  </div>
</template>

<script>
import { computed, onMounted, toRef } from "vue";
import { useStore } from "vuex";
import TopBar from "@/components/TopBarAuth"
import Footer from "@/components/FooterAuth"
export default {
  name: "AuthLayout",

  components: {
    TopBar,
    Footer
  },
  setup(){
  },
};
</script>


<style>
</style>
