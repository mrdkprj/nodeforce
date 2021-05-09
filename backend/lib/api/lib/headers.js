
const ApiType = {
    Soap:0,
    Apex:1,
    Tooling:2,
}

module.exports = {

    ApiType: ApiType,

    createLoginBody: (request) =>{

        return [
            '<tns:Envelope xmlns:tns="http://schemas.xmlsoap.org/soap/envelope/">',
            '<tns:Header/>',
            '<tns:Body>',
                '<login xmlns="urn:partner.soap.sforce.com">',
                '<username>' + request.body.username + '</username>',
                '<password>' + request.body.password + '</password>',
                '</login>',
            '</tns:Body>',
            '</tns:Envelope>'
        ].join('');
    }
    createParameters: (apiType, request) => {

        const version = request.apiversion ? request.apiversion : "43.0";

        if(apiType == ApiType.Soap){


            const host = request.sandbox ? "test.salesforce.com" : "login.salesforce.com";

            if(request.sessionId){
                return {
                    version: version,
                    serverUrl: request.body.serverUrl,
                    sessionId: request.body.sessionId,
                    allOrNone: request.body.allOrNone,
                    batchSize: 1
                }
            }else{
                return {
                    version: version,
                    serverUrl: request.serverUrl ? request.serverUrl : `https://${host}/services/Soap/u/${version}`,
                    username: request.body.username,
                    password: request.body.password,
                }
            }

        }

        if(apiType == ApiType.Apex){

            const debuggingHeader = request.debuggingHeader;
            let debugInfo = [{"category":"All", "level":"INFO"}];
            if(debuggingHeader){
                debugInfo = Object.keys(debuggingHeader).map(e => {return {"category": e, "level" : debuggingHeader[e]}})
            }

            return {
                wsdl: "./resource/apex.wsdl.xml",
                version: version,
                sessionId: sessionId,
                serverUrl: serverUrl.replace("Soap/u/", "Soap/s/"),
                language: language,
                debuggingHeader: debugInfo,
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
