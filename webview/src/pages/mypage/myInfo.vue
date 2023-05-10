<script>
import { computed, onMounted, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import api from '@/api'
import regex from "@/utils/regex"
import sample from "@/assets/images/users/profile_default.png";
import store from '@/store';

const contactValidator = (contact) => contact == "" || regex.phoneRegexCheck(contact);
const ktEmailValidator = (email) => email == "" || new RegExp("[A-Za-z0-9]+@kt.com").test(email);

export default {
  setup() {
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

    return {
      v$: useVuelidate(), categoryItems, subcategoryFullList
    };
  },
  data() {
    return {
      userId: store.getters["info/infoUser"].userId,
      user: {
        nickname: '',
        contact: "",
        email: "",
        tid: "",
        name: "",
        ktMail: "",
      },
      category: [],
      subcategory: [],
      subcategoryItems: [],
      submitted: false,
      flag: false,
      profileImage: null,
      imageFormData: null,
      menu: false,
    };
  },
  validations() {
    return {
      user: {
        nickname: {
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
  },
  watch: {
    category(newVal, oldVal) {
      console.log(newVal)
      if (newVal === '플랫폼품질혁신TF') {
        this.user.tid = 1;
      } else if (newVal === '플랫폼IT컨설팅vTF') {
        this.user.tid = 2;
      } else {
        this.user.tid = '';
      }
      console.log(this.user.tid)
    },
    subcategory(newVal, oldVal) {
      console.log(newVal)
      if (newVal === '메시징DX플랫폼팀') {
        this.user.tid = 6;
      } else if (newVal === '서비스플랫폼팀') {
        this.user.tid = 7;
      } else if (newVal === '금융결제DX플랫폼팀') {
        this.user.tid = 8;
      } else if (newVal === '인증DX플랫폼팀') {
        this.user.tid = 9;
      } else if (newVal === '미디어플랫폼팀') {
        this.user.tid = 10;
      } else if (newVal === 'AI서비스팀') {
        this.user.tid = 11;
      } else if (newVal === 'AICC서비스팀') {
        this.user.tid = 12;
      } else if (newVal === 'Safety플랫폼팀') {
        this.user.tid = 13;
      } else if (newVal === 'AgileCore팀') {
        this.user.tid = 14;
      } else if (newVal === 'Digico사업수행팀') {
        this.user.tid = 15;
      } else if (newVal === 'AICC딜리버리팀') {
        this.user.tid = 16;
      }
    }
  },
  mounted() {
    const userData = this.requestUserData();
    userData.then(
      (response) => {
        console.log('user infooooooo', response)
        this.user.nickname = response.data.nickname;
        this.user.name = response.data.name;
        this.user.email = response.data.email;
        this.user.contact = response.data.contact;
        if (response.data.teamHierarchy.length === 1) {
          this.category = response.data.teamHierarchy[0];
        } else {
          this.category = response.data.teamHierarchy[0];
          this.$nextTick(() => {
            this.subcategory = response.data.teamHierarchy[1];
          })
        }
        this.user.ktMail = response.data.ktMail;
        if (response.data.profileImage == null) {
          this.profileImage = sample
        } else {
          this.profileImage = response.data.profileImage;
        }
      }
    );
    console.log(userData)
  },
  methods: {
    async requestUserData() {
      var res = await api.get('member/members/' + this.userId, '');
      return res;
    },
    async tryToUpdate() {
      this.submitted = true;

      this.v$.$touch();

      if (!this.v$.$error) {
        const res = await api.patch('member/members/' + this.userId, {
          contact: this.user.contact,
          tid: this.user.tid,
        })
        console.log(res)
      }
    },
    goToChangePass() {
      this.$router.push({
        path: process.env.VUE_APP_CHANGEPASS,
        query: {
          email: this.user.email
        }
      });
    },
    goToDeleteMember() {
      this.$router.push('/account/delete-member');
    },
    async handleImageUpload(event) {
      const file = event.target.files[0];
      const fileName = file.name;
      const uploadNameInput = document.querySelector('.upload-name');
      const formData = new FormData();
      formData.append('image', file);
      this.profileImage = URL.createObjectURL(file);
      this.imageFormData = formData;
      uploadNameInput.value = fileName;

      const res = await api.patch('member/members/' + this.userId + '/profile/image', this.imageFormData)
      console.log(res)
    },
    categoryChanged() {
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
<template v-if="stepper === 0">
  <p class="text-h6 font-weight-black mb-30">회원정보</p>

  <v-row>
    <v-col cols="3">
      <v-avatar color="grey" size="70">
        <v-img cover :src="profileImage"></v-img>
      </v-avatar>
      <!-- <input type="file" @change="handleImageUpload"> -->
    </v-col>
    <v-col>
      <v-menu v-model="menu" :close-on-content-click="false" location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn class="button_white font-medium mt-30 mb-5" variant="" v-bind="props">
            변경
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item>
              <div class="d-flex justify-start">
                <div class="filebox bs3-primary">
                  <input class="upload-name" disabled="disabled" value="파일선택">
                  <label for="ex_filename" class="font-sm font-bold">업로드</label>
                  <input type="file" id="ex_filename" class="upload-hidden" @change="handleImageUpload">
                </div>
                <v-btn icon="mdi-close-circle" variant="" @click="menu = false"></v-btn>
              </div>
            </v-list-item>
          </v-list>
        </v-card>

      </v-menu>

    </v-col>
  </v-row>

  <v-form @submit.prevent="tryToUpdate" class="overflow-show">

    <v-form-group id="name-group" label="Name" label-for="name">
      <label for="name" class="font-medium font-sm">이름</label>
      <v-text-field type="text" v-model="user.name" variant="outlined" single-line hide-details
        class="form-control font-sm mt-2" id="name" density="compact" disabled />
    </v-form-group>

    <div class="mb-3"></div>

    <v-form-group id="email-group" label="Email" label-for="email">
      <label for="email" class="font-medium font-sm">이메일</label>
      <v-text-field type="text" v-model="user.email" variant="outlined" single-line hide-details
        class="form-control font-sm mt-2" id="email" density="compact" disabled />
    </v-form-group>

    <div class="mb-3"></div>

    <v-form-group id="nickname-group" label="Nickname" label-for="nickname">
      <label for="nickname" class="font-medium font-sm">닉네임</label>
      <v-text-field type="text" v-model="user.nickname" variant="outlined" single-line hide-details
        class="form-control font-sm mt-2" id="nickname" density="compact" :class="{
          'is-invalid': submitted && v$.user.nickname.$error,
        }" placeholder="닉네임을 입력해주세요." />
      <div v-if="submitted && v$.user.nickname.required.$invalid" class="invalid-feedback">
        <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
        <span class="font-xs font_red">닉네임을 입력해주세요.</span>
      </div>
    </v-form-group>

    <div class="mb-3"></div>

    <v-form-group id="contact-group" label="Contact" label-for="contact">
      <label for="contact" class="font-medium font-sm">연락처</label>
      <v-text-field type="text" v-model="user.contact" variant="outlined" single-line hide-details
        class="form-control font-sm mt-2" id="contact" density="compact" :class="{
          'is-invalid': submitted && v$.user.contact.$error,
        }" placeholder="연락처를 입력해주세요." />

      <div v-if="submitted && v$.user.contact.$error">
        <v-icon size="x-small" color="red">mdi-close-circle-outline</v-icon>
        <span class="font-xs font_red">{{ contactCaution }}</span>
      </div>
    </v-form-group>

    <div class="mb-3"></div>

    <v-form-group id="teamId-group" label="TeamId" label-for="teamId">
      <!-- <v-text-field type="text" v-model="user.teamId" variant="outlined" single-line hide-details
              class="form-control font-sm mt-2" id="teamId" density="compact" :class="{
                'is-invalid': submitted && v$.user.teamId.$error,
              }" /> -->
      <v-row justify="center">
        <v-col>
          <label for="category" class="font-medium font-sm">부서</label>
          <v-select v-model="category" class="text-truncate mt-2" placeholder="부서" variant="outlined" density="compact"
            :items="categoryItems" @update:modelValue="categoryChanged" id="category" hide-details></v-select>
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

    <div class="mb-3"></div>

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


    <div class="d-flex justify-end">
      <v-btn class="pph-7 button_main font-medium mt-30 mb-2" type="submit" variant="">
        저장
      </v-btn>
    </div>

  </v-form>

  <!-- 두개 다 보여주는 건 예시인거지 나중에는 하나만 보여주게 수정하세요. -->
  <!-- text 형 유저 avatar -->
  <!-- <v-card class="mt-3">
      <h3>
        <v-avatar color="grey" size="120"> asdfsdfa </v-avatar>
        <span class="font-weight">사진없는유저</span>
        
      </h3>
    </v-card> -->
  <v-divider :thickness="2" class="mt-4 mb-5"></v-divider>

  <p class="text-h6 font-weight-black mb-20">비밀번호</p>
  <v-btn class="pph-25 font-sm button_main font-medium mt-0 mb-5" variant="" @click="goToChangePass">
    비밀번호 변경
  </v-btn>

  <v-divider :thickness="2" class="mt-4 mb-5"></v-divider>
  <p class="text-h6 font-weight-black mb-2">계정삭제</p>
  <div class="alert mb-2">
    <div>
      <div class="font-sm ml-5 mt-3 mb-3 mr-5 font_gray">
        회원 탈퇴일로부터 계정 정보(이메일/사내메일/닉네임/연락처/소속팀)는
        <span style="color:deepskyblue" class="font-bold">개인정보 보호방침</span>에 따라 <b>30일간 보관 및 잠김</b>되며, 30일 경과된 후에는 모든 개인
        정보는 완전히 삭제되어 더 이상 복구할 수 없게 됩니다.
        작성된 게시글은 삭제되지 않으며, Dsquare로 소유권이 귀속됩니다.
      </div>
    </div>
  </div>
  <v-checkbox label="계정삭제 정책에 동의합니다." density="compact" v-model="flag"></v-checkbox>
  <v-btn class="pph-25 font-sm button_main font-medium mt-0 mb-5" variant="" :disabled="!flag" @click="goToDeleteMember">
    회원탈퇴
  </v-btn>
</template>
<style lang="scss" scoped>
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

.pph-7 {
  padding-left: 7% !important;
  padding-right: 7% !important;
}

.alert {
  border-width: 1px;
  border-style: solid;
  border-color: #ABABAB;
  border-radius: 0.375rem;
}

.filebox .upload-name {
  display: inline-block;
  padding: .5em .75em;
  background-color: #f5f5f5;
  border: 1px solid #ebebeb;
  border-bottom-color: #e2e2e2;
  border-radius: .25em;
}

.filebox.bs3-primary label {
  color: #fff;
  background-color: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
}

.filebox label {
  display: inline-block;
  padding: .5em .75em;
  color: #999;
  background-color: #fdfdfd;
  cursor: pointer;
  border: 1px solid #ebebeb;
  border-bottom-color: #e2e2e2;
  border-radius: .25em;
}

.filebox input[type="file"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>


