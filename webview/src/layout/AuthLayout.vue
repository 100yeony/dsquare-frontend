<template>
    <v-main>
      <router-view />
    </v-main>
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


<style lang="scss" module></style>
