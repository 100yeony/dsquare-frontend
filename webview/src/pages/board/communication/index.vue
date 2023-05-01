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

    <!-- 질문 카드 -->
    <div v-for="(item, index) in boardCardData" :value="item.talkId">
      <TalkCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
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
import TalkCard from "@/components/cards/TalkCard";
import Observe from "@/components/Observer";
import api from '@/api';
import store from "@/store";

export default {
  name: "TalkBoard",
  components: {
    TalkCard,
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
      api.get('board/talks').then(
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
        var res = await api.get('board/talks' + '?'
          + 'key=' + key
          + '&value=' + this.searchContent).then(
            (response) => {
              response.data.forEach((d) => {
                d.createDate = this.exportDateFromTimeStamp(d.createDate)
              });
              this.boardCardData = response.data
            }
          )
      }
    },
    async requestAll() {
      var res = await api.get('board/talks').then(
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
        if (item.talkId) {
          this.$router.push({
            path: process.env.VUE_APP_BOARD_COMMUNICATION_DETAIL,
            title: item.title,
            query: {
              talkId: item.talkId
            }
          });
        } else {
          alert('qid가 존재하지 않습니다.');
        }
      } else {
        alert('item이 존재하지 않습니다.');
      }
    },

    // handleCardClicked(item) {
    //   this.saveState();
    //   if (item) {
    //     this.$router.push({
    //       path: process.env.VUE_APP_BOARD_COMMUNICATION_DETAIL,
    //       title: item?.title,
    //       query: {
    //         qid: item?.qid
    //       }
    //     });
    //   }
    // },
    handleWritePage() {
      this.saveState();
      this.$router.push({
        path: process.env.VUE_APP_BOARD_COMMUNICATION_WRITE,
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

.v-col-6 {
  padding-bottom: 0px !important;
}
</style>
