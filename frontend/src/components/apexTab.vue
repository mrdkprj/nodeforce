<template>
    <div id="apexTabArea" class="tab-area">
        <button type="button" class="btn btn-sub export" @click="exportCsv">Export</button>
    </div>
</template>

<script>

const EVENT_COLUMN_INDEX = 1;
const USER_DEBUG = "USER_DEBUG";

export default {

    data: function () {
        return {
            tabComponent: new Tab(),
            logs: {}
        }
    },

    methods: {

        getActiveTabElementId: function(){
            return this.tabComponent.activeTabIndex;
        },

        createTab: function(newTab){

            const newTabId = newTab.tabIndex;

            this.tabComponent.activate(newTab.tabIndex);

            const parent = document.createElement("div");
            parent.classList.add("result-tab");
            parent.setAttribute("tabId", newTabId)

            const resultDiv = document.createElement("div");
            resultDiv.id = "logInfo" + newTabId;
            resultDiv.classList.add("result-info");
            resultDiv.setAttribute("tabId", newTabId);

            const gridDiv = document.createElement("div");
            gridDiv.id = "apexGrid" + newTabId;
            gridDiv.classList.add("result-grid")
            gridDiv.setAttribute("tabId",newTabId)

            parent.appendChild(resultDiv)
            parent.appendChild(gridDiv)

            newTab.content.appendChild(parent);

        },

        setLog: function(log){

            const elementId = "apexGrid" + log.tabId;

            this.writeLogInfo(log.tabId, log.logName);

            const grid = new GridTable(document.getElementById(elementId), {rows: log.rows, header:log.header});

            this.$set(this.logs, log.tabId, {name: log.logName, grid: grid});

        },

        writeLogInfo: function(tabId, logName){
            const infoArea = document.getElementById("logInfo" + tabId);
            infoArea.innerHTML = "";

            const log = document.createElement("span");
            log.textContent = logName;
            log.style["margin-right"] = "10px";
            const debugOnly = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("debug-only");
            checkbox.addEventListener("change", this.onDebugOnly);
            debugOnly.append(checkbox,"Debug only");

            infoArea.appendChild(log);
            infoArea.appendChild(debugOnly);

        },

        onDebugOnly: function(e){
            if (e.target.checked == true) {
                this.filterLog();
            } else {
                this.clearFilter();
            }
        },

        filterLog: function(){
            const elementId = this.getActiveTabElementId();
            const grid = this.logs[elementId].grid;
            if(grid){
                grid.filter(EVENT_COLUMN_INDEX,USER_DEBUG);
            }
        },

        clearFilter: function(){
            const elementId = this.getActiveTabElementId();
            const grid = this.logs[elementId].grid;
            if(grid){
                grid.clearFilter();
            }
        },

        exportCsv: function(){
            const elementId = this.getActiveTabElementId();
            const grid = this.logs[elementId].grid;
            if(grid){
                grid.export({
                    fileName: this.logs[elementId].name,
                    bom: true
                });
            }
        },

    },

    mounted(){
        this.tabComponent.afterAddTab(this.createTab);
        this.tabComponent.create(document.getElementById("apexTabArea"), "apexTab", "Grid");
        this.tabComponent.addTab();
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

