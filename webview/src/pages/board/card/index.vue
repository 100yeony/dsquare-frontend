<template>
  <div class="keep-all">

    <div>
      <CardDialog :isShow="isShow" :title="dialogTitle" @click-confirm="onConfirm" @click-cancel="onCancel" />
    </div>

    <!-- 카드주세요 header-->
    <p class="text-h6 font-weight-black">카드주세요</p>
    <p class="text-caption my-3 font-0000008F">
      고생하는 팀원들을 위해, 회사가 쏩니다!!!!
    </p>

    <v-divider :thickness="1" class="mt-4 mb-5"></v-divider>

    <!-- 이달의 카드 -->
    <p class="mt-3 mb-2 text-h6 font-weight-black">이달의 카드</p>
    <div class="text-center" v-if="this.selectedCardData.length === 0">
      <img src="@/assets/images/empty.png" width="70" height="70">
      <h3>이달의 카드가 없어요</h3>
    </div>
    <Flicking :plugins="flickingPlugins" :options="flickingOptions" class="mt-2">
      <RequestCard class="panel mr-3" v-for="(item, index) in selectedCardData" :data="item" :key="index"
        @handle-card-clicked="handleCardClicked" @handle-card-dialog="handleCardDialog(item)" />
    </Flicking>

    <v-divider :thickness="1" class="mt-4 mb-5"></v-divider>

    <v-tabs fixed-tabs class="mt-5" color="primary" v-model="cardTab">
      <v-tab v-for="(i, index) in cardTabTitle.length" :key="index" :value="index" slider-color="primary">
        {{ cardTabTitle[index] }}
      </v-tab>
    </v-tabs>
    <!-- 
    <p class="mt-3 text-h6 font-weight-black">카드 대기중</p> -->

    <v-window v-model="cardTab" :touch="false">
      <v-window-item :value="0">
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

        <!-- 정렬 -->
        <div class="mt-4 mb-4 d-flex justify-end">
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

        <div v-if="requestCardData.length == 0 && !searchFlag" class="text-center mt-60 mb-20">
          <img src="@/assets/images/nopost.png" width="70" height="70">
          <h3>대기중인 카드가 없어요</h3>
        </div>

        <div v-if="requestCardData.length == 0 && searchFlag" class="text-center mt-60 mb-20">
          <img src="@/assets/images/search.png" width="70" height="70">
          <h3>검색 결과가 없어요</h3>
        </div>

        <!-- 카드 대기중 목록 -->
        <div>
          <div v-for="(item, index) in requestCardData" :value="item.cardId" class="card">
            <RequestCard class=" mt-2" :data="item" @handle-card-clicked="handleCardClicked"
              @handle-card-dialog="handleCardDialog(item)" :style="item.style" />
          </div>
          <Observe @triggerIntersected="loadMore" />
        </div>

      </v-window-item>

      <v-window-item :value="1">
        <!-- 선정된 카드 목록 -->
        <!-- <p class="mt-3 text-h6 font-weight-black">선정된 카드</p> -->

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

        <!-- 정렬 -->
        <div class="mt-4 mb-4 d-flex justify-end">
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

        <div v-if="completedCardData.length == 0 && !completedFlag" class="text-center mt-60 mb-20">
          <img src="@/assets/images/nopost.png" width="70" height="70">
          <h3>선정된 카드가 없어요</h3>
        </div>

        <div v-if="completedCardData.length == 0 && completedFlag" class="text-center mt-60 mb-20">
          <img src="@/assets/images/search.png" width="70" height="70">
          <h3>검색 결과가 없어요</h3>
        </div>

        <div>
          <div v-for="(item, index) in completedCardData" :value="item.cardId" class="card" :key="index">
            <RequestCard class=" mt-2" :data="item" @handle-card-clicked="handleCardClicked"
              @handle-card-dialog="handleCardDialog(item)" :style="item.style" />
          </div>
          <Observe @triggerIntersected="loadMore" />
        </div>
      </v-window-item>
    </v-window>
  </div>

  <br>

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
import object from "@/utils/objectUtils";
import Flicking from "@egjs/vue3-flicking";
import "@egjs/vue3-flicking/dist/flicking.css";
import { AutoPlay } from "@egjs/flicking-plugins";

