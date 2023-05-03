<template>
    <v-card class="mx-auto justify-center" variant="outlined" @click="handleCardClicked">
        <v-card-item>
            <div>
                <div class="text-primary mb-1">[{{ boardtypeToName(props?.data?.boardType) }}] </div>
                <v-row>
                    <v-col>
                        <div class="text-caption font-0000008F">{{ props?.data?.post?.name }}({{
                            !props?.data?.post?.teamHierarchy ? [] :
                            props?.data?.post?.teamHierarchy[props?.data?.post?.teamHierarchy.length - 1] }})</div>
                    </v-col>
                    <v-col cols="5" align="right" class="text-caption font-0000008F">{{ props?.data?.createDate }}</v-col>
                </v-row>

                <div class="text-h7">
                    <template v-if="props?.data?.boardType === 'QUESTION'">
                        <span class="text-primary">{{ props?.data?.post?.categoryName }}:</span>
                    </template>
                    {{ props?.data?.post?.title }}
                </div>
                <div class="mt-2 text-caption font-0000008F">내 댓글: {{ props?.data?.content }}</div>
            </div>
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

function boardtypeToName(type) {
    var maps = {
        QUESTION: "궁금해요",
        ANSWER: "답변",
        CARD: "카드주세요",
        TALK: "소통해요",
        CARROT: "당근해요",
    }
    return maps[type];
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