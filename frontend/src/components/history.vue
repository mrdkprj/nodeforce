<template>
    <div id="history" class="sidenav" :class="navstatus">
        <div class="tbl soql-history-title noselect">
            <div class="row"><button class="closebtn noselect" @click="onCloseHistoryClick">&times;</button></div>
            <div class="row">{{header}}</div>
        </div>
        <div class="soql-list">
            <ul>
                <li v-for="(key,index) in items" :key="index" @dblclick="onHistoryDblClick" :title="key">{{key}}</li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {

    props: ["header","container"],

    data: function () {
        return {
            opened: false,
            items: []
        }
    },

    computed: {
        navstatus: function () {
            if(this.opened){
                return "sidenav-open";
            }else{
                return "sidenav-close";
            }
        },

    },

    methods: {

        toggle: function(){
            if (this.opened) {
                this.closeHistory();
            } else {
                this.openHistory();
            }
        },

        onCloseHistoryClick: function(e){
            this.closeHistory();
        },

        onHistoryDblClick: function(e) {
            this.$emit("navItemDblclicked", this.container, e.target.innerHTML)
        },

        openHistory: function(){
            this.opened = true;
            this.$emit("navChanged", this.opened, this.container)
        },

        closeHistory: function(){
            this.opened = false;
            this.$emit("navChanged", this.opened, this.container)
        },

        addItem: function(item){
            this.items.push(item);
        }

    },

}

</script>

<style>
    .sidenav {
        height: 100%;
        width: 0;
        position: fixed;
        top: 45px;
        left: 0;
        background-color: #fafafb;
        overflow-x: hidden;
        overflow-y: auto;
        transition: 0.2s;
        border-right: 1px solid #aaa;
        z-index: 3000;
    }

    .sidenav ul{
        list-style-type: none;
        margin-top: 10px;
        padding: 0;
    }

    .sidenav li{
        padding: 0 15px;
        text-decoration: none;
        font-size: 12px;
        color: #000;
        display: block;
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .sidenav a{
        text-decoration: none;
    }

    .sidenav li:hover {
        background-color: #efe9e9;
    }

    .sidenav .closebtn {
        position: absolute;
        top: 5px;
        right: 10px;
        font-size: 30px;
        color: #000;
        background-color: transparent;
        background-repeat:no-repeat;
        border: none;
        cursor:pointer;
        overflow: hidden;
        outline:none;
        z-index: 2;
        padding:0;
        line-height: 20px
    }

    .sidenav .soql-history-title{
        font-size: 14px;
        color: #000;
        border-bottom: 1px solid #ccc;
        padding-left: 15px;
        margin: 0;
        font-family: Meiryo;
        width: 100%;
        vertical-align: middle;
        height:40px;
    }

    .soql-list{
        overflow-y: auto;
        overflow-y: auto;
        position: absolute;
        top: 40px;
        bottom: 45px;
        width: 100%;
    }

    @media screen and (max-height: 450px) {
        .sidenav li { font-size: 12px;}
    }

    .sidenav-close {
        width: 0px;
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s, opacity 0s step-start;
    }

    .sidenav-open {
        width: 250px;
    }
</style>

