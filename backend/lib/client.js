const axios =  require('axios');
const xml2js = require('xml2js');
const parseOptions = {ignoreAttrs : true,explicitArray :false, tagNameProcessors: [xml2js.processors.stripPrefix]}
const helper  = require( "./helper.js");
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
        const code = response.Envelope.Body.Fault.faultcode;
        if(!code || !code.startsWith("sf:")){
            throw new Error("Unknown error occurred.")
        }

        throw new Error(response.Envelope.Body.Fault.faultstring);
    }
}

function createCallOptions(params){
    return {url: params.serverUrl, data: params.body }
}

module.exports = {

        login: async (request) => {

            const params = helper.createLoginParameters(request);

            const response = await call(createCallOptions(params));
            const result = response.Body.loginResponse.result;
            return {userInfo:result.userInfo, token:result.sessionId, serverUrl:result.serverUrl, sessionSeconds:result.userInfo.sessionSecondsValid};

        },

        logout: async (request) => {

            const params = helper.createLogoutParameters(request);

            return await call(createCallOptions(params));
        },

        query: async (request) => {

            const params = helper.createQueryParameters(request);

            const response = await call(createCallOptions(params));
            const result = response.Body.queryResponse.result;
            return soql.parse(request.body, result);
        },

        listSobject: async (request) => {

            const params = helper.createListSobjectParameters(request);
            const response = await call(createCallOptions(params));
            return {list: response.Body.describeGlobalResponse.result.sobjects};
        },

        describe: async (request) => {
            const params = helper.createDescribeParameters(request);
            const response = await call(createCallOptions(params));
            const result = response.Body.describeSObjectsResponse.result;
            return describe.parse(request.body, result);
        },

        execute: async (request) => {

            const params = helper.createExecuteParameters(request);

            const response = await call(createCallOptions(params));
            const result = {header: response.Header, body:response.Body.executeAnonymousResponse}
            return apex.parse(request.body, result);
        },

}
