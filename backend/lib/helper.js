const xml2js = require('xml2js');

module.exports = {

    createLoginParameters: (request) => {

        const common = commons(request);

        const body = createLoginBody(request.body.username, request.body.password)

        const host = request.body.sandbox ? "test.salesforce.com" : "login.salesforce.com";

        common.serverUrl = `https://${host}/services/Soap/u/${common.version}`;

        return {
            body: body,
            ...common,
        }
    },

    createLogoutParameters: (request) => {
        const common = commons(request);
        return {
            body: createLogoutBody(common.sessionId),
            ...common,
        }
    },

    createQueryParameters: (request) => {

        const common = commons(request);
        const soql = request.body.soql;
        const tooling = request.body.tooling;

        const body = createQueryBody(common.sessionId, soql, tooling);

        if(tooling){
            common.serverUrl = common.serverUrl.replace("Soap/u/", "Soap/T/");
        }

        return {
            body: body,
            soql: soql,
            ...common,
        }
    },

    createListSobjectParameters: (request) => {

        const common = commons(request);
        const body = createListSobjectBody(common.sessionId);
        return {
            body: body,
            ...common,
        }
    },

    createDescribeParameters: (request) => {

        const common = commons(request);
        const body = createDescribeBody(common.sessionId, request.body.sobject);
        return {
            body: body,
            ...common,
        }
    },

    createExecuteParameters: (request) => {

        const common = commons(request);

        const debuggingHeader = request.body.debuggingHeader;
        const debugInfo = Object.keys(request.body.debuggingHeader).map(e => {return {"categories" : {"category": e, "level" : debuggingHeader[e]}}});
        const builder = new xml2js.Builder({headless :true, rootName :"tns:DebuggingHeader",renderOpts:{'pretty': false}});

        const body = createExecuteBody(common.sessionId, builder.buildObject(debugInfo), request.body.code)

        common.serverUrl = common.serverUrl.replace("Soap/u/", "Soap/s/");

        return {
            body: body,
            ...common,
        }

    }

}

const createLoginBody = (username, password) => {
    return [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">',
        '<soap:Header/>',
        '<soap:Body>',
            '<login xmlns="urn:partner.soap.sforce.com">',
            '<username>' + username + '</username>',
            '<password>' + password + '</password>',
            '</login>',
        '</soap:Body>',
        '</soap:Envelope>'
    ].join('');
};

const createLogoutBody = (sessionId) => {
    return [
        '<?xml version="1.0" encoding="utf-8"?>',
        `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">`,
        '<soap:Header>',
            '<soap:SessionHeader>',
                `<soap:sessionId>${sessionId}</soap:sessionId>`,
            '</soap:SessionHeader>',
        '</soap:Header>',
        '<soap:Body>',
            '<logout xmlns="urn:partner.soap.sforce.com"/>',
        '</soap:Body>',
        '</soap:Envelope>'
    ].join('');
};

const createQueryBody = (sessionId, soql, tooling) => {

    const query = soql.replace(/\r|\n|\r\n/gi, " ").replace(";", "");

    const tns = tooling ? "urn:tooling.soap.sforce.com" : "urn:partner.soap.sforce.com";

    return [
        '<?xml version="1.0" encoding="utf-8"?>',
        `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="${tns}">`,
        '<soap:Header>',
            '<tns:SessionHeader>',
                `<tns:sessionId>${sessionId}</tns:sessionId>`,
            '</tns:SessionHeader>',
            '<tns:QueryOptions><tns:batchSize>1</tns:batchSize></tns:QueryOptions>',
        '</soap:Header>',
        '<soap:Body>',
            `<query xmlns="${tns}">`,
                `<queryString>${query}</queryString>`,
            '</query>',
        '</soap:Body>',
        '</soap:Envelope>'
    ].join('');
};

const createListSobjectBody = (sessionId) => {
    return [
        '<?xml version="1.0" encoding="utf-8"?>',
        `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">`,
        '<soap:Header>',
            '<soap:SessionHeader>',
                `<soap:sessionId>${sessionId}</soap:sessionId>`,
            '</soap:SessionHeader>',
        '</soap:Header>',
        '<soap:Body>',
            '<describeGlobal xmlns="urn:partner.soap.sforce.com"/>',
        '</soap:Body>',
        '</soap:Envelope>'
    ].join('');
};

const createDescribeBody = (sessionId, name) => {

    return [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="urn:partner.soap.sforce.com">',
        '<soap:Header>',
            '<tns:SessionHeader>',
                `<tns:sessionId>${sessionId}</tns:sessionId>`,
            '</tns:SessionHeader>',
        '</soap:Header>',
        '<soap:Body>',
            '<describeSObjects xmlns="urn:partner.soap.sforce.com">',
                `<sObjectType>${name}</sObjectType>`,
            '</describeSObjects>',
        '</soap:Body>',
        '</soap:Envelope>'
    ].join('');
};

const createExecuteBody = (sessionId, debuggingHeader, code) => {
    return [
        '<?xml version="1.0" encoding="utf-8"?>',
        '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  xmlns:tns="http://soap.sforce.com/2006/08/apex">',
        '<soap:Header>',
            '<tns:SessionHeader>',
                `<tns:sessionId>${sessionId}</tns:sessionId>`,
            '</tns:SessionHeader>',
            debuggingHeader,
        '</soap:Header>',
        '<soap:Body>',
            '<executeAnonymous xmlns="http://soap.sforce.com/2006/08/apex">',
                `<string>${code}</string>`,
            '</executeAnonymous>',
        '</soap:Body>',
        '</soap:Envelope>'
    ].join('');

};

const commons = (request) => {
    return {
        version: request.apiversion ? request.apiversion : "43.0",
        sessionId: request.session.token,
        serverUrl: request.session.serverUrl,
        language: request.header("locale-options") ? request.header("locale-options") : "ja",
    }
};