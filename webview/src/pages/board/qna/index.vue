<template>
  <div class="keep-all">
    <!-- 궁금해요 header-->
    <p class="text-h6 font-weight-black">궁금해요</p>
    <p class="text-caption my-3 font-0000008F">
      분야별 궁금한 부분을 질문해보세요. 각 분야의 담당자가 답변해드립니다.
    </p>
    <v-tabs fixed-tabs class="mt-5" color="primary" v-model="qnaTab">
      <v-tab v-for="(i, index) in qnaTabTitle.length" :key="index" :value="index" slider-color="primary">
        {{ qnaTabTitle[index] }}
      </v-tab>
    </v-tabs>
    <v-window v-model="qnaTab" :touch="false">
      <!-- ***** 업무 ***** -->
      <v-window-item :value="0">
        <!-- 검색 -->
        <v-expansion-panels class="my-3">
          <v-expansion-panel>
            <v-expansion-panel-title>검색</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row justify="center" class="mt-1">
                <v-col cols="6" class="">
                  <v-select v-model="category" class="text-truncate" placeholder="분야" variant="outlined" density="compact"
                    :items="categoryItems" @update:modelValue="categoryChanged" hide-details></v-select>
                </v-col>
                <v-col cols="6" class="">
                  <v-select v-model="subcategory" class="text-truncate" placeholder="소분야" variant="outlined"
                    density="compact" :items="subcategoryItems" :disabled="!subcategoryItems.length" hide-details></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4" class="">
                  <v-select v-model="searchKey" placeholder="구분" class="text-truncate" variant="outlined"
                    density="compact" :items="['제목 + 내용', '작성자']"></v-select>
                </v-col>
                <v-col cols="8" class="pl-2">
                  <v-text-field v-model="searchContent" placeholder="검색어" variant="outlined" density="compact" />
                </v-col>
              </v-row>
              <v-btn color="shades-black" @click="search()" block :disabled="!searchValidation">검색</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <div v-if="boardCardData.length == 0 && !workSearchFlag" class="text-center mt-60 mb-20">
          <img src="@/assets/images/nopost.png" width="70" height="70">
          <h3>작성된 글이 없어요</h3>
        </div>

        <div v-if="boardCardData.length == 0 && workSearchFlag" class="text-center mt-60 mb-20">
          <img src="@/assets/images/search.png" width="70" height="70">
          <h3>검색 결과가 없어요</h3>
        </div>

        <!-- 질문 카드 -->
        <div v-for="(item, index) in boardCardData" :value="item.qid">
          <BoardCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
        </div>
        <Observe @triggerIntersected="loadMore" />
      </v-window-item>

      <!-- ***** 비업무 ***** -->
      <v-window-item :value="1">
        <!-- 검색 -->
        <v-expansion-panels class="my-3">
          <v-expansion-panel>
            <v-expansion-panel-title>검색</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row class="mt-1">
                <v-col cols="4" class="">
                  <v-select v-model="searchKey" placeholder="구분" class="text-truncate" variant="outlined"
                    density="compact" :items="['제목 + 내용', '작성자']"></v-select>
                </v-col>
                <v-col cols="8" class="pl-2">
                  <v-text-field v-model="searchContent" placeholder="검색어" variant="outlined" density="compact" />
                </v-col>
              </v-row>
              <v-btn color="shades-black" @click="search()" block>검색</v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <div v-if="boardCardData.length == 0 && !searchFlag" class="text-center mt-60 mb-20">
          <img src="@/assets/images/nopost.png" width="70" height="70">
          <h3>작성된 글이 없어요</h3>
        </div>

        <div v-if="boardCardData.length == 0 && searchFlag" class="text-center mt-60 mb-20">
          <img src="@/assets/images/search.png" width="70" height="70">
          <h3>검색 결과가 없어요</h3>
        </div>

        <!-- 질문 카드 -->
        <div v-for="(item, index) in boardCardData" :value="item.qid">
          <BoardCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
        </div>
        <Observe @triggerIntersected="loadMore" />
      </v-window-item>
    </v-window>
  </div>

  <v-menu transition="slide-y-transition">
    <template v-slot:activator="{ props }">
      <v-btn class="fixed_fab" size="large" icon color="primary" v-bind="props" @click="handleWritePage">
        <v-icon size="large">mdi-pencil-box-outline</v-icon>
      </v-btn>
    </template>
  </v-menu>
