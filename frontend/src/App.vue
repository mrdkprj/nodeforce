<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  computed: {
    token () {
      return this.$store.state.auth.token
    }
  },

    watch: {
    token (newToken) {
      console.log("token")
      //this.$router.push('/')
    if (this.$store.state.auth.token) {
      this.$router.push('/')
    }else{
      this.$router.push('/login')
    }
    }
  }
};
</script>

<style>
    @import "https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/themes/smoothness/jquery-ui.css";
    @import "https://stackpath.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    @import "./assets/css/common.css";
    @import "./assets/css/main.css";
    @import "./assets/css/GridTable.css";
</style>