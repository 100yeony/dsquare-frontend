<template>
<div class="keep-all">
    <!-- 카드주세요 header-->
    <p class="text-h6 font-weight-black">카드주세요</p>
    <p class="text-caption my-3 font-0000008F">
      고생하는 팀원들을 위해, 회사가 쏩니다!!!!
    </p>

    <!-- 검색 -->
    <v-expansion-panels class="my-3">
      <v-expansion-panel>
        <v-expansion-panel-title>검색</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row justify="center">
            <v-col cols="6" class="mb-0 pb-0">
              <v-select v-model="category" class="text-truncate" placeholder="분야" variant="outlined" density="compact"
                :items="categoryItems" @update:modelValue="categoryChanged"></v-select>
            </v-col>
            <v-col cols="6" class="mb-0 pb-0">
              <v-select v-model="subcategory" class="text-truncate" placeholder="소분야" variant="outlined" density="compact"
                :items="subcategoryItems" :disabled="!subcategoryItems.length"></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4" class="pr-0 pt-0">
              <v-select v-model="searchKey" placeholder="구분" class="text-truncate" variant="outlined" density="compact"
                :items="['제목 + 내용', '작성자']"></v-select>
            </v-col>
            <v-col cols="8" class="pl-0 pt-0">
              <v-text-field v-model="searchContent" placeholder="검색어" variant="outlined" density="compact" />
            </v-col>
          </v-row>
          <v-btn color="shades-black" @click="search()" block>검색</v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- 금주의 카드 -->
    <p class="mt-3 text-h6 font-weight-black">금주의 카드</p>
    <div>
        <RequestCard class="mt-2 card-of-the-week" :data="giftedCardData" @handle-card-clicked="handleCardClicked" />
    </div>

    <!-- 카드 대기중 목록 -->
    <p class="mt-3 text-h6 font-weight-black">카드 대기중</p>
    <div class="card-deck-js ">
        <div v-for="(item, index) in requestCardData" :value="item.id" class="card" >
        <RequestCard class=" mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
        </div>
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
import RequestCard from "@/components/cards/RequestCard";
import Observe from "@/components/Observer";
import api from '@/api';
import store from "@/store";

/* 카드 UI 관련 */
var StackCards = function(element) {
  this.element = element;
  this.items = this.element.getElementsByClassName("card");
  this.scrollingListener = false;
  this.scrolling = false;
  initStackCardsEffect(this);
};

function initStackCardsEffect(element) {
  // use Intersection Observer to trigger animation
  var observer = new IntersectionObserver(stackCardsCallback.bind(element));
  observer.observe(element.element);
}

function stackCardsCallback(entries) {
  // Intersection Observer callback
  if (entries[0].isIntersecting) {
    // cards inside viewport - add scroll listener
    if (this.scrollingListener) return; // listener for scroll event already added
    stackCardsInitEvent(this);
  } else {
    // cards not inside viewport - remove scroll listener
    if (!this.scrollingListener) return; // listener for scroll event already removed
    window.removeEventListener("scroll", this.scrollingListener);
    this.scrollingListener = false;
  }
}

function stackCardsInitEvent(element) {
  element.scrollingListener = stackCardsScrolling.bind(element);
  window.addEventListener("scroll", element.scrollingListener);
}

function stackCardsScrolling() {
  if (this.scrolling) return;
  this.scrolling = true;
  window.requestAnimationFrame(animateStackCards.bind(this));
}

function animateStackCards() {
  var top = this.element.getBoundingClientRect().top;
  var offsetTop = 100,
    cardHeight = 100,
    marginY = 15;
  for (var i = 0; i < this.items.length; i++) {
    // cardTop/cardHeight/marginY are the css values for the card top position/height/Y offset
    var scrolling = offsetTop - top - i * (cardHeight + marginY);
    // debugger;
    if (scrolling > 0) {
      // card is fixed - we can scale it down
      this.items[i].setAttribute(
        "style",
        "transform: translateY(" +
          marginY * i +
          "px) scale(" +
          (cardHeight - scrolling * 0.05) / cardHeight +
          ");"
      );
    }
  }

  this.scrolling = true;
}

var stackCards = document.getElementsByClassName("card-deck-js");
var intersectionObserverSupported =
  "IntersectionObserver" in window && "IntersectionObserverEntry" in window;

if (stackCards.length > 0 && intersectionObserverSupported) {
  for (var i = 0; i < stackCards.length; i++) {
    new StackCards(stackCards[i]);
  }
}

/* 카드 UI 관련 끝 */



export default {
    name: "cardBoard",
    components: {
        RequestCard,
        Observe
    },
    setup() {
        let area = store.getters["info/infoArea"];
        let categoryItems = area.areaList; 
        let subcategoryFullList = area.subAreaList; 
        
        let searchUri = "/board/questions";
        // const page = ref(1);

        // const loadMore = async () => {
        //   page.value += 1;
        //   console.log(page.value)
        // };

        return {
        categoryItems,
        subcategoryFullList,
        searchUri,
        };
    },
    data() {
        return {
            category: [],
            subcategory: [],
            subcategoryItems: [],
            searchContent: '',
            searchKey: '',
            page: 1,
            requestCardData: [], 
            giftedCardData: {
                        id: 12,
                        title: "신입사원과제",
                        content: "신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요.. 신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요.. 신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요..",
                        date: "2023-04-01",
                        members: "변상진  이호열",
                        like: "327",
                        comment: "3",
                        gifted: true,
            },
        };
    }, 
    mounted(){
    //   var res = this.requestAllWork();
        var i;
        for (i = 0; i < 12; i++) {
            this.requestCardData.push(
                {
                    id: i,
                    title: "신입사원과제",
                    content: "신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요.. 신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요.. 신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요.. 신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요.. 신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요.. 신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요.. ",
                    date: "2023-04-01",
                    members: "변상진  이호열",
                    like: "327",
                    comment: "3",
                    gifted: false,
                },
            );
        }
    },
    watch: {
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
    //   async requestAllWork() {
    //     console.log(store.getters["info/infoToken"].accessToken)
    //     var res = await api.get('board/questions', '')
    //     res.data.forEach((d) => {
    //       d.lastUpdateDate = this.exportDateFromTimeStamp(d.lastUpdateDate) 
    //     });
    //     //this.boardCardData = res.data
    //   },
        handleCardClicked(item) {
        // console.log("[handleCardClicked]", item);
        // if (item) {
        //     //상세 화면으로 이동.
        //     this.$router.push({
        //     path: process.env.VUE_APP_BOARD_QNA_DETAIL,
        //     title: item?.title,
        //     query: {
        //         qid: item?.qid 
        //     }
        //     });
        // }
        },
        handleeWritePage() {
        console.log("handleeWritePage");
        //this.$router.replace(process.env.VUE_APP_BOARD_QNA_WRITE);
        console.log("---------------------------------");
        console.log(process.env.VUE_APP_BOARD_QNA_WRITE);
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
  
  
  
<style lang="scss" scoped>
    .fixed_fab {
    position: fixed;
    top: 80vh;
    left: 80vw;
    z-index: 99999;
    }

    .keep-all {
    word-break: keep-all;
    /* 한국어 잘림 방지 */
    }

    .card {
        position: -webkit-sticky;
        position: sticky;
        top: 5em;
    }
</style>
