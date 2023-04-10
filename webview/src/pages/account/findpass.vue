<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import api from '@/api'
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
  validations() {
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
    async tryToReset() {
      this.submitted = true;
      // stop here if form is invalid
      this.v$.$touch();
      if (!this.v$.$error) {
        let postParam = {};
        postParam.email = this.email
        
        const res = await api.post('/account/find-pw', postParam)
        console.log(res)
        if (res.status === 200) {
          this.$router.push('/account/find-pass-ok');
          return;
        }
      
      }
    },
  },
};
</script>

<template>
  <v-container class="ph-55 pw-100">
    <v-row class="ph-100">
      <v-col class="pw-100" align-self="center">
        <form @submit.prevent="tryToReset">
          <v-container class="max-pw">
            <h2 class="text-primary text-center mb-5 font-bold">비밀번호 찾기</h2>
            <div class="pph-10 text-center font-sm mb-7 font_gray">
              회원 가입시 입력하신 이메일 주소를 입력하시면, 해당 이메일로 임시 비밀번호를 발급해드립니다.
            </div>
            <label for="useremail" class="font-medium font-sm"> 이메일 주소</label>
            
            <v-text-field label="이메일을 입력해주세요" type="text" v-model="email" variant="outlined"
              single-line hide-details
              class="form-control font-sm mt-2" id="useremail" density="compact" :class="{
                'is-invalid': submitted && v$.email.$error,
              }" />
            <div v-if="submitted && v$.email.$error" class="invalid-feedback">
              <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
              <span v-if="v$.email.required.$invalid" class="font-xs font_red">이메일을 입력해주세요.</span>
              <span v-if="v$.email.email.$invalid" class="font-xs font_red">올바르지 않은 이메일입니다.</span>
            </div>
          
            <v-row align="center" class="mt-5">
              <v-col>
                <v-btn class="mr-5 pph-25 font-sm button_white font-medium" @click="cancel" variant="">
                  취소
                </v-btn>
              </v-col>
              <v-col>
                <v-btn type="submit" class="pph-25 font-sm button_main font-medium" variant="">
                  비밀번호 찾기
                </v-btn>
              </v-col>
            </v-row>
          </v-container>

        </form>
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

span{
  padding: 0px 5px !important; 
}
</style>


