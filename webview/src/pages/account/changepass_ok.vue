<script>
export default {
  setup() {
  },
  methods: {

    login() {
      this.$router.push(process.env.VUE_APP_LOGIN);
    },

  },
};
</script>


<template>
  <v-container class="ph-50 pw-100">
        <v-row class="ph-100">
          <v-col class="pw-100" align-self="center">
            <v-container class="pw-90">
              <center>
              <img src="@/assets/images/check.png" width="55" height="55">
              </center>
              <h2 class="text-center mt-20 font-bold">
                비밀번호가 성공적으로 변경 되었습니다.
              </h2>
            </v-container>
            <div class="text-center">
              <div class="col-12 mt-20">
                <v-btn max-width="180" type="submit" class="pw-50 font-medium button_main" variant="" @click="login">
                  로그인
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
</template>

<style lang="scss" scoped>
.button_main {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-primary));
  color: white;
}
</style>


