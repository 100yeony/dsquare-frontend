import api from '@/api';


const postUri = "/board/like";
const delUri = "/board/like";
const boardTypes = {
    // "절대절대절대 바뀌지 않을 키" : "바뀌는 부분"
    "question" : "question",
    "answer": "answer",
    "card": "card",
    "talk": "talk",
    "carrot": "carrot",
}


const fn = {
    async getBoardTypes(){
    /* 
        var res = await api.get(URI).then(
            (response) => {
                boardType에 저장
            }
        );
    */
    },

    async post(board, id) {
        var res = await api.post(postUri, {
            boardType: boardTypes[board],
            postId: id,
        });
        return res;
    },

    async del(board, id) {
        var res = await api.del(delUri, {
            boardType: boardTypes[board],
            postId: id,
        });
        return res;
    },
}

export default fn;