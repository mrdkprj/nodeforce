<template>
    <div id="soqlTabArea" class="tab-area">
        <button type="button" id="soqlHistoryBtn" class="btn btn-sub" @click="onHistoryButtonClick">History</button>
        <button type="button" class="btn btn-sub export" @click="exportCsv">Export</button>
    </div>
</template>

<script>

export default {

    data: function () {
        return {
            tabComponent: new Tab(),
            sObjects: {},
        }
    },

    computed: {

    },

    methods: {

        onHistoryButtonClick: function(e) {
            this.$emit("requestOpenHistory");
        },

        onRerunClick: function(e){
            const tabId = this.getActiveTabElementId();
            if (this.sObjects[tabId]) {
                this.$emit("requestRerunSoql", this.sObjects[tabId].soql);
            }
        },

        createTab: function(newTab){
            const newTabId = newTab.tabIndex;

            this.tabComponent.activate(newTab.tabIndex);

            const parent = document.createElement("div");
            parent.classList.add("result-tab");
            parent.setAttribute("tabId", newTabId)

            const resultDiv = document.createElement("div");
            resultDiv.classList.add("result-info");
            resultDiv.setAttribute("tabId", newTabId);

            const soqlInfoDiv = document.createElement("div");
            soqlInfoDiv.classList.add("soql-info-area");

            const infoDiv = document.createElement("div");
            infoDiv.id = "soqlInfo"+ newTabId;
            infoDiv.innerText = "0 rows";

            const btnArea = document.createElement("div");
            btnArea.classList.add("rerun");
            btnArea.classList.add("refresh-sm");
            const btn = document.createElement("div");
            btn.classList.add("refresh-btn-sm");
            btnArea.appendChild(btn);
            btnArea.addEventListener("click", this.onRerunClick);

            soqlInfoDiv.appendChild(infoDiv);
            soqlInfoDiv.appendChild(btnArea);


            resultDiv.appendChild(soqlInfoDiv)

            const gridDiv = document.createElement("div");
            gridDiv.id = "soqlGrid" + newTabId;
            gridDiv.classList.add("result-grid")
            gridDiv.setAttribute("tabId",newTabId)

            parent.appendChild(resultDiv)
            parent.appendChild(gridDiv)

            newTab.content.appendChild(parent);
        },

        getActiveTabElementId: function(){
            return this.tabComponent.activeTabIndex;
        },

        setQueryResult: function(result){
            const gridSelector = "soqlGrid" + result.soqlInfo.tabId;
            document.getElementById("soqlInfo" + result.soqlInfo.tabId).textContent = result.soqlInfo.timestamp;
            const grid = new GridTable(document.getElementById(gridSelector), {rows: result.rows, header:result.columns});
            this.$set(this.sObjects, result.soqlInfo.tabId, {grid:grid, soql:result.soqlInfo.soql});
        },

        exportCsv: function(){
            const tabId = this.getActiveTabElementId();
            const grid = this.sObjects[tabId].grid;

            if(grid){
                grid.export({
                    fileName: "query_result",
                    bom: true
                });
            }
        },

    },

    mounted(){
        this.tabComponent.afterAddTab(this.createTab);
        this.tabComponent.create(document.getElementById("soqlTabArea"), "soqlTab", "Grid");
        this.tabComponent.addTab();
    }
}
</script>
<style>
    .soql-info-area{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

