<template>
  <div class="none_ck-toolbar_border none_expansion-panel-padding
   center_expansion-panel-icon 
   none_expansion-panel-background-color 
   none_expansion-panel-box-shadow">
    <div>
      <DeleteDialog :isShow="isShow" :title="dialogTitle" @click-confirm="onConfirm" @click-cancel="onCancel" />
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
            <div class="text-caption font-0000008F">{{ qData.createDate }}</div>
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
        <h3>
          <span class="text-primary">{{ qData.cname }}: </span>{{ qData.title }}
        </h3>
        <ckeditor v-model="qData.content" :editor="editor" :config="editorConfig" :disabled="true"></ckeditor>
        <!-- <v-row v-if="'atc' in questionData">
        <v-card variant="outlined" class="ml-3" color="grey">
          <v-card-item class="text-caption pa-1 pr-2 font-0000008F" density="compact">
            <v-icon size="large">mdi-paperclip</v-icon> {{ questionData.atc.fileUrl.split("/").pop() }}
          </v-card-item>
        </v-card>
      </v-row> -->
        <v-row class="mt-3">
          <v-col cols="2" class="center-container">
            <span @click="toggleLike('question', qnaId)">
              <template v-if="qData.likeYn"><v-icon size="small" color="red">mdi-heart</v-icon></template>
              <template v-else><v-icon size="small">mdi-heart-outline</v-icon></template>
            </span>
            <span class="text-caption font-0000008F ml-1">{{ qData.likeCnt }}</span></v-col>
          <v-col cols="2" class="center-container"><v-icon size="small">mdi-message-text-outline</v-icon><span
              class="text-caption font-0000008F ml-1">{{ commentList.length }}</span></v-col>
        </v-row>
        <v-slide-group>
          <v-slide-group-item v-for="(chip, index) in qData.tags" :key="index">
            <v-chip class="mt-4 mb-2 mr-2">#{{ chip }}</v-chip>
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
      <v-card :color="item.writerInfo.id == qData.managerId ? '#E8F2E1' : ''" class="mt-4">
        <v-card-title v-if="item.writerInfo.id == qData.managerId" class="font-6DAE43">
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
                <v-row> {{ item.writerInfo.name }} </v-row>
                <v-row class="text-caption font-0000008F"> {{
                  item.writerInfo.teamHierarchy[item.writerInfo.teamHierarchy.length - 1] }}</v-row>
              </div>
            </v-col>
            <v-col cols="2">
              <v-menu v-if="this.user.userId == item.writerInfo.id">
                <template v-slot:activator="{ props }">
                  <v-btn icon flat rounded="0" v-bind="props" color="transparent">
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(menu, index) in questionMenu" :key="id" :value="id"
                    @click="editAnswer(index, item.aid, item.content)">
                    <v-list-item-title>{{ menu.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
          <ckeditor v-model="item.content" :editor="editor" :config="editorConfig" :disabled="true"></ckeditor>


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


        </v-card-item>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title class="text-center"
              :color="item.writerInfo.id == qData.managerId ? '#E8F2E1' : ''"></v-expansion-panel-title>
            <v-expansion-panel-text>

              <v-list>
                <!-- <v-list-item v-for="item in items" :key="item.title" :title="item.title" subtitle="..."
                  :prepend-avatar="item.avatar"></v-list-item> -->
                <v-list-item key="홍길동" title="홍길동" subtitle="메세징dx플랫폼팀"
                  prepend-avatar="@/assets/images/users/avatar_sample.png">
                  <div>
                    테스트 데이터
                  </div>
                </v-list-item>

                <v-divider class="m-em-1" />
                <v-list-item key="홍길동" title="홍길동" subtitle="메세징dx플랫폼팀"
                  prepend-avatar="@/assets/images/users/avatar_sample.png">
                  <div>
                    <span class="font-1C4EFE">@김경란</span>테스트 데이터
                  </div>
                </v-list-item>
                <v-divider class="m-em-1" />
                <v-container v-if="!item.commentMode" class="text-center font_white_gray font-xs">
                  <div @click="comment(item)">댓글 달기</div>
                </v-container>

                <v-container v-else class="text-center font_white_gray font-xs">
                  <div @click="comment(item)">댓글작성 닫기</div>
                  <v-text-field v-model="item.commentText" type="input" variant="outlined" single-line hide-details append-inner-icon="mdi-send" class="mt-5"
                    @click:append-inner="writeComment(item.commentText)"></v-text-field>
                </v-container>




              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </div>
  </div>
</template>
<script>
import DeleteDialog from '@/components/DeleteDialog';
import api from '@/api';
import store from '@/store';
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import like from '@/api/like.js';

export default {
  components: {
    DeleteDialog,
    ckeditor: CKEditor.component,
  },

  data() {
    return {
      editor: ClassicEditor,
      editorData: "",
      editorConfig: {
        toolbar: [],
        disabled: true,
        removePlugins: ["ImageCaption", "ImageUpload", "EasyImage", "MediaEmbed"]
      },
      user: store.getters["info/infoUser"],
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
        upCategory: '',
        title: '',
        content: '',
        createDate: '',
        viewCnt: 0,
        likeCnt: 0,
        likeYn: false,
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
      isShow: false,
      isWriter: false,
      selectedPostType: 0,
      answerId: 0,
    };
  },
  mounted() {
    this.qnaId = this.$route.query.qid;
    console.log("--mounted");
    console.log(this.$route.query.qid);
    const questionData = this.requestQuestionData();
    questionData.then(
      (response) => {
        this.qData = this.parseToQData(response.data)
        console.log(this.user.userId, response.data.writerId)
        if (this.user.userId == response.data.writerInfo.id) {
          this.isWriter = true;
        }
      }
    );
    this.requestAnswerData();
  },
  computed: {
    dialogTitle() {
      if (this.selectedPostType == 0) {
        return '게시물을 삭제하시겠습니까?';
      } else if (this.selectedPostType == 1) {
        return '답변을 삭제하시겠습니까?'
      } else if (this.selectedPostType == 2) {
        return '게시글을 삭제하시겠습니까?'
      }
    }
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
    comment(item) {
      item.commentMode = !item.commentMode
      console.log("comment")
    },
    writeComment(value) {
      console.log(value)
    },
    editPost(index) {
      console.log(index)
      if (index === 0) {
        console.log("수정하기")
        store.dispatch('info/setPageState', {});
        this.$router.push({
          path: process.env.VUE_APP_BOARD_QNA_EDIT,
          query: {
            qid: this.qnaId,
            title: this.qData.title,
            content: this.qData.content,
            upCategory: this.qData.upCategory,
            cid: this.qData.cid,
            atcid: this.qData.atc.atcId,
            chipData: this.qData.tags
          }

        });
      } else if (index === 1) {
        console.log("삭제하기")
        if (this.answerList.length == 0) {
          this.showDialog(0)
        } else {
          console.log("답변이 있어 삭제 못함.")
        }
      }
    },
    editAnswer(index, id, content) {
      this.answerId = id;
      if (index == 0) {
        console.log("답변 수정하기")
        this.$router.push({
          path: process.env.VUE_APP_BOARD_QNA_ANSWER_EDIT,
          query: {
            qid: this.$route.query.qid,
            id: id,
            content: content
          }
        });
      } else if (index == 1) {
        console.log("답변 삭제하기")
        this.showDialog(1)
      }
    },
    showDialog(num) {
      this.selectedPostType = num;
      this.isShow = true;
    },
    onConfirm() {
      console.log('confirm payload:');
      this.isShow = false;
      if (this.selectedPostType == 0) {
        this.requestDelQuestion();
      } else if (this.selectedPostType == 1) {
        this.requestDelAnswer();
      } else if (this.selectedPostType == 2) {

      }
    },
    onCancel() {
      console.log('cancel');
      this.isShow = false;
    },
    async requestDelQuestion() {
      const res = await api.del('board/questions/' + this.$route.query.qid, '').then(
        (response) => {
          console.log(response)
          store.dispatch('info/setPageState', {});
          this.$router.push(process.env.VUE_APP_BOARD_QNA);
        }
      )
    },
    async requestDelAnswer(num) {
      const res = await api.del('board/questions/' + this.$route.query.qid + '/answers/' + this.answerId, '').then(
        (response) => {
          // console.log(response)
          // this.$router.replace({
          //   path: process.env.VUE_APP_BOARD_QNA_DETAIL,
          //   query: {
          //     qid: this.$route.query.qid
          //   }
          // });
          this.requestAnswerData()
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
      return {
        name: data.writerInfo.name,
        team: data.writerInfo.teamHierarchy[data.writerInfo.teamHierarchy.length - 1],
        atc: {
          atcId: 1,
          fileUrl: "https://ktds.dsquare.co.kr/테스트파일.xlsx",
          extension: "xlsx",
          createDate: "2023-03-23 21:02:12",
          fileSize: 512345,
        },
        cname: data.category.name,
        upCategory: data.category.categoryHierarchy[1],
        cid: data.category.cid,
        title: data.title,
        content: data.content,
        createDate: this.exportDateFromTimeStamp(data.createDate),
        viewCnt: data.viewCnt,
        likeCnt: data.likeCnt,
        likeYn: data.likeYn,
        tags: data.tags,
        writerId: data.writerInfo.id,
        managerId: data.category.managerId,
      }
    },
    async requestAnswerData() {
      var res = await api.get('board/questions/' + this.$route.query.qid + '/answers', '').then(//this.$route.query.qid
        (response) => {
          console.log("answer: ")
          this.initAnswerData(response.data)
        }
      )
    },
    initAnswerData(datas) {
      console.log(datas)
      datas.forEach((data) => {
        Object.assign(data, { commentMode: false , commentText: ''})
      })
      this.answerList = datas
    
    },

    // 좋아요 관련
    async toggleLike(board, id) {
      var res = !this.qData.likeYn ? await like.post(board, id) : await like.del(board, id);
      if ([200, 201].includes(res.status)) {  // 성공
        if (this.qData.likeYn) {
          this.qData.likeCnt--;
        }
        else {
          this.qData.likeCnt++;
        }
        this.qData.likeYn = !this.qData.likeYn;
        this.$forceUpdate();
      }
    }
  },
};
</script>
<style scoped>
::v-deep .ck-rounded-corners .ck.ck-editor__main>.ck-editor__editable {
  padding-left: 0;
  padding-bottom: 0;
}

::v-deep .ck.ck-editor__editable_inline>:last-child{
  margin-bottom:0;
}

.v-chip.v-chip--size-default{
  font-size: 0.8rem !important;
}
</style>