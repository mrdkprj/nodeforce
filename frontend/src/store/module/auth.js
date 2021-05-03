export default {

    namespaced: true,

    state: {
        username: "",
        token: "",
        inprogress: false,
    },

    mutations: {

        create (state, data) {
            state.token = data.token;
            state.username = data.username;
            state.serverUrl = data.serverUrl;
        },

        destroy (state) {
            state.username = "";
            state.token = "";
            state.serverUrl = "";
        },

        request(state){
            state.inprogress = true;
        },

        end(state){
            state.inprogress = false;
        }
    },

    actions: {

        async create ({ commit, dispatch }, data) {
            commit("request");

            return await dispatch("http/post", { url: "/login", data }, { root: true })
                        .then(res => commit("create", res.data))
                        .finally(() => commit("end"))

        },

        async destroy ({ commit, dispatch }, data) {
            return await dispatch("http/delete", { url: "/logout", data }, { root: true })
                        .then(res => res)
                        .catch(err => err)
                        .finally(() => commit("destroy"));
        },

        async request ({ commit, dispatch }, data) {
            commit("request");

            return await dispatch("http/post", { url: data.url, data:data.data }, { root: true })
                        .then(res => res.data)
                        .finally(() => commit("end"))
        },
    }
  }