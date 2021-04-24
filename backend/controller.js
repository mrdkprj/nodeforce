const url = require('url');
const fs = require('fs');
const SoapClient = require("./lib/SoapClient.js");
const soql = require("./lib/soql/soql.js");
//const csv = require("./lib/csv.js");
//const describeParser = require("./lib/describe/parser.js");
const Log_split_char = "|";
const Log_split_limit = 3;
const Log_headers = ["Timestamp", "Event", "Details"];
const QUERY_NO_RESULT = "Your query returned no results.";

async function login(client, params){
    return await client.login(params)
}

function header(req){
    return {
        sessionId: req.header("Authorization"),
        serverUrl: req.header("Server-Url"),
    }
}

module.exports = {

    test: () => {
        const text = fs.readFileSync("./resource/sample.json");
        return JSON.parse(text);
    },

    authenticate: async (body, response) => {
        return await SoapClient.init(body)
            .then(client => client.login(body))
            .catch(ex => {throw new Error(ex.cause.root.Envelope.Body.Fault.faultstring)})
    },

    query: async (req) => {

        const requestParam = soql.createParams(req.body);

        return await SoapClient.init(header(req)).then(client => client.query(requestParam).then(queryResult => soql.getResponse(req.body, queryResult)));

    },

    parseQueryResultTest: (response) => {
        return fs.readFileSync("./resource/sample.json");
    },

    parseQueryResult: (request, response, result) => {

        if(result.error){
            response.writeHead(400, {'Content-Type': 'text/json'});
            response.end(JSON.stringify(result));
            return;
        }

        if(result.startsWith(QUERY_NO_RESULT)){
            response.writeHead(400, {'Content-Type': 'text/json'});
            response.end(JSON.stringify({error:result}));
            return;
        }

        const queryResult = csv.CSVToArray(result, ",");
        queryResult.pop();
        response.writeHead(200, {'Content-Type': 'text/json'});
        response.end(JSON.stringify(
            {
                header: queryResult[0],
                rows: queryResult.slice(1),
                soqlInfo: {
                    soql: request.soql,
                    tabId: request.tabId,
                    timestamp: queryResult.length - 1 + " rows@" + new Date().toLocaleString('ja-JP')
                }
            }
        ));

    },

    parseApexResult: (response, apexResult) => {

        if(apexResult.error){
            response.writeHead(400, {'Content-Type': 'text/json'});
            response.end(JSON.stringify(apexResult));
            return;
        }

        //let logs = JSON.parse(apexResult).result.logs.split("\n").map(str => splitLimit(str));
        let logs = apexResult.split("\n").map(str => splitLimit(str));
        logs = logs.filter(log => log.length >= 1).map(log => fill_blank(log));
        response.writeHead(200, {'Content-Type': 'text/json'});
        response.end(JSON.stringify(
            {
                name: "executeAnonymous@" + new Date().toLocaleString('ja-JP'),
                data:{
                    header:Log_headers,
                    rows:logs
                }
            }
        ));

    },

    splitLimit : (str) => {

        const all = str.split("|");

        if(all.length > Log_split_limit){
            const splits = all.slice(0, Log_split_limit - 1);
            splits.push(all.slice(Log_split_limit).join(Log_split_char));
            return splits;
        }else{
            return all;
        }
    },

    fill_blank: (log) => {
        if(log.length == 1){
            return ["","",csv.escapeXml(log[0])];
        }else if(log.length == 2){
            return [log[0],log[1],""];
        }else{
            return log.map(item => csv.escapeXml(item));
        }
    },

}