<template>
    <div id="apexArea">
        <div class="form-area">
            <div>
                <textarea id="apexCode" class="code-input" spellcheck="false" cols="120" rows="5" v-model="apexCode"></textarea>
            </div>
            <div>
                <button type="button" id="executeAnonymousBtn" class="btn btn-main" @click="onExecuteClick">Execute Anonymous</button>
            </div>
            <message ref="message"></message>
        </div>

        <apextab ref="tab"></apextab>

    </div>

</template>

<script>
import message from "@/components/message.vue";
import tab from "@/components/apexTab.vue";

export default {

    components: {
        "message" : message,
        "apextab" : tab
    },

    data: function () {
        return {
            apexCode: "string x = 'a'; system.debug(x);",
        }
    },

    methods: {

        //------------------------------------------------
        // Execute Anonymous
        //------------------------------------------------
        onExecuteClick: function(e){

            if (!this.apexCode) {
                return;
            }

            this.executeAnonymous(this.apexCode);
        },

        executeAnonymous: function(code){

            this.$refs.message.hideMessageArea();

            this.$store.dispatch(
                "auth/request",
                {
                    url: "/apex",
                    data:{
                        code: code, tabId: this.$refs.tab.getActiveTabElementId()
                    }
                }
            ).then(res => this.displayLog(res))
            .catch(ex => this.$refs.message.displayError(ex))
        },

        displayLog: function(json){
            this.$refs.tab.setLog(json);
        },

    }
}
</script>
<style></style>

