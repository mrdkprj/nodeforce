<template>
    <div id="mainArea" :class="selectedArea" current-locale-option="">

    <overlay message="Loading..."></overlay>

        <div class="header">
            <progress-line></progress-line>
            <div id="menuList">
                <dropdown></dropdown>
                <menus v-on:change="onMenuChanged"></menus>
            </div>
        </div>

        <div id="contentsArea">

            <div id="soqlContent">
                <soql ref="soql"></soql>
            </div>

            <div id="describeContent">
            </div>

            <div id="apexContent">
                <apex ref="apex"></apex>
            </div>

        </div>
    </div>
</template>


<script>
import overlay from "@/components/overlay.vue";
import progress from "@/components/progress.vue";
import dropdown from "@/components/dropdown.vue";
import menus from "@/components/menus.vue";
import soql from "@/components/soql.vue";
import apex from "@/components/apex.vue";

export default {

    data: function () {
        return {
          selectedArea: "soql"
        }
    },

    components: {
        "overlay": overlay,
        "progress-line": progress,
        "dropdown": dropdown,
        "menus": menus,
        "soql": soql,
        "apex": apex
    },

    created: function () {
        window.addEventListener('keydown', this.onkeydown)
    },

    methods: {

        //------------------------------------------------
        // Shortcut keys
        //------------------------------------------------
        onkeydown: function(e) {

        if (e.ctrlKey && (e.key === "r" || e.keyCode === 13)) {
            e.preventDefault();

            if (e.target.id === "inputSoql"){
                this.$refs.soql.executeSoql();
            }

            if(e.target.id === "apexCode") {
                this.$refs.apex.onExecuteClick(e);
            }
        }

        // tab
        if (e.keyCode === 9) {
            if (e.target.id === "inputSoql" || e.target.id === "apexCode") {
                e.preventDefault();
                this.insertTab(e);
            }
        }

        },

        //------------------------------------------------
        // Insert Tab
        //------------------------------------------------
        insertTab: function(e) {
            const elem = e.target;
            const start = elem.selectionStart;
            const end = elem.selectionEnd;
            elem.value = "" + (elem.value.substring(0, start)) + "\t" + (elem.value.substring(end));
            elem.selectionStart = elem.selectionEnd = start + 1;
        },

        onMenuChanged: function(e) {
            this.selectedArea = e.target;
        }

    }

}

