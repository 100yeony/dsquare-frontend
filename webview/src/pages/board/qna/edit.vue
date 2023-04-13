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
    var qid = this.$route.query.qid;
    var questionData = api.get()

    let chipData = ref(new Set());
    let chipText = ref("");

    return { qid, chipData, chipText };
  },

  data() {
    

    return {
      
      editor: ClassicEditor,
      
      editorConfig: {
        // 상세 수정은 https://ckeditor.com
        extraPlugins: [this.uploader],
        removePlugins: ["ImageCaption"],
      },
      placeholderText: '',
      isWork: true,
      
      // 데이터 가져와서 
      title: '',
      editorData: '',
      categoryName : '',
      content: '',
      tags : [],
      atc: '',
    };
  },
  watch: {
    selectedArea: function (newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
    },
    selectedSubArea: function (newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
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

  },
  mounted() {
  },
  methods: {
    async write(editorData) {
      console.log(editorData);
      var uri = '/board/questions/' + this.qid;
      const res = await api.post(uri, {
        title: this.title,
        content: editorData,
        categoryName: this.categoryName,
        tags: this.tags,
        atc: this.atc,
        // atc
      });
    },
    uploader(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new FileUploadAdapter(loader);
      };
    },
    addChips() {
      let item = this.chipText.trim()
      if (item !== "" && this.chipData.size < 3) {
        if (item.startsWith('#')) {
          this.chipData.add(item)
        } else {
          this.chipData.add('#' + this.chipText.trim())
        }
      }
      this.chipText = "";
    },
    deleteChip(event, item) {
      event.preventDefault();
      event.stopPropagation();
      this.chipData.delete(item);
      console.log(this.chipData)
    },
    handleInput(event) {
      var inputValue = event.target.value;
      if (inputValue.endsWith(' ')) {
        this.addChips();
      }
    },
    cancle() {
      this.$router.push(process.env.VUE_APP_BOARD_QNA);
    },

  },
};
</script>

<template>
  <div>
    <div class="font-sm font-medium mt-2">제목</div>
    <v-text-field v-model="title" placeholder="제목을 입력해주세요." variant="outlined" density="compact" hide-details class="mt-2" />

    <div class="font-sm font-medium mt-7 mb-2">본문</div>
    <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" height="200"></ckeditor>


    <div class="font-sm font-medium mt-7 mb-2">태그</div>

    <v-row justify="center" class="mt-2">
      <v-col cols="12" class="pw-100 ">
        <v-sheet elevation="1" rounded="xl">
          <div class="pa-2">
            <v-chip-group column>
              <v-chip v-for="tag in tags" :key="tag">
                {{ tag }}
                <v-icon icon="mdi-close-circle" @click="deleteChip($event, tag)"></v-icon>
              </v-chip>
            </v-chip-group>

          </div>
          <v-container>
            <v-row>
              <v-col cols="11" align-self="end">
                <v-text-field :placeholder=placeholderText v-model="chipText" variant="underlined" density="compact"
                  @input="handleInput" hide-details class="pw-90"></v-text-field>
              </v-col>
              <v-col cols="1" align-self="end">
                <v-icon icon="mdi-tag-plus" @click="addChips"></v-icon>
              </v-col>
            </v-row>

          </v-container>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row class="mt-5" align="center">
      <v-col cols="6">
        <v-btn block variant="" class="button_white font-medium" @click="cancle">취소</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn block variant="" class="button_main font-medium" @click="write(editorData)">저장</v-btn>
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
  border-color: #ADE4EB;
  background-color: #ADE4EB;
  color: white;
}

.tag {
  border-color: #ABABAB;
}

.v-btn--icon.v-btn--density-default {
  height: 0px;
  width: 0px;
}
</style>
