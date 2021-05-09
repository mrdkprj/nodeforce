const fs = require('fs');
const soapClient = require("./lib/soap-client.js");
const api = require("./lib/api.js");
const soql = require("./lib/soql/soql.js");
const apex = require("./lib/apex/apex.js");

module.exports = {

    test: () => {
        const text = fs.readFileSync("./resource/sample.json");
        return JSON.parse(text);
    },

    authenticate: async (req) => {

        const params = api.createParameters(api.ApiType.Partner, req);

        return await soapClient.init(params)
            .then(client => client.login(req.body.username, req.body.password))
    },

    query: async (req) => {

        const apiType = req.body.tooling ? api.ApiType.Tooling : api.ApiType.Partner;

        const params = api.createParameters(apiType, req);

        const requestParam = soql.createParams(req.body);

        return await soapClient.init(params)
            .then(client => client.query(requestParam)
            .then(queryResult => soql.getResponse(req.body, queryResult)))
    },

    execute: async (req) => {

        const params = api.createParameters(api.ApiType.Apex, req);

        const requestParam = apex.createParams(req.body);

        return await soapClient.init(params)
            .then(client => client.executeAnonymous(requestParam)
            .then(queryResult => apex.parse(req.body, queryResult)))
    },


}
