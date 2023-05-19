<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FileUploadAdapter from "@/utils/fileUploaderAdapter";
import fileUtils from "@/utils/fileUtils";
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
    let area = store.getters["info/infoArea"];
    let categoryItems = area.areaList;
    let subcategoryFullList = area.subAreaList;
    var categoriesAll = [].concat(["업무", "비업무"]);
    var i;
    for (i = 1; i < categoryItems.length; i++) {
      categoriesAll.push(categoryItems[i]);
      categoriesAll = categoriesAll.concat(subcategoryFullList[i - 1]);
    }
    let cidData = {};
    categoriesAll.forEach((value, index) => cidData[value] = index + 1);

    const route = useRoute();
    store.dispatch("url/setUrlQuery", { qid: route.query.qid })

    return { chipData, chipText, cidData, categoriesAll };
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
      area: {},
      areaItems: [],
      subAreaItems: [],
      selectedArea: [],
      selectedSubArea: [],
      placeholderText: '',
      isWork: true,
      title: '',
      tags: [],
      cid: 0,
      attachment: null,
      isDeleted: false,
      selectedFile: null,
      isWarning: false, 
    };
  },
  watch: {
    selectedArea: function (newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
      if (typeof oldVal === 'string') {
        this.cid = ''
      }
    },
    selectedSubArea: function (newVal, oldVal) {
      console.log(newVal)
      console.log(oldVal)
      if (typeof newVal === 'string') {
        this.cid = this.cidData[newVal]
      }
    },
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
    },
    editorData(newValue, oldValue){
      if(newValue?.length > 10000) {
        this.isWarning = true
      } else {
        this.isWarning = false 
      }
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
      if (this.cid !== '' && this.title !== '' && this.editorData !== '' && !this.isWarning) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    this.area = store.getters["info/infoArea"]
    this.areaItems = this.area.areaList.slice(1)

    this.requestQuestionData().then((res) => {
      console.log(res)
      this.cid = res.data.category.cid
      this.title = res.data.title
      this.editorData = res.data.content
      this.chipData = new Set(res.data.tags);
      this.attachment = res.data.attachment
      console.log(res.data.attachment)
      if (this.cid == 2) {
        this.isWork = false;
      } else {
        this.selectedArea = res.data.category.categoryHierarchy[1]
        this.selectedSubArea = this.categoriesAll[this.cid - 1]
        this.subAreaItems = this.area.subAreaList[this.areaItems.indexOf(this.selectedArea)]
      }
    })


  },
  methods: {
    async requestQuestionData() {
      var res = await api.get('board/questions/' + this.$route.query.qid, '')
      return res
    },
    async edit() {

      const formData = new FormData();

      const question ={
        cid: this.cid,
        title: this.title,
        content: this.editorData,
        tags: Array.from(this.chipData),
      }

      if (this.attachment) {
        Object.assign(this.attachment, {
          deleted: this.isDeleted
        })
        Object.assign(question, {
          attachment: this.attachment
        })
      }
      console.log(question)
      const questionBlob = new Blob([JSON.stringify(question)], { type: 'application/json' });
      formData.append('question', questionBlob);

      if ((!this.attachment && !this.isDeleted && this.selectedFile) || (this.attachment && this.isDeleted && this.selectedFile)) {
        console.log(this.selectedFile)
        formData.append("attachment", this.selectedFile[0], this.selectedFile.name);
      }
      console.log(formData.values)
      await api.multiPartPatch('board/questions/' + this.$route.query.qid, formData)
      this.cancel()

    },
    uploader(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new FileUploadAdapter(loader);
      };
    },
    addChips() {
      let item = this.chipText.trim().replaceAll('#', '').toLowerCase()
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
    deleteAttachment(event) {
      event.preventDefault();
      event.stopPropagation();
      this.isDeleted = true
    },
    handleInput(event) {
      var inputValue = event.target.value;
      if (inputValue.endsWith(' ')) {
        this.addChips();
      }
    },
    cancel() {
      this.$router.replace({
        path: '/board/qna/' + this.$route.query.qid + '/'
      });
    },
    categoryChanged() {
      var areaIndex = this.areaItems.indexOf(this.selectedArea);
      this.subAreaItems = this.area.subAreaList[areaIndex];
      this.selectedSubArea = [];
    },
  }
};
</script>

<template>
  <v-form @submit.prevent="edit()" class="overflow-show">
    <div>
      <div class="font-sm font-medium mt-2">제목</div>
      <v-text-field v-model="title" placeholder="제목을 입력해주세요." variant="outlined" density="compact" hide-details
        class="mt-2" maxlength="100" />

      <v-row v-if="this.isWork" align="center" class="mt-2">
        <v-col>
          <label class="font-sm font-medium">분야</label>
          <v-select v-model="selectedArea" placeholder="분야 선택" variant="outlined" density="compact" :items="areaItems"
            :scrollable="true" hide-details @update:modelValue="categoryChanged" class="mt-2 basic"></v-select>
        </v-col>

        <v-col>
          <label class="font-sm font-medium">업무</label>
          <v-select v-model="selectedSubArea" placeholder="업무 선택" variant="outlined" density="compact"
            :items="subAreaItems" :scrollable="true" hide-details :disabled="!selectedArea.length"
            class="mt-2 basic"></v-select>
        </v-col>
      </v-row>

      <div class="font-sm font-medium mt-7 mb-2">본문</div>
      <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" height="200"></ckeditor>
      <div v-if="isWarning" class="invalid-feedback d-flex justify-end mt-2">
        <v-icon size="x-small" color="red">mdi-information-outline</v-icon>
        <span class="font-xs font_red ml-1">더 이상 입력할 수 없어요.</span>
      </div>

      <div class="font-sm font-medium mt-7 mb-2">파일</div>

      <v-chip v-if="this.attachment && !isDeleted">
        <v-icon size="small">mdi-attachment</v-icon> {{ this.attachment.origFilename }}
        <v-icon class="ml-2" icon="mdi-close-circle" @click="deleteAttachment($event)"></v-icon>
      </v-chip>

      <div v-if="!this.attachment || isDeleted">
        <v-file-input v-model="selectedFile" label="파일을 첨부해주세요." chips class="mt-5" variant="outlined" density="compact">
        </v-file-input>
      </div>

      <div class="mt-5 mb-2">
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
                  @input="handleInput" hide-details append-icon="mdi-tag-plus" @keydown.enter.prevent
                  @click:append="addChips" maxlength="15"></v-text-field>
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
          <v-btn block variant="" class="button_white font-medium" @click="cancel">취소</v-btn>
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
  color: black;
  opacity: initial !important;
}

::v-deep .ck.ck-editor__editable_inline {
  min-height: 300px !important;
  max-height: 300px !important;
  overflow-y: scroll !important;
}

.basic {
  min-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
