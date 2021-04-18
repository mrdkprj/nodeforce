<template>
    <div id="userList" class="user-list" :class="dropdownStatus">
        <button id="username" class="btn dropdown-btn" type="button" @click="onDropdownClick" @blur="onDropdownClick">{{currentUser}}</button>
        <ul id="dropdownMenu" class="dropdown-menu">
            <li class="dropdown-submenu">
                <a id="changeLocale">Locale Option</a>
                <ul class="dropdown-menu locale-options">
                    <li><a locale-option="ja">Japanese</a></li>
                    <li><a locale-option="en_US">English</a></li>
                </ul>
            </li>
            <li><a id="refreshSObjects">Refresh sObjects</a></li>
            <li><a id="refreshMetadata">Refresh Metadata</a></li>
            <li role="separator" class="divider"></li>
            <li><a @mousedown="logout()">Logout</a></li>
        </ul>
    </div>
</template>

<script>

export default {

    data: function () {
        return {
            currentUser: this.$store.state.auth.username,
            opened: false
        }
    },

    computed: {
        dropdownStatus: function () {
            if(this.opened){
                return "open";
            }else{
                return "";
            }
        },

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
            this.opened = !this.opened;
        },

    },

}
</script>

<style scoped>
    .dropdown-submenu:hover .dropdown-menu{
        display: block;
    }
    #username{
        margin-left:10px;
        margin-top:7px;
        line-height: 1.35;
    }

    .user-list {
        position: relative;
        display: inline-block;
        vertical-align: middle;
    }

    .open > .dropdown-menu{
        display: block;
    }

    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 10px;
        z-index: 1000;
        display: none;
        float: left;
        min-width: 160px;
        padding: 5px 0;
        margin: 2px 0 0;
        font-size: 12px;
        text-align: left;
        list-style: none;
        background-color: #fff;
        border: 1px solid #ccc;
        border: 1px solid rgba(0, 0, 0, .15);
        border-radius: 4px;
        box-shadow: 0 6px 12px rgb(0 0 0 / 18%);
    }

    .dropdown-menu > li > a {
        display: block;
        padding: 3px 20px 3px 25px;
        color: #333;
        white-space: nowrap;
    }

    .dropdown-menu > li > a:hover,
    .dropdown-menu > li > a:focus {
        color: #262626;
        text-decoration: none;
        background-color: #f5f5f5;
        cursor: pointer;
    }

    .dropdown-btn{
        font-size: 12px;
        line-height: 1.5;
        border-radius: 3px;
        text-decoration: none;
        color: black;
        background-color: white;
        border-radius: 12px;
        border: #aaa 1px solid;
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, .175);
    }

    .dropdown-btn:hover{
        color: black;
    }

    .dropdown-submenu>.dropdown-menu {
        top: 5px;
        left: 100%;
        margin-top: -6px;
        margin-left: -1px;
        border-radius: 0 6px 6px 0;
    }

    .dropdown-submenu{
        position: relative;
    }

    .dropdown-submenu>.dropdown-menu a {
        padding-left: 25px;
    }

    .dropdown-submenu>a:after {
        display: block;
        content: " ";
        float: right;
        width: 0;
        height: 0;
        border-color: transparent transparent transparent #000;
        border-style: solid;
        border-width: 5px 0 5px 5px;
        margin-top: 2px;
        margin-right: -10px;
    }

    .dropdown-menu .divider {
        height: 1px;
        margin: 9px 0;
        overflow: hidden;
        background-color: #e5e5e5;
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

    .checkmark:before{
        height: 5px;
        width: 9px;
        border-left: 2px solid #aaa;
        border-bottom: 2px solid #aaa;
        transform: rotate(-45deg);
        left: 10px;
        top: 7px;
    }

    .checkmark:after {
        height: 5px;
        width: 9px;
        border-left: 1px solid;
        border-bottom: 1px solid;
        transform: rotate(-45deg);
        left: 10px;
        top: 7px;
    }

</style>