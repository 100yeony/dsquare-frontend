<template>
  <div class="keep-all">
    <p class="text-h7 font-weight-black">오늘</p>
    <v-card variant="">
      <v-list>
        <v-list-item
          v-for="(item, index) in notifications"
          :key="index"
          :href="item.link"
        >
          <v-row>
            <v-col cols="2">
              <v-avatar color="grey" size="35">
                <v-img cover src="@/assets/images/users/profile_default.png"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10">
              <v-list-item-content>
                <v-list-item-title class="text-truncate">
                  <span class="font-weight-bold">{{ item.username }}</span>
                  <span v-html="item.message"></span>
                </v-list-item-title>
                <v-list-item-subtitle class="grey--text">{{ item.time }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card>
    <v-divider class="mb-2"></v-divider>
    <p class="text-h7 font-weight-black">이번 주</p>
    <v-card variant="">
      <v-list>
        <v-list-item
          v-for="(item, index) in notifications"
          :key="index"
          :href="item.link"
        >
          <v-row>
            <v-col cols="2">
              <v-avatar color="grey" size="35">
                <v-img cover src="@/assets/images/users/profile_default.png"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10">
              <v-list-item-content>
                <v-list-item-title class="text-truncate">
                  <span class="font-weight-bold">{{ item.username }}</span>
                  <span v-html="item.message"></span>
                </v-list-item-title>
                <v-list-item-subtitle class="grey--text">{{ item.time }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card>
    <v-divider class="mb-2"></v-divider>
    <p class="text-h7 font-weight-black">이번 달</p>
    <v-card variant="">
      <v-list>
        <v-list-item
          v-for="(item, index) in notifications"
          :key="index"
          :href="item.link"
        >
          <v-row>
            <v-col cols="2">
              <v-avatar color="grey" size="35">
                <v-img cover src="@/assets/images/users/profile_default.png"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10">
              <v-list-item-content>
                <v-list-item-title class="text-truncate">
                  <span class="font-weight-bold">{{ item.username }}</span>
                  <span v-html="item.message"></span>
                </v-list-item-title>
                <v-list-item-subtitle class="grey--text">{{ item.time }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card>
    <v-divider class="mb-2"></v-divider>
    <p class="text-h7 font-weight-black">이전 활동</p>
    <v-card variant="">
      <v-list>
        <v-list-item
          v-for="(item, index) in notifications"
          :key="index"
          :href="item.link"
        >
          <v-row>
            <v-col cols="2">
              <v-avatar color="grey" size="35">
                <v-img cover src="@/assets/images/users/profile_default.png"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10">
              <v-list-item-content>
                <v-list-item-title class="text-truncate">
                  <span class="font-weight-bold">{{ item.username }}</span>
                  <span v-html="item.message"></span>
                </v-list-item-title>
                <v-list-item-subtitle class="grey--text">{{ item.time }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card>

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
    data() {
      return {
        notifications: [
          {
            username: '홍길동',
            message: '님이 회원님의 질문에 답변을 남겼습니다.',
            time: '2023-05-05',
            read: false,
            link: '#'
          },
          {
            username: '김둘리',
            message: '님이 회원님의 글에 댓글을 남겼습니다.',
            time: '2023-05-05',
            read: true,
            link: '#'
          },
          {
            avatar: 'https://picsum.photos/40/40',
            username: '박짱구',
            message: '님이 회원님의 글에 댓글을 남겼습니다.',
            time: '2023-05-05',
            read: true,
            link: '#'
          }
        ]
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

  .v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line{
    padding-inline-start: 0px !important; 
    padding-inline-end: 0px !important; 
  }

  .v-col-10{
    padding-left: 2px !important; 
  }
  
</style>
  