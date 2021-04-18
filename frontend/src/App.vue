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
    @import "./assets/css/gridtable.css";
    @import "./assets/css/tab.css";
</style>