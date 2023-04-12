<template>
  <div>
    <!-- 두개 다 보여주는 건 예시인거지 나중에는 하나만 보여주게 수정하세요. -->
    <!-- 이미지 형 유저 avatar -->
    <v-card class="mt-3">
      <h3>
        <v-avatar color="grey" size="120">
          <v-img cover src="@/assets/images/users/avatar_sample.png"></v-img>
        </v-avatar>
        <span class="font-weight">사진있는유저</span>
        <v-btn
          color="error"
          @click="logout"
        >
          로그아웃
        </v-btn>
      </h3>
    </v-card>
    <!-- text 형 유저 avatar -->
    <v-card class="mt-3">
      <h3>
        <v-avatar color="grey" size="120"> asdfsdfa </v-avatar>
        <span class="font-weight">사진없는유저</span>
        <v-btn
          color="error"
          @click="logout"
        >
          로그아웃
        </v-btn>
      </h3>
    </v-card>
  <v-divider :thickness="2" class="mt-4 mb-4"></v-divider>
  아래에 사용자 설정 넣으세요.
  </div>
</template>
<script>
import { computed, onMounted, ref } from "vue";
export default {
  setup() {
    return {};
  },
  methods: {
    logout() {
      this.$store.dispatch('info/setInfoToken', {accessToken: '', refreshToken: ''}); // 토큰값을 제거해줍니다.
      this.$router.push(process.env.VUE_APP_LOGIN);
    },
  },
};
</script>
