export const info = {
  namespaced: true,
  state: () => ({
      token: '',
      list: [],
      area: {
        areaList: [],
        subAreaList: []
      },
  }),
  mutations: {
    SET_INFO_TOKEN(state,value){
      state.token = value;
    },
    SET_INFO_VALUE(state, value){
      let inputKey = value?.key;
      let isEdit = false;
      for(let i=0;i<state.list.length;i++) {
        if(state.list[i].key === inputKey) {
          state.list[i].value = value?.value;
          state.list[i].type = value?.type;
          state.list[i].preference = value?.preference;
          isEdit = true;
          break;
        }
      }
      if(!isEdit){
        state.list.push(value)
      }
    },
    SET_INFO_AREA(state, value){
      //추후 api 와 연동
      state.area.areaList = value.value1;
      state.area.subAreaList = value.value2;
    }
  },
  getters: {
    infoToken(state, getters, rootState){
      return state.token;
    },
    infoListByKey: (state) => (key) => {
      console.log(key)
      return state.list.find(item => item.key === key)
    },
    infoArea(state){
      return state.area;
    }
  },
  actions: {
    setInfoToken({state, commit, rootState}, value) {
      console.log(value)
      commit('SET_INFO_TOKEN', value)
    },
    setInfoValue({state, commit, rootState}, value) {
      console.log(value)
      commit('SET_INFO_VALUE', value)
    },
    setInfoArea({state, commit, rootState}, value) {
      //추후 api 와 연동
      commit('SET_INFO_AREA', value)
    }
  }
};
