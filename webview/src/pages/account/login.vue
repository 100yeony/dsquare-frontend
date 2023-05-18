<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import Footer from "@/components/FooterAuth"
import api from '@/api'

import { NativeValueDto } from "@/class/NativeValueDto"
import bridgeUtils from '@/utils/bridgeUtils'

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
      flag: false,
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
        const res = await api.noneTokenPost('login', postParam)

        if (res?.status === 200) {
          console.log(res)

          let accessTokenNativeDto = new NativeValueDto({ "key": 'accessToken', "value": res.data.accessToken, "type": 'P', "preference": 'pref_key_access_token' });
          this.$store.dispatch('info/setInfoValue', accessTokenNativeDto);
          bridgeUtils.saveAccessToken(res.data.accessToken);

          let refreshTokenNativeDto = new NativeValueDto({ "key": 'refreshToken', "value": res.data.refreshToken, "type": 'P', "preference": 'pref_key_refresh_token' });
          this.$store.dispatch('info/setInfoValue', refreshTokenNativeDto);
          bridgeUtils.saveRefreshToken(res.data.refreshToken);

          // this.$store.dispatch('info/setInfoToken', {
          //   accessToken: res.data.accessToken,
          //   refreshToken: res.data.refreshToken
          // });

          const jwt = require("jsonwebtoken");
          const decodedToken = jwt.decode(res.data.accessToken);
          console.log(decodedToken);
          this.$store.dispatch('info/setInfoUser',
            {
              userId: decodedToken.id,
              role: decodedToken.role,
            });
          bridgeUtils.sendRegistrationToken(decodedToken.id)
          this.$router.push(process.env.VUE_APP_HOME);

        } else {
          console.log(res)
          if (res?.status == 401) {
            if (res?.data.code == 401001) {
              this.flag = true;
            } else if (res?.data.code == 401002) {
              this.$router.push({
                path: process.env.VUE_APP_CHANGEPASS_ALERT,
                query: {
                  email: this.email
                }
              });

            }
          } else {
            this.flag = true;
          }
        }
      }
    },
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
        <v-col class="pw-100 ph-60" align-self="center">
          <div class="d-flex justify-center">
            <img cover src="@/assets/images/logo.jpeg" width="70" height="70">
          </div>
          <h1 class="text-primary text-center mb-20 font-bold">DSquare</h1>
          <div class="p-2 mt-4">
            <v-alert v-model="isAuthError" variant="danger" class="mt-3" dismissible>{{ authError }}</v-alert>

            <v-form @submit.prevent="tryToLogIn">
              <v-container class="max-pw">
                <label for="useremail" class="font-sm font-medium"> 이메일</label>
                <v-text-field type="text" v-model="email" variant="outlined" single-line hide-details id="useremail"
                  density="compact" :class="{ 'is-invalid': submitted && v$.email.$error }"
                  class="font-sm mt-2"></v-text-field>
                <div v-if="submitted && v$.email.$error" class="invalid-feedback">
                  <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                  <span v-if="v$.email.required.$invalid" class="font-xs font_red">이메일을 입력해주세요.</span>
                  <span v-if="v$.email.email.$invalid" class="font-xs font_red">올바른 이메일 형식이 아닙니다.</span>
                </div>

                <div class="mb-20"></div>

                <label for="password" class="font-sm font-medium"> 비밀번호</label>
                <v-text-field type="password" v-model="password" variant="outlined" single-line hide-details id="password"
                  density="compact" :class="{ 'is-invalid': submitted && v$.password.$error }" class="font-sm mt-2">
                </v-text-field>
                <div v-if="submitted && v$.password.required.$invalid" class="invalid-feedback">
                  <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                  <span class="font-xs font_red">비밀번호를 입력해주세요.</span>
                </div>

                <v-btn type="submit" class="pph-25 font-sm button_main mt-30 mb-5 font-medium" variant="">
                  로그인
                </v-btn>

                <div class="flex justify-space-between">
                  <div class="mb-5">
                    <router-link to="/account/register/" class="text-primary font-sm n_td">회원가입</router-link>
                  </div>
                  <div class="mb-5">
                    <router-link to="/account/find-pass/" class="text-primary font-sm n_td">비밀번호 찾기</router-link>
                  </div>
                </div>

                <div class="alert" v-if="flag">
                  <div class="flex">
                    <div><v-icon size="small" color="#B91C1C" class="mr-3 mt-5 ml-5">mdi-information</v-icon></div>
                    <div>
                      <h3 class="font-sm font-B91C1C mt-5">로그인 실패</h3>
                      <div class="font-sm font-B91C1C mt-2 mb-5 mr-5">등록되지 않은 아이디이거나 비밀번호가 일치하지 않습니다.</div>
                    </div>
                  </div>
                </div>

              </v-container>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <Footer />
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

span {
  padding: 0px 5px !important;
}

.alert {
  border-width: 0.1px;
  border-style: solid;
  border-color: white;
  border-radius: 0.375rem;
  background-color: #F5EFFA;
}
</style>
