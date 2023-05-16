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
                    density="compact" :items="subcategoryItems" :disabled="!subcategoryItems.length"
                    hide-details></v-select>
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

        <!-- 정렬 -->
        <div class="mt-4 mb-4 d-flex justify-end" >
          <v-btn prepend-icon="mdi-sort-descending">정렬
            <v-menu activator="parent">
              <v-list>
                <v-list-item v-for="(item, index) in sortMenu" :key="index" :value="index" @click="sort(index)">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </div>

        <div v-if="workCardData.length == 0 && !workSearchFlag" class="text-center mt-60 mb-20">
          <img src="@/assets/images/nopost.png" width="70" height="70">
          <h3>작성된 글이 없어요</h3>
        </div>

        <div v-if="workCardData.length == 0 && workSearchFlag" class="text-center mt-60 mb-20">
          <img src="@/assets/images/search.png" width="70" height="70">
          <h3>검색 결과가 없어요</h3>
        </div>

        <!-- 질문 카드 -->
        <div v-for="(item, index) in workCardData" :value="item.qid">
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

        <!-- 정렬 -->
        <div class="mt-4 mb-4 d-flex justify-end" >
          <v-btn prepend-icon="mdi-sort-descending">정렬
            <v-menu activator="parent">
              <v-list>
                <v-list-item v-for="(item, index) in sortMenu" :key="index" :value="index" @click="sort(index)">
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </div>

        <div v-if="nonworkCardData.length == 0 && !searchFlag" class="text-center mt-60 mb-20">
          <img src="@/assets/images/nopost.png" width="70" height="70">
          <h3>작성된 글이 없어요</h3>
        </div>

        <div v-if="nonworkCardData.length == 0 && searchFlag" class="text-center mt-60 mb-20">
          <img src="@/assets/images/search.png" width="70" height="70">
          <h3>검색 결과가 없어요</h3>
        </div>

        <!-- 질문 카드 -->
        <div v-for="(item, index) in nonworkCardData" :value="item.qid">
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

