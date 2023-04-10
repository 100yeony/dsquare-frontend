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
    let work = ref(false);
    let chipData = ref([]);
    let chipText = ref("");

    return { work, chipData, chipText };
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: "<h3>안녕하세요!</h3>",
      editorConfig: {
        // 상세 수정은 https://ckeditor.com
        extraPlugins: [this.uploader],
        removePlugins: ["ImageCaption"],
      },
      items: [],
      selectedManager: ''

    };
  },
  watch: {
    selectedManager: function (newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
    }
  },
  mounted() {
    store.dispatch('info/setInfoManager', ['카테고리1', '카테고리2', '카테고리3', '카테고리4', '카테고리5', '카테고리6', '카테고리7', '카테고리8'])
    this.items = store.getters["info/infoManagerList"]
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
    <div class="font-sm font-medium mt-2">제목</div>
    <v-text-field placeholder="제목을 입력해주세요." variant="outlined" density="compact" hide-details class="mt-2" />

    <v-row align="center" class="mt-2">
      <v-col>
        <label for="select1" class="font-sm font-medium">분야</label>
        <v-select v-model="selectedManager" placeholder="분야 선택" variant="outlined" density="compact" :items="this.items"
          id="select1" :scrollable="true" hide-details class="mt-2" onchange="areaChange(this)"></v-select>
      </v-col>

      <v-col>
        <label for="select1" class="font-sm font-medium">업무</label>
        <v-select v-model="selectedManager" placeholder="업무 선택" variant="outlined" density="compact" :items="this.items"
          id="select1" :scrollable="true" hide-details class="mt-2"></v-select>
      </v-col>
    </v-row>

    <div class="font-sm font-medium mt-7 mb-2">본문</div>
    <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" height="200"></ckeditor>

    <div class="font-sm font-medium mt-7 mb-2">태그</div>

    <v-text-field placeholder="태그를 입력해주세요." v-model="chipText" variant="outlined" density="compact" hide-details>
      <template v-slot:append>
        <v-btn icon @click="addChips" variant="" class="mr-5 ml-2"><img src="@/assets/images/tag.png" width="25"
            height="25"></v-btn></template>
      <template v-slot:prepend-inner>
        <div v-for="(chipDataText, index) in chipData" :key="index">
          <v-chip class="ma-1" closable @click:close="deleteChip(chipDataText)">{{
            chipDataText
          }}</v-chip>
        </div>
      </template>
    </v-text-field>

    <v-row class="mt-5" align="center">
      <v-col cols="6">
        <v-btn block variant="" class="button_white font-medium">취소</v-btn>
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
