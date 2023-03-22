<template class="pw-100 ph-100">
  <div class="pw-100 ph-100">
    <v-card>
      <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center">
        <v-tab :value="1">FAQ</v-tab>
        <v-tab :value="2">자유게시판</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item v-for="n in 2" :key="n" :value="n">
          <!-- 1이면 FAQ 2이면 자유게시판을 보여주도록 합니다.
        나중에 화면 바꾸시고, recylcer view 형식으로 변경하는걸 권장합니다.  -->
          <v-container fluid>
            <div v-if="n === 1">
              <v-card
                v-for="qnaItem in qnaItems"
                :key="qnaItem.id"
                :title="qnaItem.title"
                :subtitle="qnaItem.subtitle"
                :text="qnaItem.text"
                class="mt-4"
                @click="routerMove(qnaItem)"
              ></v-card>
            </div>
            <div v-if="n === 2">
              <v-card
                v-for="boardItems in boardItems"
                :key="boardItems.id"
                :title="boardItems.title"
                :subtitle="boardItems.subtitle"
                :text="boardItems.text"
                class="mt-4"
                @click="routerMove(boardItems)"
              ></v-card>
            </div>
          </v-container>
        </v-window-item>
      </v-window>
    </v-card>

    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ props }">
        <v-btn
          class="fixed_fab"
          size="large"
          icon
          color="primary"
          v-bind="props"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
      </template>
      <v-list v-if="tab === 1">
        <v-list-item v-for="(item, index) of qnaTab" :key="item">
          <v-list-item-title
            v-text="item.title"
            @click="routerMove(item)"
          ></v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list v-if="tab === 2">
        <v-list-item v-for="(item, index) of freeTab" :key="item">
          <v-list-item-title
            v-text="item.title"
            @click="routerMove(item)"
          ></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
