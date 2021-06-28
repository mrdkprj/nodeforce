<template>
    <div id="describeArea">
        <div class="form-area">
            <div class="sobject-list-area">
                <div id="sobjectList"></div>
                <div id="listSobjectBtn" class="refresh" @click="listSobjects"><div class="refresh-btn"></div></div>
            </div>
            <div class="sobject-category">
                <span>
                    <label v-for="(value, name) in sobjectCategories" v-bind:value="value" v-bind:key="name">
                        <input type="radio" name="category" :value="value" v-model="sobjectCategory" v-bind:disabled="!isReady" @change="changeList"/>{{name}}
                    </label>
                    <label><input type="checkbox" v-model="useObjectName" @change="changeList"/>Use sObject name</label>
                </span>
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
import tab from "@/components/describe-tab.vue";

export default {

    components: {
        "message" : message,
        "desctab" : tab
    },

    data: function () {
        return {
            pulldown: new Pulldown(),
            sobjectCategories: {
                All: 0,
                Standard: 1,
                Custom: 2,
            },
            sobjectCategory: 0,
            useObjectName: true,
            sObjects: {},
        }
    },

    computed: {
        isReady: function () {
            return Object.keys(this.sObjects).length > 0;
        },

    },

    mounted(){
        const parent = document.getElementById("sobjectList");
        parent.appendChild(this.pulldown.pulldown);
    },

    methods: {

        listSobjects: async function(e){

            if(this.isReady && !confirm("Refresh sObject list?")) return;

            try{
                const result = await this.$store.dispatch("auth/request", {url: "/list"});
                this.sObjects = result.list;
                this.createOptions();
            }catch(ex){
                this.$refs.message.displayError(ex);
            }

        },

        changeList: function(e){
            this.createOptions();
        },

        createOptions: function(){

            if(!this.isReady) return;

            let list;

            if(this.sobjectCategory == 0){
                list = this.sObjects.map(e => this.useObjectName ? e.name : {[e.name]: e.label});
            }else if(this.sobjectCategory == 1){
                list = this.sObjects.filter(e => e.custom == "false").map(e => this.useObjectName ? e.name : {[e.name]: e.label});
            }else if(this.sobjectCategory == 2){
                list = this.sObjects.filter(e => e.custom == "true").map(e => this.useObjectName ? e.name : {[e.name]: e.label});
            }

            this.pulldown.create(list);
        },

        describeSobject: async function(e) {

            let sobject = this.pulldown.value;

            if(!sobject){
                return;
            }

            this.$refs.message.hideMessageArea();

            const params = {
                url: "/describe",
                data:{sobject: sobject, tabId: this.$refs.tab.getActiveTabElementId()}
            };

            try{
                const res = await this.$store.dispatch("auth/request", params);
                this.$refs.tab.update(res);
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

    .sobject-category{
        margin-bottom:10px;
    }
</style>