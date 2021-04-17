<template>
    <div class="btn-group">
        <button id="username" class="btn btn-secondary btn-sm dropdown-toggle dropdown-btn paper-raise"
         type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{currentUser}}</button>
        <ul id="dropdownMenu" class="dropdown-menu">
            <li class="dropdown-submenu">
                <a id="changeLocale" href="javascript:void(0)">Locale Option</a>
                <ul class="dropdown-menu locale-options">
                    <li><a href="javascript:void(0)" locale-option="ja">Japanese</a></li>
                    <li><a href="javascript:void(0)" locale-option="en_US">English</a></li>
                </ul>
            </li>
            <li><a id="refreshSObjects" href="javascript:void(0)" action="<%= refresh_sobjects_path() %>">Refresh sObjects</a></li>
            <li><a id="refreshMetadata" href="javascript:void(0)" action="<%= refresh_metadata_path() %>">Refresh Metadata</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="javascript:void(0)" @click="logout()">Logout</a></li>
        </ul>
    </div>
</template>

<script>

export default {

    data: function () {
        return {
            currentUser: this.$store.state.auth.username,
            users: []
        }
    },

    methods: {

        logout: function(){
            console.log("destroy")
            //this.$store.dispatch('auth/destroy').then(res => {console.log(res);this.$router.push('/login');})
            this.$store.dispatch('auth/destroy')//.then(res => res)
            //const res = this.$store.dispatch('auth/destroy');
            //this.$store.state.auth.token = "";
            //this.$store.dispatch('auth/destroy')
            console.log("destroy and push")


        },

        onDropdownClick: function(e){
            if($.isAjaxBusy()){
                return false;
            }

            const selectedUser = e.target.text.trim();

            if(this.user == selectedUser){
                return false;
            }

            this.currentUser = selectedUser;

            this.updateCurrentUser();
        },

        prepareUser: function(){
            const options = $.getAjaxOptions("/init", "GET", {}, "", null);
            const callbacks = $.getAjaxCallbacks(this.displayUsers, this.displayUsers, null);
            $.executeAjax(options, callbacks);
        },

        updateCurrentUser: function(){
            const options = $.getAjaxOptions("/user", "POST", {currentUser: this.currentUser}, "", null);
            const callbacks = $.getAjaxCallbacks(() => {}, () => {}, null);
            $.executeAjax(options, callbacks);
        },

        displayUsers: function(json){
            this.currentUser = json.currentUser;
            this.users = json.users;
        }
    },

    created (){
        //this.prepareUser();
    }

}
</script>

<style scoped>
    #username{
        margin-left:10px;
        margin-top:7px;
        line-height: 1.35 !important;
    }

    .dropdown-menu>li>a{
        font-size:12px;
    }

    .dropdown-item-font{
        font-size: 0.875rem;
    }

    .dropdown-btn:hover{
        color: black;
    }

    .disabled-dropdown{
        color: #bdbcbc;
    }

    .header{
        position: fixed;
        top:0px;
        height: 45px;
        z-index: 3000;
        width: 100%;
    }

    .dropdown-btn{
        text-decoration: none;
        color: black;
        background-color: white;
        border-radius: 12px;
        border: #aaa 1px solid;
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, .175);
    }

    .dropdown-submenu {
        position: relative;
    }

    .dropdown-submenu>.dropdown-menu {
        top: 5px;
        left: 100%;
        margin-top: -6px;
        margin-left: -1px;
        -webkit-border-radius: 0 6px 6px 6px;
        -moz-border-radius: 0 6px 6px;
        border-radius: 0 6px 6px 6px;
    }

    .dropdown-submenu:hover>.dropdown-menu {
        display: block;
    }

    .dropdown-submenu>a:after {
        display: block;
        content: " ";
        float: right;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
        border-width: 5px 0 5px 5px;
        border-left-color: #000;
        margin-top: 2px;
        margin-right: -10px;
    }

    .dropdown-submenu:hover>a:after {
        border-left-color: #aaa;
    }

    .dropdown-submenu.pull-left {
        float: none;
    }

    .dropdown-submenu.pull-left>.dropdown-menu {
        left: -100%;
        margin-left: 10px;
        -webkit-border-radius: 6px 0 6px 6px;
        -moz-border-radius: 6px 0 6px 6px;
        border-radius: 6px 0 6px 6px;
    }

    .dropdown-submenu>.dropdown-menu a{
        padding-left: 25px;
    }

    .checkmark{
        position: relative;
        display: inline-block;
        padding-left: 15px;
    }

    .checkmark:before,
    .checkmark:after {
        position: absolute;
        content: "";
        display: inline-block;
    }

    /*Outer box of the fake checkbox*/
    .checkmark:before{
        height: 5px;
        width: 9px;
        border-left: 2px solid #aaa;
        border-bottom: 2px solid #aaa;
        transform: rotate(-45deg);
        left: 10px;
        top: 7px;
    }

    /*Checkmark of the fake checkbox*/
    .checkmark:after {
        height: 5px;
        width: 9px;
        border-left: 1px solid;
        border-bottom: 1px solid;
        transform: rotate(-45deg);
        left: 10px;
        top: 7px;
    }

    .user a{
        padding-left: 25px !important;
    }
</style>