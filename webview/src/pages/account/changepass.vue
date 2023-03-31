
<script>
export default {
};
</script>
<template>
    <v-container class="pw-100 ph-100">
        <v-row class="ph-100">
            <v-col class="pw-100" align-self="center">
                <v-container class="pw-90">
                    <h2 class="text-primary text-center mb-5">비밀번호 변경</h2>
                    <div class="pph-10 text-center font-sm mb-5">
                        비밀번호를 변경하신 지 90일이 경과하였습니다.
                        회원님의 소중한 정보를 안전하게 보호하기 위해 정기적으로
                        비밀번호 변경을 요청드리고 있습니다.
                    </div>
                    <v-card>
                        <v-col>
                            <v-text-field prepend-inner-icon="mdi-lock" type="password" label="현재 비밀번호" v-model="password"
                                :class="{ 'is-invalid': submitted && v$.password.$error }" class="font-sm">
                            </v-text-field>
                            <v-text-field prepend-inner-icon="mdi-lock" type="password" label="새로운 비밀번호" v-model="password"
                                :class="{ 'is-invalid': submitted && v$.password.$error }" class="font-sm">
                            </v-text-field>
                            <v-text-field prepend-inner-icon="mdi-lock" type="password" label="비밀번호 확인" v-model="password"
                                :class="{ 'is-invalid': submitted && v$.password.$error }" class="font-sm">
                            </v-text-field>
                            <div v-if="submitted && v$.password.required.$invalid" class="invalid-feedback font-sm">
                                비밀번호를 입력해주세요.
                            </div>

                        </v-col>
                    </v-card>
                    <v-btn type="submit" class="font-sm pph-50 mt-5">비밀번호 변경</v-btn>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>
<style lang="scss" module></style>