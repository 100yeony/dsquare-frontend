<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import FileUploadAdapter from "@/utils/fileUploaderAdapter";
import { watch, onMounted, ref } from "vue";
//import { generateKey } from "crypto";
import api from '@/api';
import store from "@/store";
import { useRoute, useRouter } from 'vue-router';

export default {
  components: {
    ckeditor: CKEditor.component,
  },
  setup() {
    const route = useRoute();
    let chipData = ref(new Set(route.query.teammates))
    let chipText = ref("");
    let categoryItems = ['플랫폼품질혁신TF', '플랫폼서비스담당',
      'Digico서비스담당', 'Digico개발센터'];
    let subcategoryFullList = [
      [],
      ["메시징DX플랫폼팀", "서비스플랫폼팀",
        "금융결제DX플랫폼팀", "인증DX플랫폼팀", "플랫폼IT컨설팅팀"],
      ["미디어플랫폼팀", "AI서비스팀",
        "Safety플랫폼팀"],
      ["AgileCore팀", "Digico사업수행팀", "DX솔루션사업팀"],
    ];
    store.dispatch("url/setUrlQuery", { qid: route.query.qid })
    return { chipData, chipText, categoryItems, subcategoryFullList };
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: this.$route.query.content,
      editorConfig: {
        // 상세 수정은 https://ckeditor.com
        extraPlugins: [this.uploader],
        removePlugins: ["ImageCaption", "MediaEmbed"],
      },
      title: this.$route.query.title,
      projTeamId: this.$route.query.projTeamId,
      category: [],
      subcategory: [],
      subcategoryItems: [],
      tags: [],
      teammateCnt: this.$route.query.teammateCnt,
      upperTeamIdx: '',
    };
  },
  watch: {
    category(newVal, oldVal) {
      console.log(newVal)
      if (newVal === '플랫폼품질혁신TF') {
        this.projTeamId = 1;
      } else {
        this.projTeamId = '';
      }
    },
    subcategory(newVal, oldVal) {
      console.log(newVal)
      if (newVal === '메시징DX플랫폼팀') {
        this.projTeamId = 5;
      } else if (newVal === '서비스플랫폼팀') {
        this.projTeamId = 6;
      } else if (newVal === '금융결제DX플랫폼팀') {
        this.projTeamId = 7;
      } else if (newVal === '인증DX플랫폼팀') {
        this.projTeamId = 8;
      } else if (newVal === '플랫폼IT컨설팅팀') {
        this.projTeamId = 9;
      } else if (newVal === '미디어플랫폼팀') {
        this.projTeamId = 10;
      } else if (newVal === 'AI서비스팀') {
        this.projTeamId = 11;
      } else if (newVal === 'Safety플랫폼팀') {
        this.projTeamId = 12;
      } else if (newVal === 'AgileCore팀') {
        this.projTeamId = 13;
      } else if (newVal === 'Digico사업수행팀') {
        this.projTeamId = 14;
      } else if (newVal === 'DX솔루션사업팀') {
        this.projTeamId = 15;
      }
    }
  },
  computed: {
    remainingCharacters() {
      return this.editorData.length;
    },
    tags() {
      return Array.from(this.chipData);
    },
    placeholderText() {
      if (this.chipData.size === 0) {
        return '이름을 입력해주세요.'
      } else {
        return ''
      }
    },
    editorValidation() {
      if (this.cid !== '' && this.title !== '' && this.editorData !== '' && this.projTeamId !== '') {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    this.title = this.$route.query.title
    this.editorData = this.$route.query.content
    this.chipData = new Set(this.$route.query.teammates);
    this.getUpperIdx()
    this.category = this.categoryItems[this.upperTeamIdx]
    if (this.projTeamId != 1 && this.projTeamId != 2) {
      this.subcategory = this.$route.query.projTeamName
    }
  },
  methods: {
    async edit(editorData) {
      const res = await api.patch('board/cards/' + this.$route.query.id, {
        content: editorData,
        title: this.title,
        teammates: Array.from(this.chipData),
        projTeamId: this.projTeamId,
        teammateCnt: this.teammateCnt,
      })
      console.log(res)
      this.cancle()

    },
    uploader(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new FileUploadAdapter(loader);
      };
    },
    addChips() {
      let item = this.chipText.trim().replaceAll('#', '')
      if (item !== "") {
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
        path: process.env.VUE_APP_BOARD_CARD_DETAIL,
        query: {
          qid: this.$route.query.qid
        }
      });
    },
    categoryChanged() {
      this.subcategory = [];
      var categoryIndex = this.categoryItems.indexOf(this.category);
      if (categoryIndex != 0) {
        this.subcategoryItems = this.subcategoryFullList[categoryIndex];
      }
      else {
        this.subcategoryItems = [];
      }
    },
    getUpperIdx() {
      if (this.projTeamId == 1) {
        this.upperTeamIdx = 0
      }
      else if (this.projTeamId == 2) {
        this.upperTeamIdx = 1
      }
      else if (this.projTeamId == 6 || this.projTeamId == 7 || this.projTeamId == 8 || this.projTeamId == 9) {
        this.upperTeamIdx = 2
      }
      else if (this.projTeamId == 10 || this.projTeamId == 11 || this.projTeamId == 12 || this.projTeamId == 13) {
        this.upperTeamIdx = 3
      }
      else if (this.projTeamId == 14 || this.projTeamId == 15 || this.projTeamId == 16) {
        this.upperTeamIdx = 4
      }
    }
  }
};
</script>

