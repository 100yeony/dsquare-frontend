<template>
  <div class="none_ck-toolbar_border">
    <div>
      <DeleteDialog :isShow="isShow" :title="dialogTitle" @click-confirm="onConfirm" @click-cancel="onCancel" />
    </div>

    <v-card class="mx-auto justify-center rounded-lg" :class="cardData.selectionInfo ? 'gifted-card' : 'nongifted-card'" variant="outlined">
      <v-card-item>
        <div>
          <v-chip class="gifted-chip mb-3 w-100" v-if="cardData.selectionInfo" variant="outlined">
            <img src="@/assets/images/icons/party-popper.svg" class="mr-2"/>카드 드립니다!!!
          </v-chip>
        </div>
        <v-row class="mb-2" align="center">
          <v-col cols="2">
            <v-avatar color="grey">😀</v-avatar>
          </v-col>
          <v-col cols="4">
            <div class="text-body font-bold">
              <v-row>{{ cardData.writerInfo.name }}</v-row>
              <v-row class="text-caption font-0000008F">{{ cardData.writerInfo.teamHierarchy[cardData.writerInfo.teamHierarchy.length-1] }}</v-row>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="text-caption font-0000008F">{{ cardData.createDate }}</div>
          </v-col>
          <v-col cols="2">
            <v-menu v-if="isWriter">
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
        <h2 class="mb-3">{{ cardData.title }}</h2>
        <div>
          {{ cardData.content }}
        </div>
        <div v-if="cardData.teammate[0] !== '' || cardData.teammateCnt !== null">
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
            <div v-if="cardData.teammate[0] !== ''" class="mt-2">
              <span class="sizing">• 참여인원: </span>
              <span class="sizing" v-for="(p, index) in cardData.teammate" :key="p" :value="p">{{ p }} 
                <span class="sizing" v-if="index!==cardData.teammate.length-1">,</span> 
              </span>
            </div>
          </div>
        </div>
        <v-chip class="mt-5" variant="outlined">
          <v-icon start icon="mdi-account-multiple-outline"></v-icon>
          <template v-for="team in cardData.projTeamInfo?.name">
            {{  team  }}
          </template>
        </v-chip>
        
        <v-row class="mt-2">
          <v-col cols="2" class="center-container">
            <span @click="toggleLike('card', cardData.cardId)">
              <template v-if="cardData.likeYn"><v-icon size="small" color="red">mdi-heart</v-icon></template>
              <template v-else><v-icon size="small">mdi-heart-outline</v-icon></template>
            </span>
            <span class="text-caption font-0000008F ml-1">{{ cardData.likeCnt }}</span></v-col>
          <v-col cols="2" class="center-container"><v-icon size="small">mdi-message-text-outline</v-icon><span
              class="text-caption font-0000008F ml-1"><!-- 댓글 수 --></span></v-col>
        </v-row>
      </v-card-item>
    </v-card>

    <!-- 카드 승인 버튼 -->
    <v-card v-if="!isWriter /* && isCardOwner */" class="mt-4" variant="outlined">
      <v-card-item>
        <div class="font-m text-center mb-3">수고한 직원들을 응원해주세요!</div>
        <v-btn block color="shades-black" @click="giveCard">카드 주기</v-btn>
      </v-card-item>
    </v-card>

  
  </div>
</template>

<script>
import DeleteDialog from '@/components/DeleteDialog';
import store from '@/store';
import api from '@/api';
import like from '@/api/like.js';

export default {
  components: {
    DeleteDialog,
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
        teammate: "",
        createDate: "",
        lastUpdateDate: "",
        likeCnt: 0,
        likeYn: false,
        viewCnt: 0,
        selectionInfo: null,
        teammateCnt: 0,
      },
      isWriter: false,
      isCardOwner: false,
      isShow: false,
      cardMenu: [
        { title: "수정", id: 0 },
        { title: "삭제", id: 1 },
      ],
    };
  },
  computed: {
    dialogTitle() {
      // 댓글이 생길 경우 조건 생성
      return '게시물을 삭제하시겠습니까?';
    }
  },
  mounted() {
    if (!this.$route.query.id) { 
      this.$router.replace(process.env.VUE_APP_BOARD_CARD);
      return;
    }

    const questionData = this.requestQuestionData();
    questionData.then(
      (response) => {
        this.cardData = response.data;
        this.cardData.createDate = this.exportDateFromTimeStamp(this.cardData.createDate);
        var tempTeammate = this.cardData.teammate.replaceAll('[', '["').replaceAll(']', '"]').replaceAll(',', '","');
        this.cardData.teammate = JSON.parse(tempTeammate);  // 어레이로 변환
        if (this.user.userId == response.data.writerInfo.id) {
          this.isWriter = true;
        }
      }
    );
  },
  methods: {
    /* 카드 정보 받아오기 */
    async requestQuestionData() {
      var res = await api.get('board/cards/' + this.$route.query.id, '');
      return res;
    },
    exportDateFromTimeStamp(timeStamp) {
      var date = new Date(timeStamp)
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();

      return year + "-" + month + "-" + day + " " + hour + ":" + minute
    },

    /* 수정, 삭제 */
    editPost(index) {
      console.log(index)
      if (index === 0) {  // 수정
        this.$router.push({
          path: process.env.VUE_APP_BOARD_CARD_EDIT,
          query: {
            id: this.cardData.cardId,
            title: this.cardData.title,
            content: this.cardData.content,
            teammate: this.cardData.teammate,
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
      this.isShow = true;
    },
    onConfirm() {
      this.isShow = false;
      this.requestDelCard();
    },
    onCancel() {
      this.isShow = false;
    },
    async requestDelCard() {
      const res = await api.del('board/cards/' + this.$route.query.id, '').then(
        (response) => {
          console.log(response)
          this.$router.push(process.env.VUE_APP_BOARD_CARD);
        }
      )
    },

    /* 카드 주기 */
    giveCard() {
      console.log("NotImplementedError"); 
    },

    // 좋아요 관련
    async toggleLike(board, id) {
      var res = !this.cardData.likeYn ? await like.post(board, id) : await like.del(board, id);
      if ([200, 201].includes(res.status)) {  // 성공
        if (this.cardData.likeYn) {
          this.cardData.likeCnt--;
        }
        else {
          this.cardData.likeCnt++;
        }
        this.cardData.likeYn = !this.cardData.likeYn;
        this.$forceUpdate();
      }
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

::v-deep .v-chip.v-chip--size-default{
        font-size: 0.75rem !important;
    }

.sizing {
  font-size: 0.875rem !important;
}
</style>