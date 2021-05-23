import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"
import auth from "@/store/module/auth"
import http from "@/store/module/http"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth:auth,
        http:http
    },
    getters: {
        isAuthenticated: state => !!state.auth.username,
        inProgress: state => state.http.inprogress,
        currentUser: state => state.auth.username,
    },
    plugins: [createPersistedState({
        key: "sf.node.app",     // プロジェクト単位の一意の識別子
        storage: window.sessionStorage,
    })]
})