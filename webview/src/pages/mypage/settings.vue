<template>
  <p class="text-h6 font-weight-black mb-2">회원 목록</p>
  <v-data-table
    :headers="headers"
    :items="users"
    :sort-by="[{ key: 'name', order: 'asc' }]"
    class="elevation-1"
  >
  <template v-slot:item.profileImage="{ item }">
    <span v-if="item.raw.profileImage==null">
      <v-avatar color="grey" size="40">
        <v-img cover src="@/assets/images/users/profile_default.png"></v-img>
      </v-avatar>
    </span>
    <span v-else>
      <v-avatar color="grey" size="40">
        <v-img cover :src="item.raw.profileImage"></v-img>
      </v-avatar>
    </span>
  </template>

    <template v-slot:top>
      <v-dialog
        v-model="dialog"
        max-width="500px"
      >
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h6">회원을 삭제하시겠습니까?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="closeDelete">취소</v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        size="small"
        class="me-2"
        @click="editItem(item.raw.id)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item.raw.id)"
      >
        mdi-delete
      </v-icon>
    </template>
  
  </v-data-table>
</template>
<script>
import store from '@/store';
import api from '@/api'
import { VDataTable } from 'vuetify/labs/VDataTable'

  export default {
    components: {
      VDataTable,
    },
    data: () => ({
      dialogDelete: false,
      headers: [
        {
          title: '',
          align: 'start',
          sortable: false,
          key: 'profileImage',
        },
        { title: '이름', key: 'name' },
        { title: '옵션', key: 'actions', sortable: false },
      ],
      users: [],
      user: {
        nickname: '',
        contact: "",
        email: "",
        tid: "",
        name: "",
        ktMail: "",
      },
    }),

    computed: {
      
    },

    watch: {
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },
    mounted() {
      const userData = this.requestUserData();
      userData.then(
        (response) => {
          console.log('user info for manager', response)
          response.data.forEach((d) => {
            this.users.push(d)
          });
        }
      );
      console.log(this.users)

    },

  methods: {
    async requestUserData() {
      var res = await api.get('member/members', '');
      return res;
    },

    editItem (item) {
      this.$router.push({
        path: process.env.VUE_APP_MYPAGE_SETTINGS_INFO,
        query: {
          userId: item,
        },
      });
    },

    deleteItem (item) {
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.closeDelete()
    },

    closeDelete () {
      this.dialogDelete = false
    },
  },
}
</script>
