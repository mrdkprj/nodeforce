<template>
    <div id="soqlArea" v-bind:class="displayPosition">
        <soqlhistory ref="history" header="SOQL History" :container="selector" @navChanged="onHistoryStatusChanged" @navItemDblclicked="onHistoryItemSelected"></soqlhistory>

        <div class="form-area soql-form">
            <div>
                <textarea id="inputSoql" class="code-input" spellcheck="false" cols="120" rows="5" v-model="inputSoql"></textarea>
            </div>
            <div>
                <button type="button" id="executeSoqlBtn" class="btn btn-sm btn-primary" @click="onExecuteSoqlBtn">Execute</button>
                <button type="button" id="test" class="btn btn-sm btn-primary" @click="showTest">Test</button>
                <label class="soql-options"><input type="checkbox" id="useTooling" v-model="tooling"> Use Tooling API</label>
            </div>
            <p><message ref="message"></message></p>
        </div>

        <soqltab ref="tab" @onExecuteRequest="executeSoql($event)" @requestOpenHistory="openHistory"></soqltab>
    </div>
</template>

<script>
import message from "@/components/message.vue";
import history from "@/components/history.vue";
import tab from "@/components/soqlTab.vue";
const DEFAULT_DATA_TYPE = "";
const DEFAULT_CONTENT_TYPE = null;
const POST = "post";

export default {

    data: function () {
        return {
            selector: "#soqlArea",
            tooling: false,
            inputSoql: "select firstname,Name,Id,account.name from contact where id in ('0036F00003Vhe7y','0036F00003WqLC4')",
            sidenavOpened: false
        }
    },

    components: {
        "message" : message,
        "soqlhistory": history,
        "soqltab" : tab
    },

    computed: {
        displayPosition: function(){
            if(this.sidenavOpened){
                return "with-sidenav";
            }else{
                return "without-sidenav";
            }
        }
    },

    methods: {

        showTest: function(){
               this.$refs.message.hideMessageArea();

            this.$store.dispatch(
                "auth/request",
                {
                    url: "/test",
                    data:{}
                }
            ).then(res => this.displayQueryResult3(res))
            .catch(e => this.$refs.message.displayError(e))
        },

        displayQueryResult3: function(json) {
            var _selectedTabId = $("#soqlArea .tab-area .ui-tabs-panel:visible").attr("tabId");
            const elementId = "#soqlArea #soqlGrid" + _selectedTabId;
            new GridTable(document.querySelector(elementId), json);
        },

        //------------------------------------------------
        // Execute SOQL
        //------------------------------------------------
        onExecuteSoqlBtn: function(e){
            this.executeSoql();
        },

        executeSoql: function(soql) {

            let inputSoql = soql ? soql : this.inputSoql;

            if(!inputSoql){
                return false;
            }

            this.$refs.message.hideMessageArea();

            this.$store.dispatch(
                "auth/request",
                {
                    url: "/soql",
                    data:{
                        soql: inputSoql, tooling: this.tooling, tabId: this.$refs.tab.currentTabId
                    }
                }
            ).then(res => this.displayQueryResult(res))
            .catch(e => this.$refs.message.displayError(e))
        },

        //------------------------------------------------
        // Query callbacks
        //------------------------------------------------
        displayQueryResult: function(json){
            this.$refs.tab.setQueryResult(json);
            this.$refs.history.addItem(json.soqlInfo.soql);
        },

        openHistory: function(){
            this.$refs.history.toggle();
        },

        onHistoryStatusChanged: function(opened){
            this.sidenavOpened = opened;
        },

        onHistoryItemSelected: function(target, value){
            if(target == this.selector){
                document.getElementById("inputSoql").value = value;
            }
        }

    }
}
</script>

<style>
    #soqlArea{
        position:relative;
        top:0;
        right:0;
    }

    .soql-options{
        margin-left: 10px;
    }

    .left-align-btn{
        float: left;
    }

    .right-align-btn{
        text-align: right;
        margin-bottom: 2px;
    }

    .soql-empty-row{
        height:20px;
    }

    .grid-btn{
        font-size: 12px !important;
        margin-right: 5px;
    }

    .with-sidenav{
        margin-left: 150px;
    }

    .without-sidenav{
        margin-left: 0;
    }
</style>