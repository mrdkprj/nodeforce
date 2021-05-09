import Vue from "vue"
import Vuex from "vuex"
import createPersistedState from "vuex-persistedstate"
import * as Cookies from "js-cookie"
import auth from "@/store/module/auth"
import http from "@/store/module/http"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth:auth,
        http:http
    },
    getters: {
        isAuthenticated: state => !!state.auth.token,
        inProgress: state => state.http.inprogress,
        currentUser: state => state.auth.username,
    },
    plugins: [createPersistedState({
        key: "xxxproject",     // プロジェクト単位の一意の識別子
        storage: {
            getItem: key => Cookies.get(key),
            setItem: (key, value) =>
              Cookies.set(key, value, { expires: 1, secure: true, sameSite: 'strict' }),
            removeItem: key => Cookies.remove(key),
        },
    })]
})