</template>



<script>
import { computed, onMounted, ref } from "vue";
import BoardCard from "@/components/cards/BoardCard";
import Observe from "@/components/Observer";
import api from '@/api';
import store from "@/store";

export default {
  name: "qnaBoard",
  components: {
    BoardCard,
    Observe
  },
  setup() {
    let qnaTabTitle = ["업무", "비업무"];
    let area = store.getters["info/infoArea"];
    let categoryItems = area.areaList;
    let subcategoryFullList = area.subAreaList;
    var categoriesAll = [].concat(qnaTabTitle);
    var i;
    for (i = 1; i < categoryItems.length; i++) {
      categoriesAll.push(categoryItems[i]);
      categoriesAll = categoriesAll.concat(subcategoryFullList[i - 1]);
    }
    let cidData = {};
    categoriesAll.forEach((value, index) => cidData[value] = index + 1);

    function exportDateFromTimeStamp(timeStamp) {
      var date = new Date(timeStamp)
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();

      return year + "-" + month + "-" + day + " " + hour + ":" + minute
    }

    let pageState = store.getters["info/infoPageState"]

    var qnaTab = ref(pageState?.qnaTab ?? 0)
    var category = ref(pageState?.category ?? [])
    var subcategory = ref(pageState?.subcategory ?? [])
    var subcategoryItems = ref(pageState?.subcategoryItems ?? [])
    var searchKey = ref(pageState?.searchKey ?? '')
    var searchContent = ref(pageState?.searchContent ?? '')
    var page = ref(pageState?.page ?? 1)
    var boardCardData = ref(pageState?.boardCardData ?? [])

    if (Object.keys(pageState).length == 0) {
      api.get('board/questions' + '?' + 'workYn=true').then(
        (res) => {
          res.data.forEach((d) => {
            d.createDate = exportDateFromTimeStamp(d.createDate)
          });
          boardCardData.value = res.data
        }
      )
    }

    store.dispatch('info/setPageState', {});


    return {
      qnaTabTitle,
      categoryItems,
      subcategoryFullList,
      cidData,
      qnaTab,
      category,
      subcategory,
      subcategoryItems,
      searchKey,
      searchContent,
      page,
      boardCardData,
      exportDateFromTimeStamp,
    };
  },
  data() {
    return {
      workSearchFlag: false, 
      searchFlag: false, 
    }
  },
  computed: {
    searchValidation() {
      if (typeof this.subcategory == 'string') {
        return true;
      } else {
        if (typeof this.category == 'string') {
          if (this.category == '전체') {
            if (this.searchKey != '' && this.searchContent != '') {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    }

  },
  watch: {
    qnaTab(newVal, oldVal) {
      this.page = 1;
      console.log(newVal)
      this.tabChanged();
    }
  },
  methods: {
    categoryChanged() {
      var categoryIndex = this.categoryItems.indexOf(this.category);
      this.subcategory = [];
      this.subcategoryItems = 1 <= categoryIndex ? this.subcategoryFullList[categoryIndex - 1] : [];
    },
    async search() {
      if (this.qnaTab == 0) {
        if (typeof this.subcategory == 'string') {
          if (this.searchKey != '' && this.searchContent != '') {
            var key = ''
            if (this.searchKey == '제목 + 내용') {
              key = 'titleAndContent'
            } else if (this.searchKey == '작성자') {
              key = 'member'
            }
            var res = await api.get('board/questions?workYn=true&cid='
              + this.cidData[this.subcategory]
              + '&key=' + key
              + '&value=' + this.searchContent).then(
                (response) => {
                  response.data.forEach((d) => {
                    d.createDate = this.exportDateFromTimeStamp(d.createDate)
                  });
                  this.boardCardData = response.data
                }
              ); 
              this.workSearchFlag = (this.boardCardData.length == 0) ? true:false  
          } else {
            console.log('key, value 없음')
            var res = await api.get('board/questions?workYn=true&cid=' + this.cidData[this.subcategory]).then(
              (response) => {
                response.data.forEach((d) => {
                  d.createDate = this.exportDateFromTimeStamp(d.createDate)
                });
                this.boardCardData = response.data
              }
            );
            this.workSearchFlag = (this.boardCardData.length == 0) ? true:false  
          }
        } else {
          if (this.searchKey != '' && this.searchContent != '') {
            var key = ''
            if (this.searchKey == '제목 + 내용') {
              key = 'titleAndContent'
            } else if (this.searchKey == '작성자') {
              key = 'member'
            }
            var res = await api.get('board/questions?workYn=true'
              + '&key=' + key
              + '&value=' + this.searchContent).then(
                (response) => {
                  response.data.forEach((d) => {
                    d.createDate = this.exportDateFromTimeStamp(d.createDate)
                  });
                  this.boardCardData = response.data
                }
              );
              this.workSearchFlag = (this.boardCardData.length == 0) ? true:false  
          } else {
            var res = await api.get('board/questions?workYn=true').then(
              (response) => {
                response.data.forEach((d) => {
                  d.createDate = this.exportDateFromTimeStamp(d.createDate)
                });
                this.boardCardData = response.data
              }
            );
            this.workSearchFlag = (this.boardCardData.length == 0) ? true:false  
          }
        }
      } else if (this.qnaTab == 1) {
        if (this.searchKey != '' && this.searchContent != '') {
          var key = ''
          if (this.searchKey == '제목 + 내용') {
            key = 'titleAndContent'
          } else if (this.searchKey == '작성자') {
            key = 'member'
          }
          var res = await api.get('board/questions?workYn=false'
            + '&key=' + key
            + '&value=' + this.searchContent).then(
              (response) => {
                response.data.forEach((d) => {
                  d.createDate = this.exportDateFromTimeStamp(d.createDate)
                });
                this.boardCardData = response.data
              }
            );
            this.searchFlag = (this.boardCardData.length == 0) ? true:false  
        }
      }
    },
    async requestAllWork() {
      var res = await api.get('board/questions' + '?' + 'workYn=true').then(
        (response) => {
          response.data.forEach((d) => {
            d.createDate = this.exportDateFromTimeStamp(d.createDate)
          });
          this.boardCardData = response.data
        }
      )
    },

    async requestAllNoneWork() {
      var res = await api.get('board/questions' + '?' + 'workYn=false').then(
        (response) => {
          response.data.forEach((d) => {
            d.createDate = this.exportDateFromTimeStamp(d.createDate)
          });
          this.boardCardData = response.data
        }
      )
    },

    tabChanged() {
      this.category = []
      this.subcategory = []
      this.searchKey = ''
      this.searchContent = '';

      if (this.qnaTab == 0) {
        this.requestAllWork()
      } else {
        this.requestAllNoneWork()
      }
    },
    handleCardClicked(item) {
      this.saveState();
      if (item) {
        this.$router.push({
          path: process.env.VUE_APP_BOARD_QNA_DETAIL,
          title: item?.title,
          query: {
            qid: item?.qid
          }
        });
      }
    },
    handleWritePage() {
      this.saveState();
      this.$router.push({
        path: process.env.VUE_APP_BOARD_QNA_WRITE,
        query: {
          work: (this.qnaTab == 0) ? true : false
        }
      });

    },
    loadMore() {
      this.page += 1;
      console.log(this.page)

    },
    saveState() {
      store.dispatch('info/setPageState', {
        qnaTab: this.qnaTab,
        category: this.category,
        subcategory: this.subcategory,
        subcategoryItems: this.subcategoryItems,
        searchKey: this.searchKey,
        searchContent: this.searchContent,
        page: this.page,
        boardCardData: this.boardCardData
      });
    }
  },
};
</script>



<style scoped>
.fixed_fab {
  position: fixed;
  top: 80vh;
  left: 80vw;
}

.keep-all {
  word-break: keep-all;
  /* 한국어 잘림 방지 */
}

.v-col-6 {
  padding-bottom: 0px !important;
}
</style>
