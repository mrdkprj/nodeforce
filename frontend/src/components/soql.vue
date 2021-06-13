<template>
    <div id="soqlArea" :class="adjustMargin">
        <soqlhistory ref="history" header="SOQL History" container="soql" @historyToggled="onHistoryToggled" @itemDblClicked="onHistoryItemSelected"></soqlhistory>

        <div class="form-area soql-form">
            <div>
                <textarea id="inputSoql" class="code-input" spellcheck="false" cols="120" rows="5" v-model="inputSoql"></textarea>
            </div>
            <div>
                <button type="button" id="executeSoqlBtn" class="btn btn-main" @click="onExecuteSoqlBtnClick">Execute</button>
                <label class="soql-options"><input type="checkbox" id="useTooling" v-model="tooling"/> Use Tooling API</label>
            </div>
            <message ref="message"></message>
        </div>

        <soqltab ref="tab" @requestRerunSoql="executeSoql($event)" @requestOpenHistory="openHistory"></soqltab>
    </div>
</template>

<script>
import message from "@/components/message.vue";
import history from "@/components/soql-history.vue";
import tab from "@/components/soql-tab.vue";

export default {

    data: function () {
        return {
            tooling: false,
            inputSoql: "select firstname,Name,Id,account.name from contact where id in ('0036F00003Vhe7y','0036F00003WqLC4')",
            historyOpened: false
        }
    },

    components: {
        "message" : message,
        "soqlhistory": history,
        "soqltab" : tab
    },

    computed: {
        adjustMargin: function(){
            if(this.historyOpened){
                return "with-history";
            }else{
                return "without-history";
            }
        }
    },

    methods: {

        onExecuteSoqlBtnClick: function(e){
            this.executeSoql();
        },

        executeSoql: async function(soql) {

            let inputSoql = soql ? soql : this.inputSoql;

            if(!inputSoql){
                return;
            }

            this.$refs.message.hideMessageArea();

            const params = {
                url: "/soql",
                data:{soql: inputSoql, tooling: this.tooling, tabId: this.$refs.tab.getActiveTabElementId()}
            };

            try{
                const result = await this.$store.dispatch("auth/request", params);

                this.$refs.tab.setQueryResult(result);
                this.$refs.history.addItem(result.soqlInfo.soql);

            }catch(ex){
                this.$refs.message.displayError(ex);
            }
        },

        openHistory: function(){
            this.$refs.history.toggle();
        },

        onHistoryToggled: function(opened){
            this.historyOpened = opened;
        },

        onHistoryItemSelected: function(target, value){
            if(target == "soql"){
                document.getElementById("inputSoql").value = value;
            }
        }

    }
}
</script>

<style scoped>
    #soqlArea{
        position:relative;
        top:0px;
        right:0px;
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

    .with-history{
        margin-left: 150px;
    }

    .without-history{
        margin-left: 0;
    }
</style>