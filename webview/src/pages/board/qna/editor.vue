<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FileUploadAdapter from "@/utils/fileUploaderAdapter";
import fileUtils from "@/utils/fileUtils";
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

    return { chipData, chipText, cidData };
  },
  data() {
    return {
      selectedFile: null,
      fileAttachable: false,
      editor: ClassicEditor,
      editorData: "",
      editorConfig: {
        // 상세 수정은 https://ckeditor.com
        extraPlugins: [this.uploader],
        removePlugins: ["ImageCaption", "MediaEmbed"] //, "ImageUpload", "EasyImage"
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
      cid: '',
    };
  },
  watch: {
    selectedArea: function (newVal, oldVal) {
      this.cid = ''
    },
    selectedSubArea: function (newVal, oldVal) {
      if (typeof newVal === 'string') {
        this.cid = this.cidData[newVal]
      }
    },
    selectedFile: function (newVal, oldVal) {
      console.log(newVal)
      if (newVal != null && newVal?.length != 0) {
        if (fileUtils.isFileSizeLimit(newVal[0].size)){
          this.fileAttachable = false
          alert('파일 크기는 10MB 이하여야 합니다.');
          this.selectedFile = null
        } else {
          this.fileAttachable = true 
        }
      } else {
        this.fileAttachable = false
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
      if (this.cid !== '' && this.title !== '' && this.editorData !== '') {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    this.area = store.getters["info/infoArea"]
    this.areaItems = this.area.areaList.slice(1)
    if (this.$route.query.work === 'false') {
      this.isWork = false;
      this.cid = 2;
    }
  },
  methods: {
    async write(editorData) {
      const formData = new FormData();

      const question = {
        writerId: store.getters["info/infoUser"].userId,
        cid: this.cid,
        content: editorData,
        title: this.title,
        tags: Array.from(this.chipData),
      };

      const questionBlob = new Blob([JSON.stringify(question)], { type: 'application/json' });
      formData.append('question', questionBlob);
      if (this.fileAttachable) {
        formData.append("attachment", this.selectedFile[0], this.selectedFile.name);
      }

      api.multiPartPost('board/questions', formData)
        .then((response) => {
          console.log(response)
          store.dispatch('info/setPageState', {});
          this.$router.push(process.env.VUE_APP_BOARD_QNA);
        }).catch((error) => {
          console.log(error)
        })
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
      this.$router.push(process.env.VUE_APP_BOARD_QNA);
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
  <v-form @submit.prevent="write(editorData)" class="overflow-show">
    <div>
      <div class="font-sm font-medium mt-2">제목</div>
      <v-text-field v-model="title" placeholder="제목을 입력해주세요." variant="outlined" density="compact" hide-details
        class="mt-2" />

      <v-row v-if="this.isWork" align="center" class="mt-2">
        <v-col>
          <label class="font-sm font-medium">분야</label>
          <v-select v-model="selectedArea" placeholder="분야 선택" variant="outlined" density="compact" :items="areaItems"
            :scrollable="true" hide-details @update:modelValue="categoryChanged" class="mt-2"></v-select>
        </v-col>

        <v-col>
          <label class="font-sm font-medium">업무</label>
          <v-select v-model="selectedSubArea" placeholder="업무 선택" variant="outlined" density="compact"
            :items="subAreaItems" :scrollable="true" hide-details :disabled="!selectedArea.length"
            class="mt-2"></v-select>
        </v-col>
      </v-row>

      <div class="font-sm font-medium mt-7 mb-2">본문</div>
      <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" height="200"></ckeditor>

      <v-file-input v-model="selectedFile" label="파일을 첨부해주세요." chips class="mt-5" variant="outlined" density="compact">
      </v-file-input>

      <div class="font-sm font-medium mb-2">태그</div>

      <v-row justify="center">
        <v-col cols="12" class="pw-100 ">
          <v-sheet>
            <v-row>
              <v-col>
                <v-text-field :placeholder=placeholderText v-model="chipText" variant="outlined" density="compact"
                  @input="handleInput" hide-details append-icon="mdi-tag-plus" @click:append="addChips"></v-text-field>
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
</style>
