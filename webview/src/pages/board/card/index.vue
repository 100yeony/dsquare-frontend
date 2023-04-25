<template>
  <div class="keep-all">

    <div>
      <CardDialog :isShow="isShow" 
      :title="dialogTitle" 
      @click-confirm="onConfirm" 
      @click-cancel="onCancel" />
    </div>

    <!-- 카드주세요 header-->
    <p class="text-h6 font-weight-black">카드주세요</p>
    <p class="text-caption my-3 font-0000008F">
      고생하는 팀원들을 위해, 회사가 쏩니다!!!!
    </p>

    <v-divider :thickness="1" class="mt-4 mb-5"></v-divider>

    <!-- 금주의 카드 -->
    <p class="mt-3 text-h6 font-weight-black">이달의 카드</p>
    <div>
      <RequestCard class="mt-2 card-of-the-week" :data="giftedCardData" @handle-card-clicked="handleCardClicked" @handle-card-dialog="handleCardDialog" />
    </div>

    <v-divider :thickness="1" class="mt-4 mb-5"></v-divider>

    <p class="mt-3 text-h6 font-weight-black">카드 대기중</p>
    <!-- 검색 -->
    <v-expansion-panels class="my-3">
      <v-expansion-panel>
        <v-expansion-panel-title>검색</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row justify="center" class="mb-2">
            <v-col>
              <v-select v-model="category" class="text-truncate mt-2" placeholder="부서 선택" variant="outlined"
                density="compact" :items="categoryItems" @update:modelValue="categoryChanged" id="category"
                hide-details></v-select>
            </v-col>
            <v-col>
              <v-select v-model="subcategory" class="text-truncate mt-2" placeholder="소속팀 선택" variant="outlined"
                density="compact" :items="subcategoryItems" :disabled="!subcategoryItems.length" id="subcategory"
                hide-details></v-select>
            </v-col>
          </v-row>
          <v-btn color="shades-black" @click="search()" block>검색</v-btn>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- 카드 대기중 목록 -->
    <div>
      <div v-for="(item, index) in requestCardData" :value="item.cardId" class="card">
        <RequestCard class=" mt-2" :data="item" :key="index" @handle-card-clicked="handleCardClicked" @handle-card-dialog="handleCardDialog" :style="item.style"/>
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
import CardDialog from "@/components/cards/CardDialog.vue";
import Observe from "@/components/Observer";
import api from '@/api';
import store from "@/store";
import dialogUtils from "@/utils/dialogUtils"

export default {
  name: "cardBoard",
  components: {
    RequestCard,
    Observe,
    CardDialog
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
      categoryItems, subcategoryFullList,
      searchUri,
      maxStackedCards: 4,
    };
  },
  data() {
    return {
      writerInfo: {
        id: 0,
        email: "",
        nickname: "",
        name: "",
        contact: "",
        teamHierarchy: []
      },
      projTeamInfo: {
        tid: 0,
        name: ""
      },
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
        projTeamInfo:{tid: 6, name: "메세징DX플랫폼팀"},
      },
      isShow: false, 
    };
  },
  watch: {
    category(newVal, oldVal) {
      console.log(newVal)
      if (newVal === '플랫폼품질혁신TF') {
        this.projTeamId = 1;
      } else if (newVal === '플랫폼IT컨설팅vTF') {
        this.projTeamId = 2;
      } else {
        this.projTeamId = '';
      }
    },
    subcategory(newVal, oldVal) {
      console.log(newVal)
      if (newVal === '메시징DX플랫폼팀') {
        this.projTeamId = 6;
      } else if (newVal === '서비스플랫폼팀') {
        this.projTeamId = 7;
      } else if (newVal === '금융결제DX플랫폼팀') {
        this.projTeamId = 8;
      } else if (newVal === '인증DX플랫폼팀') {
        this.projTeamId = 9;
      } else if (newVal === '미디어플랫폼팀') {
        this.projTeamId = 10;
      } else if (newVal === 'AI서비스팀') {
        this.projTeamId = 11;
      } else if (newVal === 'AICC서비스팀') {
        this.projTeamId = 12;
      } else if (newVal === 'Safety플랫폼팀') {
        this.projTeamId = 13;
      } else if (newVal === 'AgileCore팀') {
        this.projTeamId = 14;
      } else if (newVal === 'Digico사업수행팀') {
        this.projTeamId = 15;
      } else if (newVal === 'AICC딜리버리팀') {
        this.projTeamId = 16;
      }
    }
  },
  mounted() {
    var res = this.requestAll();
  },
  computed: {
    dialogTitle() {
      return '카드를 주시겠습니까?';
    },
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
      if (typeof this.subcategory == 'string' || typeof this.category == 'string'){
        var res = await api.get('board/cards/search?projTeamId=' + this.projTeamId).then(
          (response) => {
            response.data.forEach((d) => {
              d.createDate = this.exportDateFromTimeStamp(d.createDate)
            });
            this.requestCardData = response.data
          }
        )
      }
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
    handleCardDialog() {
      console.log('handel card dialog')
      this.isShow = true; 
    },
    onConfirm() {
      console.log('confirm payload:');
      this.isShow = false;
      // if (this.selectedPostType == 0) {
      //   this.requestDelQuestion();
      // } else if (this.selectedPostType == 1) {
      //   this.requestDelAnswer();
      // } else if (this.selectedPostType == 2) {

      // }
    },
    onCancel() {
      console.log('cancel');
      this.isShow = false;
    },
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
