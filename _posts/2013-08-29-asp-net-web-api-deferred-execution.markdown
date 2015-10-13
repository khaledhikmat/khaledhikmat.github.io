---
layout: post
title:  "ASP .NET Web API Deferred Execution"
date:   2013-08-31 20:14:01
summary: "Something to run after the Web API excecutes"
categories: Technical
tags: ASP.NET WebAPI
featured_image: /images/cover.jpg
---

I have an ASP.NET Web API project with a SignalR hub that I have been working for a while. One of the purposes of the SignalR hub is to deliver print jobs to remote printers via remote agents. The agents are SignalR .NET clients which receive the print job requests via a SignalR broadcast and determine whether the print job is intended for them by examining the 'printer' attribute of the print job.

The problem I am trying to solve is in the case of failure! If the job fails to print (for whatever reason... the agent is offline, the printer is jammed or out of paper), there must be way to recover. Here is what I really wanted....re-try the print if the print date was not set on the print job within 10 seconds of the original send date. If the re-try counter is exhausted, the hub will fetch a backup printer (configured for that specific account) and switch the print job print and re-submit the print job.

So I needed a way to monitor each print job after it has been sent off to the agent. I did not want to use a recurring timer because it would not be per specific job and I can't use the system (i.e. Windows) services or time scheduler because I am running in the cloud on a shared server. By the way, this service is not expected to process thousands of print jobs a minutes...it is a lay back service that needs to process about 100-200 print jobs a day maximum.

Searching StackOverflow, I found many techniques. Examples:

* [http://stackoverflow.com/questions/4329859/how-to-call-function-on-timer-asp-net-mvc](http://stackoverflow.com/questions/4329859/how-to-call-function-on-timer-asp-net-mvc)
* [http://stackoverflow.com/questions/542804/best-way-to-run-scheduled-tasks](http://stackoverflow.com/questions/542804/best-way-to-run-scheduled-tasks)

Also here is a nice time trigger that can be useful for different situations: [http://atrigger.com/](http://atrigger.com/). It relies on scheduling a task at 'a trigger' and then, after the time elapses, 'a trigger' will call back on certain URL. Triggers can be set up in many different ways: every x minutes, once per month, etc.

Eventually I found two techniques that work:

* The first one relies on ThreadPool.RegisterWaitForSingleObject which is documented in MSDN. It basically borrows a worker thread from the pool and runs at a specified time.
* The second technique relies on inserting an expirable cache item and do something at the time of the expiration callback:  [http://blog.stackoverflow.com/2008/07/easy-background-tasks-in-aspnet/](http://blog.stackoverflow.com/2008/07/easy-background-tasks-in-aspnet/)

Given that my service is not in high-demand, I opted to use the second technique which is really simple and seems to work quite well.
