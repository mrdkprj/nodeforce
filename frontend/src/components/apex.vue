<template>
    <div id="apexArea">
        <div class="form-area">
            <div>
                <textarea id="apexCode" class="code-input" spellcheck="false" cols="120" rows="5" v-model="apexCode"></textarea>
            </div>
            <div class="apex-btn-area">
                <button type="button" id="executeAnonymousBtn" class="btn btn-main" @click="onExecuteClick">Execute Anonymous</button>
                <debugopt ref="debugOption"></debugopt>
            </div>
            <message ref="message"></message>
        </div>

        <apextab ref="tab"></apextab>

    </div>

</template>

<script>
import message from "@/components/message.vue";
import tab from "@/components/apexTab.vue";
import debugOption from "@/components/debug-option.vue";

export default {

    components: {
        "message" : message,
        "apextab" : tab,
        "debugopt": debugOption,
    },

    data: function () {
        return {
            apexCode: "string x = 'a'; system.debug(x);",
        }
    },

    methods: {

        onExecuteClick: function(e){

            if (!this.apexCode) {
                return;
            }

            this.executeAnonymous(this.apexCode);
        },

        executeAnonymous: function(code){

            //debuggingHeader
            this.$refs.message.hideMessageArea();

            this.$store.dispatch(
                "auth/request",
                {
                    url: "/apex",
                    data:{
                        code: code, debuggingHeader: this.$refs.debugOption.debuggingHeader,tabId: this.$refs.tab.getActiveTabElementId()
                    }
                }
            ).then(res => this.displayLog(res))
            .catch(ex => this.$refs.message.displayError(ex.message))
        },

        displayLog: function(json){
            this.$refs.tab.setLog(json);
        },

    }
}
</script>
<style>
    .apex-btn-area{
        display: flex;
        align-items: center;
    }
</style>

