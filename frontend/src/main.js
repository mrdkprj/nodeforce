import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import store from "@/store"
import jQuery from "jquery"
global.jQuery = jQuery
global.$ = jQuery
window.$ = window.jQuery = require("jquery")
require("./assets/js/bootstrap.js");
require("./assets/js/jquery-ui-1.11.3.min.js");
//require("./assets/js/ajaxUtils.js");
import {GridTable} from "./assets/js/GridTable.js";
global.GridTable = GridTable

Vue.config.productionTip = false
/*
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")*/
new Vue({
  router,
  store,
  components: { App },
  template: "<App />"
}).$mount("#app")
