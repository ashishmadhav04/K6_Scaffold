# k6_Scaffold
This contains the base project for setting up k6 in any project

# Steps to run load test in local

This documentation contains how to execute Performance/Load test in local

**Step 1** Pull the latest master in your local and open the **GenericFunction.js** file under [PerformanceTests](https://github.com/ashishmadhav04/K6_Scaffold/blob/master/Tests.Performance/GenericFunctions.js)

**Step 2** Change executionEnvironment from **CircleCI** to **local** on line 7.
					Also set the environment as **Beta** or **Test** on line 10.

**Step 3** Open **EnvironmentVariables.json** file and set the **TestName** as to the one you want to execute
> Available tests (to be used as TestName in the above mentioned file) for execution are: 
> > Load Test (commonly used for load generation purpose)
> > Ramp Arrival Test 
> > Ramp Up Test
> > Health Test
> > GetSettings Test
> > PutUpdateSettings Test


Also add the Client_Id & Client_Secret values for the respective environment

**Step 4** If executing Load Test, open **PerformanceConfig.js** file and set load value in line 3 to whatever time you want the execution to happen.
> e.g: **`3m`** for 3 minutes of load test, **`100s`** for 100 seconds, **`1h`** for 1 hour duration


**Step 5** If executing Ramp Arrival Test/Ramp Up Test, make changes to **stage** variables as per requirement.
>In Ramp Arrival Test we increase the number of Api call/sec in a staggered manner by controlling the target rate and duration
>> `{ "duration": "10s", "target": 10 }` - Executes 10 calls/sec for 10 seconds
>>> **NOTE: No control over the number of Virtual Users (VUs) utilized during execution

>In Ramp Up Test we increase the number of Virtual Users (VUs) in a staggered manner by controlling the target rate and duration
>> `{ "duration": "10s", "target": 10 }` - Executes on 10 VUs for 10 seconds
>>> **NOTE: No control over the number of calls made per second during execution

**Step 6** In **TestScript.js** file add your api calls. A sample request is added for each GET/POST/PUT calls

**Step 7** Execution Steps: 
|                |Command                          |Description                         |
|----------------|-------------------------------|-----------------------------|
|Normal mode|k6 run TestScript.js --console-output ./Testlog.csv            |This executes the test selected from PerformanceConfig.js and logs the result in Testlog.csv file. This Testlog.csv file is generated on the fly          |
|Debug Mode          |k6 run --http-debug TestScript.js --console-output ./Testlog.csv           |This command executes the test selected from PerformanceConfig.js and logs the result in Testlog.csv file and also prints the entire request/response in the terminal for each API call made           |


