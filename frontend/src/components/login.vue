<template>
<div>
    <div id="menuList">
        <ul></ul>
    </div>

    <div id="loginSpaceArea"></div>

    <div id="flashArea">
        <div id="flashMessage" class="alert">{{message}}</div>
    </div>

    <div id="loginArea">
        <div id="loginFormArea">
            <form>
                <div class="tbl login-form-table">
                    <div class="row">
                        <div class="login-form-label">
                            <lable>User Name:</lable>
                        </div>
                        <div class="login-form-element">
                            <input type="text" id="username" value="" v-model="username"/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="login-form-label">
                            <lable>Password:</lable>
                        </div>
                        <div class="login-form-element">
                            <input type="text" id="password" value="" v-model="password"/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="login-form-label">
                            <label>Sandbox:</label>
                        </div>
                        <div class="login-form-element">
                            <input type="checkbox" id="sandbox"/>
                        </div>
                    </div>
                    <div class="row">
                        <div class="login-form-label"></div>
                        <div id="loginButtonArea">
                            <button class="btn btn-primary btn-sm" @click="login()">Login</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
</template>

<script>
export default {
    data () {
        return {
            message: "",
            username: "a",
            password: "b"
        }
    },
    methods: {
        login () {
            this.$store.dispatch(
                "auth/create",
                {
                    username: this.username,
                    password: this.password
                }
            ).then(e => {console.log("eee");console.log(e);this.message = e;})
        }
    },
    /*
    computed: {
        token () {
        return this.$store.state.auth.token
        }
    },*/

    created: function () {
        console.log("login created")
        //this.$store.dispatch("auth/destroy")
        // already logined
        if (this.$store.state.auth.token) {
        this.$router.push("/")
        }
    },
    /*
    watch: {
        token (newToken) {
        console.log("token")
        this.$router.push("/")
        }
    }*/
    }
</script>

<style scoped>

#loginFormArea{
    padding-top: 20px;
    margin: 0 auto;
}

#flashMessage{
    text-align:center;
    padding:5px;
    display:block;
    background-color:#f0ad4e;
}

#loginSpaceArea{
    height:50px;
}

#loginButtonArea{
    padding-top: 10px;
    padding-bottom: 2px;
    width: 60%;
    text-align: left;
    vertical-align: middle;
}

.login-form-table{
    margin: 0 auto;
    width: 100%;
}

.login-form-label{
    padding-top: 2px;
    padding-bottom: 2px;
    padding-right: 10px;
    width: 40%;
    text-align: right;
    vertical-align: middle;
    white-space: nowrap;
}

.login-form-element{
    padding-top: 2px;
    padding-bottom: 2px;
    width: 60%;
    text-align: left;
    vertical-align: middle;
}

</style>