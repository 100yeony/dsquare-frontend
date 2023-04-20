<script>
import { computed, onMounted, ref } from "vue";
import BoardCard from "@/components/cards/BoardCard";
import Observe from "@/components/Observer";
import api from '@/api';
import store from "@/store";

export default {
  name: "myPost",
  components: {
    BoardCard,
    Observe
  },
  setup() {
    let myPostTabTitle = ["궁금해요", "소통해요", "당근해요", "카드주세요"];

    return {
      myPostTabTitle,
    };
  },
  data() {
    return {
      qnaTab: 0,
      page: 1,
      boardCardData: [],
    };
  },
  computed: {

  },
  mounted() {
    var res = this.requestAllWork();
  },
  watch: {
    qnaTab(newVal, oldVal) {
      this.page = 1;
      console.log(newVal)
      this.tabChanged();
    }
  },
  methods: {
    async requestAllWork() {
      console.log(store.getters["info/infoToken"].accessToken)
      var res = await api.get('board/questions' + '?' + 'workYn=true').then(
        (response) => {
          response.data.forEach((d) => {
            d.createDate = this.exportDateFromTimeStamp(d.createDate)
          });
          this.boardCardData = response.data
        }
      )
    },

    // async requestAllNoneWork() {
    //   console.log(store.getters["info/infoToken"].accessToken)
    //   var res = await api.get('board/questions' + '?' + 'workYn=false').then(
    //     (response) => {
    //       response.data.forEach((d) => {
    //         d.createDate = this.exportDateFromTimeStamp(d.createDate)
    //       });
    //       this.boardCardData = response.data
    //     }
    //   )
    // },

    tabChanged() {
      if (this.qnaTab == 0) {
        this.requestAllWork()
      } else if (this.qnaTab == 1) {
        // 소통해요 넣기 
      } else if (this.qnaTab == 2) {
        // 당근해요 넣기 
      } else {
        // 카드주세요 넣기 
      }
    },
    handleCardClicked(item) {
      console.log("[handleCardClicked]", item);
      if (item) {
        //상세 화면으로 이동.
        this.$router.push({
          path: process.env.VUE_APP_BOARD_QNA_DETAIL,
          title: item?.title,
          query: {
            qid: item?.qid
          }
        });
      }
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
<template>
  <div class="keep-all">
    <v-tabs class="mt-5 mb-2" v-model="qnaTab" color="primary">
      <v-tab v-for="(i, index) in myPostTabTitle.length" :key=index :value="index" slider-color="primary">
        {{ myPostTabTitle[index] }}
      </v-tab>
    </v-tabs>
    <v-window v-model="qnaTab" :touch="false">
      <!-- ***** 업무 ***** -->
      <v-window-item :value="0">
        <!-- 질문 카드 -->
        <div v-for="(item, index) in boardCardData" :value="item.qid">
          <BoardCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
        </div>
        <Observe @triggerIntersected="loadMore" />
      </v-window-item>

      <!-- ***** 비업무 *****
      <v-window-item :value="1">
        
        <div v-for="(item, index) in boardCardData" :value="item.qid">
          <BoardCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
        </div>
        <Observe @triggerIntersected="loadMore" />
      </v-window-item> -->
    </v-window>
  </div>
</template>

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

.v-btn--size-default{
  padding: 0 0px;
}
</style>
