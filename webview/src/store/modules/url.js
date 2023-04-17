export const url = {
    namespaced: true,
    state: () => ({
        urlBack: '',
        urlQuery: {}
    }),
    mutations: {
        SET_URL_BACK(state, value) {
            state.urlBack = value;
        },
        SET_URL_QUERY(state, value) {
            state.urlQuery = value;
        }
    },
    getters: {
        urlBack(state, getters, rootState) {
            return state.urlBack;
        },
        urlQuery(state, getters, rootState) {
            return state.urlQuery;
        }
    },
    actions: {
        setUrlBack({ state, commit, rootState }, value) {
            console.log(value)
            commit('SET_URL_BACK', value)
        },
        setUrlQuery({state, commit, rootState }, value) {
            commit('SET_URL_QUERY', value)
        }
    }
};
