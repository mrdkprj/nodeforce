<template>
    <div id="describeTabArea" class="tab-area">
        <button type="button" class="btn btn-sub export" @click="exportCsv">Export</button>
    </div>
</template>

<script>

export default {

    data: function () {
        return {
            tabComponent: new Tab(),
            results: {}
        }
    },

    methods: {

        getActiveTabElementId: function(){
            return this.tabComponent.activeTabIndex;
        },

        update(result){
            const elementId = "describeGrid" + result.tabId;

            this.writeSobjectInfo(result);

            const grid = new GridTable(document.getElementById(elementId), result);
            this.$set(this.results, result.tabId, {name: result.name, grid:grid});
        },

        writeSobjectInfo(result){
            const sobjectInfoArea = document.getElementById("sobjectInfo" + result.tabId);

            sobjectInfoArea.innerHTML = "";
            const name = document.createElement("div");
            name.textContent = "Name: " + result.name;
            const label = document.createElement("div");
            label.textContent = "Label: " + result.label;
            const prefix = document.createElement("div");
            prefix.textContent = "Prefix: " + result.prefix;

            sobjectInfoArea.append(name, label, prefix);
        },

        createTab(newTab){

            const newTabId = newTab.tabIndex;

            this.tabComponent.activate(newTab.tabIndex);

            const parent = document.createElement("div");
            parent.classList.add("result-tab");
            parent.setAttribute("tabId", newTabId)

            const resultDiv = document.createElement("div");
            resultDiv.id = "sobjectInfo" + newTabId;
            resultDiv.classList.add("result-info");
            resultDiv.setAttribute("tabId", newTabId);

            const gridDiv = document.createElement("div");
            gridDiv.id = "describeGrid" + newTabId;
            gridDiv.classList.add("result-grid")
            gridDiv.setAttribute("tabId",newTabId)

            parent.appendChild(resultDiv)
            parent.appendChild(gridDiv)

            newTab.content.appendChild(parent);
        },

        exportCsv: function(){
            const elementId = this.getActiveTabElementId();
            const grid = this.results[elementId].grid;
            if(grid){
                grid.export({
                    fileName: this.results[elementId].name,
                    bom: true
                });
            }
        },

    },

    mounted(){
        this.tabComponent.afterAddTab(this.createTab);
        this.tabComponent.create(document.getElementById("describeTabArea"), "describeTab", "Grid");
        this.tabComponent.addTab();
    }
}
</script>

<style>

</style>

