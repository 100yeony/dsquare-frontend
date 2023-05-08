<template>
    <div class="keep-all">
      <p class="text-h6 font-weight-black">알림 목록</p>
      <p class="text-caption my-3 font-0000008F">
        알림목록 입니다. 확인해주세요!
      </p>
          <!-- <div v-for="(item, index) in boardCardData" :value="item.qid">
            <BoardCard class="mt-2" :data="item" @handle-card-clicked="handleCardClicked" />
          </div> -->
          <Observe @triggerIntersected="loadMore" />
    </div>
  </template>
  
  
  
  <script>
  import { computed, onMounted, ref } from "vue";
  import Observe from "@/components/Observer";
  import api from '@/api';
  import store from "@/store";
  
  export default {
    name: "notifications",
    components: {
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
  
  
      return {
        exportDateFromTimeStamp,
      };
    },
    computed: {
    },
    watch: {
    },
    methods: {
  
      loadMore() {
        this.page += 1;
        console.log(this.page)
  
      },
    },
  };
  </script>
  
  
  
  <style scoped>
  .keep-all {
    word-break: keep-all;
    /* 한국어 잘림 방지 */
  }
  
  </style>
  