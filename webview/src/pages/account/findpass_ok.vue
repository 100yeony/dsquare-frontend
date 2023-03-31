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
  <div class="mt-50"></div>
  <div class="mt-50 flex justify-center px-6 pb-16">
    <div class = "w-full max-w-xl space-y-8">
      
      <div class="text-center">
        <img src="@/assets/images/check.png" width="55" height="55">
        <h2 class="text-primary mt-20">example@gmail.com</h2>
        <h2>으로 임시 비밀번호를 <br> 발급해드렸습니다.</h2>
      </div>
      <div class="text-center">
        <div class="col-12 mt-30">
          <v-btn type="submit" class="text-white" color="rgb(var(--v-theme-primary))" @click="login">
            로그인
          </v-btn>
        </div>
      </div>
    </div>
  </div>

  
</template>

<style lang="scss" module></style>


