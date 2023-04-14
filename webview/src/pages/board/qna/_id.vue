<template>
  <div>
    <DeleteDialog :showDialog="showDialog" @click-confirm="onConfirm" @click-cancel="onCancel" />
  </div>
  <v-card>
    <v-card-item>
      <v-row class="mb-2" align="center">
        <v-col cols="2">
          <v-avatar color="grey">😀</v-avatar>
        </v-col>
        <v-col cols="4">
          <div class="text-body font-bold">
            <v-row>{{ qData.name }}</v-row>
            <v-row class="text-caption font-0000008F">{{ qData.team }}</v-row>
          </div>
        </v-col>
        <v-col cols="4">
          <div class="text-caption font-0000008F">{{ qData.lastUpdateDate }}</div>
        </v-col>
        <v-col cols="2">
          <v-menu v-if="isWriter">
            <template v-slot:activator="{ props }">
              <v-btn icon flat rounded="0" v-bind="props" color="transparent">
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(menu, index) in questionMenu" :key="id" :value="id" @click="editPost(index)">
                <v-list-item-title>{{ menu.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>
      <h2 class="mb-3">
        <span class="text-primary">{{ qData.cname }}: </span>{{ qData.title }}
      </h2>
      <div v-html="qData.content"></div> <!-- v-html: HTML 코드를 템플릿에 삽입 -->
      <!-- <v-row v-if="'atc' in questionData">
        <v-card variant="outlined" class="ml-3" color="grey">
          <v-card-item class="text-caption pa-1 pr-2 font-0000008F" density="compact">
            <v-icon size="large">mdi-paperclip</v-icon> {{ questionData.atc.fileUrl.split("/").pop() }}
          </v-card-item>
        </v-card>
      </v-row> -->
      <v-row>
        <v-col cols="2" class="center-container"><v-icon size="small">mdi-heart-outline</v-icon><span
            class="text-caption font-0000008F ml-1">{{ qData.likes }}</span></v-col>
        <v-col cols="2" class="center-container"><v-icon size="small">mdi-message-text-outline</v-icon><span
            class="text-caption font-0000008F ml-1">{{ commentList.length }}</span></v-col>
      </v-row>
      <v-slide-group>
        <v-slide-group-item v-for="(chip, index) in qData.tags" :key="index">
          <v-chip class="ma-2">#{{ chip }}</v-chip>
        </v-slide-group-item>
      </v-slide-group>
    </v-card-item>
  </v-card>

  <v-card v-if="!isWriter" class="mt-4">
    <v-card-item>
      <div class="font-m text-center mb-3">답변을 남기고 좋아요를 받아보세요!</div>
      <v-btn block color="shades-black" @click="answer">등록</v-btn>
    </v-card-item>
  </v-card>

  <!-- ***** 답변 ***** -->
  <div v-for="(item, index) in answerList" :value="item.id">
    <v-card :color="item.writerId == qData.managerId ? '#E8F2E1' : ''" class="mt-4">
      <v-card-title v-if="item.writerId == qData.managerId" class="font-6DAE43">
        <v-icon class="mr-2">mdi-checkbox-marked-circle-outline</v-icon>담당자 답변 완료
      </v-card-title>
      <v-card-item>
        <!-- 답변자 -->
        <v-row class="mb-2" align="center">
          <v-col cols="2">
            <v-avatar color="grey">😀</v-avatar>
          </v-col>
          <v-col cols="8">
            <div class="text-body font-bold">
              <v-row> 홍길동 </v-row>
              <v-row class="text-caption font-0000008F"> --팀 </v-row>
            </div>
          </v-col>
          <v-col cols="2">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon flat rounded="0" v-bind="props" color="transparent">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-for="(menu, index) in questionMenu" :key="id" :value="id" @click="editAnswer(index)">
                  <v-list-item-title>{{ menu.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
        <div v-html="item.content" class="text-caption font-0000008F"></div>

        <!-- 
        답변 댓글 데이터 생기면 이 코드 사용
        <div v-for="(comment, index) in item.commentList" :value="comment.id" class="back-white mt-4 pa-2">
          <v-row class="mb-2" align="center">
            <v-col cols="2">
              <v-avatar color="grey">😀</v-avatar>
            </v-col>
            <v-col cols="10">
              <div class="text-body font-bold">{{ comment.name }}</div>
            </v-col>
          </v-row>
          <div class="text-caption font-0000008F">
            {{ comment.content }}
          </div>
        </div> 
-->
        <!-- ***** 답변 댓글 ***** -->
        <v-card class="back-white mt-4">
          <v-card-item>
            <v-row class="mb-2" align="center">
              <v-col cols="2">
                <v-avatar color="grey">😀</v-avatar>
              </v-col>
              <v-col cols="10">
                <div class="text-body font-bold">
                  <v-row>변상진</v-row>
                  <v-row class="text-caption font-0000008F">메시징DX플랫폼</v-row>
                </div>
              </v-col>
            </v-row>
            <div class="text-caption font-0000008F">
              <span class="font-1C4EFE">@김경란</span>테스트 데이터
            </div>
          </v-card-item>
        </v-card>

        <v-card class="back-white mt-4">
          <v-card-item>
            <v-row class="mb-2" align="center">
              <v-col cols="2">
                <v-avatar color="grey">😀</v-avatar>
              </v-col>
              <v-col cols="10">
                <div class="text-body font-bold">
                  <v-row>이상진</v-row>
                  <v-row class="text-caption font-0000008F">메시징DX플랫폼</v-row>
                </div>
              </v-col>
            </v-row>
            <div class="text-caption font-0000008F">
              테스트 데이터
            </div>
          </v-card-item>
        </v-card>
      </v-card-item>
    </v-card>
  </div>
</template>
<script>
import DeleteDialog from '@/components/DeleteDialog';
import api from '@/api'
import store from '@/store'
export default {
  components: {
    DeleteDialog
  },
  data() {
    return {
      qnaId: 0,
      qData: {
        name: "",
        team: "",
        atc: {
          atcId: 0,
          fileUrl: "",
          extension: "",
          createDate: "",
          fileSize: 0,
        },
        cname: '',
        cid: 0,
        upid: 0,
        title: '',
        content: '',
        lastUpdateDate: '',
        viewCnt: 0,
        likes: 0,
        tags: [],
        writerId: 0,
        managerId: 0,
      },
      commentList: [],
      answerList: [
      ],
      questionMenu: [
        { title: "수정", id: 0 },
        { title: "삭제", id: 1 },
      ],
      showDialog: false,
      isWriter: false,

    };
  },
  mounted() {
    this.qnaId = this.$route.query.qid
    console.log("--mounted")
    console.log(this.$route.query.qid);
    const user = store.getters["info/infoUser"]
    const questionData = this.requestQuestionData()
    questionData.then(
      (response) => {
        this.qData = this.parseToQData(response.data)
        if (user.userId === response.data.writerId) {
          this.isWriter = true;
        }
      }
    )
    this.requestAnswerData()
  },
  methods: {
    answer() {
      this.$router.push({
        path: process.env.VUE_APP_BOARD_QNA_ANSWER,
        query: {
          qid: this.$route.query.qid
        }
      });
    },
    editPost(index) {
      console.log(index)
      if (index === 0) {
        console.log("수정하기")
        this.$router.push({
          path: process.env.VUE_APP_BOARD_QNA_EDIT,
          query: {
            qid: this.qnaId,
            title: this.qData.title,
            content: this.qData.content,
            upid: this.qData.upid,
            cid: this.qData.cid,
            atcid: this.qData.atc.atcId
          }

        });
      } else if (index === 1) {
        console.log("삭제하기")
        this.showDialog = true;
      }
    },
    editAnswer(index){
      if (index === 0) {
        // console.log("수정하기")
        // this.$router.push({
        //   path: process.env.VUE_APP_BOARD_QNA_EDIT,
        //   query: {
        //     qid: this.qnaId,
        //     title: this.qData.title,
        //     content: this.qData.content,
        //     upid: this.qData.upid,
        //     cid: this.qData.cid,
        //     atcid: this.qData.atc.atcId
        //   }

        // });
      } else if (index === 1) {
        // console.log("삭제하기")
        // this.showDialog = true;
      }
    },
    onConfirm(payload) {
      console.log('confirm payload:', payload);
      this.showDialog = false;
      this.requestDelQuestion();
    },
    onCancel() {
      console.log('cancel');
      this.showDialog = false;
    },
    async requestDelQuestion() {
      const res = await api.del('board/questions/' + this.$route.query.qid, '').then(
        (response) => {
          console.log(response)
          this.$router.push(process.env.VUE_APP_BOARD_QNA);
        }
      )
    },
    async requestQuestionData() {
      var res = await api.get('board/questions/' + this.$route.query.qid, '')
      return res
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
    parseToQData(data) {

      console.log("parse_data:  ", data)
      console.log("parse_cid  :", data.cid)
      return {
        name: "변상진",
        team: "메시징DX플랫폼",
        atc: {
          atcId: 1,
          fileUrl: "https://ktds.dsquare.co.kr/테스트파일.xlsx",
          extension: "xlsx",
          createDate: "2023-03-23 21:02:12",
          fileSize: 512345,
        },
        cname: data.cid.name,
        upid: Number(data.cid.upId),
        cid: data.cid.cid,
        title: data.title,
        content: data.content,
        lastUpdateDate: this.exportDateFromTimeStamp(data.lastUpdateDate),
        viewCnt: data.viewCnt,
        likes: 1,
        tags: ["jsp", "js", "jquery"],
        writerId: data.writerId,
        managerId: 1,
      }
    },
    async requestAnswerData(){
      var res = await api.get('board/questions/' + this.$route.query.qid + '/answers', '').then(//this.$route.query.qid
        (response)=>{
          console.log("answer: " + response.data)
          this.answerList = response.data 
        }
      )
    }
  },
};
</script>
<!-- {
  "id": 1,
  "writerId": 1,
  "content": "답변글 내용입니다222.",
  "createDate": "2023-04-14T15:08:32.221714",
  "lastUpdateDate": null,
  "atcId": null,
  "deleteYn": false
} -->