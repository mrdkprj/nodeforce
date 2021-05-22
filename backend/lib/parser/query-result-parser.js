const soqlParser = require("./query-parser.js");

const EXCLUDE_KEY_NAMES = ["@xsi:type", "type","attributes"];
const RECORDS = "records"
const ID = "ID"
const AGGREGATE = "EXPR"

module.exports = {

    parse(request, result) {

        const parsedResult = getParsedQueryResult(request.soql, result);

        return {
            columns:parsedResult.columns,
            rows:parsedResult.records,
            soqlInfo: {
                soql: request.soql,
                tabId: request.tabId,
                timestamp: parsedResult.recordCount - 1 + " rows@" + new Date().toLocaleString('ja-JP')
            }
        }

    }
}

const getParsedQueryResult = (soql, queryResult) => {

    const parsedSOQL = parseSoql(soql);
    const fields = parsedSOQL.rawQueryFields;
    const recordCount = queryResult.size;

    const records = parseQueryReuslt(queryResult, parsedSOQL.queryFields);

    return {
        sobject: parsedSOQL.sobjectType,
        records : records,
        recordCount : recordCount,
        columns : fields
    }

}

const parseQueryReuslt = (queryResult, queryFields) => {

    const records = []

    const results = Array.isArray(queryResult.records) ? queryResult.records : [queryResult.records]

    results.forEach(result => {

        let recordMap = new Map();

        extract(result).forEach((value, key) => {

            if(isReference(value)){

                recordMap = new Map([...recordMap,...resolveReference(key, value)])

            }else if(isChild(value)){

                recordMap = new Map([...recordMap,...resolveChild(key, value)])

            }else if(queryFields.has(key.toUpperCase())){

                recordMap = new Map([...recordMap,...getMap(key, value)]);

            }
        })

        const record = [];

        queryFields.forEach((_, key) => {
            if(recordMap.has(key)){
                record.push(recordMap.get(key));
            }else{
                record.push(null);
            }
        })



        records.push(record);

    })

    return records;
}

const isReference = (value) => {

    if(value == null){
        return false;
    }

    if(isChild(value)){
        return false
    }else if(isMap(value) && Object.keys(value).length > 1){
        return true
    }else{
        return false
    }
}

const isMap = (o) => {
    return typeof o == "object";
}

const isChild = (value) => {

    if(value == null){
        return false;
    }

    if(isMap(value) && value[RECORDS] != null){
        true
    }else{
        false
    }
}

const resolveReference = (key, value) => {
    reference = new Map();

    if(value){
        resolveDeepReference(key, extract(value))
    }

    return reference
}

const resolveDeepReference = (key, value) => {
    value.forEach((v, k) => {
        if(isMap(v)){
            resolveDeepReference(key + "." + k, extract(v))
        }else{
            reference = new Map([...reference,...getMap(key + "." + k, v)])
        }
    })
}

const resolveChild = (key,value) => {
    const records = value.records;
    const childRecords = [];
    Array.from(records).forEach(record => {
        children = new Map();
        resolveDeepChild(record);
        childRecords.push(children);
    });

    return getMap(key, JSON.stringify(childRecords))
}

const resolveDeepChild = (record, key) => {
    record.forEach((v,k) => {
        if(!skipRequired(k, v)){
            if(isMap(v)){
                resolveDeepChild(v, k)
            }else{
                if(!key){
                    children = new Map([...children,...[k,v]])
                }else{
                    children = new Map([...children,...[key,[k, v]]])
                }
            }
        }
    })
}

const extract = (record) => {
    let result = new Map();
    new Map(Object.entries(record)).forEach((v,k) => {
        if(!skipRequired(k, v)){
            result = new Map([...result,...removeDuplicateId(k, v)]);
        }
    })
    return result;
}

const getMap = (key, value) => {
    return new Map([[key.toUpperCase(), value]]);
}

const skipRequired = (key, value) => {

    if(EXCLUDE_KEY_NAMES.includes(key.toLowerCase())){
        return true
    }else if(key.toUpperCase() == ID && !value){
        return true
    }else{
        return false
    }
}

const removeDuplicateId = (key, value) => {
    if(key.toUpperCase() == ID && Array.isArray(value)){
        return new Map([[key, value[0]]]);
    }else{
        return new Map([[key, value]]);
    }
}

const parseSoql = (soql) => {

    let parsedSoql;
    try{
        parsedSoql = soqlParser.parse(soql);
    }catch(ex){
        return {done: false};
    }

    const queryFields = new Map();
    const rawQueryFields = [];
    const sobjectType = parsedSoql["objects"][0]["objectName"];
    let expCount = 0;

    parsedSoql["fields"].forEach(field => {

        if(field["subQuery"]){

            const subQuery = field["subQuery"];
            rawQueryFields.push([subQuery["objectName"]]);
            queryFields.set([subQuery["objectName"]].toUpperCase(),"readOnly");

        }else if(field["function"]){

            const func = field["function"]
            if(func == "countAll"){
                rawQueryFields.push(AGGREGATE);
                queryFields.set(AGGREGATE, "readOnly");
                isAggregate = true;
            }else{
                rawQueryFields.push(func);
                queryFields.set(AGGREGATE + expCount,"readOnly");
                expCount++;
            }

        }else{

            const fieldName = field["name"]
            rawQueryFields.push(fieldName);
            if(fieldName == ID){
                queryFields.set(fieldName.toUpperCase(),"readOnly");
            }else if(fieldName.includes(".")){
                queryFields.set(fieldName.toUpperCase(),"readOnly");
            }else{
                queryFields.set(fieldName.toUpperCase(),"text");
            }

        }
    })

    return {
        done: true,
        sobjectType: sobjectType,
        queryFields: queryFields,
        rawQueryFields: rawQueryFields,
    }
}
