<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FileUploadAdapter from "@/utils/fileUploaderAdapter";
import { watch, onMounted, ref } from "vue";
import api from '@/api';
import store from "@/store";
import { useRoute, useRouter } from 'vue-router';


export default {
  components: {
    ckeditor: CKEditor.component,
  },
  setup() {
    let chipData = ref(new Set());
    let chipText = ref("");

    const route = useRoute();
    store.dispatch("url/setUrlQuery", { carrotId: route.query.carrotId })

    return { chipData, chipText };
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: this.$route.query.content,
      editorConfig: {
        // 상세 수정은 https://ckeditor.com
        extraPlugins: [this.uploader],
        removePlugins: ["ImageCaption", "MediaEmbed"]

      },
      placeholderText: '',
      title: this.$route.query.title,
      tags: [],
    };
  },
  watch: {
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
    this.title = this.$route.query.title
    this.editorData = this.$route.query.content
    this.chipData = new Set(this.$route.query.chipData);

  },
  methods: {
    async edit(editorData) {
      await api.patch('board/carrots/' + this.$route.query.carrotId, {
        content: editorData,
        title: this.title,
        atcId: this.$route.query.atcid,
        tags: Array.from(this.chipData)
      })
      this.cancle()
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
      this.$router.replace({
        path: process.env.VUE_APP_BOARD_DEAL_DETAIL,
        query: {
          carrotId: this.$route.query.carrotId
        }
      });
    },
  }
};
</script>

<template>
  <v-form @submit.prevent="edit(editorData)" class="overflow-show">
    <div>
      <div class="font-sm font-medium mt-2">제목</div>
      <v-text-field v-model="title" placeholder="제목을 입력해주세요." variant="outlined" density="compact" hide-details
        class="mt-2" maxlength="100"/>

      <div class="font-sm font-medium mt-7 mb-2">본문</div>
      <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" height="200"></ckeditor>

      <div class="font-sm font-medium mt-5 mb-2">태그</div>

      <v-row justify="center">
        <v-col cols="12" class="pw-100 ">
          <v-sheet>
            <v-row>
              <v-col>
                <v-text-field :placeholder=placeholderText v-model="chipText" variant="outlined" density="compact"
                  @input="handleInput" hide-details append-icon="mdi-tag-plus" @click:append="addChips" maxlength="15"></v-text-field>
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
          <v-btn block variant="" class="button_main font-medium" type="submit" :disabled="!editorValidation">수정</v-btn>
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
  border-color: #ADE4EB;
  background-color: #ADE4EB;
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
