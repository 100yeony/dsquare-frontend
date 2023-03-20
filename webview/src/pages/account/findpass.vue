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
    // Try to register the user in with the email, fullname
    // and password they provided.
    tryToReset() {
      this.submitted = true;
      // stop here if form is invalid
      this.v$.$touch();
      if (!this.v$.$error) {
        // api 통신 필요.
        this.$router.push('/account/login');
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
                    <h5 class="text-primary">비밀번호 초기화</h5>
                    <p class="text-muted">Reset Password with KTDS.</p>
                  </div>
                  <div class="p-2 mt-4">
                    <div
                      class="alert alert-success text-center mb-4"
                      role="alert"
                    >
                      이메일로 비밀번호 초기화 코드를 발송합니다.
                    </div>
                    <form @submit.prevent="tryToReset">
                      <div class="mb-3">
                        <label for="useremail">Email</label>
                        <v-text-field
                          type="email"
                          v-model="email"
                          class="form-control"
                          id="useremail"
                          placeholder="Enter email"
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
                      <div class="form-group row mb-0">
                        <div class="col-12 text-end">
                          <v-btn type="submit">
                            비밀번호 초기화
                          </v-btn>
                        </div>
                      </div>
                      <div class="mt-4 text-center">
                        <p class="mb-0">
                          비밀번호가 기억나시나요?
                          <router-link
                            to="/account/login"
                            class="fw-medium text-primary"
                            >Signin</router-link
                          >
                        </p>
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