</script>
<style>
    .header{
        position: fixed;
        top:0px;
        left: 0px;
        height: 45px;
        z-index: 3500;
        width: 100%;
    }

    #contentsArea{
        width:100%;
        position:fixed;
        top: 45px;
        left: 0px;
        bottom: 10px;
        overflow-y: auto;
        /*padding-top: 30px;*/
        z-index: 3000;
    }

    /* ------------------------------
    Menu display
    ------------------------------ */
    #soqlContent,
    #describeContent,
    #apexContent{
        visibility: hidden;
        overflow: hidden;
        height: 0px;
        opacity: 0;
    }

    .soql #soqlContent,
    .describe #describeContent,
    .apex #apexContent{
        visibility: visible;
        overflow:auto;
        height:100%;
        opacity: 1;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        padding-top:30px;
    }

    #menuList {
        width: 100%;
        height: 45px;
        border-bottom: #aaa 1px solid;
        z-index: 3000;
        background-color: #0c549c;
        display: flex;
        font-size:10pt;
        box-shadow: 0 3px 6px rgba(0,0,0,.225)
    }

    /* ------------------------------
    Common
    ------------------------------ */
    * {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    body{
        font-family: Arial, Helvetica, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
        background-color: #fff;
    }

    /* ------------------------------
    Overrides
    ------------------------------ */
    a{
        text-decoration: none;
    }

    label {
        font-weight: normal;
        margin-bottom: 0;
    }

    ul, ol {
        margin-top: 0;
        margin-bottom: 10px;
    }

    button:hover,
    button:focus,
    button:active{
        outline: 0px;
    }

    /* ------------------------------
    Table
    ------------------------------ */
    .tbl{
        display: table;
    }

    .row{
        display: table-row;
    }

    .row > div{
        display: table-cell;
    }

    /* ------------------------------
    Areas
    ------------------------------ */
    .form-area{
        width: 80%;
        margin: 0 auto;
    }

    .tab-area{
        width: 80%;
        margin: 15px auto;
    }

    /* ------------------------------
    #tab area
    ------------------------------ */
    .result-tab{
        padding-right: 7px;
    }

    .result-info{
        border: 1px solid #ccc;
        font-size: 9pt;
        font-family:Arial;
        padding: 4px;
        margin-bottom: 2px;
        margin-top: 2px;
        white-space: pre-wrap;
    }

    .result-grid {
        background-color: white;
        background: none;
        outline: 0;
        overflow: auto;
        height: 0;
    }

    /* ------------------------------
    Textarea
    ------------------------------ */
    .code-input{
        font-family: Consolas;
        font-size: 14px;
    }

    /* ------------------------------
    Button
    ------------------------------ */
    .btn{
        display: inline-block;
        padding: 6px 12px;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: normal;
        line-height: 1.5;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 4px;
    }

    .btn:active{
        background-image: none;
        outline: 0;
        box-shadow: inset 0 3px 5px rgb(0 0 0 / 13%);
    }

    .btn:hover{
        color: #333;
        text-decoration: none;
    }

    .btn:focus{
        text-decoration: none;
    }

    .btn-main {
        padding: 5px 10px;
        font-size: 12px;
        line-height: 1.5;
        border-radius: 3px;
        color: #fff;
        background-color: #337ab7;
        border-color: #2e6da4;
    }

    .btn-main:hover {
        color: #fff;
        background-color: #286090;
        border-color: #204d74;
    }

    .btn-sub {
        padding: 1px 5px;
        font-size: 12px;
        line-height: 1.5;
        border-radius: 3px;
        color: #333;
        background-color: #fff;
        border-color: #ccc;
    }

    .btn-sub:hover {
        color: #333;
        background-color: #e6e6e6;
        border-color: #adadad;
    }

    .refresh{
        width: 30px;
        height: 30px;
        border: 1px solid #ccc;
        padding: 5px;
        border-radius: 100%;
        cursor: pointer;
        box-shadow: 0px 2px 2px rgb(0 0 0 / 20%);
    }

    .refresh:active {
        transform: translateY(.5px);
        box-shadow: inset 0 0 3px 1px rgb(0 0 0 / 20%);
    }

    .refresh-btn{
        position: relative;
        width: 100%;
        height: 100%;
        border: 3px solid;
        border-right-color: transparent;
        border-radius: 100%;
        box-sizing: border-box;
        color: #807e7e;
    }

    .refresh-btn:before{
        position: absolute;
        top: 6px;
        right: -6px;
        content: "";
        height: 50%;
        border: 6px solid transparent;
        border-top: 6px solid;
        background: transparent;
        transform-origin: left top;
        transform: rotate(-40deg);
        box-sizing: border-box;
    }

    .refresh-sm{
        width: 25px;
        height: 25px;
        border: 1px solid #ccc;
        padding: 5px;
        border-radius: 100%;
        cursor: pointer;
    }

    .refresh-sm:active{
        transform: translateY(.5px);
    }

    .refresh-btn-sm{
        position: relative;
        width: 100%;
        height: 100%;
        border: 2px solid;
        border-right-color: transparent;
        border-radius: 100%;
        box-sizing: border-box;
        color: #807e7e;
    }

    .refresh-btn-sm:before{
        position: absolute;
        top: 6px;
        right: -6px;
        content: "";
        height: 50%;
        border: 6px solid transparent;
        border-top: 6px solid;
        background: transparent;
        transform-origin: left top;
        transform: rotate(-40deg);
        box-sizing: border-box;
    }
</style>

