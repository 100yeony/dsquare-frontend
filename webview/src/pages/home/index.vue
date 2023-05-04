<template>
  <div>
    <!-- My place body-->
    <v-row>
      <v-col cols="10">
        <p class="text-h6 font-weight-black">My Place</p>
      </v-col>
      <v-col cols="2"><v-icon icon="mdi-plus"></v-icon></v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card color="#0000000A">
          <v-card-item class="justify-center text-center">
            <img src="@/assets/images/icons/icon_layout-list.png" />
            <p class="text-caption">등록글</p>
            <v-chip>10</v-chip>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card color="#0000000A">
          <v-card-item class="justify-center text-center">
            <img src="@/assets/images/icons/icon_smile.png" />
            <p class="text-caption">Reply</p>
            <v-chip color="shades-black">12</v-chip>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    <!-- My Weekly Hot body-->
    <v-row>
      <v-col cols="10">
        <p class=" text-h6 font-weight-black">Weekly Hot</p>
      </v-col>
      <v-col cols="2"><v-icon icon="mdi-plus"></v-icon></v-col>
    </v-row>
    <div>
      <v-slide-group>
        <v-slide-group-item>
          <v-chip class="ma-2">#페이밴드</v-chip>
        </v-slide-group-item>
        <v-slide-group-item>
          <v-chip class="ma-2">#초과근무</v-chip>
        </v-slide-group-item>
        <v-slide-group-item>
          <v-chip class="ma-2">#벗꽃명소</v-chip>
        </v-slide-group-item>
        <v-slide-group-item>
          <v-chip class="ma-2">#판교사옥</v-chip>
        </v-slide-group-item>
        <v-slide-group-item>
          <v-chip class="ma-2">#내용1</v-chip>
        </v-slide-group-item>
      </v-slide-group>
    </div>

    <!-- 최신글 -->
    <v-row class="mt-2 mb-2">
      <v-col cols="10">
        <p class="text-h6 font-weight-black">최신글</p>
      </v-col>
      <v-col cols="2"><v-icon icon="mdi-plus"></v-icon></v-col>
    </v-row>
    <v-card>
      <v-tabs fixed-tabs show-arrows bg-color="shades-black" color="shades-white" align-tabs="title" height="2rem" selected-class="shades-white"
        v-model="recentTab">
        <v-tab v-for="(i, index) in recentTabTitle.length" :key="index" :value="index" selected-class="shades-white">
          {{ recentTabTitle[index] }}
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="recentTab">
          <!-- 각 게시판 최신글 목록 -->
          <template v-for="(x, i) in recentData.length" :key="i">
            <v-window-item :value="i">
              <v-table density="compact">
                <tbody>
                  <tr v-for="post in recentData[i]" :key="post.id">
                    <v-row no-gutters>
                      <v-col cols="8">
                        <td class="d-inline-block text-truncate text-body-2 font-weight-bold" style="max-width:95%;" color="#0000008F">
                          {{ post.title }}
                        </td>
                      </v-col>
                      <v-col cols="2">
                        <td class="text-caption font-0000008F">
                          <img src="@/assets/images/icons/icon_heart.png" /> {{ post.likeCnt }}
                        </td>
                      </v-col>
                      <v-col cols="2">
                        <td class="text-caption font-0000008F">
                          <img src="@/assets/images/icons/icon_message-circle.png" /> {{ post.commentCnt }}
                        </td>
                      </v-col>
                    </v-row>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>
          </template>
        </v-window>
      </v-card-text>
    </v-card>


    <!-- 명예의 전당 body-->
    <v-row class="mt-2 mb-2">
      <v-col cols="10">
        <p class="text-h6 font-weight-black">명예의 전당</p>
      </v-col>
      <v-col cols="2"><v-icon icon="mdi-plus"></v-icon></v-col>
    </v-row>
    <v-card>
      <v-tabs fixed-tabs bg-color="shades-black" color="shades-white" align-tabs="title" height="2rem" selected-class="shades-white"
        v-model="hallOfFameTab">
        <v-tab v-for="(i, index) in hallOfFameTabTitle.length" :key="index" :value="index" selected-class="shades-white">
          {{ hallOfFameTabTitle[index] }}
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="hallOfFameTab">
          <v-window-item :value="0">
            <v-table density="compact">
              <tbody>
                <tr v-for="item in hallOfFameData[0]" :key="item.id">
                  <v-row no-gutters>
                    <v-col cols="8">
                      <td class="text-body-2 font-weight-bold" color="#0000008F">
                        {{ item.title }}
                      </td>
                    </v-col>
                    <v-col cols="2">
                      <td class="text-caption font-0000008F">
                        <img src="@/assets/images/icons/icon_heart.png" />{{
                          item.like
                        }}
                      </td>
                    </v-col>
                    <v-col cols="2">
                      <td class="text-caption font-0000008F">
                        <img src="@/assets/images/icons/icon_message-circle.png" />{{ item.comment }}
                      </td>
                    </v-col>
                  </v-row>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>
          <v-window-item :value="1">
            <v-table density="compact">
              <tbody>
                <tr v-for="item in hallOfFameData[1]" :key="item.id">
                  <v-row no-gutters>
                    <v-col cols="8">
                      <td class="text-body-2 font-weight-bold" color="#0000008F">
                        {{ item.title }}
                      </td>
                    </v-col>
                    <v-col cols="2">
                      <td class="text-caption font-0000008F">
                        <img src="@/assets/images/icons/icon_heart.png" />{{
                          item.like
                        }}
                      </td>
                    </v-col>
                    <v-col cols="2">
                      <td class="text-caption font-0000008F">
                        <img src="@/assets/images/icons/icon_message-circle.png" />{{ item.comment }}
                      </td>
                    </v-col>
                  </v-row>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
    <!-- 사용자 랭킹 body-->
    <v-row class="mt-2 mb-2">
      <v-col cols="10">
        <p class="text-h6 font-weight-black">사용자 랭킹</p>
      </v-col>
      <v-col cols="2"><v-icon icon="mdi-plus"></v-icon></v-col>
    </v-row>

    <v-card>
      <v-tabs fixed-tabs bg-color="shades-black" color="shades-white" align-tabs="title" height="2rem" selected-class="shades-white"
        v-model="userRankingTab">
        <v-tab v-for="(i, index) in userRankingTabTitle.length" :key="index" :value="index" selected-class="shades-white">
          {{ userRankingTabTitle[index] }}
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="userRankingTab">
          <v-window-item :value="0">
            <v-table density="compact">
              <tbody>
                <tr v-for="item in userRankingData[0]" :key="item.id">
                  <v-row no-gutters>
                    <v-col cols="2">
                      <td class="text-h6 font-bold" color="#0000008F">
                        {{ item.ranking }}
                      </td>
                    </v-col>
                    <v-col cols="2">
                      <td>
                        <v-avatar v-if="item.icon">
                          <v-img cover :src="item.icon"></v-img>
                        </v-avatar>
                        <v-avatar v-else color="grey">{{
                          item.userId
                        }}</v-avatar>
                      </td>
                    </v-col>
                    <v-col cols="6">
                      <td class="text-body-2 font-weight-bold" color="#0000008F">
                        {{ item.userId }}
                      </td>
                    </v-col>
                    <v-col cols="2">
                      <td class="text-caption font-0000008F">
                        <img src="@/assets/images/icons/icon_message-circle.png" />{{ item.comment }}
                      </td>
                    </v-col>
                  </v-row>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>
          <v-window-item :value="1">
            <v-table density="compact">
              <tbody>
                <tr v-for="item in userRankingData[0]" :key="item.id">
                  <v-row no-gutters>
                    <v-col cols="2">
                      <td class="text-h6 font-bold" color="#0000008F">
                        {{ item.ranking }}
                      </td>
                    </v-col>
                    <v-col cols="2">
                      <td>
                        <v-avatar v-if="item.icon">
                          <v-img cover :src="item.icon"></v-img>
                        </v-avatar>
                        <v-avatar v-else color="grey">{{
                          item.userId
                        }}</v-avatar>
                      </td>
                    </v-col>
                    <v-col cols="6">
                      <td class="text-body-2 font-weight-bold" color="#0000008F">
                        {{ item.userId }}
                      </td>
                    </v-col>
                    <v-col cols="2">
                      <td class="text-caption font-0000008F">
                        <img src="@/assets/images/icons/icon_message-circle.png" />{{ item.comment }}
                      </td>
                    </v-col>
                  </v-row>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
