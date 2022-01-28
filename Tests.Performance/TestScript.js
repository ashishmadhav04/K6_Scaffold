// The purpose of this script is to performance test the Loan Client Settings Service
import http from "k6/http";
import { check, sleep, group, fail, abort } from "k6";
import { Rate, Trend, Counter, Gauge } from "k6/metrics";
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

var performanceOptions = require('./PerformanceConfig.js');
var genericFunctions = require('./GenericFunctions.js');

// Use papaparse.js to open data.csv file
// The following can be uncommented when the tests/endpoints need to be data-driven
const csvData = papaparse.parse(open("./TestData.csv"), {header: true});

let randomData = csvData.data[Math.floor(Math.random() * csvData.data.length)];
let randomLoan = randomData.LoanNumber;
let randomGUID = randomData.Guid;
let randomRAID = randomData.Raid;
let randomGCID = randomData.Gcid;

var header; 
var params;

// ERROR CODES
let myErrors = new Rate("my_errors");

// TRENDS
let GetHealthRT = new Trend("GetHealthRT");  //response time
let GetHealthTPS = new Counter("GetHealthTPS");  //transactions per second
let GetLoanSettingsRT = new Trend("GetLoanSettingsRT");
let GetLoanSettingsTPS = new Counter("GetLoanSettingsTPS");  
let PutUpdateLoanSettingsRT = new Trend("PutUpdateLoanSettingsRT");  
let PutUpdateLoanSettingsTPS = new Counter("PutUpdateLoanSettingsTPS");  
let PutUpdateClientSettingsRT = new Trend("PutUpdateClientSettingsRT");  
let PutUpdateClientSettingsTPS = new Counter("PutUpdateClientSettingsTPS");  

let variables = genericFunctions.getEnvironmentVariables();
let environment = variables.environment;
let test = variables.test;
let url = variables.hostUrl;

export let options = {};

let isValidTest = false;
switch(test){
    case "Load Test":
    case "Ramp Up Test":
    case "Ramp Arrival Test":
    case "Health Test":
    case "GetLoanSettings Test":
    case "PutUpdateClientSettings Test":
        options = performanceOptions.TestTypes.find(element => element.test == test).Options;
        isValidTest = true;
}
if (!isValidTest)
{
        console.log("Please select test type");
}

let d;

export function setup(){
    d = new Date();
    console.log("Test Start - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
    console.log("Timestamp,LoanNumber,Endpoint,ResponseCode,Correlation ID,Amazon Trace ID");
    if(params == null || params == undefined)
    {
        params = genericFunctions.setHeaders();
    }
    return params;
}

export function get_loan_settings(data) {
    group("GetLoanSettings", function()
    {
        let response = http.get(`${url}/api/v1/loanClientSetting/loan/${randomLoan}/client/${randomGUID}`, data);
        let validateResponse = check(response,
            {
            "Status was 200": (r) => r.status == 200
            });
        if(!validateResponse){
            genericFunctions.logError("GetLoanSettings", response);
        }
        else{
            GetLoanSettingsRT.add(response.timings.duration);
            GetLoanSettingsTPS.add(1);
        }
    });
};

export function post_update_client_settings(data) {
    group("PutUpdateFunctionName", function(){
        let random10digit = (Math.floor(Math.random() * 10000000000) + 10000000000).toString().substring(1);
         let preferredContactMethod = ["CellPhone","Email","HomePhone","WorkPhone"];
         let bestTimesToCall = ["Morning","Afternoon","Evening"];
         preferredContactMethod = preferredContactMethod[Math.floor(Math.random() * 3) + 0];
         bestTimesToCall = bestTimesToCall[Math.floor(Math.random() * 3) + 0];
        let postBody = {
            fromAppId: "208543",
            loanNumber: `${randomLoan}`,
            gcId: `${randomGCID}`,
            raId: `${randomRAID}`,
            servicingClientGuid: `${randomGUID}`,
            name: {
                firstName: "dolfly",
                middleName: "deca",
                lastName: "blenky"
            },
            emailAddress: "just_testing@qe.com",
            address: {
                addressLine1: "5620 wessex ct",
                addressLine2: "1111",
                city: "Troy",
                state: "MI",
                zipCode: "48084"
            },
            phoneNumbers: {
                homePhone: random10digit,
                cellPhone: random10digit,
                workPhone: random10digit,
                workExtension: "1111"
            },
            preferredContactMethods: [
                preferredContactMethod
            ],
            bestTimesToCall: [
                bestTimesToCall
            ]
        };
        let response = http.post(url + "api-url", JSON.stringify(postBody), data);
        let validateResponse = check(response,
        {
            "Status was 200": (r) => r.status == 200
        });
        if(!validateResponse)
        {
            genericFunctions.logError("PutUpdateFunctionName", response);
        }
        else
        {
            PutUpdateClientSettingsRT.add(response.timings.duration);
            PutUpdateClientSettingsTPS.add(1);
        }
    });
};

export function put_update_loan_settings(data) {
    group("PutUpdateLoanSettings", function(){
        let putBody = {
            IsPaperlessEnabled: true,
            FromAppId: "121001",
            LoanNumber: `${randomLoan}`
        }
        let response = http.put(url + "/api-url", JSON.stringify(putBody), data);
        let validateResponse = check(response,
        {
            "Status was 200": (r) => r.status == 200
        });
        if(!validateResponse)
        {
            genericFunctions.logError("PutUpdateLoanSettings", response);
        }
        else
        {
            PutUpdateLoanSettingsRT.add(response.timings.duration);
            PutUpdateLoanSettingsTPS.add(1);
        }
    });
};

export function teardown(data){
    var d = new Date();
    console.log("Test End - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds());
}

export function handleSummary(data) {
    return {
        "/perfTestResults/summary.html": htmlReport(data), //-- this is to generate the handleSummary.html file in Circle CI
        //"./summary.html": htmlReport(data), -- This is to generate the summary.html file in local
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}