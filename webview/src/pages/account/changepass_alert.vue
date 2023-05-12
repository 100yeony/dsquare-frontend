<script>
export default {
  setup() {
  },
  methods: {

    // cancel() {
    //   this.$router.push(process.env.VUE_APP_HOME);
    //   // this.$router.push(process.env.VUE_APP_LOGIN);
    // },

    changepass(){
      this.$router.push({
        path: process.env.VUE_APP_CHANGEPASS,
        query: {
          email: this.$route.query.email
        }
      });
    }

  },
};
        /**
        90일 암호 변경과 같은 로직은 정상적으로 api에서 로그인에서 특정 code로 던져줄 경우 보내주면 됩니다. 아래 주석을 푸시면 findpass로 가는 팝업으로 갑니다.
        다만 지금 figma에선 one button으로 무조건 암호 변경을 가는 로직일텐데, 2버튼으로 하여 권장으로 하여 암호 변경을 하지 않는 로직도 추가하시는걸 추천드립니다.
        */
</script>


<template>
  <v-container class="ph-55 pw-100">
        <v-row class="ph-100">
          <v-col class="pw-100" align-self="center">
            <v-container class="max-pw">
              <center>
              <img src="@/assets/images/alert.png" width="65" height="65">
              </center>
              <h2 class="text-center mt-20 font-bold">
                비밀번호를 변경해주세요.
              </h2>
              <div class="mt-20 text-center font_gray">90일 동안 비밀번호를 변경하지 않으셨어요. <br> 안전한 사용을 위하여, 기존 비밀번호를 변경해주세요.</div>

              <v-row align="center" class="mt-5">
                <!-- <v-col>
                  <v-btn class="mr-5 pph-25 font-sm button_white font-medium" @click="cancel" variant="">
                    취소
                  </v-btn>
                </v-col> -->
                <v-col class="d-flex justify-center">
                  <v-btn type="submit" class="pph-10 font-sm button_main font-medium" @click="changepass" variant="">
                    지금 변경하기
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
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

.button_white {
  border-width: 1px;
  border-style: solid;
  border-color: #ABABAB;
  color: black;
}

.max-pw {
  max-width: 500px;
  width: 95% !important;
}

</style>


