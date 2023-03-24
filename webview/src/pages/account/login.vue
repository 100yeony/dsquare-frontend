<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import dialogUtils from '@/utils/dialogUtils'
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
  validations () {
    return {
      password: { required },
      email: {
        required, email
      }
    }
  },
  methods: {
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
      /*const result = await dialogUtils.dialogMsgConfirm(this,
        "암호를 변경하신 지 90일이 지나, 암호를 변경하시는 것을 권장드립니다.\n암호를 변경하시도록, 하시겠습니까?",
        "안내");
      if(result === true) { // 확인 버튼을 누른 경우
        this.$router.push(process.env.VUE_APP_CHANGEPASS);
        return;
      } else { // 취소 버튼을 누른 경우, 정상적으로 로그인 되며 서버에 고객이 90일동안 추가적으로 미변경을 요청한걸 알려줘야함.
        this.$store.dispatch('info/setInfoToken', 'ABCDEFG'); // 테스트로 토큰을 'ABCDEFG' 로 넣습니다. 이건 router에서 확인과 연관이 있습니다.
        this.$router.push(process.env.VUE_APP_HOME);
        return;
      }*/
        this.$store.dispatch('info/setInfoToken', 'ABCDEFG'); // 테스트로 토큰을 'ABCDEFG' 로 넣습니다. 이건 router에서 확인과 연관이 있습니다.
        this.$router.push('/');
        return;
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="home-btn d-none d-sm-block">
      <router-link to="/" class="text-dark">
        <i class="mdi mdi-home-variant h2"></i>
      </router-link>
    </div>
    <div class="account-pages my-5 pt-sm-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center">
            </div>
          </div>
        </div>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card">
              <div class="card-body p-4">
                <div class="text-center mt-2">
                  <h3 class="text-primary">슬기로운 DS 생활</h3>
                </div>
                <div class="p-2 mt-4">
                  <v-alert
                    v-model="isAuthError"
                    variant="danger"
                    class="mt-3"
                    dismissible
                    >{{ authError }}</v-alert
                  >
                  <v-form @submit.prevent="tryToLogIn">
                    <v-form-group
                      id="input-group-1"
                      label="Email"
                      label-for="input-1"
                      class="mb-3"
                    >
                      <v-text-field
                        id="input-1"
                        v-model="email"
                        type="text"
                        placeholder="Enter email"
                        :class="{ 'is-invalid': submitted && v$.email.$error }"
                      ></v-text-field>
                      <div
                        v-if="submitted && v$.email.$error"
                        class="invalid-feedback"
                      >
                        <span v-if="v$.email.required.$invalid"
                          >이메일을 입력해주세요.</span
                        >
                        <span v-if="v$.email.email.$invalid"
                          >올바르지 않은 이메일입니다.</span
                        >
                      </div>
                    </v-form-group>

                    <v-form-group id="input-group-2" class="mb-3">
                      <div class="float-end">
                        <router-link
                          to="/account/find-pass/"
                          class="text-muted"
                          >비밀번호 찾기</router-link
                        >
                      </div>
                      <label for="input-2">Password</label>
                      <v-text-field
                        id="input-2"
                        v-model="password"
                        type="password"
                        placeholder="Enter password"
                        :class="{
                          'is-invalid': submitted && v$.password.$error
                        }"
                      ></v-text-field>
                      <div
                        v-if="submitted && v$.password.required.$invalid"
                        class="invalid-feedback"
                      >
                        비밀번호를 입력해주세요.
                      </div>
                    </v-form-group>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="auth-remember-check"
                      />
                      <label class="form-check-label" for="auth-remember-check"
                        >Remember me</label
                      >
                    </div>
                    <div class="mt-3 text-end">
                      <v-btn type="submit"
                        >로그인</v-btn
                      >
                    </div>
                    <div class="mt-4 text-center">
                      <p class="mb-0">
                        계정이 없으신가요?
                        <router-link
                          to="/account/register/"
                          class="fw-medium text-primary"
                          >회원가입</router-link
                        >
                      </p>
                    </div>
                  </v-form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module></style>
