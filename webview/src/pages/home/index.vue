<template>
  <div>
    <!-- My place body-->
    <v-row>
      <v-col cols="10">
        <p class="text-h6 font-weight-black">My Place</p>
      </v-col>

    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card color="#0000000A" @click="pushMyPosts">
          <v-card-item class="justify-center text-center">
            <img src="@/assets/images/icons/icon_layout-list.png" />
            <p class="text-caption">등록글</p>
            <v-chip>{{ myPostsCount }}</v-chip>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card color="#0000000A" @click="pushMyReplies">
          <v-card-item class="justify-center text-center">
            <img src="@/assets/images/icons/icon_smile.png" />
            <p class="text-caption">답변/댓글</p>
            <v-chip color="shades-black">{{ myRepliesCount }}</v-chip>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    <!-- My Weekly Hot body-->
    <v-row>
      <v-col cols="10">
        <p class=" text-h6 font-weight-black">Weekly Hot</p>
      </v-col>

    </v-row>
    <div>
      <v-slide-group>
        <template v-if="weeklyHotData.length">
          <v-slide-group-item v-for="(tag, index) in weeklyHotData" :key="index">
            <v-chip class="ma-2">{{ tag }}</v-chip>
          </v-slide-group-item>
        </template>
        <template v-else>
          <v-container align="center">한 주간 관심이 많았던 태그가 없습니다.</v-container>
        </template>
      </v-slide-group>
    </div>

    <!-- 최신글 -->
    <v-row class="mt-2 mb-2">
      <v-col cols="10">
        <p class="text-h6 font-weight-black">최신글</p>
      </v-col>

    </v-row>
    <v-card>
      <v-tabs fixed-tabs bg-color="shades-black" color="shades-white" align-tabs="title" height="2rem"
        selected-class="shades-white" v-model="recentTab">
        <v-tab v-for="(i, index) in recentTabTitle.length" :key="index" :value="index" selected-class="shades-white"
          class="pa-0">
          {{ recentTabTitle[index] }}
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="recentTab">
          <!-- 각 게시판 최신글 목록 -->
          <template v-for="(x, i) in recentData.length" :key="i">
            <v-window-item :value="i">
              <v-table density="compact">
                <tbody>
                  <tr v-for="post in recentData[i]" :key="post.id">
                    <v-row no-gutters @click="pushPost(post)">
                      <v-col cols="8">
                        <td class="d-inline-block text-truncate text-body-2 font-weight-bold" style="max-width:95%;"
                          color="#0000008F">
                          {{ post.title }}
                        </td>
                      </v-col>
                      <v-col cols="2">
                        <td class="text-caption font-0000008F">
                          <img src="@/assets/images/icons/icon_heart.png" /> {{ post.likeCnt }}
                        </td>
                      </v-col>
                      <v-col cols="2">
                        <td class="text-caption font-0000008F">
                          <img src="@/assets/images/icons/icon_message-circle.png" /> {{ "qid" in post ? post.answerCnt :
                            post.commentCnt }}
                        </td>
                      </v-col>
                    </v-row>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>
          </template>
        </v-window>
      </v-card-text>
    </v-card>


    <!-- 명예의 전당 body-->
    <v-row class="mt-2 mb-2">
      <v-col cols="10">
        <p class="text-h6 font-weight-black">명예의 전당</p>
      </v-col>

    </v-row>
    <v-card>
      <v-tabs fixed-tabs bg-color="shades-black" color="shades-white" align-tabs="title" height="2rem"
        selected-class="shades-white" v-model="hallOfFameTab">
        <v-tab v-for="(i, index) in hallOfFameTabTitle.length" :key="index" :value="index" selected-class="shades-white">
          {{ hallOfFameTabTitle[index] }}
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="hallOfFameTab">
          <v-window-item v-for="(hall, i) in hallofFameData" :key="i" :value="0">
            <v-table density="compact">
              <tbody>
                <tr v-for="post in hall" :key="post.qid">
                  <v-row no-gutters @click="pushPost(post)">
                    <v-col cols="8">
                      <td class="d-inline-block text-truncate text-body-2 font-weight-bold" style="max-width:95%;"
                        color="#0000008F">
                        {{ post.title }}
                      </td>
                    </v-col>
                    <v-col cols="2">
                      <td class="text-caption font-0000008F">
                        <img src="@/assets/images/icons/icon_heart.png" />{{ post.likeCnt }}
                      </td>
                    </v-col>
                    <v-col cols="2">
                      <td class="text-caption font-0000008F">
                        <img src="@/assets/images/icons/icon_message-circle.png" />{{ post.answerCnt }}
                      </td>
                    </v-col>
                  </v-row>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
    <!-- 사용자 랭킹 body-->
    <v-row class="mt-2 mb-2">
      <v-col cols="10">
        <p class="text-h6 font-weight-black">사용자 랭킹</p>
      </v-col>

    </v-row>

    <v-card>
      <v-tabs fixed-tabs bg-color="shades-black" color="shades-white" align-tabs="title" height="2rem"
        selected-class="shades-white" v-model="userRankingTab">
        <v-tab v-for="(i, index) in userRankingTabTitle.length" :key="index" :value="index" selected-class="shades-white">
          {{ userRankingTabTitle[index] }}
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="userRankingTab">
          <template v-for="(x, i) in userRankingData.length" :key="i">
            <v-window-item :value="i">
              <v-table density="compact">
                <tbody>
                  <tr v-for="(user, rank) in userRankingData[i]" :key="user.id">
                    <v-row class="mb-2" no-gutters>
                      <v-col cols="2">
                        <td class="text-h6 font-bold" color="#0000008F">
                          {{ rank + 1 }}
                        </td>
                      </v-col>
                      <v-col cols="2">
                        <td>
                          <v-avatar v-if="'icon' in user && user.icon">
                            <v-img cover :src="user.icon"></v-img>
                          </v-avatar>
                          <v-avatar v-else color="grey">{{ user.memberInfo?.name.slice(0, 3) }}</v-avatar>
                        </td>
                      </v-col>
                      <v-col align-self="center" cols="6">
                        <td class="text-body-2 font-weight-bold" color="#0000008F">
                          {{ user.memberInfo?.name }}
                        </td>
                      </v-col>
                      <v-col align-self="center" cols="2">
                        <td class="text-caption font-0000008F">
                          <img src="@/assets/images/icons/icon_message-circle.png" /> {{ user.postCnt }}
                        </td>
                      </v-col>
                    </v-row>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>
          </template>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
