<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FileUploadAdapter from "@/utils/fileUploaderAdapter";
import { computed, onMounted, ref } from "vue";
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
      editorData: "<h3>안녕하세요!</h3>",
      editorConfig: {
      // 상세 수정은 https://ckeditor.com
        extraPlugins: [this.uploader],
        removePlugins: ["ImageCaption"],
      },
    };
  },
  mounted(){
    console.log(this.$route.query.work)
    if(!this.$route.query.work) { // work 값이 없으면.
      this.$router.replace(process.env.VUE_APP_BOARD)
    }
    this.work = this.$route.query.work;
  },
  methods: {
    uploader(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new FileUploadAdapter(loader);
      };
    },
  },
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">제목 넣기 : </h4>
            <h4 v-if="work">담당자</h4>
            첨부파일.
            <!-- 첨부파일은 직접 넣어보세요. -->
            <p class="card-title-desc">
            </p>
            <!-- Editor -->
            <ckeditor
              v-model="editorData"
              :editor="editor"
              :config="editorConfig"
            ></ckeditor>
          </div>
        </div>
      </div>
      <v-btn block>작성</v-btn>
    </div>
  </div>
</template>
