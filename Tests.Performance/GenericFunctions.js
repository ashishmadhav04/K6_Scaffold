import http from "k6/http";
import { Rate } from "k6/metrics";
import { check } from "k6";

const eVariables = JSON.parse(open('./EnvironmentVariables.json'));

//set executionEnvironment as local for Local Execution & CircleCI for pipeline execution
let executionEnvironment = "CircleCI";

//set the environment as Beta/Test as it then pulls the variables from EnvironmentVariables.json file
let environment = "Beta";

let myErrors = new Rate("my_errors");

export function getAccessToken(){
    var response;
    var token;
    var values = this.getEnvironmentVariables();
    let uri = values.reader_url;

    const body = 
    {
        grant_type: "client_credentials",
        client_id: values.reader_client_id,
        client_secret: values.reader_client_secret,
        audience: values.reader_audience        
    }
        
    response = http.post(uri, body);
    token = JSON.parse(response.body)['access_token'];
    if(token == null || token == undefined)
    {
        throw Error("Access Token generation failed");
    }
    return token;
}

export function setHeaders(){
    const token = this.getAccessToken();
    const params = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "FromAppId": "121001"
        }
    }
    return params;
}


export function logError(functionName, response) {
    myErrors.add(1);
    var d = new Date();
    let timestamp = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    console.log(timestamp + "," + randomLoan + "," + functionName + "," + response.status + "," + response.headers["X-Correlation-Id"] + "," + response.headers["X-Amzn-Trace-Id"]);

}

export function getEnvironmentVariables()
{
    let i = eVariables.Environments.findIndex(x => x.environment.toLocaleLowerCase()==environment.toLocaleLowerCase());

    if (executionEnvironment == "local")
    {
        return{
            test : eVariables.TestName,
            environment : eVariables.Environments[i].environment,
            hostUrl : eVariables.Environments[i].host_url,
            url : eVariables.Environments[i].access_token_url,
            audience : eVariables.Environments[i].audience,
            client_id : eVariables.Environments[i].Client_Id,
            client_secret : eVariables.Environments[i].Client_Secret,
        }
    }
    else if (executionEnvironment == "CircleCI")
    {
        return{
            test : `${__ENV.TestType}`,
            environment : `${__ENV.Environment}`,
            hostUrl : eVariables.Environments[i].host_url,
            url : eVariables.Environments[i].access_token_url,
            audience : eVariables.Environments[i].audience,
            client_id : `${__ENV.Client_Id}`,
            client_secret : `${__ENV.Client_Secret}`,
        }
    }
}

export function getCalls(url, api, data, functionName, callRT, callTPS)
{
    let response = http.get(url + api, data); 
    let validateValidStateGuidelines = check(response,{
        "Status was 200": (r) => r.status == 200
    });

    if(!validateValidStateGuidelines){   
        this.logError(functionName, response);
    }
    else{
        callRT.add(response.timings.duration);
        callTPS.add(1);
    }
}

export function postCalls(url, api, body , data, functionName, callRT, callTPS)
{
    let response = http.post(url + api, JSON.stringify(body), data); 
    let validateValidStateGuidelines = check(response,{
        "Status was 200": (r) => r.status == 200
    });

    if(!validateValidStateGuidelines){   
        this.logError(functionName, response);
    }
    else{
        callRT.add(response.timings.duration);
        callTPS.add(1);
    }
}

export function putCalls(url, api, body , data, functionName, callRT, callTPS)
{
    let response = http.put(url + api, JSON.stringify(body), data); 
    let validateValidStateGuidelines = check(response,{
        "Status was 200": (r) => r.status == 200
    });

    if(!validateValidStateGuidelines){   
        this.logError(functionName, response);
    }
    else{
        callRT.add(response.timings.duration);
        callTPS.add(1);
    }
}