const fs = require('fs');
const axios =  require( 'axios');
const xml2js = require('xml2js');
const api  = require( "./lib/headers.js");

async function call({headers, url, method = "post", data}){

    const options = {
        method,
        url,
        headers,
        data,
        timeout: 15000
    }

    return await axios(options);
}

module.exports = {

        test: () => {
            const text = fs.readFileSync("./resource/sample.json");
            return JSON.parse(text);
        },

        authenticate: async (headers = {}, req) => {
            headers["Content-Type"] = "text/xml";
            headers["SOAPAction"] = '""';

            const params = headers.createParameters(headers.ApiType.Soap, req);

            const body = headers.createLoginBody(req);

            try{
                const results = await call({headers, url:params.serverUrl, data:body });
                const result = results.data;
                console.log(result)
                return {username:result.userInfo.userName, token:result.sessionId, serverUrl:result.serverUrl};
            }catch(ex){
                throw new Error(ex.cause.root.Envelope.Body.Fault.faultstring);
            }
        },

        query: async (headers = {}, req) => {
            headers['Content-Type'] = 'application/json'

            const apiType = req.body.tooling ? headers.ApiType.Tooling : headers.ApiType.Partner;

            const params = headers.createParameters(apiType, req);

            const requestParam = soql.createParams(req.body);

            return await soapClient.init(params)
                .then(client => client.query(requestParam)
                .then(queryResult => soql.getResponse(req.body, queryResult)))
        },

        execute: async (headers = {}, req) => {
            headers["Content-Type"] = "text/xml";
            headers["SOAPAction"] = '""';

            const params = headers.createParameters(headers.ApiType.Apex, req);

            const requestParam = apex.createParams(req.body);

            return await soapClient.init(params)
                .then(client => client.executeAnonymous(requestParam)
                .then(queryResult => apex.parse(req.body, queryResult)))
        },

}
