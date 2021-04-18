<template>
    <div id="loginFormArea">
        <div id="flashArea">
            <div id="flashMessage" class="alert">{{message}}</div>
        </div>

        <div class="login-form">
            <form class="form">
                <div class="input-area">
                    <div class="login-form-label">
                        <div>User Name</div>
                        <div class="login-form-element">
                            <input type="text" id="username" value="" v-model="username"/>
                        </div>
                    </div>
                    <div class="login-form-label">
                        <div>Password</div>
                        <div class="login-form-element">
                            <input type="password" id="password" value="" v-model="password"/>
                        </div>
                    </div>
                    <div class="login-form-element">
                        <div>Environment</div>
                        <div class="selection">
                            <div class="radio selected">Production<input type="radio" name="envtype"/></div>
                            <div class="radio selected">Sandbox<input type="radio" name="envtype"/></div>
                        </div>
                    </div>
                </div>
                <div class="button-area">
                    <button class="btn login-btn" @click="login()">Login</button>
                </div>
            </form>
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
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: #f3f3f4;
    position: fixed;
    margin: 0;
    padding: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

#flashMessage{
    text-align:center;
    padding:5px;
    display:block;
    background-color:#f0ad4e;
}

.login-form{
    width: 400px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #0c549c;
    border: 1px solid #b9b7b7;
    border-radius: 6px;
    box-shadow: 0 3px 6px rgb(0 0 0 / 23%);
    color: #e1e0e0;
}

.form{
    display: flex;
    justify-content: center;
    flex-direction: column;
    height: 100%;
}

.input-area{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 60%;
}

.button-area{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20%;
}

.login-form input[type=text],
.login-form input[type=password]{
    border: 1px solid #888;
    line-height: 35px;
    font-size: 14px;
    height: 35px;
    border-radius: 4px;
    text-indent: 5px;
    width: 300px;
}

.login-form-label{
    white-space: nowrap;
    font-size: 14px;
}

.login-form-element{
font-size: 14px;
}

.selection{
    width: 100%;
    border-radius: 4px;
    display: flex;
    height: 35px;
}

.radio{
    width: 50%;
    border-right: 1px solid #888;
    background: #dadcdc;
    box-shadow: inset 2px 3px 2px rgb(0 0 0 / 23%);
    border-radius: 4px 0px 0 4px;
}

.selected{
    background: #fff;
    box-shadow: 2px 3px 2px rgb(0 0 0 / 23%);
}

.radio:last-of-type{
    border-right: none;
    border-radius: 0px 4px 4px 0;
}

input[type=radio]{
    height:0;
    width:0;
    opacity: 0;
}

.login-btn{
    padding: 1px 5px;
    font-size: 20px;
    line-height: 40px;
    border-radius: 3px;
    color: #333;
    background-color: #fff;
    border-color: #ccc;
    width: 200px;
    height: 40px;
}

</style>