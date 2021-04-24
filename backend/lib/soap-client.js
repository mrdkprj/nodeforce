const soap = require('soap');

class SoapClient {

    constructor(client, params){
        this.client = client;
        this.client.addSoapHeader((methodName, args, headers, req) => {
            return {
                "tns:SessionHeader": {"tns:sessionId": params.sessionId},
                "tns:AllOrNoneHeader" : {"tns:allOrNone": true},
                "tns:QueryOptions":{"tns:batchSize": 1}
                //"tns:LocaleOptions" : {"tns:language": options[:language]}
            };
        });
    }

    static async init(params = {}) {
        const version = params.version ? params.version : "43.0";
        const host = params.host ? params.host : 'login.salesforce.com';
        const endpoint = params.serverUrl ? params.serverUrl : `https://${host}/services/Soap/u/${version}`;

        const wsdlPath = "./resource/partner.wsdl.xml";
        const options = {
            endpoint: endpoint
        }

        return new SoapClient(await soap.createClientAsync(wsdlPath, options), params)
    }

    async login(options = {}){

        if(!options.username || !options.password){
            throw new Error("Must provide username/password or session_id/server_url.");
        }

        return await this.client.loginAsync({username: options.username, password: options.password})
            .then(results => {
                const result = results[0].result;
                return {username:result.userInfo.userName, token:result.sessionId, serverUrl:result.serverUrl};
            })
    }

    async query(soql){
        return await this.client.queryAsync({queryString: soql})
            .then(results => results[0].result)
    }

    async queryAll(soql){
        await this.client.queryAllAsync({queryString: soql})
            .then(r => r)
            .catch(e => {throw new Error(e.message)})
    }

}

module.exports = SoapClient;
