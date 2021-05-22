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

        const rows = [];

        result.fields.forEach((field) => {

            const row = Object.entries(field)
                        .sort(([a,],[b,]) => fields.indexOf(a) - fields.indexOf(b))
                        .filter(([k,v]) => fields.includes(k))
                        .map(([k,v]) => flatten([k,v]))
                        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

            rows.push(Object.values(row));
        })

        return {
                tabId: request.tabId,
                name: result.name,
                label: result.label,
                prefix: result.keyPrefix,
                header: fields,
                rows: rows,
        };

    }

}

const flatten = ([k,v]) => {

        if(k == "picklistValues"){
            const values = Array.from(v).map((obj) => obj["value"]).join("\n");
            return [k, values];
        }

        if(Array.isArray(v)){
            return [k, v.join("\n")];
        }

        return [k, v];
};
