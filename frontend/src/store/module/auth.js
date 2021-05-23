export default {

    namespaced: true,

    state: {
        username: "",
    },

    mutations: {

        create (state, data) {
            state.username = data.username;
        },

        destroy (state) {
            state.username = "";
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