
const ApiType = {
    Partner:0,
    Apex:1,
    Tooling:2,
}

module.exports = {

    ApiType: ApiType,

    createParameters: (apiType, request) => {

        const version = request.apiversion ? request.apiversion : "43.0";
        const sessionId = request.header("Authorization");
        const serverUrl = request.header("Server-Url");
        const language = request.header("locale-options") ? request.header("locale-options") : "ja";

        if(apiType == ApiType.Partner){


            const host = request.body.sandbox ? "test.salesforce.com" : "login.salesforce.com";

            return {
                wsdl: "./resource/partner.wsdl.xml",
                version: version,
                sessionId: sessionId,
                serverUrl: serverUrl ? serverUrl : `https://${host}/services/Soap/u/${version}`,
                language: language,
                username: request.body.username,
                password: request.body.password,
                allOrNone: request.body.allOrNone,
                batchSize: 1
            }

        }

        if(apiType == ApiType.Apex){

            const defaults = {"Db":"INFO","Workflow":"INFO","Validation":"INFO","Callout":"INFO","Apex_code":"FINEST","Apex_profiling":"INFO","Visualforce":"INFO","System":"FINE","All":"NONE"};
            const defaultDebugOptions = Object.keys(defaults).map(e => {return {"category": e, "level" : defaults[e]}});

            return {
                wsdl: "./resource/apex.wsdl.xml",
                version: version,
                sessionId: sessionId,
                serverUrl: serverUrl.replace("Soap/u/", "Soap/s/"),
                language: language,
                debuggingHeader: request.body.debuggingHeader ? request.body.debuggingHeader : defaultDebugOptions,
            }

        }

        if(apiType == ApiType.Tooling){

            return {
                wsdl: "./resource/tooling.wsdl.xml",
                version: version,
                sessionId: sessionId,
                serverUrl: serverUrl.replace("Soap/u/", "Soap/T/"),
                language: language,
            }

        }

    }

}