let questionUri = 'board/questions';
let searchUri = 'board/questions';

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

    let sortMenu = [
      { title: "좋아요순" },
      { title: "최신순" },
    ]

    function leftPad(value) {
      if (value >= 10) {
        return value;
      }
      return `0${value}`;
    }

    function exportDateFromTimeStamp(timeStamp) {
      var date = new Date(timeStamp)
      const year = date.getFullYear();
      const month = leftPad(date.getMonth() + 1); // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = leftPad(date.getDate());
      const hour = leftPad(date.getHours());
      const minute = leftPad(date.getMinutes());

      return year + "-" + month + "-" + day + " " + hour + ":" + minute
    }

    let pageState = store.getters["info/infoPageState"]

    var qnaTab = ref(pageState?.qnaTab ?? 0)
    var category = ref(pageState?.category ?? [])
    var subcategory = ref(pageState?.subcategory ?? [])
    var subcategoryItems = ref(pageState?.subcategoryItems ?? [])
    var searchKey = ref(pageState?.searchKey ?? '')
    var searchContent = ref(pageState?.searchContent ?? '')
    var workCardData = ref(pageState?.workCardData ?? [])
    var nonworkCardData = ref(pageState?.nonworkCardData ?? [])

    // if (Object.keys(pageState).length == 0) {
    //   api.get('board/questions' + '?' + 'workYn=true&order=create&page=0&size=10').then(
    //     (res) => {
    //       res.data.forEach((d) => {
    //         d.createDate = exportDateFromTimeStamp(d.createDate)
    //       });
    //       workCardData.value = res.data
    //     }
    //   )
    // }

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
      sortMenu,
      workCardData,
      nonworkCardData,
      exportDateFromTimeStamp,

      /* GET param 관련  */
      workDataOrder: "create",
      workDataPage: 0,
      workDataSize: 10,
      nonworkDataOrder: "create",
      nonworkDataPage: 0,
      nonworkDataSize: 10,
      searchParams: {},
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
      // 업무
      if (this.qnaTab == 0) {
        var params = {
          workYn: true,
          order: this.workDataOrder,
          page: (this.workDataPage = 0),
          size: (this.workDataSize = 10),
        };
        
        if (typeof this.subcategory == 'string') {
          params['cid'] = this.cidData[this.subcategory];
          if (this.searchKey != '' && this.searchContent != '') {
            if (this.searchKey == '제목 + 내용') {
              params['key'] = 'titleAndContent';
            } else if (this.searchKey == '작성자') {
              params['key'] = 'member';
            }
            params['value'] = this.searchContent;
            this.workCardData = [];
            this.workSearchFlag = (this.workCardData.length == 0) ? true:false  
          } else {
            console.log('key, value 없음');
            this.workCardData = [];
            this.workSearchFlag = (this.workCardData.length == 0) ? true:false  
          }
        } else {
          if (this.searchKey != '' && this.searchContent != '') {
            if (this.searchKey == '제목 + 내용') {
              params['key'] = 'titleAndContent'
            } else if (this.searchKey == '작성자') {
              params['key'] = 'member'
            }
            params['value'] = this.searchContent;
            this.workCardData = [];
            this.workSearchFlag = (this.workCardData.length == 0) ? true:false  
          } else {
            this.workCardData = [];
            this.workSearchFlag = (this.workCardData.length == 0) ? true:false  
          }
        }

        this.searchParams = params;
      }
      // 비업무
      else if (this.qnaTab == 1) {
        var params = {
          workYn: false,
          order: this.nonworkDataOrder,
          page: (this.nonworkDataPage = 0),
          size: (this.nonworkDataSize = 10),
        };
        if (this.searchKey != '' && this.searchContent != '') {
          if (this.searchKey == '제목 + 내용') {
            params['key'] = 'titleAndContent';
          } else if (this.searchKey == '작성자') {
            params['key'] = 'member';
          }
          params['value'] = this.searchContent;
          this.nonworkCardData = [];
          this.searchFlag = (this.nonworkCardData.length == 0) ? true:false  
        }

        this.searchParams = params;
      }
    },
    async loadMore() {
      var params = this.searchParams ?? {};
      if (this.qnaTab == 0) {
        params['workYn'] = true,
        params['order'] = this.workDataOrder;
        params['page'] = this.workDataPage;
        params['size'] = this.workDataSize;
      } else {
        params['workYn'] = false;
        params['order'] = this.nonworkDataOrder;
        params['page'] = this.nonworkDataPage;
        params['size'] = this.nonworkDataSize; 
      }
      var res = await api.get(questionUri, { params }).then(
        (response) => {
          if ([200, 201].includes(response.status) && response.data.length) {
            response.data.forEach((d) => {
              d.createDate = this.exportDateFromTimeStamp(d.createDate);
            });
            if (this.qnaTab == 0) {
              this.workCardData = this.workCardData.concat(response.data);
              this.workDataPage++;
            } else {
              this.nonworkCardData = this.nonworkCardData.concat(response.data);
              this.nonworkDataPage++;
            }
          }
        }
      );
    },
    sort(index) {
      // index 0=좋아요순, 1=등록순
      // 업무
      if (this.qnaTab == 0) {
        this.workDataOrder = index ? "create" : "like";
        this.workDataPage = 0;
        this.workDataSize = 10;
        this.workCardData = [];
      }
      // 비업무
      else if (this.qnaTab == 1) {
        this.nonworkDataOrder = index ? "create" : "like";
        this.nonworkDataPage = 0;
        this.nonworkDataSize = 10;
        this.nonworkCardData = [];
      }
      
      this.loadMore();
    },

    tabChanged() {
      this.category = []
      this.subcategory = []
      this.searchKey = ''
      this.searchContent = '';

      // if (this.qnaTab == 0) {
      //   this.requestAllWork()
      // } else {
      //   this.requestAllNoneWork()
      // }
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
    saveState() {
      store.dispatch('info/setPageState', {
        qnaTab: this.qnaTab,
        category: this.category,
        subcategory: this.subcategory,
        subcategoryItems: this.subcategoryItems,
        searchKey: this.searchKey,
        searchContent: this.searchContent,
        workCardData: this.workCardData,
        workDataPage: this.workDataPage,
        workDataOrder: this.workDataOrder,
        workDataSize: this.workDataSize,
        nonworkCardData: this.nonworkCardData,
        nonworkDataPage: this.nonworkDataPage,
        nonworkDataOrder: this.nonworkDataOrder,
        nonworkDataSize: this.nonworkDataSize,
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
