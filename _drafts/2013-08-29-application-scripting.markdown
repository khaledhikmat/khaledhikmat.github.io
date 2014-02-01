---
layout: post
title:  "Application Scripting"
date:   2013-09-05 20:14:01
summary: "A sample of application scripting"
categories: Technical
tags: Application Scripting
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

It is useful to be able to script a running app to affect its operation at runtime. This is really nothing new:

* Microsoft Excel uses VBA to provide a very nice and mature scripting environment
* Most modern browsers provide a nice way of inspecting and interacting with DOM objects while the site is loaded
* Visual Studio provides a nice Immediate Window that allows us to inspect elements of the application being debugged

So if you have an application like WPF, for example, it will be a great added value to make it scriptable via PowerShell. The way to do this would be to inject live instances into your application so they can be interrogated and inspected from within PowerShell. Suppose I injected a live instance of my application (i.e. MainWindow) into PowerShell (a subject that is discussed in great detail on the Internet and is outside the scope of this micro blog… see resources below):

```
$MainWindow.Title = 'Changed from PowerShell!'
$MainWindow | Get-Member -MemberType Property | Sort Name
```

I can change the Title property for example from within my application PowerShell environment and also I can interrogate the the instance by piping to a PowerShell very useful Get-Member cmdlet which will display all object properties sorted by name.

The ability to interact with live instances injected into the PowerShell from the application opens up great doors. For example, I can inject my application repository instance and use it to provide data to my application from the Internet, for example. Given PowerShell great and shortcut abilities to parse Internet data i.e. XML, JSON or OData over restful services or just read local Excel files, it will make things a lot faster and easier to test and populate my application database with seed data.

Also…if your WPF application uses MEF (Microsoft Extensibility Framework) framework, you can also inject the composition container into PowerShell so PowerShell can make use of it from there:

```
$MefHelper.GetExport('_2ndCore.Lms.CourseAuthor.ViewModels.AuthorsPageViewModel') | Get-Member
```

So here I am fetching an MEF exported instance from my MEF container so I can interrogate it from PowerShell! Really awesome.

Most of the above has been inspired by Mr. Douglas Finke GitHub repository: [https://github.com/dfinke/powershell-for-developers](https://github.com/dfinke/powershell-for-developers)