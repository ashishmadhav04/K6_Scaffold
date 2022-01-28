// Circle-CI
let perf = `perf_duration`;
let load = `load_duration`;
let spike = `spike_duration`;

//Test Type and Executor Constants (Do not change)
let get_health = "get_health";
let get_loan_settings = "get_loan_settings";
let put_update_client_settings = "put_update_client_settings";
let put_update_loan_settings = "put_update_loan_settings";

let stage = [
    { "duration": "10s", "target": 10 },
    { "duration": "25s", "target": 10 },
    { "duration": "10s", "target": 20 },
    { "duration": "25s", "target": 20 },
    { "duration": "10s", "target": 25 },
    { "duration": "25s", "target": 25 },
    { "duration": "10s", "target": 30 },
    { "duration": "35s", "target": 30 },
    { "duration": "10s", "target": 15 },
    { "duration": "15s", "target": 15 },
    { "duration": "5s", "target": 0 },
]

// Duration by Test Type (Change as needed)
//let perf = `3m`
//let load = `2m`
//let spike =`1m`

let debug_duration = `1m`;
let get_health_duration = `10s`;
let get_loan_settings_duration = `10s`;
let put_update_client_settings_duration = `10s`;
let put_update_loan_settings_duration = `10s`;

//Rate by Test Type
let get_health_rate = 20
let get_loan_settings_rate = 20
let put_update_client_settings_rate = 20
let put_update_loan_settings_rate = 20

