<template>
  <v-card class="mx-auto justify-center" variant="outlined" @click="handleCardClicked">
    <v-card-item>
      <div>
        <div class="text-h7">
          <span class="text-primary">{{ props?.data?.category.name }}:</span> {{ props?.data?.title }}
        </div>
        <div class="text-caption font-0000008F">{{ props?.data?.writerInfo.name }} ({{ props?.data?.writerInfo.teamHierarchy[props?.data?.writerInfo.teamHierarchy.length - 1] }}) · {{ props?.data?.createDate }}
        </div>
      </div>
      <v-slide-group>
        <v-slide-group-item v-for="(chip, index) in props?.data?.hash" :key="index">
          <v-chip class="ma-2">#{{ chip }}</v-chip>
        </v-slide-group-item>
      </v-slide-group>
      <v-row>
        <v-col cols="6">
          <v-chip class="ma-2" color="primary" v-if="props?.data?.success">
            <v-icon start icon="mdi-account-check"></v-icon> 담당자 답변완료
          </v-chip>
        </v-col>
        <v-col cols="3" class="center-container align-items-end"><v-icon size="small">mdi-heart-outline</v-icon><span
            class="text-caption ml-1">{{ props?.data?.like }}</span></v-col>
        <v-col cols="3" class="center-container justify-content-end"><v-icon size="small">mdi-message-text-outline</v-icon><span
            class="text-caption ml-1">{{ props?.data?.comment }}</span></v-col>
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