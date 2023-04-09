<template>
  <v-card>
    <v-card-item>
      <v-row class="mb-2" align="center">
        <v-col cols="2">
          <v-avatar color="grey">👩‍💼</v-avatar>
        </v-col>
        <v-col cols="4">
          <div class="text-body font-bold">{{ this.questionData.name }}</div>
        </v-col>
        <v-col cols="4">
          <div class="text-caption font-0000008F">{{ this.questionData.lastUpdateDate }}</div>
        </v-col>
        <v-col cols="2">
          <v-icon>mdi-dots-horizontal</v-icon>
        </v-col>
      </v-row>
      <h2 class="mb-3">
        <span class="text-primary">{{ this.questionData.category }}: </span>{{ this.questionData.title }}
      </h2>
      <div v-html="this.questionData.content"></div>  <!-- v-html: HTML 코드를 템플릿에 삽입 -->

      <v-row>
        <v-col cols="2" class="center-container"><img src="@/assets/images/icons/icon_heart.png" /><span
            class="text-caption font-0000008F ml-1">{{ this.questionData.likes }}</span></v-col>
        <v-col cols="2" class="center-container"><img src="@/assets/images/icons/icon_message-circle.png" /><span
            class="text-caption font-0000008F ml-1">{{ this.questionData.answerList.length }}</span></v-col>
      </v-row>
      <v-slide-group>
        <v-slide-group-item v-for="(chip, index) in this.questionData.tags" :key="index">
          <v-chip class="ma-2">#{{ chip }}</v-chip>
        </v-slide-group-item>
      </v-slide-group>
    </v-card-item>
  </v-card>

  <v-card class="mt-4">
    <v-card-item>
      <div class="font-m text-center mb-3">답변을 남기고 채택을 받아보세요!</div>
      <v-btn block color="shades-black">등록</v-btn>
    </v-card-item>
  </v-card>

  <v-card color="#E8F2E1" class="mt-4">
    <v-card-title class="font-6DAE43"><v-icon class="mr-2">mdi-checkbox-marked-circle-outline</v-icon>담당자
      답변 완료</v-card-title>
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
          <span class="font-1C4EFE">@김경란</span>댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글
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
          <span class="font-1C4EFE">@김경란</span>댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글
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
          <span class="font-1C4EFE">@김경란</span>댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글
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
          <span class="font-1C4EFE">@김경란</span>댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글댓글
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
      qnaId: this.$route.query.id,
      questionData: {
        name: "변상진",
        category: "응용SW개발",
        managerId: 3,
        title: "OpenWeatherAPI 날씨 이미지가 가져와지지 않습니다.",
        content: '<ul column-span="none"><li><p column-span="none">현재 openweather에서 API를 가져와서 데이터 값을 넣고 있는중이다.<br>나의 오류 중 하나는 <code spellcheck="false">box</code>에 <code spellcheck="false">backgroundImage</code>를 넣어서 맑음이면<br>해 사진이 보이고, 흐름이면 구름 사진을 넣으려고 한다.</p></li><li><p column-span="none">문제점 : 배경 이미지를 불러 오는 과정에서 에러가 나온다.<br>그래서 <code spellcheck="false">placehodler</code>를 넣었더니 배경 이미지에는 잘들어간다.<br><div class="remirror-resizable-view" contenteditable="false" draggable="true" style="position: relative; max-width: 100%; min-width: 50px; vertical-align: bottom; display: inline-block; line-height: 0; transition: width 0.15s ease-out 0s, height 0.15s ease-out 0s;"><div style="position: absolute; pointer-events: auto; display: flex; align-items: center; justify-content: center; z-index: 100; right: 0px; top: 0px; height: 100%; width: 15px; cursor: col-resize;"><div data-dragging="" style="opacity: 0; transition: opacity 300ms ease-in 0s; width: 4px; height: 36px; max-height: 50%; box-sizing: content-box; background: rgba(0, 0, 0, 0.65); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 6px;"></div></div><div style="position: absolute; pointer-events: auto; display: flex; align-items: center; justify-content: center; z-index: 100; left: 0px; top: 0px; height: 100%; width: 15px; cursor: col-resize;"><div data-dragging="" style="opacity: 0; transition: opacity 300ms ease-in 0s; width: 4px; height: 36px; max-height: 50%; box-sizing: content-box; background: rgba(0, 0, 0, 0.65); border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 6px;"></div></div></div><br class="ProseMirror-trailingBreak"></p></li></ul>',
        likes: 1,
        tags: ["jsp", "js", "jquery"],
        lastUpdateDate: "2023-04-01",
        atc: {
          "atcId": 1,
          "fileUrl": "https://ktds.dsquare.co.kr/테스트파일.xlsx",
          "extension": "xlsx",
          "createDate": "2023-03-23 21:02:12",
          "fileSize": 512345,
        },
        "answerList": [
          {
            "id": 1,
            "writerId": 1,
            "content": "답변글 작성 테스트합니다.",
            "createDate": "2023-03-31T13:20:12.548107",
            "lastUpdateDate": "2023-03-31T13:20:12.548136",
            "atcId": 1,
            "deleteYn": false
          },
          {
            "id": 2,
            "writerId": 3,  // 담당자의 답변
            "content": "답변글 작성 테스트합니다.",
            "createDate": "2023-03-31T13:20:14.109683",
            "lastUpdateDate": "2023-03-31T13:20:14.109718",
            "atcId": 1,
            "deleteYn": false
          }
        ],
      },
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
