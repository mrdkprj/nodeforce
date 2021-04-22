<template>
    <div id="loginFormArea">
        <div id="loginMessageArea" v-show="hasError">
            <div id="loginMessage">{{message}}</div>
        </div>

        <div class="login-form">
            <form @submit.prevent>
            	<div class="padding-area"></div>
                <div class="input-area">
                    <div>
                        <div>User Name</div>
                        <div><input type="text" id="username" value="" v-model="username"/></div>
                    </div>
                    <div>
                        <div>Password</div>
                        <div><input type="password" id="password" value="" v-model="password"/></div>
                    </div>
                    <div>
                        <div>Environment</div>
                        <div class="selection">
                            <input type="radio" id="production" name="envtype" checked/><label for="production" class="radio">Production</label>
                            <input type="radio" id="sandbox" name="envtype"/><label for="sandbox" class="radio">Sandbox</label>
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
            username: "",
            password: "",
        }
    },

    computed: {
        hasError: function(){
            if(this.message){
                return true;
            }

            return false;
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
            ).then(e => {this.message = e;})
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

    #loginMessageArea{
        padding: 5px;
        display: block;
        background-color: #1d274a;
        position: fixed;
        top: 5%;
        left: 0;
        width: 100%;
        color: #fff;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        font-size: 14px;
        /*height: 52px;*/
    }

    #loginMessage{
        width: 35%;
        margin: 0 auto;
        padding: 5px 0;
        text-align: center;
    }

    .login-form{
        position: fixed;
        top: 25%;
        width:390px;
        min-width:300px;
        height: 40%;
        min-height:300px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #0c549c;
        border: 1px solid #b9b7b7;
        border-radius: 6px;
        box-shadow: 0 3px 6px rgb(0 0 0 / 23%);
        color: #e1e0e0;
    }

    form{
        display: flex;
        justify-content: center;
        flex-direction: column;
        height: 100%;
        padding: 0 28px;
        width:100%;
        margin: 0;
    }

    .padding-area{
        height:10%;
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
        height: 30%;
    }

    .login-form input[type=text],
    .login-form input[type=password]{
        border: 1px solid #888;
        line-height: 35px;
        font-size: 14px;
        height: 35px;
        border-radius: 4px;
        text-indent: 5px;
        width:100%;
    }

    .selection{
        width: 100%;
        border-radius: 4px;
        display: flex;
        height: 35px;
    }

    .radio{
        position:relative;
        width: 50%;
        border-right: 1px solid #888;
        background: #dadcdc;
        box-shadow: inset 3px 3px 3px 2px rgb(0 0 0 / 23%);
        border-radius: 4px 0px 0 4px;
    }

    .radio:last-of-type{
        border-right: none;
        border-radius: 0px 4px 4px 0;
    }

    input[type=radio]{
        height:0;
        width:0;
        opacity: 0;
        position:fixed;
        top:-100px;
        left:-100px;
    }

    label{
        width: 100%;
        height: 35px;
        vertical-align: middle;
        text-align: center;
        line-height: 35px;
        color:#424141;
        cursor:pointer;
    }

    input[type=radio]:checked + .radio{
        box-shadow: none;
        background-color:#fff;
        color:#424141;
        background: linear-gradient( 180deg , #ffffff 80%, #d9d9f5 100%)
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
        font-size:18px;
    }

    .login-btn:hover{
        background-color: #083d71;
        color: #fff;
        border: 1px solid #ccc;
        background: #1579c0;
    }

    input:active,
    input:focus{
        outline:none;
    }

</style>