<script>
import BoardCard from "@/components/cards/BoardCard";
import TalkCard from "@/components/cards/TalkCard";
import CarrotCard from "@/components/cards/CarrotCard";
import RequestCard from "@/components/cards/RequestCard";
import Observe from "@/components/Observer";
import api from '@/api';

let qnaUri = 'mypage/questions';
let commUri = 'mypage/talks';
let dealUri = 'mypage/carrots';
let requestCardUri = 'mypage/cards';

export default {
  name: "myPost",
  components: {
    BoardCard,
    TalkCard,
    CarrotCard,
    RequestCard,
    Observe
  },
  setup() {
    let myPostTabTitle = ["궁금해요", "소통해요", "당근해요", "카드주세요"];

    return {
      myPostTabTitle,
    };
  },
  data() {
    return {
      qnaTab: 0,
      page: 1,
      boardCardData: [],
      commCardData: [],
      dealCardData: [],
      requestedCardData: [],
    };
  },
  computed: {

  },
  mounted() {
    this.requestAllQuestions();
  },
  watch: {
    qnaTab(newVal, oldVal) {
      this.page = 1;
      console.log(newVal)
      this.tabChanged();
    }
  },
  methods: {
    async requestAllQuestions() {
      var res = await api.get(qnaUri)
      res.data.forEach((d) => {
        d.createDate = this.exportDateFromTimeStamp(d.createDate)
      });
      this.boardCardData = res.data;
    },
    async requestAllComms() {
      var res = await api.get(commUri)
      res.data.forEach((d) => {
        d.createDate = this.exportDateFromTimeStamp(d.createDate)
      });
      this.commCardData = res.data;
    },
    async requestAllDeals() {
      var res = await api.get(dealUri)
      res.data.forEach((d) => {
        d.createDate = this.exportDateFromTimeStamp(d.createDate)
      });
      this.dealCardData = res.data;


    },
    async requestAllRequestedCards() {
      var res = await api.get(requestCardUri)
      res.data.forEach((d) => {
        d.createDate = this.exportDateFromTimeStamp(d.createDate)
      });
      this.requestedCardData = res.data;

    },

    tabChanged() {
      if (this.qnaTab == 0) {
        if (!this.boardCardData.length) {
          this.requestAllQuestions();
        }
      } else if (this.qnaTab == 1) {
        if (!this.commCardData.length) {
          this.requestAllComms();
        }
      } else if (this.qnaTab == 2) {
        if (!this.dealCardData.length) {
          this.requestAllDeals();
        }
      } else {
        if (!this.requestedCardData.length) {
          this.requestAllRequestedCards();
        }
      }
    },
    handleCardClicked(item) {
      console.log("[handleCardClicked]", item);
      if ('qid' in item) {
        this.$router.push({
          path: process.env.VUE_APP_BOARD_QNA_DETAIL,
          meta: {
            back: process.env.VUE_APP_MYPAGE_MYPOST,
            title: item?.title,
          },
          query: {
            qid: item?.qid
          }
        });
      } else if ('talkId' in item) {
        this.$router.push({
          path: process.env.VUE_APP_BOARD_COMMUNICATION_DETAIL,
          meta: {
            back: process.env.VUE_APP_MYPAGE_MYPOST,
          },
          title: item?.title,
          query: {
            talkId: item?.talkId
          }
        });
      } else if ('carrotId' in item) {
        this.$router.push({
          path: process.env.VUE_APP_BOARD_DEAL_DETAIL,
          meta: {
            back: process.env.VUE_APP_MYPAGE_MYPOST,
          },
          title: item?.title,
          query: {
            carrotId: item?.carrotId
          }
        });
      } else {
        this.$router.push({
          path: process.env.VUE_APP_BOARD_CARD_DETAIL,
          meta: {
            back: process.env.VUE_APP_MYPAGE_MYPOST,
          },
          title: item?.title,
          query: {
            id: item?.cardId,
          }
        });
      }
    },
    loadMore() {
      this.page += 1;
      console.log(this.page)
      //this.request()
      // request 한 값을 추가
    },
    exportDateFromTimeStamp(timeStamp) {
      var date = new Date(timeStamp)
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();

      return year + "-" + month + "-" + day + " " + hour + ":" + minute

    }

  },
};
</script>
<template>
  <div class="keep-all">
    <v-tabs class="mt-5 mb-2" v-model="qnaTab" color="primary" grow>
      <v-tab v-for="(i, index) in myPostTabTitle.length" :key=index :value="index" slider-color="primary">
        {{ myPostTabTitle[index] }}
      </v-tab>
    </v-tabs>
    <v-window v-model="qnaTab" :touch="false">
      <!-- ***** 궁금해요 ***** -->
      <v-window-item :value="0">
        <div v-if="boardCardData.length != 0">
          <div v-for="(item, index) in boardCardData" :key="index" :value="item.qid">
            <BoardCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
          </div>
          <Observe @triggerIntersected="loadMore" />
        </div>
        <div v-if="boardCardData.length == 0" class="text-center mt-60 mb-20">
          <img src="@/assets/images/nopost.png" width="70" height="70">
          <h3>작성한 글이 없어요</h3>
        </div>
      </v-window-item>
      <!-- ***** 소통해요 ***** -->
      <v-window-item :value="1">
        <div v-if="commCardData.length != 0">
          <div v-for="(item, index) in commCardData" :key="index" :value="item.talkId">
            <TalkCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
          </div>
          <Observe @triggerIntersected="loadMore" />
        </div>
        <div v-if="commCardData.length == 0" class="text-center mt-60 mb-20">
          <img src="@/assets/images/nopost.png" width="70" height="70">
          <h3>작성한 글이 없어요</h3>
        </div>
      </v-window-item>
      <!-- ***** 당근해요 ***** -->
      <v-window-item :value="2">
        <div v-if="dealCardData.length != 0">
          <div v-for="(item, index) in dealCardData" :key="index" :value="item.carrotId">
            <CarrotCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
          </div>
          <Observe @triggerIntersected="loadMore" />
        </div>
        <div v-if="dealCardData.length == 0" class="text-center mt-60 mb-20">
          <img src="@/assets/images/nopost.png" width="70" height="70">
          <h3>작성한 글이 없어요</h3>
        </div>
      </v-window-item>
      <!-- ***** 카드주세요 ***** -->
      <v-window-item :value="3">
        <div v-if="requestedCardData.length != 0">
          <div v-for="(item, index) in requestedCardData" :key="index" :value="item.cardId">
            <RequestCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
          </div>
          <Observe @triggerIntersected="loadMore" />
        </div>
        <div v-if="requestedCardData.length == 0" class="text-center mt-60 mb-20">
          <img src="@/assets/images/nopost.png" width="70" height="70">
          <h3>작성한 글이 없어요</h3>
        </div>
      </v-window-item>
    </v-window>
  </div>
</template>

<style lang="scss" scoped>
.fixed_fab {
  position: fixed;
  top: 80vh;
  left: 80vw;
}

.keep-all {
  word-break: keep-all;
  /* 한국어 잘림 방지 */
}

.v-btn--size-default {
  padding: 0 0px;
}

.v-tab.v-tab{
  min-width: 80px !important;
}
</style>
