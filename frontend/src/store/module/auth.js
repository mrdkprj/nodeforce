export default {

    namespaced: true,

    state: {
        tenant: "",
        username: "",
        token: "",
        inprogress: false,
    },

    mutations: {

        create (state, data) {
            state.tenant = "";
            state.token = data.token;
            state.username = data.username;
            state.serverUrl = data.serverUrl;
        },

        destroy (state) {
            state.tenant = "";
            state.username = "";
            state.token = "";
            state.serverUrl = "";
        },

        request(state){
            state.inprogress = true;
        }
    },

    actions: {

        async create ({ commit, dispatch }, data) {
            return await dispatch("http/post", { url: "/login", data }, { root: true })
                        .then(res => commit("create", res.data))
                        .catch(ex => ex.message);

        },

        async destroy ({ commit, dispatch }, data) {
            return await dispatch("http/delete", { url: "/logout", data }, { root: true })
                        .then(res => {console.log("destroy done"); return commit("create", res.data);})
                        .catch(err => err)
                        .finally(res => commit("destroy"));
        },

        async request ({ commit, dispatch }, data) {
            console.log("request")
            return await dispatch("http/post", { url: data.url, data:data.data }, { root: true })
                        .then(res => res.data)
        },
    }
  }