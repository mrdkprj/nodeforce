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
        isAuthenticated: state => !!state.auth.username && new Date(state.auth.limit) > new Date(),
        inProgress: state => state.http.inprogress,
        currentUser: state => state.auth.username,
    },
    plugins: [createPersistedState({
        key: "sf.node.app",
        paths: ['auth.username',"auth.limit", "auth.list"],
        storage: window.sessionStorage,
    })]
})