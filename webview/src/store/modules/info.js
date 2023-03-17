export const info = {
  namespaced: true,
  state: () => ({
      token: '',
  }),
  mutations: {
    SET_INFO_TOKEN(state,value){
      state.token = value;
    },
  },
  getters: {
    infoToken(state, getters, rootState){
      return state.token;
    },
  },
  actions: {
    setInfoToken({state, commit, rootState}, value) {
      console.log(value)
      commit('SET_INFO_TOKEN', value)
    },
  }
};
