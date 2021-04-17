import axios from 'axios'

export default {
    namespaced: true,

    actions: {
        async request ({ dispatch, rootState }, { method, url, data, error }) {
            const headers = {}
            headers['Content-Type'] = 'application/json'
            if (rootState.auth.token) {
                headers['Authorization'] = rootState.auth.token
                headers['User-Id'] = rootState.auth.username
                headers["Server-Url"] = rootState.auth.serverUrl
            }

            const options = {
                method,
                url,
                headers,
                data,
                timeout: 15000
            }

            console.log("ax")

            return await axios(options)
                .then(res => {console.log("res" + res);return res;})
                .catch(e => {console.log(e);throw new Error(e.response.data)}
                )

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