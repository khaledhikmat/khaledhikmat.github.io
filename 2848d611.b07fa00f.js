(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{138:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return p}));var a=n(0),r=n.n(a);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=r.a.createContext({}),u=function(e){var t=r.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},d=function(e){var t=u(e.components);return r.a.createElement(l.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},m=r.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,o=e.parentName,l=c(e,["components","mdxType","originalType","parentName"]),d=u(n),m=a,p=d["".concat(o,".").concat(m)]||d[m]||b[m]||i;return n?r.a.createElement(p,s(s({ref:t},l),{},{components:n})):r.a.createElement(p,s({ref:t},l))}));function p(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var l=2;l<i;l++)o[l]=n[l];return r.a.createElement.apply(null,o)}return r.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},81:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return o})),n.d(t,"metadata",(function(){return s})),n.d(t,"toc",(function(){return c})),n.d(t,"default",(function(){return u}));var a=n(3),r=n(7),i=(n(0),n(138)),o={title:"Actors in Serverless",author:"Khaled Hikmat",author_title:"Software Engineer",author_url:"https://github.com/khaledhikmat",author_image_url:"https://avatars1.githubusercontent.com/u/3119726?s=400&u=090899e7b366dd702f9d0d5e483f20089010b25c&v=4",tags:["Azure Functions"]},s={permalink:"/blog/2017/12/27/durable-functions",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/blog/blog/2017-12-27-durable-functions.md",source:"@site/blog/2017-12-27-durable-functions.md",description:"I started with this documentation page to learn about Azure durable Functions. I wanted to know if I can build a way to implement actors in Azure Functions. Actors Programming Model is pretty interesting and I did some work on it before.",date:"2017-12-27T00:00:00.000Z",tags:[{label:"Azure Functions",permalink:"/blog/tags/azure-functions"}],title:"Actors in Serverless",readingTime:13.445,truncated:!1,prevItem:{title:"Azure CLI Notes",permalink:"/blog/2018/01/02/azure-cli-login-options"},nextItem:{title:"Point to Site Connectivity in Azure",permalink:"/blog/2017/12/21/point-to-site-connectivity"}},c=[{value:"Create a new actor:",id:"create-a-new-actor",children:[]},{value:"Signal an existing actor to perform something",id:"signal-an-existing-actor-to-perform-something",children:[{value:"Multiple signals",id:"multiple-signals",children:[]},{value:"Code Delays",id:"code-delays",children:[]},{value:"Wait on multiple events",id:"wait-on-multiple-events",children:[]}]},{value:"When do actors get created?",id:"when-do-actors-get-created",children:[]},{value:"When do actors get terminated?",id:"when-do-actors-get-terminated",children:[]},{value:"The actor state",id:"the-actor-state",children:[]},{value:"Comments &amp; Anamolies",id:"comments--anamolies",children:[{value:".NET Core and .NET Standard 2.0",id:"net-core-and-net-standard-20",children:[]},{value:"Local Debugging",id:"local-debugging",children:[]},{value:"Deployment",id:"deployment",children:[]},{value:"Storage",id:"storage",children:[]},{value:"Logging",id:"logging",children:[]},{value:"Timers",id:"timers",children:[]},{value:"Instance Termination",id:"instance-termination",children:[]}]},{value:"Conclusion",id:"conclusion",children:[]}],l={toc:c};function u(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(i.b)("wrapper",Object(a.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"I started with this ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://docs.microsoft.com/en-us/azure/azure-functions/durable-functions-install"}),"documentation page")," to learn about Azure durable Functions. I wanted to know if I can build a way to implement actors in Azure Functions. Actors Programming Model is pretty interesting and I did some work on it before."),Object(i.b)("p",null,"Following the Azure Functions sample instructions mentioned in the above link, I quickly got up and running. However, I wanted to answer the following questions about actors in Azure Functions:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"Create a new actor giving a provided actor id"),Object(i.b)("li",{parentName:"ul"},"Signal an existing actor to perform something"),Object(i.b)("li",{parentName:"ul"},"When do actors get created?"),Object(i.b)("li",{parentName:"ul"},"When do actors get terminated?"),Object(i.b)("li",{parentName:"ul"},"Can we read the actor's internal state?"),Object(i.b)("li",{parentName:"ul"},"What about .NET Core and .NET Standard 2.0 and other stuff?")),Object(i.b)("h2",{id:"create-a-new-actor"},"Create a new actor:"),Object(i.b)("p",null,"I created an HTTP trigger that looks like this where I provide a code that can be used as an instance id for the singleton i.e. membership actor. If the membership actor status is null or not running, then I start it with a ",Object(i.b)("inlineCode",{parentName:"p"},"StartNewAsync"),": "),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),'[FunctionName("HttpRefreshMemberships")]\npublic static async Task<HttpResponseMessage> Run(\n    [HttpTrigger(AuthorizationLevel.Function, methods: "post", Route = "memberships/refresh/{code}")] HttpRequestMessage req,\n    [OrchestrationClient] DurableOrchestrationClient starter,\n    string code,\n    TraceWriter log)\n{\n    var membershipStatus = await starter.GetStatusAsync(code);\n    string runningStatus = membershipStatus == null ? "NULL" : membershipStatus.RuntimeStatus.ToString();\n    log.Info($"Instance running status: \'{runningStatus}\'.");\n\n    if (\n        membershipStatus == null || \n        membershipStatus.RuntimeStatus != OrchestrationRuntimeStatus.Running\n        )\n    {\n        var membership = new {\n            Id = "asas",\n            Code = code,\n            CardNumber = "977515900121213"\n        };\n\n        await starter.StartNewAsync("E3_Membership", code, membership);\n        log.Info($"Started a new membership actor with code = \'{code}\'.");\n    }\n    else\n    {\n        await starter.RaiseEventAsync(code, "operation", "refresh");\n        log.Info($"Refreshed an existing membership actor with code = \'{code}\'.");\n    }\n\n    var res = starter.CreateCheckStatusResponse(req, code);\n    res.Headers.RetryAfter = new RetryConditionHeaderValue(TimeSpan.FromSeconds(10));\n    return res;\n}\n')),Object(i.b)("h2",{id:"signal-an-existing-actor-to-perform-something"},"Signal an existing actor to perform something"),Object(i.b)("p",null,"If the membership actor does exist, we raise a ",Object(i.b)("inlineCode",{parentName:"p"},"refresh")," event to wake up the singleton so it can do work:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),'await starter.RaiseEventAsync(code, "operation", "refresh");\n')),Object(i.b)("p",null,"The actual membership actor code looks like this:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),'public static class Membership\n{\n    [FunctionName("E3_Membership")]\n    public static async Task<dynamic> Run(\n        [OrchestrationTrigger] DurableOrchestrationContext context,\n        TraceWriter log)\n    {\n        dynamic membership = context.GetInput<dynamic>();\n        if (membership == null)\n            log.Info($"Something is bad! I should start with a valid membership.");\n\n        var operation = await context.WaitForExternalEvent<string>("operation");\n        log.Info($"***** received \'{operation}\' event.");\n\n        operation = operation?.ToLowerInvariant();\n        if (operation == "refresh")\n        {\n            membership = await Refresh(context, log);\n        }\n\n        if (operation != "end")\n        {\n            context.ContinueAsNew(membership);\n        }\n\n        return membership;\n    }\n\n    public static async Task<dynamic> Refresh(DurableOrchestrationContext context,\n                                              TraceWriter log)\n    {\n        // TODO: Do something to refresh the membership\n        dynamic membership = new {\n            Id = "asas",\n            Code = context.InstanceId,\n            CardNumber = "977515900121213"\n        };\n\n        DateTime now = DateTime.Now;\n        string formatDate = now.ToString("MM/dd/yyyy hh:mm:ss.fff tt");\n        log.Info($"**** done refreshing \'{context.InstanceId}\' @ {formatDate}");\n        return membership;\n    }\n}\n')),Object(i.b)("h3",{id:"multiple-signals"},"Multiple signals"),Object(i.b)("p",null,"But what happens if the actor is signaled frantically via raising an external event from an HTTP trigger, for example? The event signals are actually enqueued to the instance so they should run as many  times as they are sginaled. "),Object(i.b)("p",null,"If you are observing the actor's streaming logs when you try this, it could get very confusing. This is because durable functions manage long-term running processes in short-lived functions is by taking advantage of state retrieved in the ",Object(i.b)("inlineCode",{parentName:"p"},"context")," and replaying the function to resume at the next step (from ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://hackernoon.com/serverless-and-bitcoin-creating-price-watchers-dynamically-beea36ef194e"}),"this article"),"). Effectively what you will see if that functions are started, completed and re-started again to resume state.     "),Object(i.b)("h3",{id:"code-delays"},"Code Delays"),Object(i.b)("p",null,"Singletons should not use ",Object(i.b)("inlineCode",{parentName:"p"},"Task")," functions such as ",Object(i.b)("inlineCode",{parentName:"p"},"Task.Delay(millis)")," to simulate code delays. This will cause run-time errors:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),"Function 'E3_Membership (Orchestrator)', version '' failed with an error. Reason: System.InvalidOperationException: Multithreaded execution was detected. his can happen if the orchestrator function previously resumed from an unsupported async callback.\n")),Object(i.b)("p",null,"The preferred way for delays or timeouts is:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),"await context.CreateTimer(deadline, CancellationToken.None);\n")),Object(i.b)("p",null,"Where ",Object(i.b)("inlineCode",{parentName:"p"},"deadline")," is defined:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),"DateTime deadline = context.CurrentUtcDateTime.AddMinutes(30);\n")),Object(i.b)("p",null,"It is very important that we leverage the ",Object(i.b)("inlineCode",{parentName:"p"},"context")," to provide accurate timer information as opposed to ",Object(i.b)("inlineCode",{parentName:"p"},"TimeSpan")," and ",Object(i.b)("inlineCode",{parentName:"p"},"DateTime.Now"),", etc. I have seen very varying (not correct) results when I used ",Object(i.b)("inlineCode",{parentName:"p"},"TimeSpan.FromMinutes(30)"),", for example. "),Object(i.b)("h3",{id:"wait-on-multiple-events"},"Wait on multiple events"),Object(i.b)("p",null,"What if we want the actor to wait on an external event or on a internal timeout event to perhaps refresh our membership periodically? I created another membership function i.e. ",Object(i.b)("inlineCode",{parentName:"p"},"E3_MembershipWithTimer")," that awaits on either an operation event or a timeout event:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),'[FunctionName("E3_MembershipWithTimer")]\npublic static async Task<dynamic> RunWithTimer(\n    [OrchestrationTrigger] DurableOrchestrationContext context,\n    TraceWriter log)\n{\n    log.Info($"E3_MembershipWithTimer starting.....");\n    dynamic membership = context.GetInput<dynamic>();\n    if (membership == null)\n        log.Info($"Something is bad! I should start with a valid membership.");\n\n    string operation = "refresh";\n    using (var cts = new CancellationTokenSource())\n    {\n        var operationTask = context.WaitForExternalEvent<string>("operation");\n        DateTime deadline = context.CurrentUtcDateTime.AddMinutes(30);\n        var timeoutTask = context.CreateTimer(deadline, cts.Token);\n\n        Task winner = await Task.WhenAny(operationTask, timeoutTask);\n        if (winner == operationTask)\n        {\n            log.Info($"An operation event received!");\n            operation = operationTask.Result;\n            cts.Cancel();\n        }\n        else\n        {\n            // Default the timeout task to mean a \'refresh\' operation\n            log.Info($"A timeout event received!");\n            operation = "refresh";\n        }\n    }\n\n    log.Info($"***** received \'{operation}\' event.");\n\n    operation = operation?.ToLowerInvariant();\n    if (operation == "refresh")\n    {\n        membership = await Refresh(context, log);\n    }\n\n    if (operation != "end")\n    {\n        context.ContinueAsNew(membership);\n    }\n\n    return membership;\n}\n')),Object(i.b)("h2",{id:"when-do-actors-get-created"},"When do actors get created?"),Object(i.b)("p",null,"Actors or singletons actually do persist in storage (please see the section about termination)......this is how an Azure Functions knows how to start them when it restarts. So if you create actors with specific instance ids (or actor ids), shut down the functions and restart it, the singleton instances are available. When you want to trigger an instance, you must check its running state and then invoke the proper API:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),'var membershipStatus = await starter.GetStatusAsync(code);\nstring runningStatus = membershipStatus == null ? "NULL" : membershipStatus.RuntimeStatus.ToString();\nlog.Info($"Instance running status: \'{runningStatus}\'.");\n\nif (\n    membershipStatus == null || \n    membershipStatus.RuntimeStatus != OrchestrationRuntimeStatus.Running\n    )\n{\n    var membership = new {\n        Id = "asas",\n        Code = code,\n        CardNumber = "977515900121213"\n    };\n\n    await starter.StartNewAsync("E3_Membership", code, membership);\n    log.Info($"Started a new membership actor with code = \'{code}\'.");\n}\nelse\n{\n    await starter.RaiseEventAsync(code, "operation", "refresh");\n    log.Info($"Refreshed an existing membership actor with code = \'{code}\'.");\n}\n')),Object(i.b)("h2",{id:"when-do-actors-get-terminated"},"When do actors get terminated?"),Object(i.b)("p",null,"They can be easily terminated using the ",Object(i.b)("inlineCode",{parentName:"p"},"TerminateAsync")," API. So I created a little HTTP trugger that would terminate instances:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),'[FunctionName("HttpTerminateMemberships")]\npublic static async Task<HttpResponseMessage> Run(\n    [HttpTrigger(AuthorizationLevel.Function, methods: "post", Route = "memberships/terminate/{code}")] HttpRequestMessage req,\n    [OrchestrationClient] DurableOrchestrationClient starter,\n    string code,\n    TraceWriter log)\n{\n    try\n    {\n        await starter.TerminateAsync(code, "");\n        return req.CreateResponse<dynamic>(HttpStatusCode.OK);\n    }\n    catch (Exception ex)\n    {\n        return req.CreateResponse<dynamic>(HttpStatusCode.BadRequest, ex.Message);\n    }\n}\n')),Object(i.b)("p",null,"The Azure Durable Functions maintain a state of all running instances in a task hub which is basically a storage resource with control queues, qork-item queues, a history table and lease blobs. You can read more about this ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://docs.microsoft.com/en-us/azure/azure-functions/durable-functions-task-hubs"}),"here"),". "),Object(i.b)("p",null,"Effectively, the ",Object(i.b)("inlineCode",{parentName:"p"},"host.json")," ",Object(i.b)("inlineCode",{parentName:"p"},"durableTask")," indicate the hub name:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),'"durableTask": {\n    "HubName": "TestDurableFunctionsHub"\n  }\n')),Object(i.b)("p",null,"The run-time environment stores related information about running instances in storage keyed by the hub name.  "),Object(i.b)("h2",{id:"the-actor-state"},"The actor state"),Object(i.b)("p",null,"Each actor has an internal state! It is initially read by the singleton as an input:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),"dynamic membership = context.GetInput<dynamic>();\n")),Object(i.b)("p",null,"and it is updated using:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),"context.ContinueAsNew(membership);\n")),Object(i.b)("p",null,"But it seems that the internal state is actually not persisted anywhere ...it is transient. When actors are initially created, a state is passed as an input i.e. ",Object(i.b)("inlineCode",{parentName:"p"},"context.GetInput<dynamic>()")," and the actor updates it with a call to ",Object(i.b)("inlineCode",{parentName:"p"},"ContinueAsNew")," which actually restarts itself with a new state. "),Object(i.b)("p",null,"The internal state can be read by using one of the APIs of the instance management:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),"var status = await client.GetStatusAsync(instanceId);\n")),Object(i.b)("p",null,"Where ",Object(i.b)("inlineCode",{parentName:"p"},"client")," is ",Object(i.b)("inlineCode",{parentName:"p"},"DurableOrchestrationClient"),". The status input is the actor's internal state:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),'{\n    "Name": "E3_MembershipWithTimer",\n    "InstanceId": "U7CCR",\n    "CreatedTime": "2017-12-29T21:12:24.8229285Z",\n    "LastUpdatedTime": "2017-12-29T21:12:25.5309613Z",\n    "Input": {\n        "$type": "<>f__AnonymousType0`3[[System.String, mscorlib],[System.String, mscorlib],[System.String, mscorlib]], VSSample",\n        "Id": "asas",\n        "Code": "U7CCR",\n        "CardNumber": "977515900121213"\n    },\n    "Output": null,\n    "RuntimeStatus": 0\n}\n')),Object(i.b)("p",null,"I am not sure if the actor internal state is meant to hold big state though. Perhaps it is better if the actor exposes its state externally so HTTP triggers, for example, can read it directly from the external store. "),Object(i.b)("p",null,"One way of doing this is to modify the code to look something like this:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),'[FunctionName("HttpRefreshMemberships")]\npublic static async Task<HttpResponseMessage> Run(\n    [HttpTrigger(AuthorizationLevel.Function, methods: "post", Route = "memberships/refresh/{code}")] HttpRequestMessage req,\n    [OrchestrationClient] DurableOrchestrationClient starter,\n    string code,\n    TraceWriter log)\n{\n    var membershipStatus = await starter.GetStatusAsync(code);\n    string runningStatus = membershipStatus == null ? "NULL" : membershipStatus.RuntimeStatus.ToString();\n    log.Info($"Instance running status: \'{runningStatus}\'.");\n\n    if (\n        membershipStatus == null || \n        membershipStatus.RuntimeStatus != OrchestrationRuntimeStatus.Running\n        )\n    {\n        // Given the membership code, read from an external source\n        var membership = await RetriveFromCosmosDB(code);\n        await starter.StartNewAsync("E3_Membership", code, membership);\n        log.Info($"Started a new membership actor with code = \'{code}\'.");\n    }\n    else\n    {\n        await starter.RaiseEventAsync(code, "operation", "refresh");\n        log.Info($"Refreshed an existing membership actor with code = \'{code}\'.");\n    }\n\n    var res = starter.CreateCheckStatusResponse(req, code);\n    res.Headers.RetryAfter = new RetryConditionHeaderValue(TimeSpan.FromSeconds(10));\n    return res;\n}\n')),Object(i.b)("p",null,"and the membership actor:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),'public static class Membership\n{\n    [FunctionName("E3_Membership")]\n    public static async Task<dynamic> Run(\n        [OrchestrationTrigger] DurableOrchestrationContext context,\n        TraceWriter log)\n    {\n        dynamic membership = context.GetInput<dynamic>();\n        if (membership == null)\n        {\n            // Read from an external source \n            membership = await RetriveFromCosmosDB(context.InstanceId);\n        }\n\n        var operation = await context.WaitForExternalEvent<string>("operation");\n        log.Info($"***** received \'{operation}\' event.");\n\n        operation = operation?.ToLowerInvariant();\n        if (operation == "refresh")\n        {\n            membership = await Refresh(context, log);\n        }\n\n        if (operation != "end")\n        {\n            context.ContinueAsNew(membership);\n        }\n\n        return membership;\n    }\n\n    public static async Task<dynamic> Refresh(DurableOrchestrationContext context,\n                                              TraceWriter log)\n    {\n        // TODO: Do something to refresh the membership\n        dynamic membership = new {\n            Id = "asas",\n            Code = context.InstanceId,\n            CardNumber = "977515900121213"\n        };\n\n        // TODO: Store to an external source\n        await StoreToCosmosDB(context.InstanceId, membership);\n\n        DateTime now = DateTime.Now;\n        string formatDate = now.ToString("MM/dd/yyyy hh:mm:ss.fff tt");\n        log.Info($"**** done refreshing \'{context.InstanceId}\' @ {formatDate}");\n        return membership;\n    }\n}\n')),Object(i.b)("p",null,"and the HTTP trigger that retrieves the membership actor state from an extenal source without dealing with the actor:"),Object(i.b)("pre",null,Object(i.b)("code",Object(a.a)({parentName:"pre"},{}),'[FunctionName("HttpGetMembership")]\npublic static async Task<HttpResponseMessage> Run(\n    [HttpTrigger(AuthorizationLevel.Function, methods: "get", Route = "memberships/{code}")] HttpRequestMessage req,\n    [OrchestrationClient] DurableOrchestrationClient starter,\n    string code,\n    TraceWriter log)\n{\n    var status = await starter.GetStatusAsync(code);\n    if (status != null)\n    {\n        return req.CreateResponse<dynamic>(HttpStatusCode.OK, await RetriveFromCosmosDB(code));\n    }\n    else\n    {\n        return req.CreateResponse<dynamic>(HttpStatusCode.BadRequest, $"{code} membership actor is not found!");\n    }\n}\n')),Object(i.b)("p",null,"So unlike regular actor implementation, Azure Functions singletons do not expose any method to be called from the outside! The platform only allows starting/creating, querying and terminating instances. "),Object(i.b)("h2",{id:"comments--anamolies"},"Comments & Anamolies"),Object(i.b)("h3",{id:"net-core-and-net-standard-20"},".NET Core and .NET Standard 2.0"),Object(i.b)("p",null,"It is work in progress! It is best to use the .NET full framework with Azure Durable Functions. Hopefully this will change soon and we will be able to use .NET Core reliably."),Object(i.b)("h3",{id:"local-debugging"},"Local Debugging"),Object(i.b)("p",null,"I had a very hard time with this. The symptoms that I experienced are unfortutanely not experienced by other developers who tried this as I could not see similar reported issues. I am using Vs2017 and Azure Functions Extension ...the latest at the time of writing DEC/2017. "),Object(i.b)("p",null,"Here are my comments:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"If you want to debug locally, make sure you set both the local.setting.json and host.json file to ",Object(i.b)("inlineCode",{parentName:"li"},"copy always"),". You do this from the properties window."),Object(i.b)("li",{parentName:"ul"},"On both of my developer machines, I hit F5, it prompts me to install the Azure Functions Core tools and things look quite good. I was able to run locally."),Object(i.b)("li",{parentName:"ul"},"But then subsequent F5, I get very different results ranging from:",Object(i.b)("ul",{parentName:"li"},Object(i.b)("li",{parentName:"ul"},"The CLI starts and exits on its own ...I could not find out what the reason is"),Object(i.b)("li",{parentName:"ul"},"The CLI starts and displays the functions URls. But it also complains about some files were changed and the host needs to restart. The URls are not responsive and there is nothing you can do except to terminate and restart."),Object(i.b)("li",{parentName:"ul"},"The CLI statrs and actually works.....does not happen often ...but I have seen it work"),Object(i.b)("li",{parentName:"ul"},"F5 mostly causes the CLI to start and exit. Control-F5 does not exit ...but the function URLs are not accessible due to this ",Object(i.b)("inlineCode",{parentName:"li"},"change detected")," message."))),Object(i.b)("li",{parentName:"ul"},"Effectively, local debugging did not work for me at all. It was a very frustrating experience. So I had to deploy everything (see deplyment below) to Azure and debug there....another frustrating experience. ")),Object(i.b)("h3",{id:"deployment"},"Deployment"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"The only effective way I was able to find out how to deploy a Durable Functions App is via Visual Studio. I have heard some people got it to work with VSTS. But, given that this is a test run, I did not really explore this option."),Object(i.b)("li",{parentName:"ul"},"However, if you just click the ",Object(i.b)("inlineCode",{parentName:"li"},"publish")," button in VS, it will auto-create a storage account for you which names things really weird. My recommendation is to create the App Service, Service Plan, Storage and App Insights in portal or via Azure CLI and then use Visual Studio to publish into it. "),Object(i.b)("li",{parentName:"ul"},"If you renamed a function and re-deployed, Visual Studio will publish the new functions app with the new function. But the old function will still be there (you can see it from the portal). You can then use ",Object(i.b)("inlineCode",{parentName:"li"},"Kudo"),", navigate to the directory and actually delete the old function folder. "),Object(i.b)("li",{parentName:"ul"},"The local.settings.json entries are not deployed to Azure! This means you have to manually create them in the portal app settings or in Visual Studio deployment window. ")),Object(i.b)("h3",{id:"storage"},"Storage"),Object(i.b)("p",null,"As mentioned, an Azure Storage is required to maintain teh durable instances. They are keyed off the hub name you specify in the host. There are entries in blob, tables, files and queues. "),Object(i.b)("h3",{id:"logging"},"Logging"),Object(i.b)("p",null,"Unless you turn on streaming on a function in the portal, you don't get anything (or at least, I could not find a way to do it). But watching the log from the portal is very difficult as it times out and it is not very user friendly. This is one area that requires better UX in the portal. The logs are also stored on the app's file system which you can access from ",Object(i.b)("inlineCode",{parentName:"p"},"Kudo"),". However, I noticed that, unless you request stream logging on a function, these files are not created. "),Object(i.b)("p",null,"So the story of logging is a little frustrating at best! I had to use App Insights trace to see what is going on."),Object(i.b)("h3",{id:"timers"},"Timers"),Object(i.b)("p",null,"As mentioned above, it is very important that we leverage the context to provide accurate timer information as opposed to ",Object(i.b)("inlineCode",{parentName:"p"},"TimeSpan")," and ",Object(i.b)("inlineCode",{parentName:"p"},"DateTime.Now"),", etc. Initially I used ",Object(i.b)("inlineCode",{parentName:"p"},"TimeSpan.FromMinutes(30)")," to wait for 30 minutes....but the way to do it is to always use the ",Object(i.b)("inlineCode",{parentName:"p"},"context")," such as ",Object(i.b)("inlineCode",{parentName:"p"},"DateTime deadline = context.CurrentUtcDateTime.AddMinutes(30);"),". After doing that, I started getting conistent timeout periods and things worked normally. "),Object(i.b)("h3",{id:"instance-termination"},"Instance Termination"),Object(i.b)("p",null,"Although ",Object(i.b)("inlineCode",{parentName:"p"},"TerminateAsync")," on an instance works, I am not exactly sure if it works the way it is supposed to:"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"If I have a running instance and that instance is actually waiting on an external or time out event, ",Object(i.b)("inlineCode",{parentName:"li"},"TerminateAsync")," does not do anything. I guess because a message is enqueued to the instance but the instance is waiting on other events ....so it did not get the ",Object(i.b)("inlineCode",{parentName:"li"},"terminate")," signal yet."),Object(i.b)("li",{parentName:"ul"},"If the instance is not waiting on anything, ",Object(i.b)("inlineCode",{parentName:"li"},"TerminateAsync")," replays the instance which runs code that you don't necessarily want to run. For example, I had an instance that triggers a logic app once it receives an ",Object(i.b)("inlineCode",{parentName:"li"},"end")," operation which works. However, if I terminate the instance using ",Object(i.b)("inlineCode",{parentName:"li"},"TerminateAync"),", the code triggers the logic app again because it was replayed! ")),Object(i.b)("p",null,"Not sure if this behavior is correct and what the ",Object(i.b)("inlineCode",{parentName:"p"},"terminate")," signal actually do.       "),Object(i.b)("h2",{id:"conclusion"},"Conclusion"),Object(i.b)("p",null,"Reflecting on the little time that I spent with Azure Durable Functions, I think they will play an important part of my future solutions. I think they have what it takes to use as actors especially that the Azure Durable Functions are designed to ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://social.msdn.microsoft.com/Forums/en-US/b6ffeae3-f62a-4e6d-a68a-e5dc6f9ffd62/durable-singletons?forum=AzureFunctions"}),"support 1000's of instances")," . If we externalize the actor's state, we will be able to query the external store as opposed to query the actors themselves to retrieve their state. "),Object(i.b)("p",null,"Azure Durable Actors can also employ reminders and other sophisticated techniques found in Service Fabric actors such as long-running, stateful, single-threaded, location-transparent and globally addressable (taken from the overview ",Object(i.b)("a",Object(a.a)({parentName:"p"},{href:"https://docs.microsoft.com/en-us/azure/azure-functions/durable-functions-overview"}),"documentation page"),"). However, as stated above and unlike other actor implementations, Azure Functions singletons do not expose methods that can be called from the outside. "),Object(i.b)("p",null,"In any case, the Azure Durable Functions are still in preview. So we can expect many great features to be added soon.  "))}u.isMDXComponent=!0}}]);