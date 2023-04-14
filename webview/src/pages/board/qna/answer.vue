<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FileUploadAdapter from "@/utils/fileUploaderAdapter";
import { watch, onMounted, ref } from "vue";
//import { generateKey } from "crypto";
import api from '@/api';
import store from "@/store";

export default {
  components: {
    ckeditor: CKEditor.component,
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        // 상세 수정은 https://ckeditor.com
        extraPlugins: [this.uploader],
        removePlugins: ["ImageCaption"],
      },

    };
  },
  mounted() {
    this.area = store.getters["info/infoArea"]
    this.$route.query.qid
  },
  methods: {
    async write(editorData) {
      console.log(editorData);
      const res = await api.post('/board/questions/' + this.$route.query.qid + '/answers', {
        writerId: store.getters["info/infoUser"].userId,
        content: this.editorData,
        atc: {
          "originFileName": "테스트파일",
          "extension": "xlsx",
          "fileSize": "512345"
        }
      }).then(
        (response) => {
          this.$router.push(process.env.VUE_APP_BOARD_QNA);
          console.log(response)
        }
      )
    },
    uploader(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new FileUploadAdapter(loader);
      };
    },
    cancle() {
      this.$router.push(process.env.VUE_APP_BOARD_QNA_DETAIL);
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
  }
};
</script>

<template>
  <div>

    <div class="font-sm font-medium mt-7 mb-2">답변</div>
    <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" height="200"></ckeditor>

    <v-file-input label="파일을 첨부해주세요." chips class="mt-5" variant="outlined" density="compact" hide-details>
    </v-file-input>

    <v-row class="mt-5" align="center">
      <v-col cols="6">
        <v-btn block variant="" class="button_white font-medium" @click="cancle">취소</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn block variant="" class="button_main font-medium" @click="write(editorData)"
          :disabled="!answerValidation">저장</v-btn>
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
