const parser = require("./query-result-parser.js");

module.exports = {

    getResponse: (request, queryResult) => {

        const parsedResult = parser.parse(request.body.soql, queryResult);

        return {
            columns:parsedResult.columns,
            rows:parsedResult.records,
            soqlInfo: {
                soql: request.body.soql,
                tabId: request.body.tabId,
                timestamp: parsedResult.recordCount - 1 + " rows@" + new Date().toLocaleString('ja-JP')
            }
        }

    }

}
