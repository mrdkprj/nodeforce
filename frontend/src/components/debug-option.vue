<template>
    <div id="debugOptionArea" class="debug-option-area" :class="{ 'open': isOpened}">
        <button type="button" id="debugOptionBtn" class="btn btn-sub debug-option-btn" @click="toggleDebugOption">Debug option</button>
        <div id="bebugOptionTbl" class="debug-option-tbl">
            <div class="close-btn-area"><button class="closebtn" @click="toggleDebugOption">×</button></div>
            <div class="debug-option-row" v-for="categories in logCategories" :key="categories">
                <div v-for="category in categories" :key="category">
                    <span>{{category}}</span>
                    <select v-model="debuggingHeader[category]">
                        <option v-for="option in logLevel" :key="option.value" :value="option.value"> {{ option.text }}</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {

    data: function () {
        return {
            isOpened: false,

            logCategories: [
                ["Db", "Workflow"],
                ["Validation","Callout"],
                ["Apex_code","Apex_profiling"],
                ["Visualforce","System"],
                ["All"],
            ],

            logLevel : [
    	        {text: "NONE", value: "NONE"},
    	        {text: "ERROR", value: "ERROR"},
    	        {text: "WARN", value: "WARN"},
    	        {text: "INFO", value: "INFO"},
    	        {text: "DEBUG", value: "DEBUG"},
    	        {text: "FINE", value: "FINE"},
    	        {text: "FINER", value: "FINER"},
    	        {text: "FINEST", value: "FINEST"},
            ],

            debuggingHeader:{
                Db: "INFO", Workflow: "INFO",
                Validation:"INFO",Callout:"INFO",
                Apex_code:"FINEST",Apex_profiling:"INFO",
                Visualforce:"INFO",System:"FINE",
                All:"NONE"
            },
        }
    },

    methods: {

        toggleDebugOption: function(){
            this.isOpened = !this.isOpened;
        },

        closeDebugOption: function(){
            this.isOpened = false;
        }

    },

}
</script>

<style scoped>
    .debug-option-area{
        margin-left: 10px;
        position: relative;
    }

    .debug-option-area .close-btn-area{
        text-align: right;
    }

    .debug-option-area .closebtn{
        font-size: 30px;
        color: #000;
        background-color: transparent;
        background-repeat: no-repeat;
        border: none;
        cursor: pointer;
        overflow: hidden;
        outline: none;
        z-index: 2;
        padding: 0;
        line-height: 20px;
    }

    .debug-option-tbl{
        position: absolute;
        display:flex;
        visibility:hidden;
        border: 1px solid #ccc;
        padding: 10px;
        background: white;
        z-index: 3000;
        top: 25px;
        flex-direction: column;
        box-shadow: 0 3px 6px rgb(0 0 0 / 23%);
        font-size:12px;
        border-radius: 8px;
    }

    .open .debug-option-tbl{
        visibility:visible;
    }

    .debug-option-row{
        display:flex;
        justify-content: space-between;
    }

    .debug-option-row > div{
        display: flex;
        justify-content: flex-end;
        padding: 5px 30px 10px 5px;
        width: 50%;
        align-items: center;
    }

    .debug-option-row span{
        white-space: nowrap;
        margin-right:10px;
    }

    .debug-option-row select{
        border:1px solid #888;
        border-radius:4px;
        font-size:12px;
        padding:3px;
    }

    .open .debug-option-btn{
        color: #333;
        background-color: #e6e6e6;
        border-color: #adadad;
    }
</style>