import { createStore } from "vuex";
import { layout } from "@/store/modules/layout";
import { info } from "@/store/modules/info";
import { url } from "@/store/modules/url";
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    modules: {layout, info, url},
    plugins: [createPersistedState({ // 저장되는 store 값.
        paths: ["info","url"]
    })]
})

export default store;
