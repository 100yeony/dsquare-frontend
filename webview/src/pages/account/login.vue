<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import dialogUtils from '@/utils/dialogUtils'
import Footer from "@/components/FooterAuth"
import api from '@/api'
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
      email: "admin@themesbrand.com",
      password: "123456",
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
  mounted(){
    this.apiPostTest();
    this.apiGetTest();
  },
  methods: {
    async apiPostTest(){ // CRUD 전체를 담당.
      let postParam = {};
      let url = 'https://jsonplaceholder.typicode.com/comments'
      const res = await api.post(url , postParam)
      console.log('[res] apiPostTest : \n', res)
    },
    async apiGetTest(){ // R 위주로 담당.
      let getParam = {};
      getParam.postId=1
      let url = 'https://jsonplaceholder.typicode.com/comments'
      const res = await api.get(url , getParam)
      console.log('[res] apiGetTest : \n', res)
    },
    async tryToLogIn() {
      // 기초적 로그인 로직.
      this.submitted = true;
      // stop here if form is invalid
      this.v$.$touch();
      if (!this.v$.$error) {
        /**
        90일 암호 변경과 같은 로직은 정상적으로 api에서 로그인에서 특정 code로 던져줄 경우 보내주면 됩니다. 아래 주석을 푸시면 findpass로 가는 팝업으로 갑니다.
        다만 지금 figma에선 one button으로 무조건 암호 변경을 가는 로직일텐데, 2버튼으로 하여 권장으로 하여 암호 변경을 하지 않는 로직도 추가하시는걸 추천드립니다.
        */
        const result = await dialogUtils.dialogMsgConfirm(this,
          "암호를 변경하신 지 90일이 지나, 암호를 변경하시는 것을 권장드립니다.\n암호를 변경하시도록, 하시겠습니까?",
          "안내");
        if (result === true) { // 확인 버튼을 누른 경우
          this.$router.push(process.env.VUE_APP_CHANGEPASS);
          return;
        } else { // 취소 버튼을 누른 경우, 정상적으로 로그인 되며 서버에 고객이 90일동안 추가적으로 미변경을 요청한걸 알려줘야함.
          this.$store.dispatch('info/setInfoToken', 'ABCDEFG'); // 테스트로 토큰을 'ABCDEFG' 로 넣습니다. 이건 router에서 확인과 연관이 있습니다.
          this.$router.push(process.env.VUE_APP_HOME);
          return;
        }
        // this.$store.dispatch('info/setInfoToken', 'ABCDEFG'); // 테스트로 토큰을 'ABCDEFG' 로 넣습니다. 이건 router에서 확인과 연관이 있습니다.
        // this.$router.push('/');
        // return;
      }
    }
  },
  components: {
    Footer
  }
};
</script>

<template>
  <v-container class="ph-100 pw-100">
    <v-row class="ph-100">
      <v-col class="pw-100" align-self="center">
        <h2 class="text-primary text-center mb-40">DSquare</h2>
        <div class="p-2 mt-4">
          <v-alert v-model="isAuthError" variant="danger" class="mt-3" dismissible>{{ authError }}</v-alert>

          <v-form @submit.prevent="tryToLogIn">
            <v-container class="pw-90">
              <v-card>
                <v-container>
                  <v-col>
                    <div v-if="submitted && v$.email.$error" class="invalid-feedback">
                      <span v-if="v$.email.required.$invalid" class="font-xs font_red">이메일을 입력해주세요.</span>
                      <span v-if="v$.email.email.$invalid" class="font-xs font_red">올바르지 않은 이메일입니다.</span>
                    </div>
                    <v-text-field label="Email" type="text" v-model="email" prepend-inner-icon="mdi-account"
                      :class="{ 'is-invalid': submitted && v$.email.$error }" class="font-sm"></v-text-field>
                    <div v-if="submitted && v$.password.required.$invalid" class="invalid-feedback font-xs font_red">
                      비밀번호를 입력해주세요.
                    </div>
                    <v-text-field prepend-inner-icon="mdi-lock" type="password" label="Password" v-model="password"
                      :class="{ 'is-invalid': submitted && v$.password.$error }" class="font-sm">
                    </v-text-field>

                    <div class="form-check">
                      <input type="checkbox" class="form-check-input" id="auth-remember-check" />
                      <label class="form-check-label font-sm" for="auth-remember-check">Remember me</label>
                    </div>

                  </v-col>
                </v-container>
              </v-card>
              <v-btn type="submit" class="font-sm pph-50 mt-5">로그인</v-btn>
            </v-container>

            <v-container>
              <v-col class="text-center mt-30">
                <div>
                  <router-link to="/account/find-pass/" class="fw-medium text-primary font-sm n_td">비밀번호 찾기</router-link>
                </div>
                <div>
                  <router-link to="/account/register/" class="fw-medium text-primary font-sm n_td">회원가입</router-link>
                </div>
              </v-col>
            </v-container>
          </v-form>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <Footer />
</template>

<style lang="scss" module></style>
