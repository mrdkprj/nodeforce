<template>
    <div id="overlay" class="requesting-overlay" :class="state">
        <div id="overlayContent" class="overlay-content">{{message}}</div>
        <div class="loader"></div>
    </div>
</template>

<script>

export default {

    props: ["message"],

    data: function () {
        return {
            displayed: false
        }
    },

    computed: {
        state: function () {
            if(this.displayed){
                return "overlay-displayed";
            }else{
                return "overlay-hidden";
            }
        },

    },

    methods: {

        changeMessage: function(message){
            this.message = message;
        },

        show: function(){
            this.displayed = true;
        },

        hide: function(){
            this.displayed = false;
        }

    },

}

</script>

<style>
    .requesting-overlay {
        height: 100%;
        width: 100%;
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        background-color: #408080;
        opacity: 0.8;
        overflow-x: hidden;
        display:none;
    }

    .overlay-content {
        position: relative;
        top: 42%;
        width: 100%;
        text-align: center;
        margin-top: 30px;
        color:#80ffff;
        font-weight: bold;
    }

    .overlay-displayed {
        display: block;
    }

    .overlay-hidden {
        display: none;
    }

    /* ------------------------------
    Loading
    ------------------------------ */
    .loader,
    .loader:before,
    .loader:after {
        border-radius: 50%;
        width: 2.5em;
        height: 2.5em;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        -webkit-animation: load7 1.8s infinite ease-in-out;
        animation: load7 1.8s infinite ease-in-out;
    }

    .loader {
        color: #80ffff;
        font-size: 10px;
        margin: auto;
        position:absolute;
        top:0px;
        right:0px;
        left:0px;
        bottom:0px;
        text-indent: -9999em;
        -webkit-transform: translateZ(0);
        -ms-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-animation-delay: -0.16s;
        animation-delay: -0.16s;
    }

    .loader:before,
    .loader:after {
        content: '';
        position: absolute;
        top: 0;
        }

    .loader:before {
        left: -3.5em;
        -webkit-animation-delay: -0.32s;
        animation-delay: -0.32s;
    }

    .loader:after {
        left: 3.5em;
    }
    @-webkit-keyframes load7 {
        0%,
        80%,
        100% {
        box-shadow: 0 2.5em 0 -1.3em;
        }
        40% {
        box-shadow: 0 2.5em 0 0;
        }
    }
    @keyframes load7 {
        0%,
        80%,
        100% {
        box-shadow: 0 2.5em 0 -1.3em;
        }
        40% {
        box-shadow: 0 2.5em 0 0;
        }
    }
</style>

