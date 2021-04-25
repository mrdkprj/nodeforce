const SPLIT_LIMIT = 3;
const LOG_HEADER = ["Timestamp", "Event", "Details"];

class Apex{

    static createParams(body){
        return body.code;
    }

    static parse(req, apexResult){

        const result = apexResult.body.result;

        if(result.success == false){
            if(result.compiled){
                throw new Error(result.exceptionStackTrace + "\n" + result.exceptionMessage);
            }

            throw new Error("Line " + result.line + "\n" + result.compileProblem);
        }

        const log = apexResult.header.DebuggingInfo.debugLog;

        let logs = log.split("\n").map(str => this.splitLimit(str));

        logs = logs.filter(log => log.length >= 1).map(log => this.format(log));

        return {
                logName: "executeAnonymous@" + new Date().toLocaleString('ja-JP'),
                header: LOG_HEADER,
                rows: logs,
                tabId: req.tabId,
            };
    };

    static splitLimit(str){

        const all = str.split("|");

        if(all.length > SPLIT_LIMIT){
            const splits = all.slice(0, SPLIT_LIMIT - 1);
            splits.push(all.slice(SPLIT_LIMIT).join("|"));
            return splits;
        }else{
            return all;
        }
    };

    static format(log){
        if(log.length == 1){
            return ["","",log[0]];
        }else if(log.length == 2){
            return [log[0],log[1],""];
        }else{
            return log;
        }
    };

}

module.exports = Apex;