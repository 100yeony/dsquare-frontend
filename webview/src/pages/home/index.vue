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
    <!-- 명예의 전당 body-->
    <v-row class="mt-2 mb-2">
      <v-col cols="10">
        <p class="text-h6 font-weight-black">명예의 전당</p>
      </v-col>
      <v-col cols="2"><v-icon icon="mdi-plus"></v-icon></v-col>
    </v-row>
    <v-card>
      <v-tabs bg-color="shades-black" color="shades-white" align-tabs="title" height="2rem" selected-class="shades-white"
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
      <v-tabs bg-color="shades-black" color="shades-white" align-tabs="title" height="2rem" selected-class="shades-white"
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
import api from '@/api'
export default {
  name: "DashboardPage",
  setup() {
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

    return {
      hallOfFameTab,
      hallOfFameTabTitle,
      hallOfFameData,
      userRankingTab,
      userRankingTabTitle,
      userRankingData,
    };
  },
  methods: {
    init() { },
  },
  mounted() {
    store.dispatch('info/setInfoArea', {
      value1: ['전체', '컨설팅', '아키텍처', 'IT관리', '개발', '운영']
      , value2: [
      ["IT컨설팅"],
      ["SW아키텍처"],
      ["품질관리", "PM"],
      ["Biz분석/설계", "응용SW개발", "UI/UX", "데이터분석"],
      ["플랫폼품질혁신TF", "플랫폼IT컨설팅vTF", "메시징DX플랫폼팀", "서비스플랫폼팀",
        "금융결제DX플랫폼팀", "인증DX플랫폼팀", "미디어플랫폼팀", "AI서비스팀",
        "AICC서비스팀", "Safety플랫폼팀", "AgileCore팀", "AICC딜리버리팀"
      ]]
    });
    console.log(store.getters["info/infoToken"])
  }
};
</script>
<style scoped>
.v-tabs--align-tabs-title:not(.v-slide-group--has-affixes) .v-tab:first-child {
  -webkit-margin-start: 0;
  margin-inline-start: 0;
}

.v-tab.v-tab {
  min-width: 50%;
}
</style>
