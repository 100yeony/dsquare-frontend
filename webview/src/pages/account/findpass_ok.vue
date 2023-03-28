<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
/**
 * Forgot Password component
 */
export default {
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      email: "",
      submitted: false,
      error: null,
      title: "Recoverpwd",
    };
  },
  validations () {
    return {
      email: {
        required, email
      }
    }
  },
  methods: {

    cancel() {
      this.$router.push(process.env.VUE_APP_LOGIN);
    },
    // Try to register the user in with the email, fullname
    // and password they provided.
    tryToReset() {
      this.submitted = true;
      // stop here if form is invalid
      this.v$.$touch();
      if (!this.v$.$error) {
        // api 통신 필요.
        // 기초적인 스낵바 예제.
        this.$inform(
        {
          text : "임시 비밀번호가 발급되었습니다.",
          snackbarX : "center",
          snackbarY : "center",
          snackbarTimeout : 10000,
          color : "#ECEFF1",
        }
        );
        // this.$router.push();
        return;
      }
    },
  },
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
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <div>
              <div class="card">
                <div class="card-body p-4">
                  <div class="text-center mt-2">
                    <h2 class="text-primary">비밀번호 찾기</h2>
                    <p class="text-muted mt-4 font-sm">회원 가입시 입력하신 이메일 주소를 입력하시면, <br> 해당 이메일로 임시 비밀번호를 발급해드립니다.</p>
                  </div>
                  <div class="mt-8 space-y-6">
                    <form @submit.prevent="tryToReset">
                      <div class="mb-3">
                        <label for="useremail" class="font-sm"><b>이메일 주소</b></label>
                        <v-text-field
                          type="email"
                          v-model="email"
                          class="form-control"
                          id="useremail"
                          placeholder="이메일을 입력해주세요"
                          :class="{
                            'is-invalid': submitted && v$.email.$error,
                          }"
                        />
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
                      </div>
                      <div class="text-center">
                        <div class="col-12">
                          <v-btn type="submit" class="mr-5" @click="cancel">
                            취소
                          </v-btn>
                          <v-btn type="submit" class="text-white" color="rgb(var(--v-theme-primary))">
                            비밀번호 찾기
                          </v-btn>
                        </div>
                      </div>
                    </form>
                  </div>
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


