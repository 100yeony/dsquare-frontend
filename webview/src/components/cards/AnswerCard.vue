<template>
    <v-card class="mx-auto justify-center" variant="outlined" @click="handleCardClicked">
      <v-card-item>
        <div>
          <v-row>
            <v-col>
              <div class="text-caption font-0000008F">{{ props?.data?.question?.name }}({{ !props?.data?.question?.teamHierarchy ? [] : 
                props?.data?.question?.teamHierarchy[props?.data?.question?.teamHierarchy.length - 1] }})</div>
            </v-col>
            <v-col cols="5" align="right" class="text-caption font-0000008F">{{ props?.data?.createDate }}</v-col>
          </v-row>
          <div class="text-h7">
            <span class="text-primary">{{ props?.data?.question?.categoryName }}:</span> {{ props?.data?.question?.title }}
          </div>
          <div class="mt-2 mb-3 text-caption font-0000008F">내 답변: {{ props?.data?.content }}</div>
        </div>
        <v-row>
          <v-col cols="2" class="center-container align-items-end">
            <template v-if="props?.data?.likeYn"><v-icon size="small" color="red">mdi-heart</v-icon></template>
            <template v-else><v-icon size="small">mdi-heart-outline</v-icon></template>
            <span class="text-caption ml-1">{{ props?.data?.likeCnt }}</span></v-col>
          <v-col cols="2" class="center-container justify-content-end">
            <v-icon size="small">mdi-message-text-outline</v-icon>
            <span class="text-caption ml-1">{{ props?.data?.commentCnt }}</span></v-col>
          <v-col cols="8">
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </template>


  <script setup>
  const props = defineProps({
    data: Object,
  });
  const emit = defineEmits(["handle-card-clicked"]);
  
  function handleCardClicked() {
    // emit은 dom을 이용하므로 대소문자 구별이 불가능함.
    emit("handle-card-clicked", props.data);
  }
  </script>
  <style scoped>
  .v-chip.v-chip--size-default {
    font-size: 0.7rem !important;
  }
  
  .chip {
    border-width: 1px;
    border-style: solid;
    border-color: #EBE2FB;
    background-color: #EBE2FB;
    color: white;
  }
  
  .v-col-8 {
    padding-top: 0;
  }
  </style>