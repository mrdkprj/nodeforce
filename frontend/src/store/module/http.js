import axios from 'axios'

export default {

    namespaced: true,

    state: {
        inprogress: false,
    },

    mutations: {

        start(state){
            state.inprogress = true;
        },

        end(state){
            state.inprogress = false;
        }
    },

    actions: {
        async request ({ commit, rootState }, { method, url, data }) {
            const headers = {}
            headers['Content-Type'] = 'application/json'

            const options = {
                method,
                url,
                headers,
                data,
                timeout: 15000,
            }

            try{
                commit("start");
                return await axios(options);
            }catch(ex){
                throw new Error(ex.response.data)
            }finally{
                commit("end");
            }

        },

        async post ({ dispatch }, requests) {
            requests.method = 'post'
            return await dispatch('request', requests)
        },

        async delete ({ dispatch }, requests) {
            requests.method = 'delete';
            return await dispatch('request', requests);
        }
  }
}