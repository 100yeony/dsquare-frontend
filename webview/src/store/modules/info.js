import { NativeValueDto } from "@/class/NativeValueDto";

export const info = {
  namespaced: true,
  state: () => ({
      list: [],
      area: {
        areaList: [],
        subAreaList: []
      },
      user: {
        userId: '',
        role: [], 
      },
      pageState: {

      },
      infoSvcType: '',
      waitingNum: 0

  }),
  mutations: {
    SET_INFO_WAITING_NUM(state, value){
      console.log('change_waiting_num', value)
      state.waitingNum = value
    },
    SET_INFO_SVC_TYPE(state, value){
      state.infoSvcType = value
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
    SET_INFO_LIST_BLANK(state){
      state.list = []
    },
    SET_INFO_AREA(state, value){
      //추후 api 와 연동
      state.area.areaList = value.value1;
      state.area.subAreaList = value.value2;
    },
    SET_INFO_USER(state, value){
      state.user = value 
    },
    SET_INFO_PAGE_STATE(state, value){
      state.pageState = value
    }
  },
  getters: {
    infoListByKey: (state) => (key) => {
      console.log(key)
      return state.list.find(item => item.key === key)
    },
    infoArea(state){
      return state.area;
    },
    infoUser(state){
      return state.user;
    },
    infoPageState(state){
      return state.pageState;
    },
    infoSvcType(state){
      return state.infoSvcType;
    },
    infoWaitingNum(state){
      return state.waitingNum 
    }
  },
  actions: {
    setInfoValue({state, commit, rootState}, value) {
      console.log(value)
      commit('SET_INFO_VALUE', value)
    },
    setInfoListBlank({state, commit, rootState}) {
      commit('SET_INFO_LIST_BLANK')
    },
    setInfoArea({state, commit, rootState}, value) {
      //추후 api 와 연동
      commit('SET_INFO_AREA', value)
    },
    setInfoUser({state, commit, rootState}, value) {
      commit('SET_INFO_USER', value)
    },
    setPageState({state, commit, rootState}, value) {
      commit('SET_INFO_PAGE_STATE', value)
    },
    setInfoSvcType({state, commit, rootState}, value) {
      commit('SET_INFO_SVC_TYPE', value)
    },
    setInfoWaitingNum({state, commit, rootState}, value) {
      commit('SET_INFO_WAITING_NUM', value)
    }
  }
};
