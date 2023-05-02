<template>
    <v-card class="mx-auto justify-center rounded-lg" :class="props?.data?.selectionInfo ? 'gifted-card' : 'nongifted-card'"  variant="outlined" @click="handleCardClicked">
        <v-card-item class="pb-4">
            <div>
                <v-chip class="gifted-chip mb-2 d-flex" v-if="props?.data?.selectionInfo" variant="outlined"><img src="@/assets/images/icons/party-popper.svg" class="mr-2"/>카드 드립니다!!!</v-chip>
            </div>
            <div>
                <v-row>
                <v-col>
                    <div class="text-caption font-0000008F">{{ props?.data?.writerInfo?.name }}({{ props?.data?.writerInfo?.teamHierarchy[props?.data?.writerInfo?.teamHierarchy.length-1] }})</div>
                </v-col>
                <v-col cols="5" align="right" class="text-caption font-0000008F">{{ props?.data?.createDate }}</v-col>
                </v-row>
                <div class="text-h7 mt-3">{{ props?.data?.title }}</div>
                <div class="mt-2 mb-3 text-caption font-0000008F">{{ props?.data?.content }} 
                </div>
            </div>
                <v-chip class="mt-1" variant="outlined"><v-icon start icon="mdi-account-multiple-outline">
                    </v-icon>
                    <template v-for="team in props?.data?.projTeamInfo?.name">
                        {{  team }}
                    </template>
                </v-chip>
            <v-row class="mt-0">
                <v-col cols="2" class="center-container align-items-end">
                    <template v-if="props?.data?.likeYn"><v-icon size="small" color="red">mdi-heart</v-icon></template>
                    <template v-else><v-icon size="small">mdi-heart-outline</v-icon></template>
                    <span class="text-caption ml-1">{{ props?.data?.likeCnt }}</span>
                </v-col>
                <v-col cols="2" class="center-container justify-content-end"><v-icon size="small">mdi-message-text-outline</v-icon><span
                    class="text-caption ml-1">{{ props?.data?.comment }}</span></v-col>
                <v-col cols="8" class="d-flex justify-end"> 
                    <div v-if="props?.data?.selectionInfo == null">
                        <v-btn class="card_button mr-4 mb-4" @click="showDialog($event)">카드주기</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-card-item>
    </v-card>
</template>

<script setup>
    const props = defineProps({
    data: Object,
    });

    const emit = defineEmits(["handle-card-clicked","handle-card-dialog"]);

    // console.log(props.data);

    function handleCardClicked() {
    // emit은 dom을 이용하므로 대소문자 구별이 불가능함.
    emit("handle-card-clicked", props.data);
    };

    function showDialog(event) {
        emit("handle-card-dialog", props.data);
        event.stopPropagation(); // stop event propagation
        console.log('a')
    
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

    ::v-deep .v-chip.v-chip--size-default{
        font-size: 0.75rem !important;
    }

    .card_button{
        border-width: 1px;
        border-style: solid;
        border-color: black;
        background-color: black;
        color: white;
    }

    .v-col-2{
        padding-right: 0px !important; 
    }

    .v-col-8 {
        padding: 0px !important;
    }
</style>