import { computed, ref, watch, toRef } from "vue";
import { useStore } from "vuex";
import store from "@/store";
import samplePng from "@/assets/images/users/avatar_sample.png";
import api from '@/api';

let qnaWorkUri = 'board/questions?workYn=true';
let qnaNonworkUri = 'board/questions?workYn=false';
let commUri = 'board/talks';
let dealUri = 'board/carrots';
let cardUri = 'board/cards';

export default {
  name: "DashboardPage",
  setup() {
    let recentTab = ref(0);
    let recentTabTitle = ref(["궁금해요", "소통해요", "당근해요", "카드주세요"]);
    let recentData = ref([]);
    let recentLimit = ref(5);

    let hallOfFameTab = ref(0);
    let hallOfFameTabTitle = ref(["주간", "월간"]);
    let hallOfFameData = ref([
      [
        {
          id: 0,
          title: "(주간)검증된 베스트 게시글 제목",
          like: "999+",
          comment: "999+",
        },
        {
          id: 1,
          title: "(주간)검증된 베스트 게시글 제목",
          like: "300",
          comment: "32",
        },
        {
          id: 2,
          title: "(주간)검증된 베스트 게시글 제목",
          like: "227",
          comment: "32",
        },
        {
          id: 3,
          title: "(주간)검증된 베스트 게시글 제목",
          like: "200",
          comment: "32",
        },
        {
          id: 4,
          title: "(주간)검증된 베스트 게시글 제목",
          like: "127",
          comment: "32",
        },
      ],
      [
        {
          id: 0,
          title: "(월간)검증된 베스트 게시글 제목",
          like: "327",
          comment: "32",
        },
        {
          id: 1,
          title: "(월간)검증된 베스트 게시글 제목",
          like: "300",
          comment: "32",
        },
        {
          id: 2,
          title: "(월간)검증된 베스트 게시글 제목",
          like: "227",
          comment: "32",
        },
        {
          id: 3,
          title: "(월간)검증된 베스트 게시글 제목",
          like: "200",
          comment: "32",
        },
        {
          id: 4,
          title: "(월간)검증된 베스트 게시글 제목",
          like: "127",
          comment: "32",
        },
      ],
    ]);

    let userRankingTab = ref(0);
    let userRankingTabTitle = ref(["질문왕", "답변왕"]);
    let userRankingData = ref([
      [
        {
          id: 0,
          ranking: "No.1",
          icon: samplePng,
          userId: "질문왕1",
          comment: "999+",
        },
        {
          id: 1,
          icon: "",
          ranking: "No.2",
          userId: "질문왕2",
          comment: "32",
        },
        {
          id: 2,
          icon: "",
          ranking: "No.3",
          userId: "질문왕3",
          comment: "32",
        },
        {
          id: 3,
          icon: "",
          ranking: "No.4",
          userId: "질문왕4",
          comment: "32",
        },
        {
          id: 4,
          icon: "",
          ranking: "No.4",
          userId: "질문왕3",
          comment: "32",
        },
      ],
      [
        {
          id: 0,
          icon: "",
          ranking: "No.1",
          userId: "답변왕1",
          comment: "32",
        },
        {
          id: 1,
          icon: samplePng,
          ranking: "No.2",
          userId: "답변왕2",
          comment: "32",
        },
        {
          id: 2,
          icon: "",
          ranking: "No.3",
          userId: "답변왕3",
          comment: "32",
        },
        {
          id: 3,
          icon: "",
          ranking: "No.4",
          userId: "답변왕4",
          comment: "32",
        },
        {
          id: 4,
          icon: "",
          ranking: "No.5",
          userId: "답변왕5",
          comment: "32",
        },
      ],
    ]);

    function exportDateFromTimeStamp(timeStamp) {
      var date = new Date(timeStamp)
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return year + "-" + month + "-" + day + " " + hour + ":" + minute + " " + seconds;
    }

    return {
      recentTab,
      recentTabTitle,
      recentData,
      recentLimit,
      hallOfFameTab,
      hallOfFameTabTitle,
      hallOfFameData,
      userRankingTab,
      userRankingTabTitle,
      userRankingData,
      exportDateFromTimeStamp,
    };
  },
  methods: {
    init() { },
    async requestAllRecent() {
      var qnaData = [];
      var commData = [];
      var dealData = [];
      var cardData = [];
      
      // 궁금해요
      var res = await api.get(qnaWorkUri).then(
        (response) => {
          response.data.forEach((d) => {
            d.createDate = this.exportDateFromTimeStamp(d.createDate)
          });
          qnaData = qnaData.concat(response.data);
        }
      );
      res = await api.get(qnaNonworkUri).then(
        (response) => {
          response.data.forEach((d) => {
            d.createDate = this.exportDateFromTimeStamp(d.createDate)
          });
          qnaData = qnaData.concat(response.data);
        }
      );
      qnaData.sort((a, b) => {
        if (a.createDate < b.createDate) return 1;
        if (b.createDate < a.createDate) return -1;
        return 0;
      });
      this.recentData.push(qnaData.slice(0, this.recentLimit));

      // 소통해요
      res = await api.get(commUri).then(
        (response) => {
          response.data.forEach((d) => {
            d.createDate = this.exportDateFromTimeStamp(d.createDate)
          });
          commData = response.data;
        }
      );
      this.recentData.push(commData.slice(0, this.recentLimit));

      // 당근해요
      res = await api.get(dealUri).then(
        (response) => {
          response.data.forEach((d) => {
            d.createDate = this.exportDateFromTimeStamp(d.createDate)
          });
          dealData = response.data;
        }
      );
      this.recentData.push(dealData.slice(0, this.recentLimit));

      // 카드주세요
      res = await api.get(cardUri).then(
        (response) => {
          response.data.forEach((d) => {
            d.createDate = this.exportDateFromTimeStamp(d.createDate)
          });
          cardData = response.data;
        }
      );
      this.recentData.push(cardData.slice(0, this.recentLimit));
    },
  },
  mounted() {
    this.requestAllRecent();
    const infoArea = {}
    var categoryList = ['전체']
    var subList = []
    api.get('board/categories').then((response) => {
      response.data[0].childList.forEach((category) => {
        categoryList.push(category.name)
        var subs = []
        category.childList.forEach((child) => {
          subs.push(child.name)
        })
        subList.push(subs)
      })
      console.log(categoryList)
      console.log(subList)
      store.dispatch('info/setInfoArea', {value1: categoryList, value2: subList})
    });

  }
};
</script>

<style scoped>
.v-tabs--align-tabs-title:not(.v-slide-group--has-affixes) .v-tab:first-child {
  -webkit-margin-start: 0;
  margin-inline-start: 0;
}

.title-col {
  font-size: 0px;
  letter-spacing: 0px;
  word-spacing: 0px;
}

.title-col > td {
  font-size: 0px;
  letter-spacing: 0px;
  word-spacing: 0px;
  margin: 0px;
  padding: 0px;
}
</style>
