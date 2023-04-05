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
            <v-container>
              <center>
              <img src="@/assets/images/check.png" width="55" height="55">
              </center>
              <h2 class="text-primary text-center mt-20 font-bold">example@gmail.com</h2>
              <h3 class="text-center font-bold">으로 임시 비밀번호를 발급해드렸습니다.</h3>
            </v-container>
            <div class="text-center">
              <div class="col-12 mt-20">
                <v-btn max-width="180" type="submit" class="text-white pw-50 font-medium" color="rgb(var(--v-theme-primary))" @click="login">
                  로그인
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
</template>

<style lang="scss" module></style>