module.exports = {
    "TestTypes": [
        {
            "test": "Ramp Arrival Test",
            "Options": {
                "discardResponseBodies": false,
                "scenarios": {
                    get_health:
                    {
                        executor: 'ramping-arrival-rate',
                        startRate: 5,
                        timeUnit: '1s',
                        preAllocatedVUs: 50,
                        maxVUs: 500,
                        "stages": stage,
                        "exec": get_health
                    },
                    get_loan_settings:
                    {
                        executor: 'ramping-arrival-rate',
                        startRate: 5,
                        timeUnit: '1s',
                        preAllocatedVUs: 50,
                        maxVUs: 500,
                        "stages": stage,
                        "exec": get_loan_settings
                    },
                    put_update_client_settings:
                    {
                        executor: 'ramping-arrival-rate',
                        startRate: 5,
                        timeUnit: '1s',
                        preAllocatedVUs: 50,
                        maxVUs: 500,
                        "stages": stage,
                        "exec": put_update_client_settings
                    },
                    put_update_loan_settings:
                    {
                        executor: 'ramping-arrival-rate',
                        startRate: 5,
                        timeUnit: '1s',
                        preAllocatedVUs: 50,
                        maxVUs: 500,
                        "stages": stage,
                        "exec": put_update_loan_settings
                    },
                },
                "tags": {
                    "AppName": "Circle Pipeline",
                    "TrainName": "Platforms",
                    "Application ID": "101001",
                    "QualityGate": "Put Update Loan Settings"
                        },
                "thresholds": {
                    "http_req_duration": ["p(95)<15000", "p(99)<20000"],
                    "http_reqs": ["count >= 1000"],
                    "dropped_iterations": ["count <= 1500"],
                },
            }
        },
        {
            "test": "Ramp Up Test",
            "Options": {
                "batch": 100,
                "discardResponseBodies": false,
                "scenarios":
                {
                    get_health:
                    {
                        "executor": "ramping-vus",
                        "startVUs": 0,
                        "stages": stage,
                        "gracefulRampDown": '0s',
                        "exec": get_health
                    },
                    get_loan_settings:
                    {
                        "executor": "ramping-vus",
                        "startVUs": 0,
                        "stages": stage,
                        "gracefulRampDown": '0s',
                        "exec": get_loan_settings
                    },
                    put_update_client_settings:
                    {
                        "executor": "ramping-vus",
                        "startVUs": 0,
                        "stages": stage,
                        "gracefulRampDown": '0s',
                        "exec": put_update_client_settings
                    },
                    put_update_loan_settings:
                    {
                        "executor": "ramping-vus",
                        "startVUs": 0,
                        "stages": stage,
                        "gracefulRampDown": '0s',
                        "exec": put_update_loan_settings
                    }
                },
                "tags": {
                    "AppName": "Circle Pipeline",
                    "TrainName": "Platforms",
                    "Application ID": "101001",
                    "QualityGate": "Put Update Loan Settings"
                },
                "thresholds": {
                    "http_req_duration": ["p(95)<15000", "p(99)<20000"],
                    "http_reqs": ["count >= 1000"],
                    "dropped_iterations": ["count <= 1500"],
                },
            }
        },
        {
            "test": "Load Test",
            "Options": {
                "discardResponseBodies": false,  //httpDebug: 'full', --set http debug to true to print the entire request/response body                                        
                "scenarios": {
                    get_health: {
                        "executor": "constant-arrival-rate",
                        "rate": get_health_rate,
                        "timeUnit": "1s",
                        "duration": load,
                        "preAllocatedVUs": 50,
                        "maxVUs": 500,
                        "exec": get_health
                    },
                    get_loan_settings: {
                        "executor": "constant-arrival-rate",
                        "rate": get_loan_settings_rate,
                        "timeUnit": "1s",
                        "duration": load,
                        "preAllocatedVUs": 50,
                        "maxVUs": 500,
                        "exec": get_loan_settings
                    },
                    put_update_client_settings: {
                        "executor": "constant-arrival-rate",
                        "rate": put_update_client_settings_rate,
                        "timeUnit": "1s",
                        "duration": load,
                        "preAllocatedVUs": 50,
                        "maxVUs": 500,
                        "exec": put_update_client_settings
                    },
                    put_update_loan_settings: {
                        "executor": "constant-arrival-rate",
                        "rate": put_update_loan_settings_rate,
                        "timeUnit": "1s",
                        "duration": load,
                        "preAllocatedVUs": 50,
                        "maxVUs": 500,
                        "exec": put_update_loan_settings
                    }
                },
                "tags": {
                    "AppName": "Circle Pipeline",
                    "TrainName": "Platforms",
                    "Application ID": "101001",
                    "QualityGate": "Put Update Loan Settings"
                },
                "thresholds": {
                    "http_req_duration": ["p(95)<15000", "p(99)<20000"],
                    "http_reqs": ["count >= 500"],
                    "dropped_iterations": ["count <= 750"],
                },
            }
        },
        {
            "test": "Health Test",
            "Options": {
                "discardResponseBodies": false,
                "scenarios": {
                    get_health: {
                        "executor": "constant-arrival-rate",
                        "rate": get_health_rate,
                        "timeUnit": "1s",
                        "duration": load,
                        "preAllocatedVUs": 50,
                        "maxVUs": 500,
                        "exec": get_health
                    }
                },
                "tags": {
                    "AppName": "Circle Pipeline",
                    "TrainName": "Platforms",
                    "Application ID": "101001",
                    "QualityGate": "Put Update Loan Settings"
                },
                "thresholds": {
                    "http_req_duration": ["p(95)<15000", "p(99)<20000"],
                    "http_reqs": ["count >= 500"],
                    "dropped_iterations": ["count <= 750"],
                },
            }
        },
        {
            "test": "GetLoanSettings Test",
            "Options": {
                "discardResponseBodies": false,
                "scenarios": {
                    get_loan_settings: {
                        "executor": "constant-arrival-rate",
                        "rate": get_loan_settings_rate,
                        "timeUnit": "1s",
                        "duration": load,
                        "preAllocatedVUs": 50,
                        "maxVUs": 500,
                        "exec": get_loan_settings
                    }
                },
                "tags": {
                    "AppName": "Circle Pipeline",
                    "TrainName": "Platforms",
                    "Application ID": "101001",
                    "QualityGate": "Put Update Loan Settings"
                },
                "thresholds": {
                    "http_req_duration": ["p(95)<15000", "p(99)<20000"],
                    "http_reqs": ["count >= 500"],
                    "dropped_iterations": ["count <= 750"],
                },
            }
        },
        {
            "test": "PutUpdateClientSettings Test",
            "Options": {
                "discardResponseBodies": false,
                "scenarios": {
                    put_update_client_settings: {
                        "executor": "constant-arrival-rate",
                        "rate": put_update_client_settings_rate,
                        "timeUnit": "1s",
                        "duration": load,
                        "preAllocatedVUs": 50,
                        "maxVUs": 500,
                        "exec": put_update_client_settings
                    }
                },
                "tags": {
                    "AppName": "Circle Pipeline",
                    "TrainName": "Platforms",
                    "Application ID": "101001",
                    "QualityGate": "Put Update Loan Settings"
                },
                "thresholds": {
                    "http_req_duration": ["p(95)<15000", "p(99)<20000"],
                    "http_reqs": ["count >= 500"],
                    "dropped_iterations": ["count <= 750"],
                },
            }
        },
        {
            "test": "PutUpdateLoanSettings Test",
            "Options": {
                "discardResponseBodies": false,
                "scenarios": {
                    put_update_loan_settings: {
                        "executor": "constant-arrival-rate",
                        "rate": put_update_loan_settings_rate,
                        "timeUnit": "1s",
                        "duration": load,
                        "preAllocatedVUs": 50,
                        "maxVUs": 500,
                        "exec": put_update_loan_settings
                    }
                },
                "tags": {
                    "AppName": "Circle Pipeline",
                    "TrainName": "Platforms",
                    "Application ID": "101001",
                    "QualityGate": "Put Update Loan Settings"
                },
                "thresholds": {
                    "http_req_duration": ["p(95)<15000", "p(99)<20000"],
                    "http_reqs": ["count >= 500"],
                    "dropped_iterations": ["count <= 750"],
                },
            }
        }
    ]
}