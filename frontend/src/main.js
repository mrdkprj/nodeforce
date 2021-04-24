import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "@/store"
import jQuery from "jquery"
import GridTable from "./assets/js/gridtable.js";
global.GridTable = GridTable
import Tab from "./assets/js/tab.js";
global.Tab = Tab

Vue.config.productionTip = false

new Vue({
  router,
  store,
  components: { App },
  template: "<App />"
}).$mount("#app")
