
<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import store from '@/store';
import api from '@/api';

const pwValidator = (pw) => pw == "" || new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$").test(pw);

export default {
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      user: store.getters["info/infoUser"],
      current_pw: "",
      new_pw: "",
      new_pw_ok: "",
    }
  },
  validations() {
    return {
      current_pw: { required, pwValidator},
      new_pw: { required, pwValidator},
      new_pw_ok: { required, pwValidator},
    }
  },
  methods: {
   
    async tryToReset() {
      this.submitted = true;
      // stop here if form is invalid
      this.v$.$touch();
      if (!this.v$.$error) {
        const res = await api.patch('account/change-pw/', {
          email: this.user.email,
          originalPassword: this.current_pw, 
          changedPassword: this.new_pw, 
        }).then((response) => {
          console.log(response)
        });
      }
    },
  },
  computed: {
    pwNewConfirm() {
      if (this.submitted && this.v$.new_pw.required.$invalid) {
        return '비밀번호는 최소 8자 이상 입력하세요.';
      } else if (this.submitted && this.v$.new_pw.pwValidator.$invalid) {
        return '알파벳 대소문자, 숫자, 특수문자를 조합한 비밀번호를 입력하세요.'
      }
      return '';
    },
    pwNewOkConfirm() {
      if (this.submitted && this.v$.new_pw_ok.required.$invalid) {
        return '비밀번호는 최소 8자 이상 입력하세요.';
      } else if (this.submitted && this.v$.new_pw_ok.pwValidator.$invalid) {
        return '알파벳 대소문자, 숫자, 특수문자를 조합한 비밀번호를 입력하세요.'
      } else if (this.submitted && this.new_pw != this.new_pw_ok){
        return '비밀번호가 일치하지 않아요.'
      }
      console.log(this.new_pw)
      console.log(this.new_pw_ok)
      console.log('-----')
      return '';
    },
    pwCurrentConfirm() {
      if (this.submitted && this.v$.current_pw.required.$invalid) {
        return '비밀번호는 최소 8자 이상 입력하세요.';
      } else if (this.submitted && this.v$.current_pw.pwValidator.$invalid) {
        return '알파벳 대소문자, 숫자, 특수문자를 조합한 비밀번호를 입력하세요.'
      }
      return '';
    },
  }
};
</script>
<template>
    <v-container class="pw-100 ph-70">
        <v-row class="ph-100">
            <v-col class="pw-100" align-self="center">
                <v-form @submit.prevent="tryToReset">
                    <v-container class="pw-95 max-pw">
                        <h2 class="text-primary text-center font-bold">비밀번호 변경</h2>
                        <div class="pph-10 text-center font-sm mb-7 mt-2 font_gray">
                            변경하실 비밀번호를 입력해주세요.
                        </div>
                    
                        <label for="current_pw" class="font-medium font-sm">현재 비밀번호</label>
                        <v-text-field type="password" id="current_pw" v-model="current_pw" density="compact"
                            variant="outlined" single-line hide-details
                            :class="{ 'is-invalid': submitted && v$.current_pw.$error }" class="font-sm">
                        </v-text-field>
                        <div v-if="submitted && v$.current_pw.$error">
                          <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                          <span class="font-xs font_red">{{ pwCurrentConfirm }}</span>
                        </div>

                        <div class="mb-20"></div>

                        <label for="new_pw" class="font-medium font-sm">신규 비밀번호</label>
                        <v-text-field type="password" id="new_pw" v-model="new_pw" density="compact"
                            variant="outlined" single-line hide-details    
                            :class="{ 'is-invalid': submitted && v$.new_pw.$error }" class="font-sm">
                        </v-text-field>
                        <div v-if="submitted && v$.new_pw.$error">
                          <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                          <span class="font-xs font_red">{{ pwNewConfirm }}</span>
                        </div>

                        <div class="mb-20"></div>

                        <label for="new_pw_ok" class="font-medium font-sm">신규 비밀번호 확인</label>
                        <v-text-field type="password" id="new_pw_ok" v-model="new_pw_ok" density="compact"
                            variant="outlined" single-line hide-details
                            :class="{ 'is-invalid': submitted && v$.new_pw_ok.$error }" class="font-sm">
                        </v-text-field>
                        <div v-if="submitted && v$.new_pw_ok.$error">
                          <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                          <span class="font-xs font_red">{{ pwNewOkConfirm }}</span>
                        </div>
    
                        <v-btn type="submit" class="font-sm pph-50 mt-30 button_main font-medium" variant="">
                            비밀번호 변경
                        </v-btn>
                    </v-container>
                </v-form>
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
.max-pw {
  max-width: 500px;
  width: 95% !important;
}

span{
  padding: 0px 5px !important; 
}

</style>