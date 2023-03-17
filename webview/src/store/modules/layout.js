export const layout = {
    namespaced: true,
    state: () => ({
        menuTitle: '',
        menuOpen: false
    }),
    mutations: {
        SET_MENU_TITLE(state,value){
            state.menuTitle = value;
        },
        SET_MENU_OPEN(state, value){
            state.menuOpen = value;
        }
    },
    getters: {
        menuTitle(state, getters, rootState){
            return state.menuTitle;
        },
        menuOpen(state, getters, rootState){
            return state.menuOpen;
        }
    },
    actions: {
        setMenuTitle({state, commit, rootState}, value) {
            console.log(value)
                commit('SET_MENU_TITLE', value)
        },
        // setMenuOpen(state, commit, rootState, value) {
        //     if(typeof value ===  'boolean') {
        //         commit('SET_MENU_OPEN', value)
        //     }
        // },
    }
};
