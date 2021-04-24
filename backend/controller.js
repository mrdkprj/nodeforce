const fs = require('fs');
const SoapClient = require("./lib/soap-client.js");
const ToolingClient = require("./lib/tooling-client.js")
const soql = require("./lib/soql/soql.js");
const apex = require("./lib/apex/apex.js");

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

        return await SoapClient.init(header(req))
            .then(client => client.query(requestParam)
            .then(queryResult => soql.getResponse(req.body, queryResult)))
            .catch(ex => {throw new Error(ex.cause.root.Envelope.Body.Fault.faultstring)})

    },

    execute: async (req) => {

        const requestParam = apex.createParams(req.body);

        return await ToolingClient.init(header(req))
            .then(client => client.executeAnonymous(requestParam)
            .then(queryResult => apex.parse(req.body, queryResult)))
            .catch(ex => {console.log(ex);throw new Error(ex.cause.root.Envelope.Body.Fault.faultstring)})

    },


}