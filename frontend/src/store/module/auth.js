export default {

    namespaced: true,

    state: {
        token: "",
        username: "",
        serverUrl: "",
    },

    mutations: {

        create (state, data) {
            state.token = data.token;
            state.username = data.username;
            state.serverUrl = data.serverUrl;
        },

        destroy (state) {
            state.token = "";
            state.username = "";
            state.serverUrl = "";
        },

    },

    actions: {

        async create ({ commit, dispatch }, data) {
            const res = await dispatch("http/post", { url: "/login", data }, { root: true });
            commit("create", res.data);
        },

        async request ({ dispatch }, data) {
            const res = await dispatch("http/post", { url: data.url, data:data.data }, { root: true });
            return res.data;
        },

        async destroy ({ commit, dispatch }, data) {

            try{
                return await dispatch("http/delete", { url: "/logout", data }, { root: true });
            }catch(ex){

            }finally{
                commit("destroy")
            }
        },
    }
  }