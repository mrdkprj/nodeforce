import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"

import auth from "@/store/module/auth"
import http from "@/store/module/http"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth,
        http
    },
    plugins: [createPersistedState({
        key: "xxxproject",     // プロジェクト単位の一意の識別子
        //paths: ["auth.login"], // auth.js の loginキーは再度アクセスしても保持するようにする
        //storage: localStorage  // 今回は localStorage に保存することにする
        storage: window.sessionStorage
    })]
})