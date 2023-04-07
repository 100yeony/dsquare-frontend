<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FileUploadAdapter from "@/utils/fileUploaderAdapter";
import { computed, onMounted, ref } from "vue";
import api from '@/api'

export default {
  components: {
    ckeditor: CKEditor.component,
  },

  setup() {
    let work = ref(false);
    let chipData = ref([]);
    let chipText = ref("");

    return { work, chipData, chipText };
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: "",
      editorConfig: {
        // 상세 수정은 https://ckeditor.com
        extraPlugins: [this.uploader],
        removePlugins: ["ImageCaption"],
      },
    };
  },
  mounted() {
    console.log(this.$route.query.work);
    if (!this.$route.query.work) {
      // work 값이 없으면.
      this.$router.replace(process.env.VUE_APP_BOARD);
    }
    this.work = this.$route.query.work;
  },
  methods: {
    async write(editorData) {
      console.log(editorData);
      const res = await api.post('/board/questions', {
        content: editorData,
      });
    },
    uploader(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new FileUploadAdapter(loader);
      };
    },
    addChips() {
      if (this.chipText.length) {
        this.chipData.push(this.chipText);
        this.chipText = "";
      }
    },
    deleteChip(item) {
      if (this.chipData && item) {
        for (let i = 0; i < this.chipData.length; i++) {
          if (this.chipData[i] === item) {
            this.chipData.splice(i, 1);
            break;
          }
        }
      }
    },
  },
};
</script>

<template>
  <div>
    <v-text-field
      placeholder="제목을 입력해 주세요"
      variant="outlined"
      density="compact"
    />
    <div class="text-body-2 font-weight-bold">분야지정</div>
    <v-select
      placeholder="분야"
      variant="outlined"
      density="compact"
      :items="['아키텍처', '분야1', '분야2', '분야3']"
    ></v-select>
    <v-row class="mb-2" align="center">
      <v-col cols="2">
        <v-avatar color="grey">유저</v-avatar>
      </v-col>
      <v-col cols="5">
        <div class="text-body font-bold">작성자</div>
      </v-col>
      <v-col cols="3">
        <div class="text-caption font-0000008F">2023-04-01</div>
      </v-col>
      <v-col cols="2">
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-col>
    </v-row>
    <ckeditor
      v-model="editorData"
      :editor="editor"
      :config="editorConfig"
      height="80vh"
    ></ckeditor>

    <div class="text-text-body-2 font-weight-bold">Tags</div>

    <v-text-field
      placeholder="Tag를 입력해 주세요."
      v-model="chipText"
      variant="outlined"
      density="compact"
    >
      <template v-slot:append>
        <v-btn icon @click="addChips"
          ><v-icon>mdi-magnify</v-icon></v-btn
        ></template
      >
      <template v-slot:prepend-inner>
        <div v-for="(chipDataText, index) in chipData" :key="index">
          <v-chip class="ma-1" closable @click:close="deleteChip(chipDataText)">{{
            chipDataText
          }}</v-chip>
        </div>
      </template>
    </v-text-field>

    <v-row class="mb-2" align="center">
      <v-col cols="6">
        <v-btn @click="write(editorData)" block color="#ADE4EB">저장</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn block>취소</v-btn>
      </v-col>
    </v-row>
  </div>
</template>
