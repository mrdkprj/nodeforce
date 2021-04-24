const soap = require('soap');

class ToolingClient {

    constructor(client, params){
        this.client = client;
        this.client.addSoapHeader((methodName, args, headers, req) => {
            const x = {"Db":"INFO","Workflow":"INFO","Validation":"INFO","Callout":"INFO","Apex_code":"FINEST","Apex_profiling":"INFO","Visualforce":"INFO","System":"FINE","All":"NONE"};
            const b = Object.keys(x).map(e => {return {"category": e, "level" : x[e]}});
            console.log(b);
            return {
                "tns:SessionHeader": {"tns:sessionId": params.sessionId},
                "tns:DebuggingHeader": {"tns:categories" : b},
                //"tns:AllOrNoneHeader" : {"tns:allOrNone": true},
                //"tns:QueryOptions":{"tns:batchSize": 1}
                //"tns:LocaleOptions" : {"tns:language": options[:language]}
            };
        });
    }

    static async init(params = {}) {
        if(!params.sessionId || !params.serverUrl){
            throw new Error("Must provide session_id/server_url.");
        }
        const endpoint = params.serverUrl.replace("Soap/u/", "Soap/s/");

        const wsdlPath = "./resource/apex.wsdl.xml";
        const options = {
            endpoint: endpoint
        }

        return new ToolingClient(await soap.createClientAsync(wsdlPath, options), params)
    }

    async executeAnonymous(code){
        return await this.client.executeAnonymousAsync({string: code})
            .then(results => results["2"])
            .catch(r => {console.log(r.body); return r;})
    }

    async query(soql){
        await this.client.queryAllAsync({queryString: soql})
            .then(r => r)
            .catch(e => {throw new Error(e.message)})
    }

}

module.exports = ToolingClient;
