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
            try{
                commit("request");
                const res = await dispatch("http/post", { url: "/login", data }, { root: true });
                commit("create", res.data);
            }finally{
                commit("end")
            }
        },

        async request ({ commit, dispatch }, data) {
            try{
                commit("request");
                const res = await dispatch("http/post", { url: data.url, data:data.data }, { root: true });
                return res.data;
            }finally{
                commit("end");
            }
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