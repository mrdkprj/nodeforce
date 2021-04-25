const soap = require('soap');

class SoapClient {

    constructor(client, params){
        this.client = client;

        const header = {
            "tns:SessionHeader": {"tns:sessionId": params.sessionId},
            "tns:AllOrNoneHeader" : {"tns:allOrNone": params.allOrNone},
            "tns:LocaleOptions" : {"tns:language": params.language},
        };

        if(params.batchSize){
            header["tns:QueryOptions"] = {"tns:batchSize": params.batchSize};
        }

        if(params.debuggingHeader){
            header["tns:DebuggingHeader"] = {"tns:categories" : params.debuggingHeader};
        }

        this.client.addSoapHeader((methodName, args, headers, req) => header);
    }

    static async init(params = {}) {

        const options = {
            endpoint: params.serverUrl
        }

        return new SoapClient(await soap.createClientAsync(params.wsdl, options), params)
    }

    async login(username, password){

        if(!username || !password){
            throw new Error("Must provide username/password or session_id/server_url.");
        }

        return await this.client.loginAsync({username: username, password: password})
            .then(results => {
                const result = results[0].result;
                return {username:result.userInfo.userName, token:result.sessionId, serverUrl:result.serverUrl};
            })
            .catch(ex => {throw new Error(ex.cause.root.Envelope.Body.Fault.faultstring);})
    }

    async query(soql){
        return await this.client.queryAsync({queryString: soql})
            .then(results => results[0].result)
            .catch(ex => {throw new Error(ex.cause.root.Envelope.Body.Fault.faultstring);})
    }

    async queryAll(soql){
        await this.client.queryAllAsync({queryString: soql})
            .then(r => r)
            .catch(ex => {throw new Error(ex.cause.root.Envelope.Body.Fault.faultstring);})
    }

    async executeAnonymous(code){
        const headerKey = "2";
        const bodyKey = "0";
        return await this.client.executeAnonymousAsync({string: code})
            .then(results => {
                return {header: results[headerKey], body:results[bodyKey]};
            })
            .catch(ex => {throw new Error(ex.cause.root.Envelope.Body.Fault.faultstring);})
    }
}

module.exports = SoapClient;
