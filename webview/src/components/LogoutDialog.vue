<template>
  <v-dialog v-model="dialog" @shown="init()" @hide="cancel()">
    <v-card>
      <v-card-text>
        {{title}}
      </v-card-text>
      <v-card-item>
        <v-checkbox v-show="simpleLogin" label="간편로그인 해제" v-model="isSimpleLogin"/>
      </v-card-item>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="cancel"
        >
          취소
        </v-btn>
        <v-btn
          color="green-darken-1"
          variant="text"
          @click="confirm"
        >
          확인
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>

import { computed, ref, watch,  toRef } from "vue";
import { useStore } from "vuex";

export default {
  name: 'LogoutDialog',
  props: {
    showDialog:{ type: Boolean, required: true, default: false},
    id: { type: String, default: 'logout-dialog' },
    title: { type: String, default: '로그아웃합니다' },
    message: String,
    buttonName: { type: String, default: '확인' }
  },
  watch:{
		showDialog(val){
      this.dialog = val
		},
  },
  setup(props){
    let isSimpleLogin = ref(false);
    let simpleLogin = ref(false);
    let dialog  = ref(false);
    return { isSimpleLogin, simpleLogin, dialog };
  },
  methods: {
    init(){
      if (this.$store.getters["info/infoLoginType"] === 'simpleLogin'){ // 간편 로그인
        // @TODO 간편로그인 연동 추가 이후 추가 필요.
        this.isSimpleLogin = true;
      }
    },
    confirm() {
      this.dialog = false;
      this.$emit('click-confirm', {'isSimpleLogin': this.isSimpleLogin , 'simpleLogin': this.simpleLogin});
    },
    cancel() {
      this.dialog = false;
      this.$emit('click-cancel', {});
    }
  }
}
</script>
