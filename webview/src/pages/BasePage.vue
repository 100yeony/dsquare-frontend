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
import TopBar from "@/components/TopBar"
import Footer from "@/components/Footer"
export default {
  name: "BasePage",

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
