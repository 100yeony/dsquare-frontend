<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import Footer from "@/components/FooterAuth"
import api from '@/api'

//import {NativeValueDto} from "@/class/NativeValueDto"

/**
 * Login component
 */
export default {
  layout: "auth",
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
    }
  },
  validations() {
    return {
      password: { required },
      email: {
        required, email
      }
    }
  },
  mounted() {
  },
  methods: {
    async tryToLogIn() {
      // 기초적 로그인 로직.
      this.submitted = true;
      // stop here if form is invalid
      this.v$.$touch();
      if (!this.v$.$error) {
        // 이후에는 이 nativeDto를 실 토큰처럼 쓰도록 구현하세요.
        // 지금은 개발중인걸ㄹ 보이니 disable 처리만 해둡니다.
        /*let testAccessTokenValue = 'ABCDEFG';
        let accessTokenNativeDto = new NativeValueDto({"key": 'accessToken', "value": testAccessTokenValue , "type":'P', "preference": 'pref_key_access_token'});
        this.$store.dispatch('info/setInfoValue',accessTokenNativeDto);
        bridgeUtils.saveAccessToken(testAccessTokenValue);

        let testRefreshTokenValue = 'ABCDEFG';
        let refreshTokenNativeDto = new NativeValueDto({"key": 'refreshToken', "value": testRefreshTokenValue, "type":'P', "preference": 'pref_key_refresh_token'});
        this.$store.dispatch('info/setInfoValue',refreshTokenNativeDto);
        bridgeUtils.saveRefreshToken(testRefreshTokenValue);*/

        let postParam = {};
        postParam.email = this.email
        postParam.pw = this.password
        const res = await api.post('login', postParam)

        // const res = await api.post(url, postParam, {
        //   Authorization : 'Bearer ' + $store.getters["info/infoToken"]
        // })
        if (res?.status===200){
          console.log(res)
          this.$store.dispatch('info/setInfoToken', res.data.accessToken);
          this.$router.push('/account/change-pass-alert');
        } else {
          this.$inform( {
            text : "오류 메시지를 넣으세요.",
            color : 'primary',
            snackbarY : "center",
              snackbarX : "center"
          });
        }
      }
    }
  },
  components: {
    Footer
  }
};
</script>

<template>
  <div>
  <v-container class="ph-60 pw-100">
    <v-row class="ph-100">
      <v-col class="pw-100" align-self="center">
        <h1 class="text-primary text-center mb-20 font-bold">DSquare</h1>
        <div class="p-2 mt-4">
          <v-alert v-model="isAuthError" variant="danger" class="mt-3" dismissible>{{ authError }}</v-alert>

          <v-form @submit.prevent="tryToLogIn">
            <v-container class="max-pw">
              <label for="useremail" class="font-sm font-medium"> 이메일</label>
              <v-text-field type="text" v-model="email" variant="outlined"
                single-line hide-details
                id="useremail" density="compact"
                :class="{ 'is-invalid': submitted && v$.email.$error }" class="font-sm"></v-text-field>
              <div v-if="submitted && v$.email.$error" class="invalid-feedback">
                <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                <span v-if="v$.email.required.$invalid" class="font-xs font_red">이메일을 입력해주세요.</span>
                <span v-if="v$.email.email.$invalid" class="font-xs font_red">올바르지 않은 이메일입니다.</span>
              </div>

              <div class="mb-20"></div>

              <label for="password" class="font-sm font-medium"> 비밀번호</label>
              <v-text-field type="password" v-model="password" variant="outlined"
                single-line hide-details
                id="password" density="compact"
                :class="{ 'is-invalid': submitted && v$.password.$error }" class="font-sm">
              </v-text-field>
              <div v-if="submitted && v$.password.required.$invalid" class="invalid-feedback">
                <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                <span class="font-xs font_red">비밀번호를 입력해주세요.</span>
              </div>

              <v-btn type="submit" class="pph-25 font-sm button_main mt-30 mb-5 font-medium" variant="">
                로그인
              </v-btn>

              <div style="float: left;">
                <router-link to="/account/register/" class="text-primary font-sm n_td">회원가입</router-link>
              </div>
              <div style="float: right;">
                <router-link to="/account/find-pass/" class="text-primary font-sm n_td">비밀번호 찾기</router-link>
              </div>
            </v-container>

          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <Footer />
  </div>
</template>

<style lang="scss" scoped>
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

span{
  padding: 0px 5px !important;
}
</style>
