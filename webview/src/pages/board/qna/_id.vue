<template>
  <v-card>
    <v-card-item>
      <div class="text-h7">
        <span class="font-74CEBE">Q </span>안녕하세요 궁금한 것이 있어
        질문드립니다.
      </div>
      <v-row class="mb-2" align="center">
        <v-col cols="2">
          <v-avatar color="grey">유저</v-avatar>
        </v-col>
        <v-col cols="5">
          <div class="text-body font-bold">작성자</div>
        </v-col>
        <v-col cols="3">
          <div class="text-caption font-0000008F">2023-04-01</div>
        </v-col>
        <v-col cols="2">
          <v-icon>mdi-dots-horizontal</v-icon>
        </v-col>
      </v-row>
      <div>
        안녕하세요<br />
        현재 000 진행중인데 개발환경 세팅 어쩍 저쩌고<br />
        내용내용내용<br />
        내용 어떻게 해야 하나요??<br />
        아시는분들 도움 주세요!!!!!!!!!!<br />
        ㅠㅜㅠㅜㅠㅜㅠㅜㅜㅠ
      </div>

      <v-row>
        <v-col cols="2" class="center-container"
          ><img src="@/assets/images/icons/icon_heart.png" /><span
            class="text-caption font-0000008F"
            >123</span
          ></v-col
        >
        <v-col cols="2" class="center-container"
          ><img src="@/assets/images/icons/icon_message-circle.png" /><span
            class="text-caption font-0000008F"
            >2</span
          ></v-col
        >
      </v-row>
      <v-slide-group>
        <v-slide-group-item>
          <v-chip class="ma-2">#백엔드</v-chip>
        </v-slide-group-item>
        <v-slide-group-item>
          <v-chip class="ma-2">#springboot</v-chip>
        </v-slide-group-item>
        <v-slide-group-item>
          <v-chip class="ma-2">#springboot</v-chip>
        </v-slide-group-item>
      </v-slide-group>
    </v-card-item>
  </v-card>

  <v-card class="mt-4">
    <v-card-item>
      <div class="text-body-2 font-bold">답변 작성</div>
      <v-text-field
        placeholder="답변을 남기고 채택을 받아보세요"
        variant="outlined"
        density="compact"
      />
      <v-btn block color="shades-black">등록</v-btn>
    </v-card-item>
  </v-card>

  <v-card color="#E8F2E1" class="mt-4">
    <v-card-title class="font-6DAE43"
      ><v-icon class="mr-2">mdi-checkbox-marked-circle-outline</v-icon>담당자
      답변 완료</v-card-title
    >
    <v-card-item>
      <!-- 답변자 -->
      <v-row class="mb-2" align="center">
        <v-col cols="2">
          <v-avatar color="grey">유저</v-avatar>
        </v-col>
        <v-col cols="10">
          <div class="text-body font-bold">김경란</div>
        </v-col>
      </v-row>
      <div class="text-caption font-0000008F">
        답변답변 답변 답변답변 답변 답변답변 답변 답변답변 답변 답변답변 답변
        답변답변 답변
      </div>

      <div class="back-white mt-4">
        <v-row class="mb-2" align="center">
          <v-col cols="2">
            <v-avatar color="grey">유저</v-avatar>
          </v-col>
          <v-col cols="10">
            <div class="text-body font-bold">지나가던사용자1</div>
          </v-col>
        </v-row>
        <div class="text-caption font-0000008F">
          <span class="font-1C4EFE">@김경란</span
          >댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글
        </div>
      </div>

      <div class="back-white mt-4">
        <v-row class="mb-2" align="center">
          <v-col cols="2">
            <v-avatar color="grey">유저</v-avatar>
          </v-col>
          <v-col cols="10">
            <div class="text-body font-bold">지나가던사용자2</div>
          </v-col>
        </v-row>
        <div class="text-caption font-0000008F">
          <span class="font-1C4EFE">@김경란</span
          >댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글
        </div>
      </div>
    </v-card-item>
  </v-card>

  <v-card class="mt-4">
    <v-card-item>
      <!-- 답변자 -->
      <v-row class="mb-2" align="center">
        <v-col cols="2">
          <v-avatar color="grey">유저</v-avatar>
        </v-col>
        <v-col cols="10">
          <div class="text-body font-bold">김예영</div>
        </v-col>
      </v-row>
      <div class="text-caption font-0000008F">
        답변답변 답변 답변답변 답변 답변답변 답변 답변답변 답변 답변답변 답변
        답변답변 답변
      </div>

      <div class="back-white mt-4">
        <v-row class="mb-2" align="center">
          <v-col cols="2">
            <v-avatar color="grey">유저</v-avatar>
          </v-col>
          <v-col cols="10">
            <div class="text-body font-bold">지나가던사용자1</div>
          </v-col>
        </v-row>
        <div class="text-caption font-0000008F">
          <span class="font-1C4EFE">@김경란</span
          >댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글
        </div>
      </div>

      <div class="back-DDDDDD mt-4">
        <v-row class="mb-2" align="center">
          <v-col cols="2">
            <v-avatar color="grey">유저</v-avatar>
          </v-col>
          <v-col cols="10">
            <div class="text-body font-bold">지나가던사용자2</div>
          </v-col>
        </v-row>
        <div class="text-caption font-0000008F">
          <span class="font-1C4EFE">@김경란</span
          >댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글
        </div>
      </div>
    </v-card-item>
  </v-card>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      qnaId: "",
    };
  },
  mounted() {
    console.log(this.$route.query.id);
    if (!this.$route.query.id) {
      // work 값이 없으면.
      this.$router.replace(process.env.VUE_APP_BOARD);
    }
  },
};
</script>