<template>
  <v-form @submit.prevent="edit(editorData)" class="overflow-show">
    <div>
      <div class="font-sm font-medium mt-2">제목</div>
      <v-text-field v-model="title" placeholder="제목을 입력해주세요." variant="outlined" density="compact" hide-details
        class="mt-2 mb-5" maxlength="50"/>

      <label class="font-sm font-medium">프로젝트 수행팀</label>
      <v-row justify="center">
        <v-col>
          <v-select v-model="category" class="text-truncate mt-2" placeholder="부서 선택" variant="outlined" density="compact"
            :items="categoryItems" @update:modelValue="categoryChanged" id="category" hide-details></v-select>
        </v-col>
        <v-col>
          <v-select v-model="subcategory" class="text-truncate mt-2" placeholder="소속팀 선택" variant="outlined"
            density="compact" :items="subcategoryItems" :disabled="!subcategoryItems.length" id="subcategory"
            hide-details></v-select>
        </v-col>
      </v-row>

      <div class="font-sm font-medium mt-7 mb-2">본문</div>
      <v-textarea placeholder="내용을 입력해주세요." variant="outlined" hide-details
        v-model.lazy="editorData" maxlength="300"></v-textarea>
      <p class="d-flex justify-end">{{ remainingCharacters }} / 300자</p>

      <v-expansion-panels class="my-3">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <p class="mr-2">옵션</p> <p class="text-caption font-0000008F">(필수 입력란이 아닙니다)</p>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <label class="font-sm font-medium">참여인원 수</label>
            <v-row>
              <v-col cols="4">
                <v-text-field v-model="teammateCnt" placeholder="숫자 입력" variant="outlined" density="compact" hide-details
                  class="mt-2 mb-5" />
              </v-col>
            </v-row>

            <div class="font-sm font-medium mb-2">참여인원 이름</div>
            <v-row justify="center">
              <v-col cols="12" class="pw-100 ">
                <v-sheet>
                  <v-row>
                    <v-col>
                      <v-text-field :placeholder=placeholderText v-model="chipText" variant="outlined" density="compact"
                        @input="handleInput" hide-details append-icon="mdi-tag-plus"
                        @click:append="addChips"></v-text-field>
                    </v-col>
                  </v-row>
                  <div>
                    <v-chip-group column>
                      <v-chip v-for="tag in tags" :key="tag">
                        {{ tag }}
                        <v-icon class="" icon="mdi-close-circle" @click="deleteChip($event, tag)"></v-icon>
                      </v-chip>
                    </v-chip-group>

                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

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

::v-deep .v-col-4 {
  padding-right: 0px !important;
}

::v-deep .mdi-close-circle::before {
  font-size: large !important;
}

</style>
