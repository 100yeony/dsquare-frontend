
<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

export default {
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      current_pw: "",
      new_pw: "",
      new_pw_ok: "",
    }
  },
  validations() {
    return {
      current_pw: { required },
      new_pw: { required },
      new_pw_ok: { required },
    }
  },
  methods: {
   
    tryToReset() {
      this.submitted = true;
      // stop here if form is invalid
      this.v$.$touch();
      if (!this.v$.$error) {
        this.$router.push('/account/change-pass-ok');
        return;
      }
    },
  },
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
                        <div v-if="submitted && v$.current_pw.required.$invalid" class="invalid-feedback font-sm">
                            <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                            <span class="font-xs font_red">비밀번호를 입력해주세요.</span>
                        </div>

                        <div class="mb-20"></div>

                        <label for="new_pw" class="font-medium font-sm">신규 비밀번호</label>
                        <v-text-field type="password" id="new_pw" v-model="new_pw" density="compact"
                            variant="outlined" single-line hide-details    
                            :class="{ 'is-invalid': submitted && v$.new_pw.$error }" class="font-sm">
                        </v-text-field>
                        <div v-if="submitted && v$.new_pw.required.$invalid" class="invalid-feedback font-sm">
                            <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                            <span class="font-xs font_red">비밀번호를 입력해주세요.</span>
                        </div>

                        <div class="mb-20"></div>

                        <label for="new_pw_ok" class="font-medium font-sm">신규 비밀번호 확인</label>
                        <v-text-field type="password" id="new_pw_ok" v-model="new_pw_ok" density="compact"
                            variant="outlined" single-line hide-details
                            :class="{ 'is-invalid': submitted && v$.new_pw_ok.$error }" class="font-sm">
                        </v-text-field>
                        <div v-if="submitted && v$.new_pw_ok.required.$invalid" class="invalid-feedback font-sm">
                            <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                            <span class="font-xs font_red">비밀번호를 입력해주세요.</span>
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