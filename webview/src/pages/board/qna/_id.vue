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
            <span v-if="qData.profileImage == null">
              <v-avatar color="grey" size="40">
                <v-img cover src="@/assets/images/users/profile_default.png"></v-img>
              </v-avatar>
            </span>
            <span v-if="qData.profileImage != null">
              <v-avatar color="grey" size="40">
                <v-img cover :src="qData.profileImage"></v-img>
              </v-avatar>
            </span>
          </v-col>
          <v-col cols="4" class="pl-5">
            <div class="text-body font-bold">
              <v-row>{{ qData.name }}</v-row>
              <v-row class="text-caption font-0000008F">{{ qData.team }}</v-row>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="text-caption font-0000008F">{{ qData.createDate }}</div>
          </v-col>
          <v-col cols="2">
            <v-menu v-if="isWriter || checkAdmin()">
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
        <v-row class="mt-3">
          <v-col cols="2" class="center-container">
            <span @click="toggleLike('question', qnaId)">
              <template v-if="qData.likeYn"><v-icon size="small" color="red">mdi-heart</v-icon></template>
              <template v-else><v-icon size="small">mdi-heart-outline</v-icon></template>
            </span>
            <span class="text-caption font-0000008F ml-1">{{ qData.likeCnt }}</span></v-col>
          <v-col cols="2" class="center-container"><v-icon size="small">mdi-message-text-outline</v-icon><span
              class="text-caption font-0000008F ml-1">{{ qData.commentCnt }}</span></v-col>
        </v-row>
        <div class="my-1" v-if="qData.attachment">
          <a :href="qData.attachment.url" download>
            <v-icon size="small">mdi-attachment</v-icon>
            <span class="text-caption font-0000008F ml-1"> {{ qData.attachment.origFilename }} </span>
          </a>
        </div>
        <v-slide-group>
          <v-slide-group-item v-for="(chip, index) in qData.tags" :key="index">
            <v-chip class="mt-4 mb-2 mr-2">#{{ chip }}</v-chip>
          </v-slide-group-item>
        </v-slide-group>
      </v-card-item>
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title class="text-center" color="#f6f6f6">댓글</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-list>
              <div v-for="(comment) in qData.comments" :key="comment.writerInfo.id">
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
                            v-if="comment.writerInfo.id == qData.writerId">작성자</v-chip>
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
                      @click="reComment(qData, comment.writerInfo, comment.commentId)">
                      답글 달기
                    </v-col>
                    <v-col v-if="this.user.userId == comment.writerInfo.id" class="font_white_gray font-xss text-right"
                      @click="delComment(comment, qData, 'question', qnaId)">
                      삭제
                    </v-col>
                  </v-row>
                </v-list-item>

                <v-divider class="m-em-1" />
              </div>

              <!-- <v-container v-if="!qData.commentMode" class="text-center font_white_gray font-xs">
                <div @click="commentVisible(qData, true)">댓글 달기</div>
              </v-container> -->

              <v-container class="text-center font_white_gray font-xs">
                <!-- <div @click="commentVisible(qData, false)">닫기</div> -->
                <div class="mt-5">
                  <v-chip v-if="!qData.mentionName == ''">
                    @{{ qData.mentionName }}
                    <v-icon icon="mdi-close-circle" @click="deleteMention(qData)"></v-icon>
                  </v-chip>
                  <v-text-field v-model="qData.commentText" :ref="qData.commentInputRef" type="input" variant="outlined"
                    single-line hide-details append-inner-icon="mdi-send" class="mt-2 inputbox" density="compact"
                    @click:append-inner="writeComment(qData, 'question', qnaId)"></v-text-field>
                </div>
              </v-container>

            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>

    <v-card v-if="!isWriter" class="mt-4">
      <v-card-item>
        <div class="font-m text-center mb-3">답변을 남기고 좋아요를 받아보세요!</div>
        <v-btn block color="shades-black" @click="answer">등록</v-btn>
      </v-card-item>
    </v-card>

    <!-- ***** 답변 ***** -->
    <div v-for="(item, index) in answerList" :value="item.id">
      <v-card class="mt-4">
        <v-card-title v-if="item.writerInfo.id == qData.managerId" class="font-6DAE43">
          <v-icon class="mr-2">mdi-checkbox-marked-circle-outline</v-icon>담당자 답변 완료
        </v-card-title>
        <v-card-item>
          <!-- 답변자 -->
          <v-row align="center">
            <v-col cols="2">
              <span v-if="item.writerInfo.profileImage == null">
                <v-avatar color="grey" size="40">
                  <v-img cover src="@/assets/images/users/profile_default.png"></v-img>
                </v-avatar>
              </span>
              <span v-if="item.writerInfo.profileImage != null">
                <v-avatar color="grey" size="40">
                  <v-img cover :src="item.writerInfo.profileImage"></v-img>
                </v-avatar>
              </span>
            </v-col>
            <v-col cols="8" class="pl-5">
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
          <div class="my-1" v-if="item.attachment">
            <a :href="item.attachment.url" download>
              <v-icon size="small">mdi-attachment</v-icon>
              <span class="text-caption font-0000008F ml-1"> {{ item.attachment.origFilename }} </span>
            </a>
          </div>
        </v-card-item>
        <div class="mt-2"></div>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title class="text-center" color="#f6f6f6"
              :color="item.writerInfo.id == qData.managerId ? '#E8F2E1' : ''">댓글</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list>
                <div v-for="(comment) in item.comments" :key="comment.writerInfo.id">
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
                            {{
                              comment.writerInfo.name + ' (' +
                              comment.writerInfo.teamHierarchy[comment.writerInfo.teamHierarchy.length - 1] + ')' }}
                            <v-chip variant="outlined" class="ml-1" size="x-small" color="green"
                              v-if="comment.writerInfo.id == item.writerInfo.id">답변자</v-chip>
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
                        @click="reComment(item, comment.writerInfo, comment.commentId)">
                        답글 달기
                      </v-col>
                      <v-col v-if="this.user.userId == comment.writerInfo.id" class="font_white_gray font-xss text-right"
                        @click="delComment(comment, item, 'answer', item.aid)">
                        삭제
                      </v-col>
                    </v-row>
                  </v-list-item>

                  <v-divider class="m-em-1" />
                </div>

                <!-- <v-container v-if="!item.commentMode" class="text-center font_white_gray font-xs">
                  <div @click="commentVisible(item, true)">댓글 달기</div>
                </v-container> -->

                <v-container class="text-center font_white_gray font-xs">
                  <!-- <div @click="commentVisible(item, false)">닫기</div> -->
                  <div class="mt-5">
                    <v-chip v-if="!item.mentionName == ''">
                      @{{ item.mentionName }}
                      <v-icon icon="mdi-close-circle" @click="deleteMention(item)"></v-icon>
                    </v-chip>
                    <v-text-field v-model="item.commentText" :ref="item.commentInputRef" type="input" variant="outlined"
                      single-line hide-details append-inner-icon="mdi-send" class="mt-2 inputbox" density="compact"
                      @click:append-inner="writeComment(item, 'answer', item.aid)"></v-text-field>
                  </div>
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
        attachment: null,
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
        profileImage: null,
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
      async (response) => {
        this.qData = this.parseToQData(response.data)
        console.log(this.user.userId, response.data.writerId)
        if (this.user.userId == response.data.writerInfo.id) {
          this.isWriter = true;
        }
        let res = await this.callComments('question', this.qnaId)
        Object.assign(this.qData, {
          commentInputRef: 'question' + this.qnaId,
          mentionName: '',
          mentionWriterId: 0,
          mentionId: 0,
          commentMode: false,
          commentText: '',
          comments: res,
        })
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
    reComment(item, writerInfo, commentId) {
      item.commentMode = true
      item.mentionName = writerInfo.name
      item.mentionWriterId = writerInfo.id
      item.mentionId = commentId
      this.$nextTick(() => {
        console.log(item.commentInputRef)
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
      console.log(item)
      if (item.mentionName == '') {
        api.post('board/' + boardName + '/' + boardId + '/comments', {
          writerId: store.getters["info/infoUser"].userId,
          content: item.commentText
        }).then(
          async (response) => {
            console.log(response)
            item.comments = await this.callComments(boardName, boardId)
            item.commentText = ''

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
            item.commentText = ''
            this.deleteMention(item)
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
            atcid: this.qData.attachment?.id,
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
      await api.del('board/questions/' + this.$route.query.qid, '')
      store.dispatch('info/setPageState', {});
      this.$router.push(process.env.VUE_APP_BOARD_QNA);
    },
    async requestDelAnswer() {
      await api.del('board/questions/' + this.$route.query.qid + '/answers/' + this.answerId, '')
      this.requestAnswerData()
    },
    async requestQuestionData() {
      var res = await api.get('board/questions/' + this.$route.query.qid, '')
      return res
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
    parseToQData(data) {

      console.log("parse_data:  ", data)
      return {
        name: data.writerInfo.name,
        team: data.writerInfo.teamHierarchy[data.writerInfo.teamHierarchy.length - 1],
        attachment: data.attachment,
        cname: data.category.name,
        upCategory: data.category.categoryHierarchy[1],
        cid: data.category.cid,
        title: data.title,
        content: data.content,
        createDate: this.exportDateFromTimeStamp(data.createDate),
        commentCnt: data.commentCnt,
        viewCnt: data.viewCnt,
        likeCnt: data.likeCnt,
        likeYn: data.likeYn,
        tags: data.tags,
        writerId: data.writerInfo.id,
        managerId: data.category.managerId,
        profileImage: data.writerInfo.profileImage,
      }
    },
    async requestAnswerData() {
      var res = await api.get('board/questions/' + this.$route.query.qid + '/answers', '')
      this.answerList = res.data
      this.initAnswerData()
    },
    initAnswerData() {
      console.log(this.answerList)
      this.answerList.forEach(async (answer) => {
        let res = await this.callComments('answer', answer.aid)
        Object.assign(answer, {
          commentInputRef: 'answer' + answer.aid,
          mentionName: '',
          mentionWriterId: 0,
          mentionId: 0,
          commentMode: false,
          commentText: '',
          comments: res,
        })
      })
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
    },
    checkAdmin() {
      return this.user.role.includes("ADMIN")
    }
  },
};
</script>
<style scoped>
::v-deep .ck-rounded-corners .ck.ck-editor__main>.ck-editor__editable {
  padding-left: 0;
  padding-bottom: 0;
}

::v-deep .ck.ck-editor__editable_inline>:last-child {
  margin-bottom: 0;
}

.v-chip.v-chip--size-default {
  font-size: 0.8rem !important;
}

.v-container {
  padding-top: 0px !important;
  padding-bottom: 16px !important;
  padding-left: 16px !important;
  padding-right: 16px !important;
}

.inputbox {
  color: black !important;
}</style>