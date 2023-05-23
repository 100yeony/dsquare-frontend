export const url = {
    namespaced: true,
    state: () => ({
        urlBack: '',
    }),
    mutations: {
        SET_URL_BACK(state, value) {
            state.urlBack = value;
        },
    },
    getters: {
        urlBack(state, getters, rootState) {
            return state.urlBack;
        },
    },
    actions: {
        setUrlBack({ state, commit, rootState }, value) {
            console.log(value)
            commit('SET_URL_BACK', value)
        },
    }
};