let requestUri = 'board/cards';
let selectedUri = 'board/cards/card-of-the-month';
let searchUri = 'board/cards';

const flickingOptions = {
  panelsPerView: 1,
  circular: true,
  circularFallback: 'bound',
  moveType: 'freeScroll',
  easing: x => x,
}
const flickingPlugins = [new AutoPlay({
  duration: 0,
  animationDuration: 10000,
})];

export default {
  name: "cardBoard",
  components: {
    RequestCard,
    Observe,
    CardDialog,
    Flicking,
  },
  setup() {
    let categoryItems = ['플랫폼품질혁신TF', '플랫폼서비스담당',
      'Digico서비스담당', 'Digico개발센터'];
    let subcategoryFullList = [
      [],
      ["메시징DX플랫폼팀", "서비스플랫폼팀",
        "금융결제DX플랫폼팀", "인증DX플랫폼팀", "플랫폼IT컨설팅팀"],
      ["미디어플랫폼팀", "AI서비스팀",
        "Safety플랫폼팀"],
      ["AgileCore팀", "Digico사업수행팀", "DX솔루션사업팀"],
    ];

    let searchUri = "/board/questions";

    let sortMenu = [
      { title: "최신순" },
      { title: "좋아요순" },
    ]

    let cardTabTitle = ["카드대기중", "선정된카드"];

    return {
      categoryItems, subcategoryFullList,
      searchUri,
      sortMenu,
      flickingPlugins,
      flickingOptions,
      cardTabTitle,
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
      ProjTeamId: '',
      page: 1,
      requestCardData: [],
      requestCardDataOrder: "create",
      requestCardDataPage: 0,
      requestCardDataSize: 10,
      selectedCardData: [],
      completedCardData: [],
      completedCardDataOrder: "create",
      completedCardDataPage: 0,
      completedCardDataSize: 10,
      searchParams: {},
      isShow: false,
      selectedItem: {},
      cardTab: 0,
      searchFlag: false,
      completedFlag: false,
    };
  },
  watch: {
    category(newVal, oldVal) {
      console.log(newVal)
      if (newVal === '플랫폼품질혁신TF') {
        this.projTeamId = 1;
      } else {
        this.projTeamId = '';
      }
    },
    subcategory(newVal, oldVal) {
      console.log(newVal)
      if (newVal === '메시징DX플랫폼팀') {
        this.projTeamId = 5;
      } else if (newVal === '서비스플랫폼팀') {
        this.projTeamId = 6;
      } else if (newVal === '금융결제DX플랫폼팀') {
        this.projTeamId = 7;
      } else if (newVal === '인증DX플랫폼팀') {
        this.projTeamId = 8;
      } else if (newVal === '플랫폼IT컨설팅팀') {
        this.projTeamId = 9;
      } else if (newVal === '미디어플랫폼팀') {
        this.projTeamId = 10;
      } else if (newVal === 'AI서비스팀') {
        this.projTeamId = 11;
      } else if (newVal === 'Safety플랫폼팀') {
        this.projTeamId = 12;
      } else if (newVal === 'AgileCore팀') {
        this.projTeamId = 13;
      } else if (newVal === 'Digico사업수행팀') {
        this.projTeamId = 14;
      } else if (newVal === 'DX솔루션사업팀') {
        this.projTeamId = 15;
      }
    },
    cardTab(newVal, oldVal) {
      console.log(newVal)
      this.tabChanged();
    }
  },
  computed: {
    dialogTitle() {
      return '카드를 주시겠습니까?';
    },
    emptyCard() {
      return window.innerHeight
    }
  },
  methods: {
    tabChanged() {
      this.category = []
      this.subcategory = []
      this.searchKey = ''
      this.searchContent = '';
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
      if (typeof this.subcategory == 'string' || typeof this.category == 'string') {
        if (this.cardTab == 0) {
          var params = {
            projTeamId: this.projTeamId,
            order: this.requestCardDataOrder,
            page: (this.requestCardDataPage = 0),
            size: (this.requestCardDataSize = 10),
          };
          this.searchParams = params;
          this.requestCardData = [];
          this.searchFlag = (this.requestCardData.length == 0) ? true : false
        } else {
          var params = {
            projTeamId: this.projTeamId,
            order: this.completedCardDataOrder,
            page: (this.completedCardDataPage = 0),
            size: (this.completedCardDataSize = 10),
          };
          this.searchParams = params;
          this.completedCardData = [];
          this.completedFlag = (this.completedCardData.length == 0) ? true : false
        }
      }
    },
    async loadMore() {
      var params = this.searchParams ?? {};
      if (this.cardTab == 0) {
        params['isSelected'] = false;
        params['order'] = this.requestCardDataOrder;
        params['page'] = this.requestCardDataPage;
        params['size'] = this.requestCardDataSize;
      } else {
        params['isSelected'] = true;
        params['order'] = this.completedCardDataOrder;
        params['page'] = this.completedCardDataPage;
        params['size'] = this.completedCardDataSize;
      }
      console.log("******* params ******");
      console.log(params);
      var res = await api.get(requestUri, { params }).then(
        (response) => {
          if ([200, 201].includes(response.status) && response.data.length) {
            response.data.forEach((d) => {
              d.createDate = this.exportDateFromTimeStamp(d.createDate);
              if (d.teammates) {
                var tempTeammates = d.teammates.replaceAll('[', '["').replaceAll(']', '"]').replaceAll(',', '","');
                d.teammates = JSON.parse(tempTeammates);  // 어레이로 변환
              }
            });
            if (this.cardTab == 0) {
              this.requestCardData = this.requestCardData.concat(response.data);
              this.requestCardDataPage++;
            } else {
              this.completedCardData = this.completedCardData.concat(response.data);
              this.completedCardDataPage++;
            }
          }
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
    leftPad(value) {
      if (value >= 10) {
        return value;
      }
      return `0${value}`;
    },
    exportDateFromTimeStamp(timeStamp) {
      var date = new Date(timeStamp)
      const year = date.getFullYear();
      const month = this.leftPad(date.getMonth() + 1); // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = this.leftPad(date.getDate());
      const hour = this.leftPad(date.getHours());
      const minute = this.leftPad(date.getMinutes());

      return year + "-" + month + "-" + day + " " + hour + ":" + minute
    },
    onScroll(e) {
      this.scrollPosition = window.scrollY;
    },
    handleCardDialog(item) {
      console.log('handel card dialog')
      this.selectedItem = item;
      this.isShow = true;
    },
    onConfirm() {
      console.log('confirm payload:');
      this.isShow = false;
      this.cardSelect()
    },
    onCancel() {
      console.log('cancel');
      this.isShow = false;
    },
    async cardSelect() {
      console.log(this.selectedItem)
      const res = await api.patch('board/cards/' + this.selectedItem.cardId + '/chosen')
      console.log(res)
      this.selectedItem = {}
    },
    sort(index) {
      console.log("sort");
      if (this.cardTab == 0) {
        this.requestCardDataOrder = index ? "like" : "create";
        this.requestCardDataPage = 0;
        this.requestCardDataSize = 10;
        this.requestCardData = [];
      }
      // 비업무
      else if (this.cardTab == 1) {
        this.completedCardDataOrder = index ? "like" : "create";
        this.completedCardDataPage = 0;
        this.completedCardDataSize = 10;
        this.completedCardData = [];
      }
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
      transform: translateY(#{$i * 0.2}rem);
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

.v-window {
  overflow: inherit !important;
}
</style>