import { computed, ref, watch, toRef } from "vue";
import { useStore } from "vuex";
import store from "@/store";
import samplePng from "@/assets/images/users/avatar_sample.png";
import api from '@/api';

/* Weekly Hot 관련 */
let weeklyHotUri = '/board/dashboard/top7-tags';
/* My place 관련 */
let myQnaUri = 'mypage/questions';
let myCommUri = 'mypage/talks';
let myDealUri = 'mypage/carrots';
let myRequestCardUri = 'mypage/cards';

let myAnswersUri = 'mypage/answers';
let myCommentsUri = '/mypage/comments';

/* 최신글 관련 */
let qnaWorkUri = 'board/questions?workYn=true';
let qnaNonworkUri = 'board/questions?workYn=false';
let commUri = 'board/talks';
let dealUri = 'board/carrots';
let cardUri = 'board/cards';

/* 명예의 전당 관련 */
let hallWeeklyUri = '/dashboard/hall-of-fame?key=week';
let hallMonthlyUri = '/dashboard/hall-of-fame?key=month';

/* 사용자랭킹 관련 */
let questionUserUri = '/dashboard/best-users?key=question';
let answerUserUri = '/dashboard/best-users?key=answer';

export default {
  name: "DashboardPage",
  setup() {
    let weeklyHotData = ref([]);
    let weeklyHotLimit = ref(7);
    let myPostsCount = ref(0);
    let myRepliesCount = ref(0);

    let recentTab = ref(0);
    let recentTabTitle = ref(["궁금해요", "소통해요", "당근해요", "카드주세요"]);
    let recentData = ref([]);
    let recentLimit = ref(5);

    let hallOfFameTab = ref(0);
    let hallOfFameTabTitle = ref(["주간", "월간"]);
    let hallOfFameData = ref([]);
    let hallOfFameLimit = ref(5);

    let userRankingTab = ref(0);
    let userRankingTabTitle = ref(["질문왕", "답변왕"]);
    let userRankingData = ref([]);
    let userRankingLimit = ref(5);

    function exportDateFromTimeStamp(timeStamp) {
      var date = new Date(timeStamp)
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return year + "-" + month + "-" + day + " " + hour + ":" + minute + " " + seconds;
    }

    return {
      weeklyHotData,
      weeklyHotLimit,
      myPostsCount,
      myRepliesCount,
      recentTab,
      recentTabTitle,
      recentData,
      recentLimit,
      hallOfFameTab,
      hallOfFameTabTitle,
      hallOfFameData,
      hallOfFameLimit,
      userRankingTab,
      userRankingTabTitle,
      userRankingData,
      userRankingLimit,
      exportDateFromTimeStamp,
    };
  },
  methods: {
    init() { },
    /* Weekly Hot 태그 관련 */
    async requestWeeklyHot() {
      var temp = [];
      var res = await api.get(weeklyHotUri);
      temp = res.data
      this.weeklyHotData = temp.slice(0, this.weeklyHotLimit);
    },
    async requestAllMyplace() {
      this.myPostsCount += (await api.get(myQnaUri)).data.length;
      this.myPostsCount += (await api.get(myCommUri)).data.length;
      this.myPostsCount += (await api.get(myDealUri)).data.length;
      this.myPostsCount += (await api.get(myRequestCardUri)).data.length;

      this.myRepliesCount += (await api.get(myAnswersUri)).data.length;
      this.myRepliesCount += (await api.get(myCommentsUri)).data.length;
    },
    pushMyPosts() {
      this.$router.push({
        path: process.env.VUE_APP_MYPAGE_MYPOST,
      });
    },
    pushMyReplies() {
      this.$router.push({
        path: process.env.VUE_APP_MYPAGE_MYCOMMENT,
      });
    },
    /* 최신글 관련 */
    async requestAllRecent() {
      var qnaData = [];
      var commData = [];
      var dealData = [];
      var cardData = [];

      // 궁금해요
      var qnaWorks = await api.get(qnaWorkUri)
      qnaWorks.data.forEach((d) => {
        d.createDate = this.exportDateFromTimeStamp(d.createDate)
      }
      )
      qnaData = qnaData.concat(qnaWorks.data);

      var qnaNoneWorks = await api.get(qnaNonworkUri)
      qnaNoneWorks.data.forEach((d) => {
        d.createDate = this.exportDateFromTimeStamp(d.createDate)
      }
      )
      qnaData = qnaData.concat(qnaNoneWorks.data);

      qnaData.sort((a, b) => {
        if (a.createDate < b.createDate) return 1;
        if (b.createDate < a.createDate) return -1;
        return 0;
      });
      this.recentData.push(qnaData.slice(0, this.recentLimit));

      // 소통해요
      var comms = await api.get(commUri)
      comms.data.forEach((d) => {
        d.createDate = this.exportDateFromTimeStamp(d.createDate)
      })
      commData = comms.data
      this.recentData.push(commData.slice(0, this.recentLimit));


      // 당근해요
      var deals = await api.get(dealUri)
      deals.data.forEach((d) => {
        d.createDate = this.exportDateFromTimeStamp(d.createDate)
      })
      dealData = deals.data
      this.recentData.push(dealData.slice(0, this.recentLimit));

      // 카드주세요
      var cards = await api.get(cardUri)
      cards.data.forEach((d) => {
        d.createDate = this.exportDateFromTimeStamp(d.createDate)
      })
      cardData = cards.data
      this.recentData.push(cardData.slice(0, this.recentLimit));

    },
    pushPost(post) {
      var path, query;

      if ("qid" in post) {
        path = process.env.VUE_APP_BOARD_QNA_DETAIL;
        query = { qid: post.qid };
      } else {
        if ("talkId" in post) {
          path = process.env.VUE_APP_BOARD_COMMUNICATION_DETAIL;
          query = { talkId: post.talkId };
        } else if ("carrotId" in post) {
          path = process.env.VUE_APP_BOARD_DEAL_DETAIL;
          query = { carrotId: post.carrotId };
        } else {
          path = process.env.VUE_APP_BOARD_CARD_DETAIL;
          query = { id: post.cardId };
        }
      }

      this.$router.push({
        path: path,
        title: post?.title,
        query: query
      });
    },

    /* 명예의 전당 관련 */
    async requestAllHall() {
      var weeklyData = [];
      var monthlyData = [];

      var hallWeeklys = await api.get(hallWeeklyUri)
      weeklyData = hallWeeklys.data
      this.hallOfFameData.push(weeklyData.slice(0, this.hallOfFameLimit));

      var hallMonths = await api.get(hallMonthlyUri)
      monthlyData = hallMonths.data
      this.hallOfFameData.push(monthlyData.slice(0, this.hallOfFameLimit));
    },

    /* 사용자랭킹 관련 */
    async requestAllUserrank() {
      var questionUserData = [];
      var answerUserData = [];

      var questionUsers = await api.get(questionUserUri)
      questionUserData = questionUsers.data
      this.userRankingData.push(questionUserData.slice(0, this.userRankingLimit));

      var answerUsers = await api.get(answerUserUri)
      answerUserData = answerUsers.data
      this.userRankingData.push(answerUserData.slice(0, this.userRankingLimit));
    },
    async requestCategories() {
      var categoryList = ['전체']
      var subList = []
      var res = await api.get('board/categories')
      res.data[0].childList.forEach((category) => {
        categoryList.push(category.name)
        var subs = []
        category.childList.forEach((child) => {
          subs.push(child.name)
        })
        subList.push(subs)
      })
      console.log(categoryList)
      console.log(subList)
      store.dispatch('info/setInfoArea', { value1: categoryList, value2: subList })
    }
  },
  mounted() {
    this.requestWeeklyHot();
    this.requestAllMyplace();
    this.requestAllRecent();
    this.requestAllHall();
    this.requestAllUserrank();
    this.requestCategories();

  }
};
</script>

<style scoped>
.v-tabs--align-tabs-title:not(.v-slide-group--has-affixes) .v-tab:first-child {
  -webkit-margin-start: 0;
  margin-inline-start: 0;
}

.title-col {
  font-size: 0px;
  letter-spacing: 0px;
  word-spacing: 0px;
}

.title-col>td {
  font-size: 0px;
  letter-spacing: 0px;
  word-spacing: 0px;
  margin: 0px;
  padding: 0px;
}
</style>
