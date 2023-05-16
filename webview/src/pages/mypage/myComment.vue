<script>
import AnswerCard from "@/components/cards/AnswerCard";
import CommentCard from "@/components/cards/CommentCard";
import Observe from "@/components/Observer";
import api from '@/api';

let answersUri = '/mypage/answers';
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
    let sortMenu = [
      { title: "최신순" },
      { title: "좋아요순" },
    ];

    return {
      qnaTab: 0,
      sortMenu,
      answerCardData: [],
      answerCardDataOrder: 'create',
      answerCardDataPage: 0,
      answerCardDataSize: 10,
      commentCardData: [],
      commentCardDataOrder: 'create',
      commentCardDataPage: 0,
      commentCardDataSize: 10,
    };
  },
  mounted() {
    // this.requestAllAnswers();
  },
  watch: {
    qnaTab(newVal, oldVal) {
      // this.page = 1;
      // console.log(newVal)
      // this.tabChanged();
    }
  },
  methods: {
    async requestAnswers(params) {
      var res = await api.get(answersUri, { params })
      res.data.forEach(async (d) => {
        d.createDate = this.exportDateFromTimeStamp(d.createDate);
      });
      this.answerCardData = this.answerCardData.concat(res.data);

      this.answerCardData.forEach(async (answer) => {
        let res = await api.get(questionUri + answer.qid)
        answer["question"] = {
          name: res.data.writerInfo.name,
          teamHierarchy: res.data.writerInfo.teamHierarchy,
          categoryName: res.data.category.name,
          title: res.data.title,
        };

      });
    },

    async requestComments(params) {
      var res = await api.get(commentsUri, { params })
      res.data.forEach(async (d) => {
        d.createDate = this.exportDateFromTimeStamp(d.createDate);
      });
      this.commentCardData = this.commentCardData.concat(res.data);

      var uriMap = {
        QUESTION: questionUri,
        ANSWER: answerUri,
        CARD: cardUri,
        TALK: talkUri,
        CARROT: carrotUri,
      }
      this.commentCardData.forEach(async (comment) => {
        var uri = uriMap[comment.boardType];
        var res = await api.get(uri + comment.postId)
        comment["post"] = {
          name: res.data.writerInfo.name,
          teamHierarchy: res.data.writerInfo.teamHierarchy,
          title: res.data.title ? res.data.title : res.data.content,
          qid: res.data.qid ? res.data.qid : null,
        };

        if (comment.boardType === 'QUESTION') {
          comment["post"]["categoryName"] = res.data.category.name;
        }
      });
    },

    tabChanged() {
      // if (this.qnaTab == 0) {
      //   if (!this.answerCardData.length) {
      //     this.requestAllAnswers();
      //   }
      // } else {
      //   if (!this.commentCardData.length) {
      //     this.requestAllComments();
      //   }
      // }
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
            path = process.env.VUE_APP_BOARD_COMMUNICATION_DETAIL;
          } else { // CARROT
            path = process.env.VUE_APP_BOARD_DEAL_DETAIL;
          }
        }
      }

      this.$router.push({
        path: path,
        title: item?.title,
        query: query
      });
    },
    async loadMore() {
      var params = {};
      var uri;
      if (this.qnaTab == 0) {
        params['order'] = this.answerCardDataOrder;
        params['page'] = this.answerCardDataPage;
        params['size'] = this.answerCardDataSize;
        this.requestAnswers(params);
        this.answerCardDataPage++;
      } else if (this.qnaTab == 1) {
        params['order'] = this.commentCardDataOrder;
        params['page'] = this.commentCardDataPage;
        params['size'] = this.commentCardDataSize;
        this.requestComments(params);
        this.commentCardDataPage++;
      }
    },

    sort(index) {
      // index 0=좋아요순, 1=등록순
      if (this.qnaTab == 0) {
        this.answerCardDataOrder = index ? "like" : "create";
        this.answerCardDataPage = 0;
        this.answerCardDataSize = 10;
        this.answerCardData = [];
      }
      else if (this.qnaTab == 1) {
        this.commentCardDataOrder = index ? "like" : "create";
        this.commentCardDataPage = 0;
        this.commentCardDataSize = 10;
        this.commentCardData = [];
      }

      this.loadMore();
    },
    leftPad(value) {
      if (value >= 10) {
        return value;
      }
      return `0${value}`;
    },
    exportDateFromTimeStamp(timeStamp) {
      var date = new Date(timeStamp)
      const year = date.getFullYear();
      const month = this.leftPad(date.getMonth() + 1); // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = this.leftPad(date.getDate());
      const hour = this.leftPad(date.getHours());
      const minute = this.leftPad(date.getMinutes());

      return year + "-" + month + "-" + day + " " + hour + ":" + minute
    },
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
        <div class="mt-4 mb-4 d-flex justify-end" >
          <v-btn prepend-icon="mdi-sort-descending">정렬
            <v-menu activator="parent">
              <v-list>
                <v-list-item v-for="(item, index) in sortMenu" :key="index" :value="index" @click="sort(index)">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </div>
        <div v-if="answerCardData.length == 0" class="text-center mt-60 mb-20">
          <img src="@/assets/images/nopost.png" width="70" height="70">
          <h3>작성한 답변이 없어요</h3>
        </div>
        <div v-for="(item, index) in answerCardData" :key="index" :value="item.aid">
          <AnswerCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
        </div>
        <Observe @triggerIntersected="loadMore" />
      </v-window-item>

      <!-- ***** 내 댓글 ***** -->
      <v-window-item :value="1">
        <div class="mt-4 mb-4 d-flex justify-end" >
          <v-btn prepend-icon="mdi-sort-descending">정렬
            <v-menu activator="parent">
              <v-list>
                <v-list-item v-for="(item, index) in sortMenu" :key="index" :value="index" @click="sort(index)">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </div>
        <div v-if="commentCardData.length == 0" class="text-center mt-60 mb-20">
          <img src="@/assets/images/nopost.png" width="70" height="70">
          <h3>작성한 댓글이 없어요</h3>
        </div>
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
