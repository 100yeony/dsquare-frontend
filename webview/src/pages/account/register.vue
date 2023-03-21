<template>
  <div v-if="stepper === 0">
    <!-- 더 꾸며보세요.-->
    <h3 class="text-primary font-weight text-center">슬기로운 DS 생활</h3>
    <v-expansion-panels class="mt-4">
      <v-expansion-panel>
        <v-expansion-panel-title @click="terms[0] = true">
          슬기로운 DS 생활 이용약관(필수)
          <template v-slot:actions="{ expanded }">
            <v-icon
              :color="terms[0] === false ? '' : 'teal'"
              :icon="terms[0] === false ? 'mdi-pencil' : 'mdi-check'"
            ></v-icon>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="wrap__agree">
          제1장 총칙 제 1 조(목적) 본 약관은 회원이 주식회사 케이티(이하
          “회사”라 합니다)가 제공하는 “슬기로운 DS 생활”(이하 “서비스”라
          합니다.)를 이용함에 있어 불필요한 “회사”와 “회원”간의 권리, 의무 및
          책임사항, “서비스”이용에 따른 이용조건 및 절차 등 기타 필요한 제반
          사항을 규정함을 목적으로 합니다.제 2 조(약관의 효력 및 변경)제1장 총칙
          제 1 조(목적) 본 약관은 회원이 주식회사 케이티(이하 “회사”라 합니다)가
          제공하는 “슬기로운 DS 생활”(이하 “서비스”라 합니다.)를 이용함에 있어
          불필요한 “회사”와 “회원”간의 권리, 의무 및 책임사항, “서비스”이용에
          따른 이용조건 및 절차 등 기타 필요한 제반 사항을 규정함을 목적으로
          합니다.제 2 조(약관의 효력 및 변경)제1장 총칙 제 1 조(목적) 본 약관은
          회원이 주식회사 케이티(이하 “회사”라 합니다)가 제공하는 “슬기로운 DS
          생활”(이하 “서비스”라 합니다.)를 이용함에 있어 불필요한 “회사”와
          “회원”간의 권리, 의무 및 책임사항, “서비스”이용에 따른 이용조건 및
          절차 등 기타 필요한 제반 사항을 규정함을 목적으로 합니다.제 2
          조(약관의 효력 및 변경)제1장 총칙 제 1 조(목적) 본 약관은 회원이
          주식회사 케이티(이하 “회사”라 합니다)가 제공하는 “슬기로운 DS
          생활”(이하 “서비스”라 합니다.)를 이용함에 있어 불필요한 “회사”와
          “회원”간의 권리, 의무 및 책임사항, “서비스”이용에 따른 이용조건 및
          절차 등 기타 필요한 제반 사항을 규정함을 목적으로 합니다.제 2
          조(약관의 효력 및 변경)제1장 총칙 제 1 조(목적) 본 약관은 회원이
          주식회사 케이티(이하 “회사”라 합니다)가 제공하는 “슬기로운 DS
          생활”(이하 “서비스”라 합니다.)를 이용함에 있어 불필요한 “회사”와
          “회원”간의 권리, 의무 및 책임사항, “서비스”이용에 따른 이용조건 및
          절차 등 기타 필요한 제반 사항을 규정함을 목적으로 합니다.제 2
          조(약관의 효력 및 변경)제1장 총칙 제 1 조(목적) 본 약관은 회원이
          주식회사 케이티(이하 “회사”라 합니다)가 제공하는 “슬기로운 DS
          생활”(이하 “서비스”라 합니다.)를 이용함에 있어 불필요한 “회사”와
          “회원”간의 권리, 의무 및 책임사항, “서비스”이용에 따른 이용조건 및
          절차 등 기타 필요한 제반 사항을 규정함을 목적으로 합니다.제 2
          조(약관의 효력 및 변경)제1장 총칙 제 1 조(목적) 본 약관은 회원이
          주식회사 케이티(이하 “회사”라 합니다)가 제공하는 “슬기로운 DS
          생활”(이하 “서비스”라 합니다.)를 이용함에 있어 불필요한 “회사”와
          “회원”간의 권리, 의무 및 책임사항, “서비스”이용에 따른 이용조건 및
          절차 등 기타 필요한 제반 사항을 규정함을 목적으로 합니다.제 2
          조(약관의 효력 및 변경)
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title @click="terms[1] = true">
          슬기로운 DS 생활 개인정보 처리방침 동의(필수)
          <template v-slot:actions="{ expanded }">
            <v-icon
              :color="terms[1] === false ? '' : 'teal'"
              :icon="terms[1] === false ? 'mdi-pencil' : 'mdi-check'"
            ></v-icon>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="wrap__agree">
          개인정보의 수집항목 및 수집/이용 목적 1. 회사는 회원가입, 상담, 서비스
          제공 등을 위하여 필요한 범위에서 최소한의 개인정보만을 수집합니다. 2.
          회사가 수집하는 개인정보 항목과 수집/이용하는 목적은 다음과 같습니다.
          \n\n회원가입 및 로그인에서...........
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title @click="terms[2] = true">
          슬기로운 DS 생활 개인정보 처리방침2 동의(필수)
          <template v-slot:actions="{ expanded }">
            <v-icon
              :color="terms[2] === false ? '' : 'teal'"
              :icon="terms[2] === false ? 'mdi-pencil' : 'mdi-check'"
            ></v-icon>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="wrap__agree">
          개인정보의 수집항목 및 수집/이용 목적 1. 회사는 회원가입, 상담, 서비스
          제공 등을 위하여 필요한 범위에서 최소한의 개인정보만을 수집합니다. 2.
          회사가 수집하는 개인정보 항목과 수집/이용하는 목적은 다음과 같습니다.
          \n\n회원가입 및 로그인에서...........
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-title @click="terms[3] = true">
          슬기로운 DS 생활 개인정보 처리방침 선택 동의(선택)
          <template v-slot:actions="{ expanded }">
            <v-icon
              :color="terms[3] === false ? '' : 'teal'"
              :icon="terms[3] === false ? 'mdi-pencil' : 'mdi-check'"
            ></v-icon>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text class="wrap__agree">
          개인정보의 수집항목 및 수집/이용 목적 1. 회사는 회원가입, 상담, 서비스
          제공 등을 위하여 필요한 범위에서 최소한의 개인정보만을 수집합니다. 2.
          회사가 수집하는 개인정보 항목과 수집/이용하는 목적은 다음과 같습니다.
          \n\n회원가입 및 로그인에서...........
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-btn
      :disabled="!(terms[0] && terms[1] && terms[2])"
      block
      @click="stepper = 1"
      >회원가입 진행하기</v-btn
    >
  </div>
  <div v-else-if="stepper === 1">
    <v-card>
      <v-card-title>회원가입</v-card-title>
      <v-card-item>
        <div class="p-2 mt-4">
          <v-form @submit.prevent="tryToRegisterIn">
            <v-form-group
              id="name-group"
              label="name"
              label-for="username"
              class="mb-3"
            >
              <v-text-field
                id="username"
                v-model="user.username"
                type="text"
                placeholder="이름"
                :class="{
                  'is-invalid': submitted && v$.user.username.$error,
                }"
              ></v-text-field>
              <div
                v-if="submitted && v$.user.username.required.$invalid"
                class="invalid-feedback"
              >
                이름을 입력하세요.
              </div>
            </v-form-group>

            <v-form-group
              id="fullname-group"
              label="Email"
              label-for="email"
              class="mb-3"
            >
              <v-text-field
                id="email"
                v-model="user.email"
                type="email"
                placeholder="이메일"
                :class="{
                  'is-invalid': submitted && v$.user.email.$error,
                }"
              ></v-text-field>
              <div
                v-if="submitted && v$.user.email.$error"
                class="invalid-feedback"
              >
                <span v-if="v$.user.email.required.$invalid"
                  >이메일를 입력해주세요.</span
                >
                <span v-if="v$.user.email.email.$invalid"
                  >올바르지 않은 이메일입니다.</span
                >
              </div>
            </v-form-group>

            <v-form-group
              id="password-group"
              label="Password"
              label-for="password"
              class="mb-3"
            >
              <v-text-field
                id="password"
                v-model="user.password"
                type="password"
                placeholder="암호"
                :class="{
                  'is-invalid': submitted && v$.user.password.$error,
                }"
              ></v-text-field>
              <div
                v-if="submitted && v$.user.password.required.$invalid"
                class="invalid-feedback"
              >
                비밀번호를 입력해주세요.
              </div>
            </v-form-group>
            <div class="mt-3 text-end">
              <v-btn type="submit" block>회원가입</v-btn>
            </div>
          </v-form>
        </div>
      </v-card-item>
    </v-card>
  </div>
  <div v-else>
    <v-card>
      <v-card-title>
        <h3 class="text-center">환영합니다!</h3>
        <h3 class="text-center"><span class="text-primary font-weight">{{user.username}}</span>님</h3>
      </v-card-title>
      <v-card-item>
        <p>회원가입이 성공적으로 완료되었습니다.<br> 로그인해주세요.</p>
        <v-btn block @click="onLogin">로그인</v-btn>
      </v-card-item>
    </v-card>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
export default {
  setup() {
    let terms = ref([false, false, false, false]);
    let stepper = ref(0);
    return { terms, stepper, v$: useVuelidate() };
  },
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
      },
      submitted: false,
      tryingToRegister: false,
      isRegisterError: false,
    };
  },
  validations() {
    return {
      user: {
        username: {
          required,
        },
        email: {
          required,
          email,
        },
        password: {
          required,
        },
      },
    };
  },
  methods: {
    // Try to register the user in with the email, username
    // and password they provided.
    tryToRegisterIn() {
      this.submitted = true;
      // stop here if form is invalid
      this.v$.$touch();

      if (!this.v$.$error) {
        // api 통신 필요.
        // register 하기.
        this.stepper = 2;
      }
    },
    onLogin(){
      this.$router.replace('/account/login');
    }
  },
};
</script>
<style scoped>
.wrap__agree {
  height: 150px;
  border: solid 1px #d5dade;
  margin: 10px 0;
  overflow-y: scroll;
}
</style>