export default {
  name: "board",
  setup() {
    let tab = ref(null);
    return { tab };
  },
  data() {
    return {
      // 서버랑 연동하게 바꾸세요.
      qnaItems: [
        {
          id: 0,
          title: "눈 염증 때문에 리플루 점안액을 처방...",
          subtitle:
            "눈 염증 때문에 리플루 점안액을 처방받았고 일주일동안 렌즈 착용하지 말라고 하셨는데 주말에 정말 중요한 일정이 있어서 여섯시간씩 렌즈를 꺼야할것같은데ㅜ많이 안좋아질까요..? 약먹고 안약 넣으면 주말 전까지 괜찮아지나요?",
          text: "답변 0 안과 - 방금",
          url: process.env.VUE_APP_BOARD_QNA_DETAIL,
          query: {
            id: "0",
          },
        },
        {
          id: 1,
          title: "휴대폰 노케이스",
          subtitle:
            "앞 강화유리 후 보호필름 했는데요 측면 테두리 초기필름 까져서 그냥 떼버렸는데 케이스 안쓰고 쓰기에는 좀 그런가요? 휴대폰 안떨구고 들고 다니면 측면에 기스는 안날꺼같은데 고민입니다..",
          text: "답변 0 휴대전화사용 1분 전",
          url: process.env.VUE_APP_BOARD_QNA_DETAIL,
          query: {
            id: "1",
          },
        },
        {
          id: 2,
          title: "코로나 격리",
          subtitle: "마지막 6일차에 나가면 안되겠죠....??ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ",
          text: "답변 0 축구 - 방금",
          url: process.env.VUE_APP_BOARD_QNA_DETAIL,
          query: {
            id: "2",
          },
        },
        {
          id: 3,
          title: "휴대폰 노케이스",
          subtitle:
            "앞 강화유리 후 보호필름 했는데요 측면 테두리 초기필름 까져서 그냥 떼버렸는데 케이스 안쓰고 쓰기에는 좀 그런가요? 휴대폰 안떨구고 들고 다니면 측면에 기스는 안날꺼같은데 고민입니다..",
          text: "답변 0 핸드폰 1분 전",
          url: process.env.VUE_APP_BOARD_QNA_DETAIL,
          query: {
            id: "3",
          },
        },
        {
          id: 4,
          title: "건조피부..",
          subtitle: "건조피부에 좋은 파운데이션 추천해주세요.",
          text: "답변 0 색조화장품 34분 전",
          url: process.env.VUE_APP_BOARD_QNA_DETAIL,
          query: {
            id: "4",
          },
        },

        {
          id: 5,
          title: "낚싯줄 선택하는 기준이 뭔가요?",
          subtitle:
            "낚싯줄이 굵기도 여러 종류가 있고 소재도 다양하던데 어떤 차이가 있고 어떻게 선택해야 하는 건지 자세히 설명 부탁합니다.(배스 낚시 위주로 설명 부탁합니다.)",
          text: "답변 0 낚시 35분 전",
          url: process.env.VUE_APP_BOARD_QNA_DETAIL,
          query: {
            id: "5",
          },
        },
      ],
      boardItems: [
        {
          id: 0,
          title: "눈 염증 때문에 리플루 점안액을 처방...",
          subtitle:
            "눈 염증 때문에 리플루 점안액을 처방받았고 일주일동안 렌즈 착용하지 말라고 하셨는데 주말에 정말 중요한 일정이 있어서 여섯시간씩 렌즈를 꺼야할것같은데ㅜ많이 안좋아질까요..? 약먹고 안약 넣으면 주말 전까지 괜찮아지나요?",
          text: "답변 0 안과 - 방금",
          url: process.env.VUE_APP_BOARD_FREE_DETAIL,
          query: {
            id: "5",
          },
        },
        {
          id: 1,
          title: "휴대폰 노케이스",
          subtitle:
            "앞 강화유리 후 보호필름 했는데요 측면 테두리 초기필름 까져서 그냥 떼버렸는데 케이스 안쓰고 쓰기에는 좀 그런가요? 휴대폰 안떨구고 들고 다니면 측면에 기스는 안날꺼같은데 고민입니다..",
          text: "답변 0 휴대전화사용 1분 전",
          url: process.env.VUE_APP_BOARD_FREE_DETAIL,
          query: {
            id: "5",
          },
        },
        {
          id: 2,
          title: "코로나 격리",
          subtitle: "마지막 6일차에 나가면 안되겠죠....??ㅠㅠㅠㅠㅠㅠㅠㅠㅠㅠ",
          text: "답변 0 축구 - 방금",
          url: process.env.VUE_APP_BOARD_FREE_DETAIL,
          query: {
            id: "5",
          },
        },
        {
          id: 3,
          title: "휴대폰 노케이스",
          subtitle:
            "앞 강화유리 후 보호필름 했는데요 측면 테두리 초기필름 까져서 그냥 떼버렸는데 케이스 안쓰고 쓰기에는 좀 그런가요? 휴대폰 안떨구고 들고 다니면 측면에 기스는 안날꺼같은데 고민입니다..",
          text: "답변 0 핸드폰 1분 전",
          url: process.env.VUE_APP_BOARD_FREE_DETAIL,
          query: {
            id: "5",
          },
        },
        {
          id: 4,
          title: "건조피부..",
          subtitle: "건조피부에 좋은 파운데이션 추천해주세요.",
          text: "답변 0 색조화장품 34분 전",
          url: process.env.VUE_APP_BOARD_FREE_DETAIL,
          query: {
            id: "5",
          },
        },

        {
          id: 5,
          title: "낚싯줄 선택하는 기준이 뭔가요?",
          subtitle:
            "낚싯줄이 굵기도 여러 종류가 있고 소재도 다양하던데 어떤 차이가 있고 어떻게 선택해야 하는 건지 자세히 설명 부탁합니다.(배스 낚시 위주로 설명 부탁합니다.)",
          text: "답변 0 낚시 35분 전",
          url: process.env.VUE_APP_BOARD_FREE_DETAIL,
          query: {
            id: "5",
          },
        },
      ],

      qnaTab: [
        {
          id: 0,
          title: "비업무 Q&A",
          url: process.env.VUE_APP_BOARD_QNA_WRITE,
          query: {
            work: false,
          },
        },
        {
          id: 1,
          title: "업무 Q&A",
          url: process.env.VUE_APP_BOARD_QNA_WRITE,
          query: {
            work: true,
          },
        },
      ],

      freeTab: [
        {
          id: 0,
          title: "자유게시판",
          url: process.env.VUE_APP_BOARD_FREE_WRITE,
        },
      ],
    };
  },
  methods: {
    routerMove(item) {
      console.log(item);
      this.$router.replace({
        path: item.url,
        query: item?.query ?? {},
      });
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
