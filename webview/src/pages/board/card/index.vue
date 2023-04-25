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
            <v-col>
              <v-select v-model="category" class="text-truncate mt-2" placeholder="부서" variant="outlined"
                density="compact" :items="categoryItems" @update:modelValue="categoryChanged" id="category"
                hide-details></v-select>
            </v-col>
            <v-col>
              <v-select v-model="subcategory" class="text-truncate mt-2" placeholder="소속팀" variant="outlined"
                density="compact" :items="subcategoryItems" :disabled="!subcategoryItems.length" id="subcategory"
                hide-details></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="shades-black" @click="search()" block :disabled="!searchValidation">검색</v-btn>
            </v-col>
          </v-row>
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


export default {
  name: "cardBoard",
  components: {
    RequestCard,
    Observe
  },
  setup() {
    let categoryItems = ['플랫폼품질혁신TF', '플랫폼IT컨설팅vTF', '플랫폼서비스담당',
      'Digico서비스담당', 'Digico개발센터'];
    let subcategoryFullList = [
      [],
      [],
      ["메시징DX플랫폼팀", "서비스플랫폼팀",
        "금융결제DX플랫폼팀", "인증DX플랫폼팀"],
      ["미디어플랫폼팀", "AI서비스팀",
        "AICC서비스팀", "Safety플랫폼팀"],
      ["AgileCore팀", "Digico사업수행팀", "AICC딜리버리팀"],
    ];

    let searchUri = "/board/questions";

    return {
      categoryItems,
      subcategoryFullList,
      searchUri,
      maxStackedCards: 4,
    };
  },
  computed: {
    searchValidation() {
      return this.searchProjTeamId ? true : false;
    }
  },
  data() {
    return {
      category: [],
      subcategory: [],
      subcategoryItems: [],
      searchProjTeamId: 0,
      page: 1,
      requestCardData: [],
      giftedCardData: {
        cardId: 12,
        title: "신입사원과제",
        content: "신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요.. 신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요.. 신입사원 웰컴 프로젝트 중이에요.. 저희에게 힘을 주세요..",
        date: "2023-04-01",
        teammate: ["변상진", "이호열"],
        likeCnt: "327",
        likeYn: true,
        comment: "3",
        createDate: "2023-4-21 17:46",
        selectionInfo: {},
      },
    };
  },
  mounted() {
    var res = this.requestAll();
  },
  watch: {
    category(newVal, oldVal) {
      if (newVal === '플랫폼품질혁신TF') {
        this.searchProjTeamId = 1;
      } else if (newVal === '플랫폼IT컨설팅vTF') {
        this.searchProjTeamId = 2;
      } else {
        this.searchProjTeamId = '';
      }
    },
    subcategory(newVal, oldVal) {
      if (newVal === '메시징DX플랫폼팀') {
        this.searchProjTeamId = 6;
      } else if (newVal === '서비스플랫폼팀') {
        this.searchProjTeamId = 7;
      } else if (newVal === '금융결제DX플랫폼팀') {
        this.searchProjTeamId = 8;
      } else if (newVal === '인증DX플랫폼팀') {
        this.searchProjTeamId = 9;
      } else if (newVal === '미디어플랫폼팀') {
        this.searchProjTeamId = 10;
      } else if (newVal === 'AI서비스팀') {
        this.searchProjTeamId = 11;
      } else if (newVal === 'AICC서비스팀') {
        this.searchProjTeamId = 12;
      } else if (newVal === 'Safety플랫폼팀') {
        this.searchProjTeamId = 13;
      } else if (newVal === 'AgileCore팀') {
        this.searchProjTeamId = 14;
      } else if (newVal === 'Digico사업수행팀') {
        this.searchProjTeamId = 15;
      } else if (newVal === 'AICC딜리버리팀') {
        this.searchProjTeamId = 16;
      }
    }
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
      this.subcategory = [];
      var categoryIndex = this.categoryItems.indexOf(this.category);
      if (categoryIndex != 0) {
        this.subcategoryItems = this.subcategoryFullList[categoryIndex];
      }
      else {
        this.subcategoryItems = [];
      }
    },
    async search() {
      var res = await api.get('/board/cards/search?projTeamId=' + this.searchProjTeamId).then(
        (response) => {
          response.data.forEach((d) => {
            d.createDate = this.exportDateFromTimeStamp(d.createDate);
            var tempTeammate = d.teammate.replaceAll('[', '["').replaceAll(']', '"]').replaceAll(',', '","');
            d.teammate = JSON.parse(tempTeammate);
          });
          this.requestCardData = response.data;
          this.cardsLength = response.data.length;
        }
      );
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
