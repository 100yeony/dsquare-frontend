<script>
import { computed, onMounted, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import api from '@/api'
import regex from "@/utils/regex"

const ktEmailValidator = (email) => email == "" || new RegExp("[A-Za-z0-9]+@kt.com").test(email);
const contactValidator = (contact) => contact == "" || regex.phoneRegexCheck(contact);
const pwValidator = (pw) => pw == "" || new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$").test(pw);

export default {
  setup() {
    let terms = ref([false, false, false, false]);
    let stepper = ref(0);
    let categoryItems = ['플랫폼품질혁신TF', '플랫폼IT컨설팅vTF', '플랫폼서비스담당',
      'Digico서비스담당', 'Digico개발센터'];
    let subcategoryFullList = [
      [],
      [],
      ["메시징DX플랫폼팀", "서비스플랫폼팀",
        "금융결제DX플랫폼팀", "인증DX플랫폼팀"],
      ["미디어플랫폼팀", "AI서비스팀",
        "AICC서비스팀", "Safety플랫폼팀"],
      ["AgileCore팀", "Digico사업수행팀", "AICC딜리버리팀"],
    ];
    return { terms, stepper, v$: useVuelidate(), categoryItems, subcategoryFullList };
  },
  data() {
    return {
      user: {
        email: "",
        pw: "",
        nickname: "",
        name: "",
        contact: "",
        tid: "",
        ktMail: "",
      },
      category: [],
      subcategory: [],
      subcategoryItems: [],
      submitted: false,
      tryingToRegister: false,
      isRegisterError: false,
    };
  },
  validations() {
    return {
      user: {
        email: {
          required,
          email,
        },
        pw: {
          required,
          pwValidator
        },
        nickname: {
          required,
        },
        name: {
          required,
        },
        contact: {
          required,
          contactValidator
        },
        tid: {
          required,
        },
        ktMail: {
          required,
          ktEmailValidator,
          email,
        },
      },
    };
  },
  computed: {
    pwCaution() {
      if (this.submitted && this.v$.user.pw.required.$invalid) {
        return '비밀번호는 최소 8자 이상 입력하세요.';
      } else if (this.submitted && this.v$.user.pw.pwValidator.$invalid) {
        return '알파벳 대소문자, 숫자, 특수문자를 조합한 비밀번호를 입력하세요.'
      }
      return '';
    },
    emailCaution() {
      if (this.submitted && this.v$.user.email.required.$invalid) {
        return '아이디(이메일)를 입력해주세요.';
      } else if (this.submitted && this.v$.user.email.email.$invalid) {
        return '올바른 이메일 형식이 아닙니다.'
      }
      return '';
    },
    contactCaution() {
      if (this.submitted && this.v$.user.contact.required.$invalid) {
        return '연락처를 입력해주세요.';
      } else if (this.submitted && this.v$.user.contact.contactValidator.$invalid) {
        return '올바른 연락처 형식이 아닙니다.'
      }
      return '';
    },
    ktEmailCaution() {
      if (this.submitted && this.v$.user.ktMail.required.$invalid) {
        return '사내메일을 입력해주세요.';
      } else if (this.submitted && this.v$.user.ktMail.ktEmailValidator.$invalid) {
        return '올바른 사내메일 형식이 아닙니다.'
      }
      return '';
    },
    // teamCaution() {

    //   if (this.category === '플랫폼품질혁신TF' || this.category === '플랫폼IT컨설팅vTF') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },

    // let subcategoryFullList = [
    //   [],
    //   [],
    //   ["메시징DX플랫폼팀", "서비스플랫폼팀", 
    //     "금융결제DX플랫폼팀", "인증DX플랫폼팀"],
    //   ["미디어플랫폼팀", "AI서비스팀", 
    //     "AICC서비스팀", "Safety플랫폼팀"],
    //   ["AgileCore팀", "Digico사업수행팀", "AICC딜리버리팀"],

  },
  watch: {
    category(newVal, oldVal) {
      console.log(newVal)
      if (newVal === '플랫폼품질혁신TF') {
        this.user.tid = 16;
      } else if (oldVal === '플랫폼IT컨설팅vTF') {
        this.user.tid = 17;
      }
    },
    subcategory(newVal, oldVal) {
      console.log(newVal)
      if (newVal === '메시징DX플랫폼팀') {
        this.user.tid = 21;
      } else if (newVal === '서비스플랫폼팀') {
        this.user.tid = 22;
      } else if (newVal === '금융결제DX플랫폼팀') {
        this.user.tid = 23;
      } else if (newVal === '인증DX플랫폼팀') {
        this.user.tid = 24;
      } else if (newVal === '미디어플랫폼팀') {
        this.user.tid = 25;
      } else if (newVal === 'AI서비스팀') {
        this.user.tid = 26;
      } else if (newVal === 'AICC서비스팀') {
        this.user.tid = 27;
      } else if (newVal === 'Safety플랫폼팀') {
        this.user.tid = 28;
      } else if (newVal === 'AgileCore팀') {
        this.user.tid = 29;
      } else if (newVal === 'Digico사업수행팀') {
        this.user.tid = 30;
      } else if (newVal === 'AICC딜리버리팀') {
        this.user.tid = 31;
      }
    }
  },
  methods: {
    cancel() {
      this.$router.push(process.env.VUE_APP_LOGIN);
    },
    // Try to register the user in with the email, username
    // and password they provided.
    async tryToRegisterIn() {
      console.log("registerregister")
      this.submitted = true;
      // stop here if form is invalid

      this.v$.$touch();

      if (!this.v$.$error) {
        // api 통신 필요.
        // register 하기.

        // this.user.tid = 1 // 추후에 input 값에 따라 매칭 시켜야됨

        // axios.post('/account/signup', this.user)
        //   .then(response => {
        //     if (response.status === 200) {
        //       this.stepper = 2;
        //     }
        //   })
        //   .catch(error => {
        //     console.log('error=>' + this.user)
        //   });
        const res = await api.post('/account/signup', this.user)
        if (res.status === 200) {
          this.stepper = 2;
        }

      } else {
        this.moveToTopTextFieldScroll();
      }
    },
    onLogin() {
      this.$router.replace('/account/login');
    },
    moveToTopTextFieldScroll() {
      this.$refs.emailTextField.scrollIntoView();
    },
    categoryChanged() {
      console.log("categoryChanged")
      this.subcategory = [];
      var categoryIndex = this.categoryItems.indexOf(this.category);
      if (categoryIndex != 0) {
        this.subcategoryItems = this.subcategoryFullList[categoryIndex];
      }
      else {
        this.subcategoryItems = [];
      }
    },
  }
}
</script>
<template class="font-sm">
  <v-container class="ph-65 pw-100">
    <v-row class="ph-100">
      <v-col class="pw-100" align-self="center" v-if="stepper === 0">
        <v-container class="pw-95 max-pw">
          <h2 class="text-primary text-center mb-5 font-bold">회원가입</h2>
          <div class="pph-10 text-center font-sm mb-7 font_gray">
            회원 가입을 진행하시려면 아래의 약관에 동의해주세요.
          </div>

          <v-expansion-panels class="mt-4 button_white" variant="">
            <v-expansion-panel>
              <v-expansion-panel-title class="font-sm" @click="terms[0] = true">
                DSquare 이용약관(필수)
                <template v-slot:actions="{ expanded }">
                <v-icon :color="terms[0] === false ? '#ABABAB' : 'teal'"
                  :icon="terms[0] === false ? 'mdi-checkbox-blank-outline' : 'mdi-check'"></v-icon>
              </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="wrap__agree font-xs">
                <h3>
                  제1장 총칙 제 1 조(목적)
                </h3>
                <p class="mb-3">
                  본 약관은 회원이 주식회사 케이티(이하 "회사"라 합니다)가 제공하는 "디스퀘어"(이하 "서비스"라 합니다.)를 이용함에 있어 불필요한 "회사"와 "회원"간의 권리, 의무 및
                  책임사항,
                  "서비스"이용에 따른 이용조건 및 절차 등 기타 필요한 제반사항을 규정함을 목적으로 합니다.
                </p>

                <h3>
                  제 2 조 (약관의 효력 및 개정)
                </h3>
                <p class="mb-3">
                  ① 본 약관의 내용은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공시하고, 이에 동의한 회원이 서비스에 가입함으로써 효력이 발생합니다.<br />
                  ② 회사는 본 약관의 내용과 회사의 상호, 영업소 소재지, 대표자 성명, 사업자 등록번호, 연락처(전화, 팩스, 전자우편주소 등)등을 회원이 알 수 있도록 서비스 초기 화면에
                  게시합니다.<br />
                  ③ 본 약관은 회사가 필요하다고 인정되는 경우 대한민국 법령의 범위 내에서 개정할 수 있으며, 회사가 약관을 개정할 경우에는 적용예정일 및 개정사유를 명시하여 현행 약관과 함께
                  서비스 초기화면에 그
                  적용예정일 7일 전부터 공지합니다. 다만, 회원에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두 고 공지하는 것 외에 이메일 발송 등 전자적
                  수단을 통해 별도로
                  통지합니다.<br />
                  ④ 회원은 개정된 약관에 대해 동의하지 않을 권리가 있으며, 개정된 약관에 동의하지 않을 경우 이용계약을 해지할 수 있습니다. 단 회사가 전항에서 정한 사전 유예기간 내에
                  의사표시를 하지 않으면
                  개정된 약관에 동의 한다는 것으로 본다는 뜻을 명확하게 공지 또는 통지 하였음에도 회원이 명시적으로 거부의사를 표시하지 않거나 이용계약을 해지 하지 않은 경우 회원이 개정약관에
                  동의한 것으로
                  봅니다.<br />
                  ⑤ 회사는 개별 서비스에 대해서는 별도의 이용약관 및 규정, 세부 이용지침 등을 둘 수 있으며, 해당 내용이 본 약관과 상충할 경우에는 개별서비스 약관이 우선하여 적용됩니다.
                </p>


                <h3>
                  제 3 조 (약관외 준칙)
                </h3>
                <p class="mb-3">
                  본 약관에 명시되지 않은 사항은 전기통신기본법, 전기통신사업법 및 전자거래기본법, 전자상거래 등에서의 소비자보호에 관한 법률 등 관계법령 또는 상관례에 따릅니다.
                </p>

                <h3>
                  제 4 조 (용어의 정의)
                </h3>
                <p class="mb-3">
                  ① 본 약관에서 사용하는 용어의 정의는 다음과 같습니다.<br />
                  1. 서비스: 회사가 이용자 또는 회원에게 PC, 휴대용 단말기등 각종 유무선 기기 또는 프로그램을 통하여 이용할 수 있도록 제공하는 모든 서비스<br />
                  2. 회원 : 회사에서 제공하는 사이트에 접속하여 본 약관과 개인정보처리방침에 동의하고, 아이디(ID)와 비밀번호(Password)를 발급 받은 고객으로 회원의 자격 및 권한은
                  회원유형별로
                  관리합니다.(회원의 자격 및 권한 등은 본 약관에서 정한 바에 따라 일부 제한될 수 있음)<br />
                  3. 사이트 : 서비스를 제공하기 위해 회사가 제작한 웹(Web)기반 유무선 홈페이지 및 어플리케이션(APP)<br />
                  4. 아이디(ID) : 회사가 회원 식별과 회원의 서비스 이용을 위해 필요한 식별자를 의미하며, 회원이 지정한 고유 email ID이어야 합니다.<br />
                  5. 비밀번호(Password) : 회사가 회원이 ID와 일치되는 회원임을 확인하고 회원 비밀 보호를 위해 사용하는 수단으로 ID의 개수와 관계없이 회원별로 하나의 비밀번호만
                  설정,이용이
                  가능합니다.<br />
                  6. 연락처 : 회원의 고유 전화번호를 말합니다.<br />
                  7. 사내메일: 사내망 업무 메일을 말합니다.(kt.com 도메인만 허용)<br />
                  8. 게시판 : 서비스가 제공하는 글, 영상, 이미지, 음악 등의 게시물 업로드를 할 수 있는 플랫폼을 말합니다.<br />
                  9. 게시물 : 회원이 올린 영상, 글, 사진, 그림, 각종 파일과 링크, 각종 답글 등의 정보의 총칭을 말합니다.<br />
                  ② 이 약관에서 사용하는 용어의 정의는 제1항에서 정하는 것을 제외하고는 관계 법령 및 서비스별 안내에서 정하는 바에 의합니다.
                </p>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title class="font-sm" @click="terms[1] = true">
                DSquare 개인정보 처리방침(필수)
                <template v-slot:actions="{ expanded }">
                  <v-icon :color="terms[1] === false ? '#ABABAB' : 'teal'"
                    :icon="terms[1] === false ? 'mdi-checkbox-blank-outline' : 'mdi-check'"></v-icon>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="wrap__agree font-xs">
                <p class="mb-1">회사는 다음과 같이 개인정보·개인위치정보·신용정보를 수집 및 보유하고 있습니다.</p>
                <p class="mb-1">1. 서비스 제공을 위해 필요한 최소한의 개인정보만을 수집·이용하며, 사상, 신념, 가족 및 친인척관계, 학력(學歷)·병력(病歷), 기타 사회활동 경력
                  등 고객님의
                  권리·이익이나 사생활을 뚜렷하게 침해할 우려가 있는 개인정보는 수집하지 않습니다.</p>
                <p class="mb-1">2. 고객님께서 동의하시거나 다른 법률에 따라 특별히 수집 대상 개인정보로 허용된 경우에는 필요한 범위에서 최소한으로 위 개인정보를 수집할 수
                  있습니다.</p>
                <p class="mb-1">3. 법령에 따라 수집 목적과 합리적으로 관련된 범위에서는 고객님의 동의없이 개인정보를 이용할 수 있으며, 이 때 '당초 수집 목적과 관련성이 있는지,
                  수집한 정황 또는
                  처리 관행에 비추어 볼 때 예측 가능성이 있는지, 고객님의 이익을 부당하게 침해하는 지, 가명처리 또는 암호화 등 안전성 확보에 필요한 조치를 하였는지'를 종합적으로
                  고려합니다.</p>
                <p class="mb-1">4. 수집한 개인정보를 특정 개인을 알아볼 수 없도록 가명처리하여 통계작성, 과학적 연구, 공익적 기록보존 등의 목적으로 고객님의 동의 없이 처리할 수
                  있습니다. 이 때
                  가명정보는 재식별되지 않도록 추가정보와 분리하여 별도 저장/관리하고 필요한 기술적·관리적 보호조치를 취합니다.</p>
                <p class="mb-1">가. 필수 수집·이용 목적, 항목 및 보유기간</p>
                <p>목적 1: 디스퀘어 ID 만들기 및 디스퀘어 회원의 서비스 이용</p>
                <p>항목 : 아이디, 비밀번호, 닉네임, 이름, 연락처, 소속팀, 사내메일</p>
                <p>보유기간 : 회원탈퇴 후 6개월</p>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel>
              <v-expansion-panel-title class="font-sm" @click="terms[2] = true">
                DSquare 개인정보 수집방법(필수)
                <template v-slot:actions="{ expanded }">
                  <v-icon :color="terms[2] === false ? '#ABABAB' : 'teal'"
                    :icon="terms[2] === false ? 'mdi-checkbox-blank-outline' : 'mdi-check'"></v-icon>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="wrap__agree font-xs">
                <p class="mb-1">회사는 다음과 같은 방법으로 개인정보를 수집합니다.</p>
                <p class="mb-1">1. 모바일 앱, 인터넷 홈페이지를 통한 회원 가입 과정에서 수집</p>
                <p class="mb-1">2. 서비스 이용 또는 업무 처리 과정에서 생성되거나 생성정보 수집 툴을 통한 수집 등</p>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <!-- 
                                              <v-expansion-panel>
                                                <v-expansion-panel-title @click="terms[3] = true">
                                                  디스퀘어 개인정보 처리방침 선택 동의(선택)
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
                                        -->
          </v-expansion-panels>

          <v-btn :disabled="!(terms[0] && terms[1] && terms[2])" block @click="stepper = 1"
            class="mt-30 mb-5 font-sm button_main font-medium" variant="">회원가입 하기</v-btn>

          <div style="float: center;" class="font-sm text-center">
            이미 회원이신가요?
            <router-link to="/account/login/" class="text-primary font-sm n_td">로그인</router-link>
          </div>
        </v-container>
      </v-col>
      <!-- 회원가입 페이지 -->
      <v-col class="pw-100 ph-80" align-self="center" v-else-if="stepper === 1">
        <h2 class="text-primary text-center font-bold">회원가입</h2>
        <div class="pph-10 text-center font-sm mb-5 mt-2 font_gray">
          회원가입에 필요한 정보를 입력해주세요.
        </div>

        <v-form @submit.prevent="tryToRegisterIn" class="overflow-show">
          <v-container class="pw-95 max-pw">
            <v-form-group id="email-group" label="Email" label-for="email" class="">
              <label for="useremail" class="font-sm font-medium" ref="emailTextField">아이디(이메일)</label>
              <v-text-field type="text" v-model="user.email" variant="outlined" single-line hide-details id="useremail"
                density="compact" :class="{ 'is-invalid': submitted && v$.user.email.$error }" class="font-sm mt-2"
                placeholder="gildonghong@dspace.kr">
              </v-text-field>
              <div v-if="submitted && v$.user.email.$error" class="invalid-feedback">
                <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                <span class="font-xs font_red">{{ emailCaution }}</span>
              </div>
            </v-form-group>

            <div class="mb-20"></div>

            <v-form-group id="pw-group" label="Pw" label-for="pw">
              <label for="password" class="font-sm font-medium"> 비밀번호</label>
              <v-text-field type="password" v-model="user.pw" variant="outlined" single-line hide-details id="password"
                density="compact" :class="{ 'is-invalid': submitted && v$.user.pw.$error }" class="font-sm mt-2"
                placeholder="8~20자 이내로 입력해주세요">
              </v-text-field>

              <div v-if="submitted && v$.user.pw.$error">
                <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                <span class="font-xs font_red">{{ pwCaution }}</span>
              </div>

            </v-form-group>

            <div class="mb-20"></div>

            <v-form-group id="nickname-group" label="Nickname" label-for="nickname">
              <label for="nickname" class="font-medium font-sm">닉네임</label>
              <v-text-field type="text" v-model="user.nickname" variant="outlined" single-line hide-details
                class="form-control font-sm mt-2" id="nickname" density="compact" :class="{
                  'is-invalid': submitted && v$.user.nickname.$error,
                }" placeholder="닉네임1" />
              <div v-if="submitted && v$.user.nickname.required.$invalid" class="invalid-feedback">
                <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                <span class="font-xs font_red">닉네임을 입력해주세요.</span>
              </div>
            </v-form-group>

            <div class="mb-20"></div>

            <v-form-group id="name-group" label="Name" label-for="name">
              <label for="name" class="font-medium font-sm">이름</label>
              <v-text-field type="text" v-model="user.name" variant="outlined" single-line hide-details
                class="form-control font-sm mt-2" id="name" density="compact" :class="{
                  'is-invalid': submitted && v$.user.name.$error,
                }" placeholder="홍길동" />
              <div v-if="submitted && v$.user.name.required.$invalid" class="invalid-feedback">
                <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                <span class="font-xs font_red">이름을 입력해주세요.</span>
              </div>
            </v-form-group>

            <div class="mb-20"></div>

            <v-form-group id="contact-group" label="Contact" label-for="contact">
              <label for="contact" class="font-medium font-sm">연락처</label>
              <v-text-field type="text" v-model="user.contact" variant="outlined" single-line hide-details
                class="form-control font-sm mt-2" id="contact" density="compact" :class="{
                  'is-invalid': submitted && v$.user.contact.$error,
                }" placeholder="01012345678" />

              <div v-if="submitted && v$.user.contact.$error">
                <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                <span class="font-xs font_red">{{ contactCaution }}</span>
              </div>


            </v-form-group>

            <div class="mb-20"></div>

            <v-form-group id="teamId-group" label="TeamId" label-for="teamId">
              <!-- <v-text-field type="text" v-model="user.teamId" variant="outlined" single-line hide-details
                      class="form-control font-sm mt-2" id="teamId" density="compact" :class="{
                        'is-invalid': submitted && v$.user.teamId.$error,
                      }" /> -->
              <v-row justify="center">
                <v-col>
                  <label for="category" class="font-medium font-sm">부서</label>
                  <v-select v-model="category" class="text-truncate mt-2" placeholder="부서" variant="outlined"
                    density="compact" :items="categoryItems" @update:modelValue="categoryChanged" id="category"
                    hide-details></v-select>
                </v-col>
                <v-col>
                  <label for="subcategory" class="font-medium font-sm">소속팀</label>
                  <v-select v-model="subcategory" class="text-truncate mt-2" placeholder="소속팀" variant="outlined"
                    density="compact" :items="subcategoryItems" :disabled="!subcategoryItems.length" id="subcategory"
                    hide-details></v-select>
                </v-col>
              </v-row>
              <div v-if="submitted && v$.user.tid.required.$invalid" class="invalid-feedback">
                <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                <span class="font-xs font_red">부서와 소속팀을 선택해주세요.</span>
              </div>
            </v-form-group>

            <div class="mb-20"></div>

            <v-form-group id="email-group" label="KtMmail" label-for="ktMail">
              <label for="ktMail" class="font-medium font-sm">사내메일</label>
              <v-text-field type="text" v-model="user.ktMail" variant="outlined" single-line hide-details
                class="form-control font-sm mt-2" id="ktMail" density="compact" :class="{
                  'is-invalid': submitted && v$.user.ktMail.$error,
                }" placeholder="gildonghong@kt.com" />

              <div v-if="submitted && v$.user.ktMail.$error">
                <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
                <span class="font-xs font_red">{{ ktEmailCaution }}</span>
              </div>
            </v-form-group>

            <v-btn class="pph-25 font-sm button_main font-medium mt-30 mb-5" type="submit" variant="">
              회원가입
            </v-btn>

            <div style="float: center;" class="font-sm text-center mb-50">
              이미 회원이신가요?
              <router-link to="/account/login/" class="text-primary font-sm n_td">로그인</router-link>
            </div>
          </v-container>
        </v-form>
      </v-col>
      <v-col class="pw-100 ph-70" align-self="center" v-else>
        <div class="text-center">
          <img src="@/assets/images/celebration.png" width="90" height="90">
          <h2 class="text-primary mt-20 font-bold">{{ this.user.email }} 님</h2>
          <h2 class="font-bold">환영합니다!</h2>
        </div>
        <div class="text-center">
          <div class="col-12 mt-30">
            <v-btn max-width="180" type="submit" class="pw-50 font-medium button_main" variant="" @click="onLogin">
              로그인
            </v-btn>
          </div>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.wrap__agree {
  height: 150px;
  border: solid 1px #d5dade;
  margin: 10px 0;
  overflow-y: scroll;
}

.large-icon {
  font-size: 3rem;
}

.button_main {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

.button_white {
  border-width: 1px;
  border-style: solid;
  border-color: lightgray;
  color: black;
}

.max-pw {
  max-width: 500px;
  width: 95% !important;
}

span {
  padding: 0px 5px !important;
}
</style>


