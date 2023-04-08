<template>
  <div class="keep-all">
    <!-- 궁금해요 header-->
    <p class="text-h6 font-weight-black">궁금해요</p>
    <p class="text-caption my-3 font-0000008F">
      분야별 궁금한 부분을 질문하실수 있습니다. 각 분야의 담당자가 확인 후 답변을 드립니다.
    </p>
    <v-tabs fixed-tabs class="mt-5" bg-color="shades-black" color="shades-white" selected-class="shades-white" v-model="qnaTab">
      <v-tab v-for="(i, index) in qnaTabTitle.length" :key="index" :value="index" selected-class="shades-white">
        {{ qnaTabTitle[index] }}
      </v-tab>
    </v-tabs>
    <v-window v-model="qnaTab">
      <!-- ***** 업무 ***** -->
      <v-window-item :value="0">
        <!-- 검색 -->
        <v-expansion-panels class="my-3">
          <v-expansion-panel>
            <v-expansion-panel-title>검색</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row justify="center">
                <v-col cols="6" class="mb-0 pb-0">
                  <v-select v-model="category" class="text-truncate" placeholder="분야" variant="outlined" density="compact"
                    :items="categoryItems" @update:modelValue="categoryChanged"></v-select>
                </v-col>
                <v-col cols="6" class="mb-0 pb-0">
                  <v-select v-model="subcategory" class="text-truncate" placeholder="소분야" variant="outlined" density="compact"
                    :items="subcategoryItems" :disabled="!category.length"></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="pr-0 pt-0">
                  <v-select placeholder="구분" variant="outlined" density="compact"
                    :items="['전체', '제목', '내용', '작성자']"></v-select>
                </v-col>
                <v-col cols="8" class="pl-0 pt-0">
                  <v-text-field placeholder="텍스트 입력" variant="outlined" density="compact" />
                </v-col>
              </v-row>
              <v-btn color="shades-black" block>검색</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- 질문 카드 -->
        <div v-for="(item, index) in boardCardData" :value="item.id">
          <BoardCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
        </div>
      </v-window-item>

      <!-- ***** 비업무 ***** -->
      <v-window-item :value="1">
        <!-- 검색 -->
        <v-expansion-panels class="my-3">
          <v-expansion-panel>
            <v-expansion-panel-title>검색</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="4" class="pr-0">
                  <v-select placeholder="구분" variant="outlined" density="compact"
                    :items="['전체', '제목', '내용', '작성자']"></v-select>
                </v-col>
                <v-col cols="8" class="pl-0">
                  <v-text-field placeholder="텍스트 입력" variant="outlined" density="compact" />
                </v-col>
              </v-row>
              <v-btn color="shades-black" block>검색</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- 질문 카드 -->
        <div v-for="(item, index) in boardCardData" :value="item.id">
          <BoardCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
        </div>
      </v-window-item>
    </v-window>
  </div>

  <v-menu transition="slide-y-transition">
    <template v-slot:activator="{ props }">
      <v-btn class="fixed_fab" size="large" icon color="primary" v-bind="props" @click="handleeWritePage">
        <v-icon size="large">mdi-pencil-box-outline</v-icon>
      </v-btn>
    </template>
  </v-menu>
</template>



<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import BoardCard from "@/components/cards/BoardCard";
export default {
  name: "qnaBoard",
  components: {
    BoardCard,
  },
  setup() {
    let qnaTab = ref(0);
    let qnaTabTitle = ref(["업무", "비업무"]);
    let categoryItems = ref(['컨설팅', '아키텍처', '개발', '운영']);
    let subcategoryFullList = ref([
      ["IT컨설팅"],
      ["SW아키텍처", "IT관리", "품질관리", "PM"],
      ["Biz분석/설계", "응용SW개발", "UI/UX", "데이터분석"],
      ["플랫폼품질혁신TF", "플랫폼IT컨설팅vTF", "메시징DX플랫폼팀", "서비스플랫폼팀", 
        "금융결제DX플랫폼팀", "인증DX플랫폼팀", "미디어플랫폼팀", "AI서비스팀", 
        "AICC서비스팀", "Safety플랫폼팀", "AgileCore팀", "AICC딜리버리팀"
      ]
    ]);

    let boardCardData = ref([
      {
        id: 0,
        title: "안녕하세요 궁금한 것이 있어 질문드립니다. 안..",
        date: "2023-04-01",
        hash: ["백엔드", "springboot", "springboot"],
        success: true,
        like: "999+",
        comment: "999+",
      },
      {
        id: 1,
        title: "안녕하세요 궁금한 것이 있어 질문드립니다. 안..",
        date: "2023-04-01",
        hash: ["백엔드", "springboot", "springboot"],
        success: false,
        like: "327",
        comment: "3",
      },
      {
        id: 2,
        title: "안녕하세요 궁금한 것이 있어 질문드립니다. 안..",
        date: "2023-04-01",
        hash: ["백엔드", "springboot", "springboot"],
        success: false,
        like: "300",
        comment: "3",
      },
      {
        id: 3,
        title: "안녕하세요 궁금한 것이 있어 질문드립니다. 안..",
        date: "2023-04-01",
        hash: ["백엔드", "springboot", "springboot"],
        success: false,
        like: "200",
        comment: "3",
      },
      {
        id: 4,
        title: "안녕하세요 궁금한 것이 있어 질문드립니다. 안..",
        date: "2023-04-01",
        hash: ["백엔드", "springboot", "springboot"],
        success: false,
        like: "127",
        comment: "3",
      },
    ]);

    return {
      qnaTab,
      qnaTabTitle,
      categoryItems,
      subcategoryFullList,
      boardCardData,
    };
  },
  data() {
    return {
      category: [],
      subcategory: [],
      subcategoryItems: [],
    };
  },
  methods: {
    categoryChanged() {
      var categoryIndex = this.categoryItems.indexOf(this.category);
      this.subcategoryItems = this.subcategoryFullList[categoryIndex];
      this.subcategory = '';
    },
    handleCardClicked(item) {
      console.log("[handleCardClicked]", item);
      if (item) {
        //상세 화면으로 이동.
        this.$router.replace({
          path: process.env.VUE_APP_BOARD_QNA_DETAIL,
          query: item?.id ?? {},
        });
      }
    },
    handleeWritePage() {
      console.log("handleeWritePage");
      this.$router.replace(process.env.VUE_APP_BOARD_QNA_WRITE);
    },
  },
};
</script>



<style scoped>
.fixed_fab {
  position: fixed;
  top: 80vh;
  left: 80vw;
  z-index: 99999;
}

.keep-all {
  word-break: keep-all;
  /* 한국어 잘림 방지 */
}
</style>
