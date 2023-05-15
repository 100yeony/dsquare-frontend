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
  setup() {
    let chipData = ref(new Set());
    let chipText = ref("");

    return { chipData, chipText };
  },
  data() {
    return {
      selectedFile: null,
      editor: ClassicEditor,
      editorData: "",
      editorConfig: {
        // 상세 수정은 https://ckeditor.com
        extraPlugins: [this.uploader],
        removePlugins: ["ImageCaption", "MediaEmbed"] //, "ImageUpload", "EasyImage"
      },
      placeholderText: '',
      title: '',
      tags: [],
    };
  },
  watch: {
    selectedFile: function (newVal, oldVal) {
    }
  },
  computed: {
    tags() {
      return Array.from(this.chipData);
    },
    placeholderText() {
      if (this.chipData.size === 0) {
        return '태그를 입력해주세요.'
      } else {
        return ''
      }
    },
    editorValidation() {
      if (this.title !== '' && this.editorData !== '') {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
  },
  methods: {
    async write(editorData) {
      await api.post('board/carrots', {
        content: editorData,
        title: this.title,
        tags: Array.from(this.chipData),
        atc: {
          originFileName: '원본파일명',
          extension: 'png',
          fileSize: 51239
        }
      })
      store.dispatch('info/setPageState', {});
      this.$router.push(process.env.VUE_APP_BOARD_DEAL);

    },
    uploader(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new FileUploadAdapter(loader);
      };
    },
    addChips() {
      let item = this.chipText.trim().replaceAll('#', '')
      if (item !== "" && this.chipData.size < 3) {
        this.chipData.add(item)
      }
      this.chipText = "";
    },
    deleteChip(event, item) {
      event.preventDefault();
      event.stopPropagation();
      this.chipData.delete(item);
    },
    handleInput(event) {
      var inputValue = event.target.value;
      if (inputValue.endsWith(' ')) {
        this.addChips();
      }
    },
    cancle() {
      this.$router.push(process.env.VUE_APP_BOARD_DEAL);
    },
    fillForm() {
      this.editorData = "<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</p><p>&nbsp;</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;(사진)</p><p>&nbsp;</p><p>&nbsp;</p><p>품명: &nbsp;</p><p>장소:&nbsp;</p><p>시간:</p><p>가격:</p><p>상태: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p>"
    }
  }
};
</script>

<template>
  <v-form @submit.prevent="write(editorData)" class="overflow-show">
    <div>
      <div class="font-sm font-medium mt-2">제목</div>
      <v-text-field v-model="title" placeholder="제목을 입력해주세요." variant="outlined" density="compact" hide-details
        class="mt-2" maxlength="100"/>

      <div class="font-sm font-medium mt-7 mb-2">본문</div>
      <v-btn variant="outlined" size="x-small" @click="fillForm()" class="font-xs mb-2">양식 불러오기</v-btn>
      <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" height="200"></ckeditor>

      <v-file-input v-model="selectedFile" label="파일을 첨부해주세요." chips class="mt-5" variant="outlined" density="compact">
      </v-file-input>

      <div class="mb-2">
        <span class="font-sm font-medium">태그</span>
        <span class="text-caption my-3 font-0000008F">
          (스페이스 바를 눌러 입력하세요!)
        </span>
      </div>

      <v-row justify="center">
        <v-col cols="12" class="pw-100 ">
          <v-sheet>
            <v-row>
              <v-col>
                <v-text-field :placeholder=placeholderText v-model="chipText" variant="outlined" density="compact"
                  @input="handleInput" hide-details append-icon="mdi-tag-plus" @keydown.enter.prevent @click:append="addChips" maxlength="15"></v-text-field>
              </v-col>
            </v-row>
            <div>
              <v-chip-group column>
                <v-chip v-for="tag in tags" :key="tag">
                  #{{ tag }}
                  <v-icon class="ml-2" icon="mdi-close-circle" @click="deleteChip($event, tag)"></v-icon>
                </v-chip>
              </v-chip-group>

            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row class="mt-5" align="center">
        <v-col cols="6">
          <v-btn block variant="" class="button_white font-medium" @click="cancle">취소</v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn block variant="" class="button_main font-medium" type="submit" :disabled="!editorValidation">저장</v-btn>
        </v-col>
      </v-row>
    </div>
  </v-form>
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

::v-deep .v-input__append {
  margin-inline-start: 12px !important;
  margin-inline-end: 10px !important;
}

::v-deep .v-icon {
  color: black !important;
  opacity: initial !important;
}

::v-deep .ck.ck-editor__editable_inline {
    min-height: 300px !important;
    max-height: 300px !important;
    overflow-y: scroll !important; 
}
</style>
