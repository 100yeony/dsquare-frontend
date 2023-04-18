<template>
    <v-card class="mx-auto justify-center rounded-lg" :class="props?.data?.gifted ? 'gifted-card' : 'nongifted-card'"  variant="outlined" @click="handleCardClicked">
        <v-card-item class="pb-4">
            <div>
                <v-chip class="gifted-chip mb-2 w-100" v-if="props?.data?.gifted" variant="outlined"><img src="@/assets/images/icons/party-popper.svg" class="mr-2"/>카드 드립니다!!!</v-chip>
            </div>
            <div>
                <v-row>
                <v-col cols="8" class="text-h7">{{ props?.data?.title }}</v-col>
                <v-col cols="4" class="text-caption font-0000008F">{{ props?.data?.date }}</v-col>
                </v-row>
                <div class="mt-2 mb-3 text-caption font-0000008F">{{ props?.data?.content }} 
                </div>
            </div>
            <v-chip class="mt-2" variant="outlined"><v-icon start icon="mdi-account-multiple-outline"></v-icon>{{props?.data?.members}}</v-chip>
            <v-row class="mt-2">
                <v-col cols="3" class="center-container align-items-end"><v-icon size="small">mdi-heart-outline</v-icon><span
                    class="text-caption ml-1">{{ props?.data?.like }}</span></v-col>
                <v-col cols="3" class="center-container justify-content-end"><v-icon size="small">mdi-message-text-outline</v-icon><span
                    class="text-caption ml-1">{{ props?.data?.comment }}</span></v-col>
                <v-col cols="6">
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

    // console.log(props.data);

    function handleCardClicked() {
    // emit은 dom을 이용하므로 대소문자 구별이 불가능함.
    emit("handle-card-clicked", props.data);
    }
</script>

<style scoped>
    .gifted-chip {
        background: #FED999;
        border-color: transparent;
    }

    .gifted-card {
        background: #FFF2DC;
    }

    .nongifted-card {
        background: white;
    }
</style>