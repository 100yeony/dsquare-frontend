<template>
    <div class="keep-all">
      <!-- 궁금해요 header-->
      <p class="text-h6 font-weight-black">소통해요</p>
      <p class="text-caption my-3 font-0000008F">
        활발한 소통으로 다양한 의견을 나눠보세요.
      </p>
        <!-- 검색 -->
        <v-expansion-panels class="my-3">
        <v-expansion-panel>
            <v-expansion-panel-title>검색</v-expansion-panel-title>
            <v-expansion-panel-text>
            <v-row>
                <v-col cols="4" class="pr-0 pt-0 mt-5">
                <v-select v-model="searchKey" placeholder="구분" class="text-truncate" variant="outlined" density="compact"
                    :items="['제목 + 내용', '작성자']"></v-select>
                </v-col>
                <v-col cols="8" class="pl-0 pt-0 mt-5">
                <v-text-field v-model="searchContent" placeholder="검색어" variant="outlined" density="compact" />
                </v-col>
            </v-row>
            <v-btn color="shades-black" @click="search()" block>검색</v-btn>
            </v-expansion-panel-text>
        </v-expansion-panel>
        </v-expansion-panels>

        <!-- 질문 카드 -->
        <div v-for="(item, index) in boardCardData" :value="item.qid">
        <BoardCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
        </div>
        <Observe @triggerIntersected="loadMore"/>
    </div>
  
    <v-menu transition="slide-y-transition">
      <template v-slot:activator="{ props }">
        <v-btn class="fixed_fab" size="large" icon color="primary" v-bind="props" @click="handleeWritePage">
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
        categoriesAll = categoriesAll.concat(subcategoryFullList[i-1]);
      }
      let cidData = {};
      categoriesAll.forEach((value, index) => cidData[value] = index + 1);
      
  
      let searchUri = "/board/questions";
      // const page = ref(1);
  
      // const loadMore = async () => {
      //   page.value += 1;
      //   console.log(page.value)
      // };
  
      return {
        qnaTabTitle,
        categoryItems,
        subcategoryFullList,
        cidData,
        searchUri,
      };
    },
    data() {
      return {
        qnaTab: 0,
        category: [],
        subcategory: [],
        subcategoryItems: [],
        searchContent: '',
        searchKey: '',
        page: 1,
        boardCardData: [], 
      };
    }, 
    mounted(){
      var res = this.requestAllWork();
      // this.boardCardData = [   //나중에 search 대신 들어감.
      //   {
      //     id: 0,
      //     category: "응용SW개발",
      //     title: "OpenWeatherAPI 날씨 이미지가 가져와지지 않습니다.",
      //     name: "변상진",
      //     team: "메시징DX플랫폼팀",
      //     date: "2023-04-01",
      //     hash: ["jsp", "js", "jquery"],
      //     success: true,
      //     like: "999+",
      //     comment: "999+",
      //   },
      //   {
      //     id: 1,
      //     category: "응용SW개발",
      //     title: "docker로 github actions deploy 할 때 에러 - ocker run [OPTIONS] IMAGE [COMMAND] [ARG...]",
      //     name: "강소미",
      //     team: "메시징DX플랫폼팀",
      //     date: "2023-04-01",
      //     hash: ["githubactions", "docker"],
      //     success: false,
      //     like: "327",
      //     comment: "3",
      //   },
      //   {
      //     id: 2,
      //     category: "데이터분석",
      //     title: "이 두가지 쿼리의 차이가 뭘까요 ?",
      //     name: "남진욱",
      //     team: "메시징DX플랫폼팀",
      //     date: "2023-04-01",
      //     hash: ["sql"],
      //     success: false,
      //     like: "300",
      //     comment: "3",
      //   },
      //   {
      //     id: 3,
      //     category: "응용SW개발",
      //     title: "크롬 개발자 도구에서 출력값 차이 원인 (선언문, 할당문 관련)",
      //     name: "김순재",
      //     team: "메시징DX플랫폼팀",
      //     date: "2023-04-01",
      //     hash: ["자바스크립트", "선언문", "할당문", "완료값"],
      //     success: false,
      //     like: "200",
      //     comment: "3",
      //   },
      //   {
      //     id: 4,
      //     category: "응용SW개발",
      //     title: "왜 자꾸 No faces detected 오류가 뜨는지 모르겠습니다.",
      //     name: "최철준",
      //     team: "메시징DX플랫폼팀",
      //     date: "2023-04-01",
      //     hash: ["안드로이드스튜디오", "안드로이드", "얼굴인식"],
      //     success: false,
      //     like: "127",
      //     comment: "3",
      //   },
      // ]
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
        this.subcategoryItems = 1 <= categoryIndex ? this.subcategoryFullList[categoryIndex-1] : [];
      },
      async search() {
        // let params = {};
        // let work = (this.qnaTab == 0) ? true : false
        // //params.workYn = work;
        // params.cid = work ? this.cidData[this.subcategory] : 2;
        // params.key = this.searchKey
        // params.value = this.searchContent
        // var res = await api.get('board/questions/search', params)
        // res.data.forEach((d) => {
        //   d.lastUpdateDate = this.exportDateFromTimeStamp(d.lastUpdateDate) 
        // });
        // this.boardCardData = res.data
      },
      async requestAllWork() {
        console.log(store.getters["info/infoToken"].accessToken)
        var res = await api.get('board/questions', '')
        res.data.forEach((d) => {
          d.lastUpdateDate = this.exportDateFromTimeStamp(d.lastUpdateDate) 
        });
        this.boardCardData = res.data
      },
  
      tabChanged() {
        this.searchContent = '';
        if (this.qnaTab === 0){
          this.requestAllWork()
        } else {
          this.requestAllNoneWork()
        }
      },
      handleCardClicked(item) {
        console.log("[handleCardClicked]", item);
        if (item) {
          //상세 화면으로 이동.
          this.$router.push({
            path: process.env.VUE_APP_BOARD_COMMUNICATION_DETAIL,
            title: item?.title,
            query: {
              qid: item?.qid 
            }
          });
        }
      },
      handleeWritePage() {
        console.log("handleeWritePage");
        //this.$router.replace(process.env.VUE_APP_BOARD_QNA_WRITE);
        console.log("---------------------------------");
        console.log(process.env.VUE_APP_BOARD_COMMUNICATION_WRITE);
        this.$router.push({
          path: process.env.VUE_APP_BOARD_COMMUNICATION_WRITE,
          query: {
            work: (this.qnaTab == 0) ? true : false
          }
        });
  
      },
      loadMore() {
        this.page += 1;
        console.log(this.page)
        //this.request()
        // request 한 값을 추가
      },
      exportDateFromTimeStamp(timeStamp) {
        var date = new Date(timeStamp)
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
  
        return year + "-" + month + "-" + day + " " + hour + ":" + minute 
  
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
  </style>
  