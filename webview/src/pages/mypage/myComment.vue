<script>
import AnswerCard from "@/components/cards/AnswerCard";
import CommentCard from "@/components/cards/CommentCard";
import Observe from "@/components/Observer";
import api from '@/api';

let answersUri = 'mypage/answers';
let commentsUri = '/mypage/comments';
let questionUri = '/board/questions/';
let answerUri = '/board/answers/';
let cardUri = '/board/cards/';
let talkUri = '/board/talks/';
let carrotUri = '/board/carrots/';


export default {
  name: "myPost",
  components: {
    AnswerCard,
    CommentCard,
    Observe
  },
  setup() {
    let myPostTabTitle = ["내 답변", "내 댓글"];

    return {
      myPostTabTitle,
    };
  },
  data() {
    return {
      qnaTab: 0,
      page: 1,
      answerCardData: [],
      commentCardData: [],
    };
  },
  mounted() {
    this.requestAllAnswers();
  },
  watch: {
    qnaTab(newVal, oldVal) {
      this.page = 1;
      console.log(newVal)
      this.tabChanged();
    }
  },
  methods: {
    async requestAllAnswers() {
      await api.get(answersUri).then(
        (response) => {
          response.data.forEach(async (d) => {
            d.createDate = this.exportDateFromTimeStamp(d.createDate);
          });
          this.answerCardData = response.data;
        }
      );

      this.answerCardData.forEach(async (answer) => {
        await api.get(questionUri + answer.qid).then(
          (response) => {
            answer["question"] = {
              name: response.data.writerInfo.name,
              teamHierarchy: response.data.writerInfo.teamHierarchy,
              categoryName: response.data.category.name,
              title: response.data.title,
            };
          }
        );
      });
    },

    async requestAllComments() {
      await api.get(commentsUri).then(
        (response) => {
          response.data.forEach(async (d) => {
            d.createDate = this.exportDateFromTimeStamp(d.createDate);
          });
          this.commentCardData = response.data;
        }
      );

      var uriMap = {
        QUESTION: questionUri,
        ANSWER: answerUri,
        CARD: cardUri,
        TALK: talkUri,
        CARROT: carrotUri,
      }
      this.commentCardData.forEach(async (comment) => {
        var uri = uriMap[comment.boardType];
        await api.get(uri + comment.postId).then(
          (response) => {
            comment["post"] = {
              name: response.data.writerInfo.name,
              teamHierarchy: response.data.writerInfo.teamHierarchy,
              title: response.data.title ? response.data.title : response.data.content,
              qid: response.data.qid ? response.data.qid : null,
            };

            if (comment.boardType === 'QUESTION') {
              comment["post"]["categoryName"] = response.data.category.name;
            }
          }
        )
      });
    },

    tabChanged() {
      if (this.qnaTab == 0) {
        if (!this.answerCardData.length) {
          this.requestAllAnswers();
        }
      } else {
        if (!this.commentCardData.length) {
          this.requestAllComments();
        }
      }
    },
    handleCardClicked(item) {
      var path, query;

      if ("aid" in item) {
        path = process.env.VUE_APP_BOARD_QNA_DETAIL;
        query = { qid: item.qid };
      } else {
        var postId = item.postId;
        
        if (item.boardType === "QUESTION") {
          path = process.env.VUE_APP_BOARD_QNA_DETAIL;
          query = { qid: postId };
        } else if (item.boardType === "ANSWER") {
          path = process.env.VUE_APP_BOARD_QNA_DETAIL;
          query = { qid: item.post.qid };
        } else {
          query = { id: postId };
          if (item.boardType === "CARD") {
            path = process.env.VUE_APP_BOARD_CARD_DETAIL;
          } else if (item.boardType === "TALK") {
            path = process.env.VUE_APP_BOARD_TALK_DETAIL;
          } else { // CARROT
            path = process.env.VUE_APP_BOARD_CARROT_DETAIL;
          }
        }
      }

      this.$router.push({ 
        path: path, 
        title: item?.title, 
        query: query 
      });
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
      <!-- ***** 내 답변 ***** -->
      <v-window-item :value="0">
        <div v-for="(item, index) in answerCardData" :key="index" :value="item.aid">
          <AnswerCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
        </div>
        <Observe @triggerIntersected="loadMore" />
      </v-window-item>
      <!-- ***** 내 댓글 ***** -->
      <v-window-item :value="1">
        <div v-for="(item, index) in commentCardData" :key="index" :value="item.commentId">
          <CommentCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
        </div>
        <Observe @triggerIntersected="loadMore" />
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
</style>
