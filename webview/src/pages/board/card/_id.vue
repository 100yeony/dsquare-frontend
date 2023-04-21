<template>
  <h4>Q&A 상세</h4>
  <h4>제목 : </h4>
  <h6>번호 : {{qnaId}} </h6>
  <body>내용 넣으세요</body>
</template>
<script>
export default {
    components: {
    },
    data() {
      return {
        qnaId: '',
      };
    },
  mounted(){
    if(!this.$route.query.id) { // work 값이 없으면.
      this.$router.replace(process.env.VUE_APP_BOARD)
    }
  },
};
</script>
