<template>
  <div>
    <v-footer fixed app>
      <v-row justify="center mb-2">
        <v-col class="text-center mt-4 text-caption" cols="12">
          <p>문의: example@gmail.com</p>
          <p>Copyright© {{ new Date().getFullYear() }} KT DS. All rights reserved.</p>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>
<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
export default {
	methods: {
  }

}
</script>
