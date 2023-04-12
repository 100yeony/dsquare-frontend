<template>
  <div>
    <TopBar/>
    <v-main>
      <v-container>
        <router-view />
        <!-- <SideMenu v-if="isMobile === false" /> -->
      </v-container>
    </v-main>
    <!-- <Footer v-if="isMobile === true"/> 디자인 변경으로 disable처리.-->
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import SideMenu from "@/components/SideMenu";
export default {
  name: "BaseLayout",

  components: {
    TopBar,
    Footer,
    SideMenu,
  },
  setup() {
    let isMobile = ref(false);
    return { isMobile };
  },
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
  },
};
</script>

<style lang="scss" scoped></style>
