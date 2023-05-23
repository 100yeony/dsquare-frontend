<template>
  <div>
    <v-app-bar absolute dense color="#ffffff">
      <v-btn icon size="x-large" @click="onclickBackBtn()" v-if="back">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ menuTitle }}</v-toolbar-title>
      </v-app-bar
    >
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
export default {
  name: "TopBar",
  components: {},
  setup() {
    const store = useStore();
    const menuTitle = computed(() => store.getters["layout/menuTitle"]);
    const back = computed(() => store.getters["url/urlBack"]);
    return { menuTitle, back };
  },
  methods: {
    onclickBackBtn() {
      if(this.back){
        this.$router.go(-1);
      }
    },
  },
};
</script>
<style></style>
