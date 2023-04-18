<script>
import api from '@/api'
export default {
  setup() {
    return {
    };
  },
  data(){
    return{
      stepper: 0,
    }
  },
  methods: {

    cancel() {
      this.$router.push(process.env.VUE_APP_MYPAGE_MYINFO);
    },
    deleteMember(){
      this.stepper=1; 
      this.$store.dispatch('info/setInfoToken', ''); // 토큰값을 제거해줍니다.
    },
    goToLogin(){
      this.$router.push(process.env.VUE_APP_LOGIN);
    },

  },
};
</script>

<template>
  <v-container class="ph-60 pw-100" v-if="stepper===0">
    <v-row class="ph-100">
      <v-col class="pw-100" align-self="center">
        <form @submit.prevent="tryToReset">
          <v-container class="max-pw">
            <h2 class="text-primary text-center mb-2 font-bold">회원탈퇴 안내</h2>
            <h3 class="text-center mb-5 font_gray">정말로 탈퇴하시겠습니까?</h3>
            <div class="alert mb-2">
              <div>
                <div class="font-sm ml-5 mt-3 mb-3 mr-5 font_gray">
                  회원 탈퇴일로부터 계정 정보(이메일/사내메일/닉네임/연락처/소속팀)는
                  <span style="color:deepskyblue" class="font-bold">개인정보 보호방침</span>에 따라 <b>30일간 보관 및 잠김</b>되며, 30일 경과된 후에는 모든 개인 정보는 완전히 삭제되어 더 이상 복구할 수 없게 됩니다.
                  작성된 게시글은 삭제되지 않으며, Dsquare로 소유권이 귀속됩니다.
                </div>
              </div>
            </div>
          
            <v-row align="center" class="mt-5">
              <v-col>
                <v-btn class="mr-5 pph-25 font-sm button_white font-medium" @click="cancel" variant="">
                  취소
                </v-btn>
              </v-col>
              <v-col>
                <v-btn class="pph-25 font-sm button_main font-medium" variant="" @click="deleteMember">
                  회원탈퇴
                </v-btn>
              </v-col>
            </v-row>
          </v-container>

        </form>
      </v-col>
    </v-row>
  </v-container>

  <v-container class="ph-50 pw-100" v-if="stepper===1">
    <v-row class="ph-100">
      <v-col class="pw-100" align-self="center">
        <v-container class="pw-90">
          <center>
          <img src="@/assets/images/check.png" width="55" height="55">
          </center>
          <h2 class="text-center text-primary mt-20 font-bold">
            회원탈퇴가 완료되었습니다.
          </h2>
          <h2 class="text-center font-bold">지금까지 Dsquare와 함께해주셔서 감사합니다.</h2>
        </v-container>
        <div class="text-center">
          <div class="col-12 mt-20">
            <v-btn max-width="180" type="submit" class="pw-50 font-medium button_main" variant="" @click="goToLogin">
              홈으로 가기
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>

</template>

<style lang="scss" scoped>
.button_white {
  border-width: 1px;
  border-style: solid;
  border-color: #ABABAB;
  color: black;
}

.button_main {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

.max-pw {
  max-width: 500px;
  width: 95% !important;
}
.alert {
  border-width: 1px;
  border-style: solid;
  border-color: #ABABAB;
  border-radius: 0.375rem;
}
</style>


