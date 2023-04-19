<script>
import { computed, onMounted, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import api from '@/api'
import regex from "@/utils/regex"
import sample from "@/assets/images/users/avatar_sample.png";

const contactValidator = (contact) => contact == "" || regex.phoneRegexCheck(contact);

export default {
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      user: {
        nickname: "닉네임1",
        contact: "01012345678",
      },
      submitted: false,
      flag: false, 
      profileImage: sample,
      imageFormData: null,
      menu:false,
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
  },
  methods: {
    async tryToUpdate() {
      this.submitted = true;

      this.v$.$touch();

      if (!this.v$.$error) {
        // const res = await api.post('/account/signup', this.user)
        // if (res.status === 200) {
        //   this.stepper = 2;
        // }
      } 
    },
    goToChangePass(){
      this.$router.push('/account/change-pass');
    },
    goToDeleteMember(){
      this.$router.push('/account/delete-member');
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      const fileName = file.name;
      const uploadNameInput = document.querySelector('.upload-name');
      const formData = new FormData();
      formData.append('profileImage', file);
      this.profileImage = URL.createObjectURL(file);
      this.imageFormData = formData;
      uploadNameInput.value = fileName;
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
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        location="bottom"
      >
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
                <v-btn icon="mdi-close-circle" variant="" @click="menu=false"></v-btn>
              </div>
            </v-list-item>
          </v-list>
        </v-card>
        
      </v-menu>

    </v-col>
  </v-row>
  
  <v-form @submit.prevent="tryToUpdate" class="overflow-show">
    
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

    <div class="mb-20"></div>

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
  <v-btn class="pph-25 font-sm button_main font-medium mt-0 mb-5" 
    variant="" @click="goToChangePass">
    비밀번호 변경 
  </v-btn>

  <v-divider :thickness="2" class="mt-4 mb-5"></v-divider>
  <p class="text-h6 font-weight-black mb-2">계정삭제</p>
  <div class="alert mb-2">
    <div>
      <div class="font-sm ml-5 mt-3 mb-3 mr-5 font_gray">
        회원 탈퇴일로부터 계정 정보(이메일/사내메일/닉네임/연락처/소속팀)는
        <span style="color:deepskyblue" class="font-bold">개인정보 보호방침</span>에 따라 <b>30일간 보관 및 잠김</b>되며, 30일 경과된 후에는 모든 개인 정보는 완전히 삭제되어 더 이상 복구할 수 없게 됩니다.
        작성된 게시글은 삭제되지 않으며, Dsquare로 소유권이 귀속됩니다.
      </div>
    </div>
  </div>
  <v-checkbox label="계정삭제 정책에 동의합니다." density="compact" v-model="flag"></v-checkbox>
  <v-btn class="pph-25 font-sm button_main font-medium mt-0 mb-5" 
    variant="" :disabled="!flag" @click="goToDeleteMember">
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

.pph-7{
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
	clip:rect(0,0,0,0);
	border: 0;
}
</style>


