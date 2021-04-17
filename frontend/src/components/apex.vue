<template>
    <div id="apexArea">
        <div class="form-area execute-anonymous-form">
            <div>
                <textarea id="apexCode" class="code-input" spellcheck="false" cols="120" rows="5"></textarea>
            </div>
            <div>
                <button type="button" id="executeAnonymousBtn" class="btn btn-sm btn-primary" @click="onExecuteClick">Execute Anonymous</button>
            </div>
            <p><message ref="message"></message></p>
        </div>

        <apextab ref="tab"></apextab>
    </div>
</template>

<script>
import message from "@/components/message.vue";
import tab from "@/components/apexTab.vue";

const DEFAULT_DATA_TYPE = "";
const DEFAULT_CONTENT_TYPE = null;
const POST = "post";

export default {

    components: {
        "message" : message,
        "apextab" : tab
    },

    methods: {

        //------------------------------------------------
        // Execute Anonymous
        //------------------------------------------------
        onExecuteClick: function(e){

            const code = $("#apexArea #apexCode").val();

            if ($.isAjaxBusy() || !code) {
                return false;
            }

            e.preventDefault();

            this.executeAnonymous(code);
        },

        executeAnonymous: function(code){
            this.$refs.message.hideMessageArea();
            this.selectedTabId = this.$refs.tab.currentTabId;

            const debugOptions = {};
            $("#debugOptions option:selected").each(function() {
                const category = $(this).parent().attr("id");
                const level = $(this).val();
                debugOptions[category] = level;
            });

            const val = {code: code, debug_options: debugOptions};
            const action = "/apex";
            const options = $.getAjaxOptions(action, POST, val, DEFAULT_DATA_TYPE, DEFAULT_CONTENT_TYPE);
            const callbacks = $.getAjaxCallbacks(this.afterExecuteAnonymous, this.$refs.message.displayError, null);
            $.executeAjax(options, callbacks);
        },

        afterExecuteAnonymous: function(json){
            this.$refs.tab.setLog(this.selectedTabId, json);
        },

    }
}
</script>
<style></style>

