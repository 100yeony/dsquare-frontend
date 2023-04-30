<template>
  <div class="none_ck-toolbar_border">
    <DeleteDialog :isShow="isShow" :title="dialogTitle" @click-confirm="onConfirm" @click-cancel="onCancel" />
  </div>
  <v-card>
    <v-card-item>
      <!-- 프로필, 작성시간, 수정/삭제 메뉴 -->
      <v-row class="mb-2" align="center">
        <v-col cols="2">
          <v-avatar color="grey">😀</v-avatar>
        </v-col>
        <v-col cols="4">
          <div class="text-body font-bold">
            <v-row>{{ carrotData.writerInfo.name }}</v-row>
              <v-row class="text-caption font-0000008F">{{ carrotData.writerInfo.teamHierarchy[carrotData.writerInfo.teamHierarchy.length-1] }}</v-row>
          </div>
        </v-col>
        <v-col cols="4">
          <div class="text-caption font-0000008F">{{ carrotData.createDate }}</div>
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

      <!-- 제목 -->
      <h2 class="mb-3">
        {{ carrotData.title }}
      </h2>

      <!-- 내용 -->
      <ckeditor v-model="carrotData.content" :editor="editor" :config="editorConfig" :disabled="true"></ckeditor>

      <!-- 좋아요, 댓글 -->
      <v-row class="mt-2">
        <v-col cols="2" class="center-container">
          <span @click="toggleLike('carrot', carrotData.carrotId)">
            <template v-if="cardData.likeYn"><v-icon size="small" color="red">mdi-heart</v-icon></template>
            <template v-else><v-icon size="small">mdi-heart-outline</v-icon></template>
          </span>
          <span class="text-caption font-0000008F ml-1">{{ carrotData.likeCnt }}</span></v-col>
        <v-col cols="2" class="center-container"><v-icon size="small">mdi-message-text-outline</v-icon><span
            class="text-caption font-0000008F ml-1"><!-- 댓글 수 --></span></v-col>
      </v-row>

      <!-- 태그 -->
      <v-slide-group>
        <v-slide-group-item v-for="(chip, index) in carrotData.tags" :key="index">
          <v-chip class="ma-2">#{{ chip }}</v-chip>
        </v-slide-group-item>
      </v-slide-group>

    </v-card-item>
  </v-card>
</template>



<script>
import DeleteDialog from '@/components/DeleteDialog';
import api from '@/api'
import store from '@/store'
import like from '@/api/like.js';

export default {
  components: {
    DeleteDialog
  },
  data() {
    return {
      user: store.getters["info/infoUser"],
      carrotData: {
        carrotId: 0,
        writerInfo: {
            id: 0,
            email: '',
            nickname: '',
            name: '',
            contact: '',
            teamHierarchy: [],
        },
        title: '',
        content: '',
        createDate: '',
        viewCnt: 0,
        tags: [],
        likeCnt: 0,
        likeYn: false,
        commentCnt: 0
      },
      commentList: [],
      questionMenu: [
        { title: "수정", id: 0 },
        { title: "삭제", id: 1 },
      ],
      isShow: false,
      isWriter: false,
      selectedPostType: 0,
    };
  },
  mounted() {
    const carrotData = this.requestCarrotData();
    carrotData.then(
      (response) => {
        this.carrotData = response.data;
        this.carrotData.createDate = this.exportDateFromTimeStamp(this.carrotData.createDate);
        if (this.user.userId === response.data.writerInfo.id) {
          this.isWriter = true;
        }
      }
    );
  },
  computed: {
    dialogTitle() {
      if (this.selectedPostType==0) {
        return '게시물을 삭제하시겠습니까?';
      } else if(this.selectedPostType==1) {
        return '답변을 삭제하시겠습니까?'
      } else if(this.selectedPostType==2) {
        return '게시글을 삭제하시겠습니까?'
      }
    }
  },
  methods: {
    editPost(index) {
      console.log(index)
      if (index === 0) {
        console.log("수정하기");
        this.$router.push({
          path: process.env.VUE_APP_BOARD_DEAL_EDIT,
          query: {
            id: this.carrotData.carrotId,
            title: this.carrotData.title,
            content: this.carrotData.content,
            upid: this.carrotData.upid,
          }

        });
      } else if (index === 1) {
        console.log("삭제하기");
        this.showDialog(0)
      }
    },
    showDialog(num) {
      this.selectedPostType = num;
      this.isShow = true;
    },
    onConfirm() {
      console.log('confirm payload:');
      this.isShow = false;
      if (this.selectedPostType==0) {
        this.requestDelCarrot();
      } else if (this.selectedPostType==1) {
        this.requestDelComment();
      } else if (this.selectedPostType==2) {

      }
    },
    onCancel() {
      console.log('cancel');
      this.isShow = false;
    },
    async requestDelCarrot() {
      const res = await api.del('board/carrots/' + this.$route.query.id, '').then(
        (response) => {
          console.log(response)
          this.$router.push(process.env.VUE_APP_BOARD_DEAL);
        }
      )
    },
    async requestDelComment(num) {
      // TODO
    },
    async requestCarrotData() {
      var res = await api.get('board/carrots/' + this.$route.query.id, '')
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

    // 좋아요 관련
    async toggleLike(board, id) {
      var res = !this.carrotData.likeYn ? await like.post(board, id) : await like.del(board, id);
      if ([200, 201].includes(res.status)) {  // 성공
        if (this.carrotData.likeYn) {
          this.carrotData.likeCnt--;
        }
        else {
          this.carrotData.likeCnt++;
        }
        this.carrotData.likeYn = !this.carrotData.likeYn;
        this.$forceUpdate();
      }
    }
  },
};
</script>