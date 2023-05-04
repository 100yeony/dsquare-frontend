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
          <v-row class="mt-1">
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

    <div v-if="boardCardData.length == 0 && !searchFlag" class="text-center mt-60 mb-20">
      <img src="@/assets/images/nopost.png" width="70" height="70">
      <h3>작성된 글이 없어요</h3>
    </div>

    <div v-if="boardCardData.length == 0 && searchFlag" class="text-center mt-60 mb-20">
      <img src="@/assets/images/search.png" width="70" height="70">
      <h3>검색 결과가 없어요</h3>
    </div>

    <!-- 질문 카드 -->
    <div v-for="(item, index) in boardCardData" :value="item.carrotId">
      <CarrotCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
    </div>
    <Observe @triggerIntersected="loadMore" />
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

    var searchKey = ref(pageState?.searchKey ?? '')
    var searchContent = ref(pageState?.searchContent ?? '')
    var page = ref(pageState?.page ?? 1)
    var boardCardData = ref(pageState?.boardCardData ?? [])

    if (Object.keys(pageState).length == 0) {
      api.get('board/carrots').then(
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
      searchKey,
      searchContent,
      page,
      boardCardData,
      exportDateFromTimeStamp,
    };
  },
  data() {
    return {
      searchFlag: false, 
    }
  },
  computed: {
    searchValidation() {
      if (this.searchKey != '' && this.searchContent != ''){
        return true
      } else {
        return false
      }
    }

  },
  methods: {
    async search() {
      if (this.searchKey != '' && this.searchContent != '') {
        var key = ''
        if (this.searchKey == '제목 + 내용') {
          key = 'titleAndContent'
        } else if (this.searchKey == '작성자') {
          key = 'member'
        }
        var res = await api.get('board/carrots' + '?'
          + 'key=' + key
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
    },
    async requestAll() {
      var res = await api.get('board/carrots').then(
        (response) => {
          response.data.forEach((d) => {
            d.createDate = this.exportDateFromTimeStamp(d.createDate)
          });
          this.boardCardData = response.data
        }
      )
    },
    handleCardClicked(item) {
      if (item) {
        this.saveState();
        if (item.carrotId) {
          this.$router.push({
            path: process.env.VUE_APP_BOARD_DEAL_DETAIL,
            title: item.title,
            query: {
              carrotId: item.carrotId
            }
          });
        } else {
          alert('carrotId가 존재하지 않습니다.');
        }
      } else {
        alert('item이 존재하지 않습니다.');
      }
    },
    handleWritePage() {
      this.saveState();
      this.$router.push({
        path: process.env.VUE_APP_BOARD_DEAL_WRITE,
      });

    },
    loadMore() {
      this.page += 1;
      console.log(this.page)
    },
    saveState() {
      store.dispatch('info/setPageState', {
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
</style>
  