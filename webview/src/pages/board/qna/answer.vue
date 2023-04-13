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

    return { work };
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: "<h6>내용을 입력해주세요.</h6>",
      editorConfig: {
        // 상세 수정은 https://ckeditor.com
        extraPlugins: [this.uploader],
        removePlugins: ["ImageCaption"],
      },
      area: {},
      selectedArea: '',
      selectedSubArea: '',

    };
  },
  mounted() {
    store.dispatch('info/setInfoArea', { value1: ['카테고리1', '카테고리2', '카테고리3', '카테고리4', '카테고리5', '카테고리6', '카테고리7', '카테고리8'], value2: ['sub 카테고리1', 'sub 카테고리2', 'sub 카테고리3', 'sub 카테고리4', 'sub 카테고리5', 'sub 카테고리6', 'sub 카테고리7', 'sub 카테고리8'] }
    )
    this.area = store.getters["info/infoArea"]
    console.log(this.$route.query.work);
    // if (!this.$route.query.work) {
    //   // work 값이 없으면.
    //   this.$router.replace(process.env.VUE_APP_BOARD);
    // }
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
    cancle(){
      this.$router.push(process.env.VUE_APP_BOARD_QNA_DETAIL);
    }
  
  },
};
</script>

<template>
  <div>

    <div class="font-sm font-medium mt-7 mb-2">답변</div>
    <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" height="200"></ckeditor>

    <v-file-input 
      label="파일을 첨부해주세요."
      chips
      class="mt-5"
      variant="outlined"
      density="compact"
      hide-details
    >
    </v-file-input>

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

.v-btn--icon.v-btn--density-default {
  height: 0px;
  width: 0px;
}

::v-deep .v-icon{
  opacity: initial !important;
}
</style>
