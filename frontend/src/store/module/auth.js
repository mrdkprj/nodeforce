export default {

    namespaced: true,

    state: {
        username: "",
        limit: new Date(),
        list: {},
    },

    mutations: {

        create (state, data) {
            state.username = data.username;
            state.limit = new Date(data.limit);
        },

        udpate (state, data){
            state.limit = new Date(data.limit);

            if(data.list){
                state.list = data.list;
            }
        },

        destroy (state) {
            state.username = "";
            state.limit = new Date();
            state.list = {};
        },

    },

    actions: {

        async create ({ commit, dispatch }, data) {
            const res = await dispatch("http/post", { url: "/login", data }, { root: true });
            commit("create", res.data);
        },

        async request ({ commit, dispatch }, data) {
            const res = await dispatch("http/post", { url: data.url, data:data.data }, { root: true });
            commit("udpate", res.data);
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