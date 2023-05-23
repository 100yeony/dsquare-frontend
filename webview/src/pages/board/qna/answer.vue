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
    const route = useRoute();
    console.log("setup__")
    console.log(route.query.qid)
    store.dispatch("url/setUrlQuery", { qid: route.query.qid })
  },
  data() {
    return {
      selectedFile: null,
      fileAttachable: false,
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        // 상세 수정은 https://ckeditor.com
        extraPlugins: [this.uploader],
        removePlugins: ["ImageCaption", "MediaEmbed"],
      },
      isWarning: false, 
    };
  },
  watch: {
    selectedFile: function (newVal, oldVal) {
      console.log(newVal)
      if (newVal != null && newVal?.length != 0) {
        if (fileUtils.isFileSizeLimit(newVal[0].size)) {
          this.fileAttachable = false
          alert('파일 크기는 10MB 이하여야 합니다.');
          this.selectedFile = null
        } else {
          this.fileAttachable = true
        }
      } else {
        this.fileAttachable = false
      }
    },
    editorData(newValue, oldValue){
      if(newValue?.length > 10000) {
        this.isWarning = true
      } else {
        this.isWarning = false 
      }
    }
  },
  mounted() {
    this.area = store.getters["info/infoArea"];
  },
  methods: {
    async write(editorData) {
      let formData = new FormData();

      const answer = {
        content: editorData,
      };

      const answerBlob = new Blob([JSON.stringify(answer)], { type: 'application/json' });
      formData.append('answer', answerBlob);
      if (this.fileAttachable) {
        formData.append("attachment", this.selectedFile[0], this.selectedFile.name);
      }

      var res = await api.multiPartPost(`board/questions/${this.$route.query.qid}/answers`, formData)
      console.log(res)

      this.cancel();
    },
    uploader(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new FileUploadAdapter(loader);
      };
    },
    cancel() {
      this.$router.replace({
        path: '/board/qna/' + this.$route.query.qid + '/',
      });
    },

  },
  computed: {
    answerValidation() {
      if (this.editorData !== '' && !this.isWarning) {
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
    <div v-if="isWarning" class="invalid-feedback d-flex justify-end mt-2">
      <v-icon size="x-small" color="red">mdi-information-outline</v-icon>
      <span class="font-xs font_red ml-1">더 이상 입력할 수 없어요.</span>
    </div>

    <v-file-input v-model="selectedFile" label="파일을 첨부해주세요." chips class="mt-5" variant="outlined" density="compact" hide-details>
    </v-file-input>

    <v-row class="mt-5" align="center">
      <v-col cols="6">
        <v-btn block variant="" class="button_white font-medium" @click="cancel">취소</v-btn>
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

::v-deep .ck.ck-editor__editable_inline {
    min-height: 300px !important;
    max-height: 300px !important;
    overflow-y: scroll !important;
}
</style>
