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
    let chipData = ref(new Set());
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
      area: {},
      selectedArea: '',
      selectedSubArea: '',

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
    }

  },
  mounted() {
    store.dispatch('info/setInfoArea', { value1: ['카테고리1', '카테고리2', '카테고리3', '카테고리4', '카테고리5', '카테고리6', '카테고리7', '카테고리8'], value2: ['sub 카테고리1', 'sub 카테고리2', 'sub 카테고리3', 'sub 카테고리4', 'sub 카테고리5', 'sub 카테고리6', 'sub 카테고리7', 'sub 카테고리8'] }
    )
    this.area = store.getters["info/infoArea"]
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
      let item = this.chipText.trim()
      if (item !== "" && this.chipData.size < 3){
        if (item.startsWith('#')) {
          this.chipData.add(item)
        } else {
          this.chipData.add('#' + this.chipText.trim())
        }
      }
      this.chipText = "";
    },
    deleteChip(event, item) {
      // if (this.chipData && item) {
      //   for (let i = 0; i < this.chipData.length; i++) {
      //     if (this.chipData[i] === item) {
      //       this.chipData.splice(i, 1);
      //       break;
      //     }
      //   }
      // }
      event.preventDefault();
      event.stopPropagation();
      this.chipData.delete(item);
      console.log(this.chipData)
    },
    handleInput(event) {
      var inputValue = event.target.value;
      if (inputValue.endsWith(' ')) {
        console.log("spaceKeyDown")
        this.addChips();
      }
      // if (event.keyCode === 32) {
      //   console.log("spaceKeyDown")
      //   this.addChips();
      // const tag = this.tagInput.trim();
      // if (tag !== "") { // 빈 문자열은 처리하지 않음
      //   this.tagList.push(tag);
      //   this.tagInput = ""; // 입력란을 초기화함
      // }
    }
  },
};
</script>

<template>
  <div>
    <div class="font-sm font-medium mt-2">제목</div>
    <v-text-field placeholder="제목을 입력해주세요." variant="outlined" density="compact" hide-details class="mt-2" />

    <v-row align="center" class="mt-2">
      <v-col>
        <label class="font-sm font-medium">분야</label>
        <v-select v-model="selectedArea" placeholder="분야 선택" variant="outlined" density="compact"
          :items="this.area.areaList" :scrollable="true" hide-details class="mt-2"></v-select>
      </v-col>

      <v-col>
        <label class="font-sm font-medium">업무</label>
        <v-select v-model="selectedSubArea" placeholder="업무 선택" variant="outlined" density="compact"
          :items="this.area.subAreaList" :scrollable="true" hide-details class="mt-2"></v-select>
      </v-col>
    </v-row>

    <div class="font-sm font-medium mt-7 mb-2">본문</div>
    <ckeditor v-model="editorData" :editor="editor" :config="editorConfig" height="200"></ckeditor>


    <div class="font-sm font-medium mt-7 mb-2">태그</div>
    <v-row>
      <v-chip-group v-for="(chipDataText, index) in tags" :key="index">
          <v-chip class="ma-1 mt-5">{{
            chipDataText
          }}<v-icon icon="mdi-close-circle" @click="deleteChip($event, chipDataText)"></v-icon></v-chip>
        </v-chip-group>
    </v-row>
    <v-text-field placeholder="태그를 입력해주세요." v-model="chipText" variant="underlined" density="compact" @input="handleInput"
      hide-details class="mt-10">
      <!-- <template v-slot:append>
        <v-btn icon @click="addChips" variant="" class="mr-5 ml-2"><img src="@/assets/images/tag.png" width="25"
            height="25"></v-btn></template>
      <template v-slot:prepend-inner>
      </template> -->
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
