<template>
    <div id="apexArea">
        <div class="form-area">
            <div>
                <textarea id="apexCode" class="code-input" spellcheck="false" cols="120" rows="5" v-model="apexCode"></textarea>
            </div>
            <div class="apex-btn-area">
                <button type="button" id="executeAnonymousBtn" class="btn btn-main" @click="executeAnonymous">Execute Anonymous</button>
                <debugopt ref="debugOption"></debugopt>
            </div>
            <message ref="message"></message>
        </div>

        <apextab ref="tab"></apextab>

    </div>

</template>

<script>
import message from "@/components/message.vue";
import tab from "@/components/apex-tab.vue";
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

        executeAnonymous: async function(){

            if (!this.apexCode) {
                return;
            }

            this.$refs.message.hideMessageArea();
            this.$refs.debugOption.closeDebugOption();

            const params = {
                url: "/apex",
                data:{
                    code: this.apexCode,
                    debuggingHeader: this.$refs.debugOption.debuggingHeader,
                    tabId: this.$refs.tab.getActiveTabElementId()
                }
            };

            try{
                const result = await this.$store.dispatch("auth/request", params);
                this.$refs.tab.setLog(result);
            }catch(ex){
                this.$refs.message.displayError(ex.message);
            }
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

