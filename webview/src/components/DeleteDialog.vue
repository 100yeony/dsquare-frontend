<template>
  <v-dialog v-model="dialog" @shown="init()" @hide="cancel()">
    <v-card>
      <v-card-text>
        {{ title }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="cancel">
          취소
        </v-btn>
        <v-btn color="green-darken-1" variant="text" @click="confirm">
          확인
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>

import { computed, ref, watch, toRef } from "vue";
import { useStore } from "vuex";

export default {
  name: 'DeleteDialog',
  props: {
    isShow: { type: Boolean, required: true, default: false },
    title: { type: String, default: '' },
    message: String,
    buttonName: { type: String, default: '확인' }
  },
  watch: {
    isShow(val) {
      this.dialog = val
    },
  },
  setup() {
    let dialog = ref(false);
    return { dialog };
  },
  methods: {
    init() {
    },
    confirm() {
      this.dialog = false;
      this.$emit('click-confirm', {});
    },
    cancel() {
      this.dialog = false;
      this.$emit('click-cancel', {});
    }
  }
}
</script>
