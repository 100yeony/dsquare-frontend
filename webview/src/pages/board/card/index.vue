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
    <swiper
      :spaceBetween="16"
      :centeredSlides="true"
      :autoplay="{
        delay: 0,
        disableOnInteraction: false,
      }"
      :speed="7000"
      :resizeObserver="true"
      :loop="true"
      :modules="swiperModules"
      :resistance="false"
      class="overflow-visible"
      >
      <swiper-slide>
        <RequestCard class="mt-2 card-of-the-week" :data="giftedCardData" @handle-card-clicked="handleCardClicked" />
      </swiper-slide>
      <swiper-slide>
        <RequestCard class="mt-2 card-of-the-week" :data="giftedCardData" @handle-card-clicked="handleCardClicked" />
      </swiper-slide>
      <swiper-slide>
        <RequestCard class="mt-2 card-of-the-week" :data="giftedCardData" @handle-card-clicked="handleCardClicked" />
      </swiper-slide>
      <swiper-slide>
        <RequestCard class="mt-2 card-of-the-week" :data="giftedCardData" @handle-card-clicked="handleCardClicked" />
      </swiper-slide>
    </swiper>

    <!-- 카드 대기중 목록 -->
    <p class="mt-3 text-h6 font-weight-black">카드 대기중</p>
    <div>
      <div v-for="(item, index) in requestCardData" :value="item.cardId" class="card">
        <RequestCard class=" mt-2" :data="item" :key="index" @handle-card-clicked="handleCardClicked" :style="item.style"/>
      </div>
    </div>
    <Observe @triggerIntersected="loadMore" />
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
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';

export default {
  name: "cardBoard",
  components: {
    RequestCard,
    Observe,
    Swiper,
    SwiperSlide,
  },
  setup() {
    let area = store.getters["info/infoArea"];
    let categoryItems = area.areaList;
    let subcategoryFullList = area.subAreaList;

    let searchUri = "/board/questions";

    return {
      categoryItems,
      subcategoryFullList,
      searchUri,
      maxStackedCards: 4,
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
        cardId: 12,
        title: "신입사원과제",
        content: "신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요.. 신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요.. 신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요..",
        date: "2023-04-01",
        teammate: ["변상진", "이호열"],
        like: "327",
        comment: "3",
        createDate: "2023-4-21 17:46",
        selectionInfo: {},
      },
      swiperModules: [ Autoplay, ]
    };
  },
  mounted() {
    var res = this.requestAll();
  },
  methods: {
    async requestAll() {
      var res = await api.get('board/cards').then(
        (response) => {
          response.data.forEach((d) => {
            d.createDate = this.exportDateFromTimeStamp(d.createDate);
            var tempTeammate = d.teammate.replaceAll('[', '["').replaceAll(']', '"]').replaceAll(',', '","');
            d.teammate = JSON.parse(tempTeammate);  // 어레이로 변환
          });
          this.requestCardData = response.data;
          this.cardsLength = response.data.length;
        }
      );
    },
    categoryChanged() {
      var categoryIndex = this.categoryItems.indexOf(this.category);
      this.subcategory = [];
      this.subcategoryItems = 1 <= categoryIndex ? this.subcategoryFullList[categoryIndex - 1] : [];
    },
    async search() {
    },
    handleCardClicked(item) {
      if (item) {
        console.log(item);
        this.$router.push({
          path: process.env.VUE_APP_BOARD_CARD_DETAIL,
          title: item?.title,
          query: {
            id: item?.cardId,
          },
        });
      }
    },
    handleeWritePage() {
      console.log("handleeWritePage");
      this.$router.push({
        path: process.env.VUE_APP_BOARD_CARD_WRITE,
        query: {},
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

    },
    onScroll(e) {
        this.scrollPosition = window.scrollY;
    },

    calculateCardStyle(card, index) {
      var cardHeight = this.$refs.test ? this.$refs.test[index].clientHeight : 0; // height + padding + margin
      cardHeight += 16;
      const firstCardTop = this.$refs.test ? this.$refs.test[0].getBoundingClientRect().top : 0;

      const positionY = this.$refs.test ? this.$refs.test[index].getBoundingClientRect().top : 0;
      const deltaY = positionY - this.scrollPosition;
      //console.log(`${index} positionY=${positionY}, deltaY=${deltaY}`);
      // constrain deltaY between -cardHeight and 0
      const dY = this.clamp(deltaY, -cardHeight, 0);

      const disappearingPosition = firstCardTop + cardHeight * index;
      
      //const dissapearingValue = (dY / cardHeight) + 1
      const dissapearingValue = (dY / cardHeight) + 1
      const zValue = dY / cardHeight * 50;
      const yValue = dY / cardHeight * -20;

      card.style = {
        opacity: dissapearingValue,
        transform: `perspective(200px) translate3d(0,${yValue}px, ${zValue}px)`,
      }
      return card;
    },
    clamp (value, min, max) {
      return Math.min(Math.max(min, value), max)
    }
  },
};
</script>
  
  
  
<style lang="scss" scoped>
.fixed_fab {
  position: fixed;
  top: 80vh;
  left: 80vw;
}

.keep-all {
  word-break: keep-all;
  /* 한국어 잘림 방지 */
}

@mixin translateY {
  @for $i from 0 through 10000 {
    &:nth-child(#{$i}) {
      transform: translateY(#{$i * 16}px);
    }
  }
}

.card {
  position: -webkit-sticky;
  position: sticky;
  top: 4em;
  transform-origin: center top;
  @include translateY;
}

</style>
