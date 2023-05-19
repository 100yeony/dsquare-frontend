<template>
  <div class="none_ck-toolbar_border none_expansion-panel-padding
   center_expansion-panel-icon 
   none_expansion-panel-background-color 
   none_expansion-panel-box-shadow">
    <div>
      <CardDialog :isShow="isShowCard" :title="dialogTitle" @click-confirm="onConfirmCard" @click-cancel="onCancelCard" />
    </div>

    <div>
      <DeleteDialog :isShow="isShow" :title="dialogTitle" @click-confirm="onConfirm" @click-cancel="onCancel" />
    </div>

    <v-card class="mx-auto justify-center rounded-lg" variant="outlined">
      <v-card-item>
        <div>
          <v-chip class="gifted-chip mb-3 w-100" v-if="cardData.selectionInfo" variant="outlined">
            <img src="@/assets/images/icons/party-popper.svg" class="mr-2" />{{ cardData.selectionInfo.cardOwner.name }}님이
            카드 드립니다!!!
          </v-chip>
        </div>
        <v-row class="mb-2" align="center">
          <v-col cols="2">
            <span v-if="cardData.writerInfo.profileImage == null">
              <v-avatar color="grey" size="40">
                <v-img cover src="@/assets/images/users/profile_default.png"></v-img>
              </v-avatar>
            </span>
            <span v-if="cardData.writerInfo.profileImage != null">
              <v-avatar color="grey" size="40">
                <v-img cover :src="cardData.writerInfo.profileImage"></v-img>
              </v-avatar>
            </span>
          </v-col>
          <v-col cols="4" class="pl-5">
            <div class="text-body font-bold">
              <v-row>{{ cardData.writerInfo.name }}</v-row>
              <v-row class="text-caption font-0000008F">{{
                cardData.writerInfo.teamHierarchy[cardData.writerInfo.teamHierarchy.length - 1] }}</v-row>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="text-caption font-0000008F">{{ cardData.createDate }}</div>
          </v-col>
          <v-col cols="2">
            <v-menu v-if="isWriter || checkAdmin()">
              <template v-slot:activator="{ props }">
                <v-btn icon flat rounded="0" v-bind="props" color="transparent">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="(menu, index) in cardMenu" :key="id" :value="id" @click="editPost(index)">
                  <v-list-item-title>{{ menu.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
        <h3 class="mb-3">{{ cardData.title }}</h3>
        <div>
          {{ cardData.content }}
        </div>
        <div v-if="cardData.teammates[0] !== '' || cardData.teammateCnt !== null">
          <v-divider :thickness="1" class="mt-5 mb-3"></v-divider>
          <v-row>
            <v-col cols="1">
              <v-icon size="small">mdi-information-outline</v-icon>
            </v-col>
            <v-col>
              <div class="font-medium">프로젝트 정보</div>
            </v-col>
          </v-row>
          <div>
            <div class="sizing mt-2" v-if="cardData.teammateCnt">• 참여인원 수: {{ cardData.teammateCnt }}</div>
            <div v-if="cardData.teammates[0] !== ''" class="mt-2">
              <span class="sizing">• 참여인원: </span>
              <span class="sizing" v-for="(p, index) in cardData.teammates" :key="p" :value="p">{{ p }}
                <span class="sizing" v-if="index !== cardData.teammates.length - 1">,</span>
              </span>
            </div>
          </div>
        </div>
        <v-chip class="mt-7" variant="outlined">
          <v-icon start icon="mdi-account-multiple-outline"></v-icon>
          <template v-for="team in cardData.projTeamInfo?.name">
            {{ team }}
          </template>
        </v-chip>

        <v-row class="mt-2">
          <v-col cols="2" class="center-container heart-comment">
            <span @click="toggleLike('card', cardData.cardId)">
              <template v-if="cardData.likeYn"><v-icon size="small" color="red">mdi-heart</v-icon></template>
              <template v-else><v-icon size="small">mdi-heart-outline</v-icon></template>
            </span>
            <span class="text-caption font-0000008F ml-1">{{ cardData.likeCnt }}</span></v-col>
          <v-col cols="2" class="center-container heart-comment"><v-icon size="small">mdi-message-text-outline</v-icon><span
              class="text-caption font-0000008F ml-1">{{ cardData.commentCnt }}</span></v-col>
        </v-row>
      </v-card-item>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title class="text-center">댓글</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-list>
              <div v-for="(comment) in cardData.comments" :key="comment.writerInfo.id">
                <v-list-item>
                  <v-row>
                    <v-col cols="2">
                      <span v-if="comment.writerInfo.profileImage == null">
                        <v-avatar color="grey" size="40">
                          <v-img cover src="@/assets/images/users/profile_default.png"></v-img>
                        </v-avatar>
                      </span>
                      <span v-if="comment.writerInfo.profileImage != null">
                        <v-avatar color="grey" size="40">
                          <v-img cover :src="comment.writerInfo.profileImage"></v-img>
                        </v-avatar>
                      </span>
                    </v-col>
                    <v-col>
                      <div>
                        <div class="font-xs">
                          {{ comment.writerInfo.name + ' (' +
                            comment.writerInfo.teamHierarchy[comment.writerInfo.teamHierarchy.length - 1] + ')' }}
                             <v-chip variant="outlined" class="ml-1" size="x-small" color="primary"
                            v-if="comment.writerInfo.id == cardData.writerInfo.id">작성자</v-chip>
                        </div>
                        <div class="font-xs font_white_gray">
                          {{ comment.createDate }}
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                  <div class="mt-3 mb-3">
                    <span v-if="(typeof comment.originWriterName != 'undefined')" class="font_bule">
                      @{{ comment.originWriterName }} </span> {{ comment.content }}
                  </div>
                  <v-row>
                    <v-col class="font_white_gray font-xss text-left"
                      @click="reComment(cardData, comment.writerInfo, comment.commentId)">
                      답글 달기
                    </v-col>
                    <v-col v-if="this.user.userId == comment.writerInfo.id" class="font_white_gray font-xss text-right"
                      @click="delComment(comment, cardData, 'card', cardData.cardId)">
                      삭제
                    </v-col>
                  </v-row>
                </v-list-item>

                <v-divider class="m-em-1" />
              </div>

              <!-- <v-container v-if="!cardData.commentMode" class="text-center font_white_gray font-xs">
                <div @click="commentVisible(cardData, true)">댓글 달기</div>
              </v-container> -->

              <v-container class="text-center font_white_gray font-xs">
                <!-- <div @click="commentVisible(cardData, false)">닫기</div> -->
                <div class="mt-5">
                  <v-chip v-if="!cardData.mentionName == ''">
                    @{{ cardData.mentionName }}
                    <v-icon icon="mdi-close-circle" @click="deleteMention(cardData)"></v-icon>
                  </v-chip>
                  <v-text-field v-model="cardData.commentText" :ref="cardData.commentInputRef" type="input"
                    variant="outlined" single-line hide-details append-inner-icon="mdi-send" class="mt-2 inputbox"
                    density="compact"
                    @click:append-inner="writeComment(cardData, 'card', cardData.cardId)"></v-text-field>
                </div>
              </v-container>

            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>

    <!-- 카드 승인 버튼 -->
    <v-card v-if="checkOwner() && cardData.selectionInfo == null" class="mt-4" variant="outlined">
      <v-card-item>
        <div class="font-m text-center mb-3">수고한 사우들을 응원해주세요!</div>
        <v-btn block class="button_main" @click="giveCard">카드 주기</v-btn>
      </v-card-item>
    </v-card>


  </div>
</template>

<script>
import DeleteDialog from '@/components/DeleteDialog';
import CardDialog from "@/components/cards/CardDialog.vue";
import store from '@/store';
import api from '@/api';
import like from '@/api/like.js';

export default {
  components: {
    DeleteDialog,
    CardDialog,
  },
  data() {
    return {
      user: store.getters["info/infoUser"],
      cardData: {
        cardId: 0,
        writerInfo: {
          id: 0,
          email: "",
          nickname: "",
          name: "",
          contact: "",
          teamHierarchy: []
        },
        projTeamInfo: {
          tid: 0,
          name: ""
        },
        title: "",
        content: "",
        teammates: "",
        createDate: "",
        lastUpdateDate: "",
        likeCnt: 0,
        commentCnt: 0,
        likeYn: false,
        viewCnt: 0,
        selectionInfo: null,
        teammateCnt: 0,
      },
      commentList: [],
      answerList: [
      ],
      answerId: 0,
      isWriter: false,
      isCardOwner: false,
      isShow: false,
      isShowCard: false,
      selectedPostType: 0,
      cardMenu: [
        { title: "수정", id: 0 },
        { title: "삭제", id: 1 },
      ],
    };
  },
  computed: {
    dialogTitle() {
      if (this.selectedPostType == 0) {
        return '게시물을 삭제하시겠습니까?';
      }
      else {
        return '카드를 주시겠습니까?';
      }
    }
  },
  mounted() {
    if (!this.$route.query.id) {
      this.$router.replace(process.env.VUE_APP_BOARD_CARD);
      return;
    }

    const questionData = this.requestQuestionData();
    questionData.then(
      async (response) => {
        this.cardData = response.data;
        this.cardData.createDate = this.exportDateFromTimeStamp(this.cardData.createDate);
        var tempTeammates = this.cardData.teammates.replaceAll('[', '["').replaceAll(']', '"]').replaceAll(',', '","');
        this.cardData.teammates = JSON.parse(tempTeammates);  // 어레이로 변환
        if (this.user.userId == response.data.writerInfo.id) {
          this.isWriter = true;
        }
        console.log("mounted", this.cardData)
        let res = await this.callComments('card', this.cardData.cardId)
        Object.assign(this.cardData, {
          commentInputRef: 'card' + this.cardData.cardId,
          mentionName: '',
          mentionWriterId: 0,
          mentionId: 0,
          commentMode: false,
          commentText: '',
          comments: res,
        })
      }
    );
  },
  methods: {
    reComment(item, writerInfo, commentId) {
      item.commentMode = true
      item.mentionName = writerInfo.name
      item.mentionWriterId = writerInfo.id
      item.mentionId = commentId
      this.$nextTick(() => {
        const comp = this.$refs[item.commentInputRef]
        if (Array.isArray(comp)) {
          comp[0].scrollIntoView({ behavior: 'smooth', block: 'end' })
        } else {
          comp.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      })
    },
    deleteMention(item) {
      item.mentionName = ''
      item.mentionWriterId = 0
      item.mentionId = 0
    },
    commentVisible(item, flag) {
      item.commentMode = flag
      console.log("comment")
    },
    async callComments(boardName, boardId) {
      console.log(boardId)
      var res = await api.get('board/' + boardName + '/' + boardId + '/comments', '')
      console.log(res)
      res.data.forEach(
        (d) => {
          d.createDate = this.exportDateFromTimeStamp(d.createDate)
        }
      )
      return res.data
    },
    writeComment(item, boardName, boardId) {
      if (item.commentText==''){
        return 
      }
      if (item.mentionName == '') {
        api.post('board/' + boardName + '/' + boardId + '/comments', {
          writerId: store.getters["info/infoUser"].userId,
          content: item.commentText
        }).then(
          async (response) => {
            console.log(response)
            item.comments = await this.callComments(boardName, boardId)
            item.commentCnt = item.comments.length;
            item.commentText = ''

            if (store.getters["info/infoPageState"]?.requestCardData || store.getters["info/infoPageState"]?.completedCardData) {
              var storedItem = store.getters["info/infoPageState"]?.requestCardData?.find(post => post.cardId == boardId) 
                                ?? store.getters["info/infoPageState"]?.completedCardData?.find(post => post.cardId == boardId);
              storedItem.commentCnt = item.commentCnt;
            }
          }
        )
      } else {
        api.post('board/' + boardName + '/' + boardId + '/comments/' + item.mentionId, {
          writerId: store.getters["info/infoUser"].userId,
          content: item.commentText,
          originWriterId: item.mentionWriterId
        }).then(
          async (response) => {
            console.log(response)
            item.comments = await this.callComments(boardName, boardId)
            item.commentCnt = item.comments.length;
            item.commentText = ''
            this.deleteMention(item)

            if (store.getters["info/infoPageState"]?.requestCardData || store.getters["info/infoPageState"]?.completedCardData) {
              var storedItem = store.getters["info/infoPageState"]?.requestCardData?.find(post => post.cardId == boardId) 
                                ?? store.getters["info/infoPageState"]?.completedCardData?.find(post => post.cardId == boardId);
              storedItem.commentCnt = item.commentCnt;
            }
          }
        )
      }
    },
    delComment(comment, item, boardName, boardId) {
      console.log(comment)
      api.del('board/comments/' + comment.commentId, '').then(
        async (response) => {
          console.log(response)
          item.comments = await this.callComments(boardName, boardId)
          item.commentText = ''
        }
      )
    },
    /* 카드 정보 받아오기 */
    async requestQuestionData() {
      var res = await api.get('board/cards/' + this.$route.query.id, '');
      return res;
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

    /* 수정, 삭제 */
    editPost(index) {
      console.log(index)
      if (index === 0) {  // 수정
        store.dispatch('info/setPageState', {});
        this.$router.push({
          path: process.env.VUE_APP_BOARD_CARD_EDIT,
          query: {
            id: this.cardData.cardId,
            title: this.cardData.title,
            content: this.cardData.content,
            teammates: this.cardData.teammates,
            projTeamId: this.cardData.projTeamInfo.tid,
            projTeamName: this.cardData.projTeamInfo.name,
            teammateCnt: this.cardData.teammateCnt, //추후 api 연동 후 수정  
          }

        });
      } else if (index === 1) {  // 삭제
        this.showDialog();
      }
    },
    showDialog() {
      this.selectedPostType = 0;
      this.isShow = true;
    },
    showCardDialog() {
      this.selectedPostType = 1;
      this.isShowCard = true;
    },
    onConfirm() {
      this.isShow = false;
      this.requestDelCard();
    },
    onConfirmCard() {
      this.isShowCard = false;
      this.cardSelect();
    },
    onCancel() {
      this.isShow = false;
    },
    onCancelCard() {
      this.isShowCard = false;
    },
    async requestDelCard() {
      const res = await api.del('board/cards/' + this.$route.query.id, '')
      console.log(res)
      store.dispatch('info/setPageState', {});
      this.$router.push(process.env.VUE_APP_BOARD_CARD);
    },

    /* 카드 주기 */
    giveCard() {
      this.showCardDialog()
    },

    async cardSelect() {
      const res = await api.patch('board/cards/' + this.cardData.cardId + '/chosen').then(
        (response) => {
          this.$router.go(this.$router.currentRoute);
        }
      );
      console.log(res)
    },

    // 좋아요 관련
    async toggleLike(board, id) {
      var res = !this.cardData.likeYn ? await like.post(board, id) : await like.del(board, id);
      if ([200, 201].includes(res.status)) {  // 성공
        if (this.cardData.likeYn) {
          this.cardData.likeCnt--;
          if (store.getters["info/infoPageState"]?.requestCardData || store.getters["info/infoPageState"]?.completedCardData) {
            var storedItem = store.getters["info/infoPageState"]?.requestCardData?.find(post => post.cardId == id) 
                              ?? store.getters["info/infoPageState"]?.completedCardData?.find(post => post.cardId == id);
            storedItem.likeCnt--;
            storedItem.likeYn = !storedItem.likeYn;
          }
        }
        else {
          this.cardData.likeCnt++;
          if (store.getters["info/infoPageState"]?.requestCardData || store.getters["info/infoPageState"]?.completedCardData) {
            var storedItem = store.getters["info/infoPageState"]?.requestCardData?.find(post => post.cardId == id) 
                              ?? store.getters["info/infoPageState"]?.completedCardData?.find(post => post.cardId == id);
            storedItem.likeCnt++;
            storedItem.likeYn = !storedItem.likeYn;
          }
        }
        this.cardData.likeYn = !this.cardData.likeYn;
        this.$forceUpdate();
      }
    },
    checkAdmin() {
      return this.user.role.includes("ADMIN")
    },
    checkOwner() {
      return this.user.role.includes("OWNER")
    }
  }
};
</script>



<style scoped>
.gifted-chip {
  background: #FED999;
  border-color: transparent;
}

.gifted-card {
  background: #FFF2DC;
}

.nongifted-card {
  background: white;
}

::v-deep .v-chip.v-chip--size-default {
  font-size: 0.75rem !important;
}

.sizing {
  font-size: 0.875rem !important;
}

.v-container {
  padding-top: 0px !important;
  padding-bottom: 16px !important;
  padding-left: 16px !important;
  padding-right: 16px !important;
}

.inputbox {
  color: black !important;
}

.button_main {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

.heart-comment {
  align-items: end !important;
}
</style>