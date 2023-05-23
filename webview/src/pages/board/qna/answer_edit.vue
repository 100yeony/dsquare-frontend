<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FileUploadAdapter from "@/utils/fileUploaderAdapter";
import fileUtils from "@/utils/fileUtils";
import { watch, onMounted, ref } from "vue";
//import { generateKey } from "crypto";
import api from '@/api';
import store from "@/store";
import { useRoute, useRouter } from 'vue-router';

export default {
  components: {
    ckeditor: CKEditor.component,
  },
  setup() {
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        // 상세 수정은 https://ckeditor.com
        extraPlugins: [this.uploader],
        removePlugins: ["ImageCaption", "MediaEmbed"]

      },
      answer: null,
      attachment: null,
      isDeleted: false,
      selectedFile: null,
    };
  },
  mounted() {
    this.requestAnswerData().then(res => {
      this.answer = res.data
      this.editorData = res.data.content
      this.attachment = res.data.attachment
    })
  },
  methods: {
    async requestAnswerData() {
      return await api.get('board/answers/' + this.$route.query.id)
    },
    async edit() {

      const formData = new FormData();

      const answer = this.answer 

      if (this.attachment) {
        Object.assign(this.attachment, {
          deleted: this.isDeleted
        })
        answer.attachment = this.attachment
      }

      console.log(answer)
      const questionBlob = new Blob([JSON.stringify(answer)], { type: 'application/json' });
      formData.append('answer', questionBlob);

      if ((!this.attachment && !this.isDeleted && this.selectedFile) || (this.attachment && this.isDeleted && this.selectedFile)) {
        console.log(this.selectedFile)
        formData.append("attachment", this.selectedFile[0], this.selectedFile.name);
      }
      console.log(formData.values) 
      await api.multiPartPatch('board/questions/' + this.$route.query.qid + '/answers/' + this.$route.query.id, formData)
      this.cancel()



      // await api.post('board/questions/' + this.$route.query.qid + '/answers/' + this.$route.query.id, {
      //   content: this.editorData,
      //   atc: {
      //     "originFileName": "테스트파일",
      //     "extension": "xlsx",
      //     "fileSize": "512345"
      //   }
      // })
    },
    uploader(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new FileUploadAdapter(loader);
      };
    },
    deleteAttachment(event) {
      event.preventDefault();
      event.stopPropagation();
      this.isDeleted = true
    },
    cancel() {
      this.$router.replace({
        path: '/board/qna/' + this.$route.query.qid + '/',
      });
    }

  },
  computed: {
    answerValidation() {
      if (this.editorData !== '') {
        return true;
      } else {
        return false;
      }
    },
  },
  watch: {
    selectedFile: function (newVal, oldVal) {
      console.log("computed")
      if (this.selectedFile != null && this.selectedFile?.length != 0) {
        console.log('not blank')
        if (fileUtils.isFileSizeLimit(newVal[0].size)) {
          console.log('is expired')
          alert('파일 크기는 10MB 이하여야 합니다.');
          this.selectedFile = null
        }
      } else if (this.selectedFile?.length == 0) {
        console.log("length = 0")
        this.selectedFile = null
      }
    }
  }
};
</script>

<template>
  <div>

    <div class="font-sm font-medium mt-7 mb-2">답변</div>
    <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" height="200"></ckeditor>

    <div class="font-sm font-medium mt-7 mb-2">파일</div>

    <v-chip v-if="this.attachment && !isDeleted">
      <v-icon size="small">mdi-attachment</v-icon> {{ this.attachment.origFilename }}
      <v-icon class="ml-2" icon="mdi-close-circle" @click="deleteAttachment($event)"></v-icon>
    </v-chip>

    <div v-if="!this.attachment || isDeleted">
      <v-file-input v-model="selectedFile" label="파일을 첨부해주세요." chips class="mt-5" variant="outlined" density="compact">
      </v-file-input>
    </div>

    <v-row class="mt-5" align="center">
      <v-col cols="6">
        <v-btn block variant="" class="button_white font-medium" @click="cancel">취소</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn block variant="" class="button_main font-medium" @click="edit()" :disabled="!answerValidation">저장</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.button_white {
  border-width: 1px;
  border-style: solid;
  border-color: #ABABAB;
  color: black;
}

.button_main {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(var(--v-theme-primary));
  background-color: rgb(var(--v-theme-primary));
  color: white;
}

.v-btn--icon.v-btn--density-default {
  height: 0px;
  width: 0px;
}

::v-deep .v-icon {
  opacity: initial !important;
}
</style>
