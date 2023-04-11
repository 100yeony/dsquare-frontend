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

    return {chipData, chipText };
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
      area: {},
      subAreaItems: [],
      selectedArea: '',
      selectedSubArea: '',
      placeholderText: '',
      isWork: true,

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
    }

  },
  mounted() {
    // store.dispatch('info/setInfoArea', { value1: ['카테고리1', '카테고리2', '카테고리3', '카테고리4', '카테고리5', '카테고리6', '카테고리7', '카테고리8'], value2: ['sub 카테고리1', 'sub 카테고리2', 'sub 카테고리3', 'sub 카테고리4', 'sub 카테고리5', 'sub 카테고리6', 'sub 카테고리7', 'sub 카테고리8'] }
    // )
    this.area = store.getters["info/infoArea"]
    console.log(this.$route.query.work);
    if (this.$route.query.work==='false') {
      // work 값이 없으면.
      //this.$router.replace(process.env.VUE_APP_BOARD);
      this.isWork=false;
      console.log(this.isWork)
    }
    //this.work = this.$route.query.work;
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
    categoryChanged() {
      var areaIndex = this.area.areaList.indexOf(this.selectedArea);
      this.subAreaItems = this.area.subAreaList[areaIndex];
      this.selectedSubArea = '';
    },
  },
};
</script>

<template>
  <div>
    <div class="font-sm font-medium mt-2">제목</div>
    <v-text-field placeholder="제목을 입력해주세요." variant="outlined" density="compact" hide-details class="mt-2" />

    <v-row v-if="this.isWork" align="center" class="mt-2">
      <v-col>
        <label class="font-sm font-medium">분야</label>
        <v-select v-model="selectedArea" placeholder="분야 선택" variant="outlined" density="compact"
          :items="area.areaList" :scrollable="true" hide-details @update:modelValue="categoryChanged" class="mt-2"></v-select>
      </v-col>

      <v-col>
        <label class="font-sm font-medium">업무</label>
        <v-select v-model="selectedSubArea" placeholder="업무 선택" variant="outlined" density="compact"
          :items="subAreaItems" :scrollable="true" hide-details :disabled="!selectedArea.length" class="mt-2"></v-select>
      </v-col>
    </v-row>

    <div class="font-sm font-medium mt-7 mb-2">본문</div>
    <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" height="200"></ckeditor>


    <div class="font-sm font-medium mt-7 mb-2">태그</div>

    <v-row justify="center">
      <v-col cols="12" sm="7" md="6" lg="5">
        <v-sheet elevation="1" rounded="xl">
          <div class="pa-4">
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
                  @input="handleInput" hide-details class="mt-10 pw-90"></v-text-field>
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
