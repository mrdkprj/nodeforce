<template>
    <div class="tab-area">
        <button type="button" id="soqlHistoryBtn" class="btn btn-xs btn-default" @click="onHistoryButtonClick">History</button>
        <button type="button" class="btn btn-xs btn-default export" @click="exportCsv">Export</button>
        <ul id="soqlTabs">
            <li class="noselect" v-for="tabId in tabIds" v-bind:key="tabId">
                <a v-bind:href="'#soqlTab' + tabId" :tabId="tabId" @click="onTabClick">Grid{{tabId}}</a>
                <span class="ui-icon ui-icon-close ui-closable-tab" :tabId="tabId" @click="closeTab"></span>
            </li>
            <li class="add-tab-li">
                <div class="add-tab-btn icon-plus" @click="addTab"></div>
            </li>
        </ul>
        <div v-for="tabId in tabIds" v-bind:key="tabId" v-bind:id="'soqlTab' + tabId" class="result-tab" :tabId="tabId">
            <div class="result-info" :tabId="tabId">
                <div v-bind:id="'soql' + tabId">
                    <button name="rerunBtn" type="button" class="rerun btn btn-xs btn-default grid-btn" @click="rerun">Rerun</button>
                </div>
                <span v-bind:id="'soql-info' + tabId">{{timestamp}}</span>
            </div>
            <div v-bind:id="'soqlGrid' + tabId" class="result-grid" :tabId="tabId"></div>
        </div>
    </div>
</template>

<script>

export default {

    data: function () {
        return {
            tabIds: {},
            baseTabIndex: 0,
            currentTabId: 0,
            sObjects: {}
        }
    },

    computed: {

        timestamp: function(){
            if(this.sObjects[this.currentTabId]){
                return this.sObjects[this.currentTabId].timestamp;
            }else{
                return "0 rows";
            }
        }
    },

    methods: {

        onHistoryButtonClick: function(e) {
            this.$emit("requestOpenHistory");
        },

        onTabClick: function(e) {
            this.currentTabId = e.target.getAttribute("tabId");
        },

        //------------------------------------------------
        // Close tab
        //------------------------------------------------
        closeTab: function(e) {

            e.stopPropagation();

            if (Object.keys(this.tabIds).length <= 1) {
                return;
            }

            e.target.parentElement.remove();

            this.$delete(this.tabIds, e.target.getAttribute("tabId"));

            this.$nextTick(() => {

                $("#soqlArea .tab-area").tabs("refresh");

                this.setSortableAttribute();

            });

        },

        //------------------------------------------------
        // Create tab
        //------------------------------------------------
        addTab: function(e){
            this.createTab();
        },

        createTab: function(){

            this.baseTabIndex++;

            this.currentTabId = this.baseTabIndex;

            this.$set(this.tabIds, this.baseTabIndex, this.baseTabIndex);

            this.$nextTick(() => {

                $("#soqlArea .tab-area").tabs("refresh");

                const newTabIndex = $("#soqlArea .tab-area ul li").length - 2;

                this.setSortableAttribute();

                $("#soqlArea .tab-area").tabs({ active: newTabIndex});

            });
        },

        setSortableAttribute: function(){
            if (Object.keys(this.tabIds).length > 1) {
                $("#soqlTabs").sortable("enable");
            } else {
                $("#soqlTabs").sortable("disable");
            }
        },

        getActiveGridElementId: function(){
            return "#soqlGrid" + this.currentTabId;
        },

        setQueryResult: function(result){
            const gridSelector = "#soqlGrid" + result.soqlInfo.tabId;
            const grid = new GridTable(document.querySelector(gridSelector), result);
            const value = {
                            timestamp: result.soqlInfo.timestamp,
                            soql: result.soqlInfo.soql,
                            grid: grid
                        }
            this.$set(this.sObjects, result.soqlInfo.tabId, value);
        },

        //------------------------------------------------
        // Rerun SOQL
        //------------------------------------------------
        rerun: function(e){
            if (this.sObjects[this.currentTabId]) {
                this.$emit("onExecuteRequest", this.sObjects[this.currentTabId].soql);
            }
        },

        // export
        exportCsv: function(){
            const grid = this.sObjects[this.currentTabId].grid;
            if(grid){
                grid.export({
                    fileName: "query_result",
                    bom: true
                });
            }
        },

    },

    mounted(){
        $("#soqlArea .tab-area").tabs();
        $("#soqlTabs").sortable({items: "li:not(.add-tab-li)", delay: 150});
        this.createTab();
    }
}
</script>
<style></style>

