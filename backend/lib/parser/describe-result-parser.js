const fields = [
    "label", "name", "type", "custom", "length", "byteLength", "digits", "precision", "scale", "autoNumber",
    "calculated", "calculatedFormula", "formulaTreatNullNumberAsZero", "caseSensitive", "picklistValues",
    "controllerName", "dependentPicklist", "restrictedPicklist", "inlineHelpText", "referenceTo", "relationshipName",
    "relationshipOrder", "defaultValue", "defaultValueFormula", "encrypted", "externalId", "nillable", "unique",
    "aggregatable", "aiPredictionField", "cascadeDelete", "compoundFieldName", "createable", "defaultedOnCreate",
    "deprecatedAndHidden", "displayLocationInDecimal", "extraTypeInfo", "filterable", "filteredLookupInfo", "groupable",
    "highScaleNumber", "htmlFormatted", "idLookup", "mask", "maskType", "nameField", "namePointing", "permissionable",
    "polymorphicForeignKey", "queryByDistance", "referenceTargetField", "restrictedDelete", "searchPrefilterable",
    "sortable", "updateable", "writeRequiresMasterRead", "soapType"
];

module.exports = {

    parse(request, result){

        let keyBase = {};
        const rows = [];

        result.fields.forEach(field => {
            Object.assign(keyBase, field);
        })

        const header = Object.keys(keyBase).sort((a,b) => fields.indexOf(a) - fields.indexOf(b));

        result.fields.forEach(field => {

            const row = header.map(key => getValue(key, field));
            rows.push(row);
        })

        return {
                tabId: request.tabId,
                name: result.name,
                label: result.label,
                prefix: result.keyPrefix,
                header: header,
                rows: rows,
        };

    }

}

const getValue = (key, field) => {

    if(!field[key]) return null;

    let value = field[key];

    if(key == "picklistValues"){
        value = Array.from(value).map((obj) => obj["value"]).join("\n");
    }

    if(Array.isArray(value)){
        value = value.join("\n");
    }

    return value;
};
