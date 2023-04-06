<template>
  <div>
    <!-- 궁금해요 header-->

    <p class="text-h6 font-weight-black">궁금해요</p>
    <p class="text-caption mt-3 font-0000008F">
      분야별 담당자 멘션으로 궁금한 부분을 질문하실수 있습니다
    </p>
    <!-- 검색창 기본, 이후에 실 값 적용하세요.-->
    <v-expansion-panels class="mt-3 mb-3">
      <v-expansion-panel>
        <v-expansion-panel-title>검색</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row justify="center">
            <v-col cols="6">
              <v-select
                placeholder="분야선택"
                variant="outlined"
                density="compact"
                :items="['분야1', '분야2', '분야3']"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                placeholder="구분/전체/글제목"
                variant="outlined"
                density="compact"
                :items="['전체', '글제목', '내용', '작성자']"
              ></v-select>
            </v-col>
          </v-row>
          <v-text-field
            placeholder="텍스트 입력"
            variant="outlined"
            density="compact"
          />
          <v-btn color="shades-black" block>검색</v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <div v-for="(item, index) in boardCardData" :value="item.id">
      <BoardCard
        class="mt-2"
        :data="item"
        @handle-card-clicked="handleCardClicked"
      />
    </div>
  </div>

  <v-menu transition="slide-y-transition">
    <template v-slot:activator="{ props }">
      <v-btn
        class="fixed_fab"
        size="large"
        icon
        color="#74CEBE"
        v-bind="props"
        @click="handleeWritePage"
        ><v-icon size="large">mdi-pencil-box-outline</v-icon></v-btn
      >
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
    return { boardCardData };
  },
  methods: {
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
</style>
