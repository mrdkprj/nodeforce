const axios =  require('axios');
const xml2js = require('xml2js');
const parseOptions = {ignoreAttrs : true,explicitArray :false, tagNameProcessors: [xml2js.processors.stripPrefix]}
const api  = require( "./helper.js");
const soql = require("./parser/query-result-parser.js");
const apex = require("./parser/apex-result-parser.js");
const describe = require("./parser/describe-result-parser.js");
const headers = {
    "Content-Type": "text/xml",
    "SOAPAction": '""'
};

async function call({url, method = "post", data}){

    const options = {
        method,
        url,
        headers,
        data,
        timeout: 15000
    }

    try{
        const response = await axios(options);
        const result = await xml2js.parseStringPromise(response.data, parseOptions);
        return result.Envelope;
    }catch(ex){
        const response = await xml2js.parseStringPromise(ex.response.data, parseOptions);
        const message = response.Envelope.Body.Fault.faultstring;
        throw new Error(message);
    }
}

function createCallOptions(params){
    return {url: params.serverUrl, data: params.body }
}

module.exports = {

        login: async (request) => {

            const params = api.createLoginParameters(request);

            const response = await call(createCallOptions(params));
            const result = response.Body.loginResponse.result;
            return {username:result.userInfo.userName, token:result.sessionId, serverUrl:result.serverUrl};

        },

        logout: async (request) => {

            const params = api.createLogoutParameters(request);

            return await call(createCallOptions(params));
        },

        query: async (request) => {

            const params = api.createQueryParameters(request);

            const response = await call(createCallOptions(params));
            const result = response.Body.queryResponse.result;
            return soql.parse(request.body, result);
        },

        listSobject: async (request) => {

            const params = api.createListSobjectParameters(request);
            const response = await call(createCallOptions(params));
            return {list: response.Body.describeGlobalResponse.result.sobjects};
        },

        describe: async (request) => {
            const params = api.createDescribeParameters(request);
            const response = await call(createCallOptions(params));
            const result = response.Body.describeSObjectsResponse.result;
            return describe.parse(request.body, result);
        },

        execute: async (request) => {

            const params = api.createExecuteParameters(request);

            const response = await call(createCallOptions(params));
            const result = {header: response.Header, body:response.Body.executeAnonymousResponse}
            return apex.parse(request.body, result);
        },

}
