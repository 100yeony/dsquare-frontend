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
              <v-select v-model="searchKey" placeholder="구분" class="text-truncate" variant="outlined" density="compact"
                :items="['제목 + 내용', '작성자']"></v-select>
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
    <div class="mt-4 mb-4 d-flex justify-end" v-if="talkCardData.length != 0">
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

    <div v-if="talkCardData.length == 0 && !searchFlag" class="text-center mt-60 mb-20">
      <img src="@/assets/images/nopost.png" width="70" height="70">
      <h3>작성된 글이 없어요</h3>
    </div>

    <div v-if="talkCardData.length == 0 && searchFlag" class="text-center mt-60 mb-20">
      <img src="@/assets/images/search.png" width="70" height="70">
      <h3>검색 결과가 없어요</h3>
    </div>

    <!-- 질문 카드 -->
    <div v-for="(item, index) in talkCardData" :value="item.talkId">
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

let talkUri = 'board/talks';

export default {
  name: "TalkBoard",
  components: {
    TalkCard,
    Observe
  },
  setup() {
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

    var searchKey = ref(pageState?.searchKey ?? '')
    var searchContent = ref(pageState?.searchContent ?? '')
    var page = ref(pageState?.page ?? 1)
    var talkCardData = ref(pageState?.talkCardData ?? [])
    var talkCardDataOrder = ref(pageState?.talkCardDataOrder ?? 'create')
    var talkCardDataPage = ref(pageState?.talkCardDataPage ?? 0)
    var talkCardDataSize = ref(pageState?.talkCardDataSize ?? 10)


    store.dispatch('info/setPageState', {});

    let sortMenu = [
      { title: "최신순" },
      { title: "좋아요순" },
    ]
    
    return {
      searchKey,
      searchContent,
      page,
      talkCardData,
      talkCardDataOrder,
      talkCardDataPage,
      talkCardDataSize,
      exportDateFromTimeStamp,
      searchParams: {},
      sortMenu,
    };
  },
  computed: {
    searchValidation() {
      if (this.searchKey != '' && this.searchContent != '') {
        return true
      } else {
        return false
      }
    }

  },
  data() {
    return {
      searchFlag: false,
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

        var params = {
          key: key,
          value: this.searchContent,
          order: this.talkCardDataOrder,
          page: (this.talkCardDataPage = 0),
          size: (this.talkCardDataSize = 10),
        }

        this.searchParams = params;
        this.searchFlag = (this.talkCardData.length == 0) ? true:false;

        this.loadNew();
      }
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
    handleWritePage() {
      this.saveState();
      this.$router.push({
        path: process.env.VUE_APP_BOARD_COMMUNICATION_WRITE,
      });

    },
    async loadMore() {
      var params = this.searchParams ?? {};
      params['order'] = this.talkCardDataOrder;
      params['page'] = this.talkCardDataPage;
      params['size'] = this.talkCardDataSize;

      var res = await api.get(talkUri, { params }).then(
        (response) => {
          if ([200, 201].includes(response.status) && response.data.length) {
            response.data.forEach((d) => {
              d.createDate = this.exportDateFromTimeStamp(d.createDate);
            });
            this.talkCardData = this.talkCardData.concat(response.data);
            this.talkCardDataPage++;
          }
        }
      );
    },
    async loadNew() {
      var params = this.searchParams ?? {};
      params['order'] = this.talkCardDataOrder;
      params['page'] = this.talkCardDataPage;
      params['size'] = this.talkCardDataSize;

      var res = await api.get(talkUri, { params }).then(
        (response) => {
          if ([200, 201].includes(response.status) && response.data.length) {
            response.data.forEach((d) => {
              d.createDate = this.exportDateFromTimeStamp(d.createDate);
            });
            this.talkCardData = response.data;
            this.talkCardDataPage++;
          }
        }
      );
    },
    saveState() {
      store.dispatch('info/setPageState', {
        searchKey: this.searchKey,
        searchContent: this.searchContent,
        page: this.page,
        talkCardData: this.talkCardData,
        talkCardDataOrder: this.talkCardDataOrder,
        talkCardDataPage: this.talkCardDataPage,
        talkCardDataSize: this.talkCardDataSize,
      });
    },
    sort(index) {
      this.talkCardDataOrder = index ? "like" : "create";
      this.talkCardDataPage = 0;
      this.talkCardDataSize = 10;

      this.loadNew();
    },
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
