<template>
  <div class="keep-all">
    <!-- <p class="text-h7 font-weight-black">오늘</p> -->

    <v-list>
      <v-list-item v-for="(item, index) in notifications" :key="index">
        <v-card variant="" @click="handleItemClick(item)">
          <v-row class="mt-3 mb-3">
            <v-col cols="2">
              <v-avatar v-if="!item.profileImage" color="grey" size="35">
                <v-img cover src="@/assets/images/users/profile_default.png"></v-img>
              </v-avatar>
              <v-avatar v-else color="grey" size="35">
                <v-img cover :src="item.profileImage"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10">
              <v-list-item-content>
                <v-list-item-title class="text-truncate">
                  <v-list-item-subtitle class="grey--text"><span class="font-weight-bold">{{ item.username }}</span> {{
                    item.time }}</v-list-item-subtitle>
                  <p></p>
                  <span v-html="item.message"></span>
                </v-list-item-title>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-card>
        <v-divider></v-divider>
      </v-list-item>
    </v-list>
    <!-- <p class="text-h7 font-weight-black">이번 주</p>
    <v-card variant="">
      <v-list>
        <v-list-item v-for="(item, index) in notifications" :key="index" :href="item.link">
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
        <v-list-item v-for="(item, index) in notifications" :key="index" :href="item.link">
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
        <v-list-item v-for="(item, index) in notifications" :key="index" :href="item.link">
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
    </v-card> -->

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
    const notifications = ref([])
    var userInfo = store.getters['info/infoUser']
    api.get('/member/members/' + userInfo.userId + '/notification', '').then(
      (res) => {
        res.data.forEach(async (data) => {
          var r = await requestUserData(data.data.writerId)
          console.log(r)
          console.log(data.data.postId)
          console.log((typeof data.data.postId == 'undefined'))
          notifications.value.push(
            {
              userProfile: r.data.profileImage,
              username: (data.data.board == "CARROT") ? r.data.nickname : r.data.name,
              message: data.data.body,
              time: data.sentAt.substr(0, 10),
              boardType: data.data.board,
              postId: (typeof data.data.postId == 'undefined') ? data.data.questionId : data.data.postId
            }
          )
        })
      }
    )


    function exportDateFromTimeStamp(timeStamp) {
      var date = new Date(timeStamp)
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();

      return year + "-" + month + "-" + day + " " + hour + ":" + minute
    }

    async function requestUserData(userId) {
      var res = await api.get('member/members/' + userId, '');
      return res;
    }


    return {
      exportDateFromTimeStamp,
      notifications
    };
  },
  data() {
    return {
    };
  },
  computed: {
  },
  watch: {
  },
  methods: {
    handleItemClick(item) {
      var path = ''
      if (item.boardType == "QNA" || item.boardType == "QUESTION") {
        path = '/board/qna/' + item?.postId + '/'
      } else if (item.boardType == "TALK") {
        path = '/board/communication/' + item?.postId + '/'
      } else if (item.boardType == "CARROT") {
        path = '/board/deal/' + item?.postId + '/'
      } else if (item.boardType == "CARD") {
        path = '/board/card/' + item?.postId + '/'
      } else {
        console.log("none boardType")
      }
      this.$router.push({
          path: path
        });
    }
  },
};
</script>
  
  
  
<style scoped>
.keep-all {
  word-break: keep-all;
  /* 한국어 잘림 방지 */
}

.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
  padding-inline-start: 0px !important;
  padding-inline-end: 0px !important;
}

.v-col-10 {
  padding-left: 2px !important;
}
</style>
  