<template>
    <div id="describeArea">
        <div class="form-area">
            <div class="sobject-list-area">
                <div id="sobjectList"></div>
                <div id="listSobjectBtn" class="refresh" @click="listSobjects"><div class="refresh-btn"></div></div>
            </div>
            <div>
                <button type="button" id="describeBtn" class="btn btn-main" @click="describeSobject">Describe</button>
            </div>
            <message ref="message"></message>
        </div>

        <desctab ref="tab"></desctab>
    </div>
</template>

<script>
import message from "@/components/message.vue";
import tab from "@/components/describeTab.vue";

export default {

    data: function () {
        return {
            pulldown: new Pulldown(),

        }
    },

    components: {
        "message" : message,
        "desctab" : tab
    },

    mounted(){
        const parent = document.getElementById("sobjectList");
        parent.appendChild(this.pulldown.pulldown);
    },

    methods: {

        listSobjects: async function(e){

            try{
                const result = await this.$store.dispatch("auth/request", {url: "/list"});
                const list = result.list.map((e) => `${e.name}(${e.label})`);
                this.pulldown.create(list);
            }catch(ex){
                this.$refs.message.displayError(ex);
            }

        },

        describeSobject: async function(e) {

            let inputSoql = soql ? soql : this.inputSoql;

            if(!inputSoql){
                return;
            }

            this.$refs.message.hideMessageArea();

            try{
                const params = {
                    url: "/soql",
                    data:{soql: inputSoql, tooling: this.tooling, tabId: this.$refs.tab.getActiveTabElementId()}
                };

                const res = await this.$store.dispatch("auth/request", params);

                this.$refs.tab.setQueryResult(res);
                this.$refs.history.addItem(res.soqlInfo.soql);

            }catch(ex){
                this.$refs.message.displayError(ex);
            }
        },

    }
}
</script>

<style scoped>
    .sobject-list-area{
        display: flex;
        justify-content: start;
        align-items: center;
        margin-bottom: 10px;
    }

    #sobjectList{
        min-width: 100px;
        margin-right: 20px;
    }
</style>