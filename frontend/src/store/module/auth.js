export default {

    namespaced: true,

    state: {
        username: "",
        limit: new Date(),
    },

    mutations: {

        create (state, data) {
            state.username = data.username;
            state.limit = new Date(data.limit);
        },

        udpate (state, data){
            state.limit = new Date(data.limit);
        },

        destroy (state) {
            state.username = "";
            state.limit = new Date();
        },

    },

    actions: {

        async create ({ commit, dispatch }, data) {
            const res = await dispatch("http/post", { url: "/login", data }, { root: true });
            commit("create", res.headers);
        },

        async request ({ commit, dispatch }, data) {
            const res = await dispatch("http/post", { url: data.url, data:data.data }, { root: true });
            commit("udpate", res.headers);
            return res.data;
        },

        async destroy ({ commit, dispatch }, data) {
            commit("destroy");
            try{
                return await dispatch("http/delete", { url: "/logout", data }, { root: true });
            }catch(ex){

            }
        },
    }
  }