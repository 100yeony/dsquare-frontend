<script>
import { computed, onMounted, ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";
import api from '@/api'
import regex from "@/utils/regex"
import sample from "@/assets/images/users/profile_default.png";
import store from '@/store';


export default {
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      userId: this.$route.query.userId,
      user: {
        nickname: '',
        contact: "",
        email: "",
        upperTname: "",
        lowerTname: "",
        name: "",
        ktMail: "",
        role: [], 
      },
      submitted: false,
      flag: false,
      profileImage: null,
      imageFormData: null,
      menu: false,
      selected: [],
    };
  },
  validations() {
    
  },
  computed: {

  },
  watch: {
    
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
        this.user.role = response.data.role; 
        if (response.data.teamHierarchy.length === 1) {
          this.user.lowerTname = response.data.teamHierarchy[0];
        } else {
          this.user.upperTname = response.data.teamHierarchy[0];
          this.$nextTick(() => {
            this.user.lowerTname = response.data.teamHierarchy[1];
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
  },
  methods: {
    async tryToUpdate() {
      this.submitted = true;
      this.v$.$touch();

      if (!this.v$.$error) {
        const res = await api.patch('admin/members/' + this.userId, {
          role: this.selected, 
        })
        console.log(res)
      }
    },
    async requestUserData() {
      var res = await api.get('member/members/' + this.userId, '');
      return res;
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
<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-avatar color="grey" size="70" class="ma-5">
          <v-img cover :src="profileImage"></v-img>
        </v-avatar>
      </v-col>
      <v-col class="mt-7 mr-5 ml-2">
        <v-card-title>
          {{ this.user.name }}
        </v-card-title>
        <v-card-subtitle>
          {{this.user.lowerTname}}
        </v-card-subtitle>
      </v-col>
    </v-row>
    <v-label class="mt-2">닉네임</v-label>
    <v-text-field variant="underlined" density="compact" v-model="this.user.nickname" readonly hide-details></v-text-field>
    <v-label class="mt-5">연락처</v-label>
    <v-text-field variant="underlined" density="compact" v-model="this.user.contact" readonly hide-details></v-text-field>
    <v-label class="mt-5">이메일</v-label>
    <v-text-field variant="underlined" density="compact" v-model="this.user.email" readonly hide-details></v-text-field>
    <v-label class="mt-5">사내메일</v-label>
    <v-text-field variant="underlined" density="compact" v-model="this.user.ktMail" readonly hide-details></v-text-field>
    
    <v-form @submit.prevent="tryToUpdate" class="overflow-show">

      <v-label class="mt-5 mb-3">권한</v-label>
      <!-- <p>{{ selected }}</p> -->
      <v-row>
        <v-col cols="3" class="v-col-3_custom">
          <v-checkbox v-model="selected" label="회원" value="USER" hide-details></v-checkbox>
        </v-col>
        <v-col cols="4">
          <v-checkbox v-model="selected" label="관리자" value="ADMIN" hide-details></v-checkbox>
        </v-col>
        <v-col cols="4">
          <v-checkbox v-model="selected" label="담당자" value="MANAGER" hide-details></v-checkbox>
        </v-col>
        <v-col cols="5">
          <v-checkbox v-model="selected" label="카드소유자" value="OWNER" hide-details></v-checkbox>
        </v-col>
      </v-row>

      <div class="d-flex justify-end">
        <v-btn class="pph-7 button_main font-medium mt-5 mb-2" type="submit" variant="">
          권한 수정 
        </v-btn>
      </div>
    </v-form>

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
.v-card-title{
  padding: 0rem 1rem !important; 
}

::v-deep .v-field__input {
  padding-top: 0rem !important;
}

.v-col-3_custom {
  padding: 0rem !important; 
}

.v-col-4{
  padding: 0rem !important; 
}
.v-col-5{
  padding: 0rem !important; 
}

::v-deep .v-checkbox .v-selection-control {
  min-height: 1rem !important;
}
</style>


