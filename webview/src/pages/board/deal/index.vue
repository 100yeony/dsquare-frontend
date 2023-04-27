<template>
    <div class="keep-all">
      <!-- 궁금해요 header-->
      <p class="text-h6 font-weight-black">당근해요</p>
      <p class="text-caption my-3 font-0000008F">
        물품 거래 혹은 나눔을 통해 정을 나눠보세요.
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
        <div v-for="(item, index) in carrotCardData" :value="item.carrotId">
        <CarrotCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
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
  import CarrotCard from "@/components/cards/CarrotCard";
  import Observe from "@/components/Observer";
  import api from '@/api';
  import store from "@/store";
  
  export default {
    name: "carrotBoard",
    components: {
      CarrotCard,
      Observe
    },
    setup() {
      let getAllUri = "/board/carrots";
      let searchUri = "/board/carrots";
      // const page = ref(1);
  
      // const loadMore = async () => {
      //   page.value += 1;
      //   console.log(page.value)
      // };
  
      return {
        getAllUri,
        searchUri,
      };
    },
    data() {
      return {
        searchContent: '',
        searchKey: '',
        page: 1,
        carrotCardData: [], 
      };
    }, 
    mounted(){
      var res = this.requestAll();
      
    },
    methods: {
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
      async requestAll() {
        console.log(store.getters["info/infoToken"].accessToken)
        var res = await api.get(this.getAllUri, '')
        res.data.forEach((d) => {
          d.createDate = this.exportDateFromTimeStamp(d.createDate);
        });
        this.carrotCardData = res.data
      },
      handleCardClicked(item) {
        console.log("[handleCardClicked]", item);
        if (item) {
          //상세 화면으로 이동.
          this.$router.push({
            path: process.env.VUE_APP_BOARD_DEAL_DETAIL,
            title: item?.title,
            query: {
              id: item?.carrotId,
            }
          });
        }
      },
      handleeWritePage() {
        console.log("handleeWritePage");
        //this.$router.replace(process.env.VUE_APP_BOARD_QNA_WRITE);
        console.log("---------------------------------");
        console.log(process.env.VUE_APP_BOARD_DEAL_WRITE);
        this.$router.push({
          path: process.env.VUE_APP_BOARD_DEAL_WRITE,
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
  