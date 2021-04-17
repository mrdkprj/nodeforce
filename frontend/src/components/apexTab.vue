<template>
        <div class="tab-area">
            <button type="button" class="btn btn-xs btn-default export" @click="exportCsv">Export</button>
            <ul id="apexTabs">
                <li class="noselect" v-for="tabId in tabIds" :key="tabId">
                    <a :href="'#apexTab' + tabId" :tabId="tabId" @click="onTabClick">Grid{{tabId}}</a>
                    <span class="ui-icon ui-icon-close ui-closable-tab" :tabId="tabId" @click="closeTab"></span>
                </li>
                <li class="add-tab-li">
                    <div class="add-tab-btn icon-plus" @click="addTab"></div>
                </li>
            </ul>
            <div v-for="tabId in tabIds" :key="tabId" :id="'apexTab' + tabId" class="result-tab" :tabId="tabId">
                <div :id="'logInfo' + tabId" class="result-info" :tabId="tabId">
                    <span>{{name}}</span>
                    <label><input type="checkbox" class="debug-only" :disabled="!hasName" @change="debugOnly">&nbsp;&nbsp;Debug only</label>
                </div>
                <div :id="'apexGrid' + tabId" class="result-grid" :tabId="tabId"></div>
            </div>
        </div>
</template>

<script>

const EVENT_COLUMN_INDEX = 1;
const USER_DEBUG = "USER_DEBUG";

export default {

    data: function () {
        return {
            tabIds: {},
            baseTabIndex: 0,
            currentTabId: 0,
            logs: {}
        }
    },

    computed: {

        name: function () {
            if(this.hasName){
                return this.logs[this.currentTabId].name;
            }else{
                return null;
            }
        },

        hasName: function(){
            if(this.logs[this.currentTabId]) {
                return true;
            }else{
                return false;
            }
        }
    },

    methods: {

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

                $("#apexArea .tab-area").tabs("refresh");

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

                $("#apexArea .tab-area").tabs("refresh");

                const newTabIndex = $("#apexArea .tab-area ul li").length - 2;

                this.setSortableAttribute();

                $("#apexArea .tab-area").tabs({ active: newTabIndex});

            });
        },

        setSortableAttribute: function(){
            if (Object.keys(this.tabIds).length > 1) {
                $("#apexTabs").sortable("enable");
            } else {
                $("#apexTabs").sortable("disable");
            }
        },

        getActiveGridElementId: function(){
            return "#apexGrid" + this.currentTabId;
        },

        setLog: function(tabId, log){
            const gridSelector = "#apexGrid" + tabId;
            const grid = new GridTable(document.querySelector(gridSelector), log.data);
            this.$set(this.logs, tabId, {name: log.name, grid: grid});
        },

        //------------------------------------------------
        // Filter debug only
        //------------------------------------------------
        debugOnly: function(e) {
            if (e.target.checked) {
                this.filterLog();
            } else {
                this.clearFilter();
            }
        },

        filterLog: function(){
            const grid = this.logs[this.currentTabId].grid;
            grid.filter(EVENT_COLUMN_INDEX,USER_DEBUG);
        },

        clearFilter: function(){
            const grid = this.logs[this.currentTabId].grid;
            grid.clearFilter();
        },

        // export
        exportCsv: function(){
            const grid = this.logs[this.currentTabId].grid;
            if(grid){
                grid.export({
                    fileName: _logNames[elementId],
                    bom: true
                });
            }
        },

    },

    mounted(){
        $("#apexArea .tab-area").tabs();
        $("#apexTabs").sortable({items: "li:not(.add-tab-li)", delay: 150});
        this.createTab();
    }
}
</script>

<style>
    #debugOptions{
        display: none;
        padding-top: 10px;
        margin-bottom: 20px;
        font-size:12px;
    }

    .debug-only{
        vertical-align: bottom;
    }
</style>

