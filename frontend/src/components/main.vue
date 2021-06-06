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
                <describe ref="describe"></describe>
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
import describe from "@/components/describe.vue";
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
        "describe": describe,
        "apex": apex
    },

    created: function () {
        window.addEventListener('keydown', this.onkeydown)
    },

    methods: {

        onkeydown: function(e) {

            if (e.ctrlKey && (e.key === "r" || e.key === "Enter")) {
                e.preventDefault();

                if (e.target.id === "inputSoql"){
                    this.$refs.soql.executeSoql();
                }

                if(e.target.id === "apexCode") {
                    this.$refs.apex.onExecuteClick(e);
                }
            }

            if (e.key === "Tab") {
                if (e.target.id === "inputSoql" || e.target.id === "apexCode") {
                    e.preventDefault();
                    this.insertTab(e);
                }
            }

        },

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
<style scoped>
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

</style>

