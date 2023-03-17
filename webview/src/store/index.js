import { createStore } from "vuex";
import { layout } from "@/store/modules/layout";
import { info } from "@/store/modules/info";
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    modules: {layout, info},
    plugins: [createPersistedState({
        paths: ["info"]
    })]
})

export default store;
