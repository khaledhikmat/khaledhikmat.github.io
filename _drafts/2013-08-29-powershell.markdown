---
layout: post
title:  "PowerShell"
date:   2013-09-05 20:14:01
summary: "PowerShell perspective"
categories: Technical
tags: PowerShell
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

It is one of those things that I always wanted to know but did not have time to delve onto it. The other day I saw a little PowerShell script that made want to get to understand better. The script is created by Jim Christopher and modified slightly by me to fit my development environment. Here it is:

```
   1: function push-netproject($project)
   2: {
   3:     # 1: navigate to the .NET projects directory
   4:     push-location "d:\work\skydrive\sourcecode\netsolutions"
   5:
   6:     # 2: position at the desired project source
   7:     push-location "./$project/src"
   8:
   9:     # 3: open windows explorer at the project folder
  10:     invoke-item .;
  11:
  12:     # 4: open any solution found in the directory
  13:     invoke-item *.sln;
  14:
  15:     #5: pop
  16:     pop-location;
  17:     pop-location;
  18: }
  19:
  20: # Create an easy-to-remember alias
  21: new-alias -name ppn -value push-netproject
```

This allows me to launch a file explorer and my Visual Studio solution by typing something like this at the PowerShell command line:

```
ppn MyProjectName
```

It is really nice and quick.

Since the above whetted my appetite, I looked a little more and found a huge wealth of information, resources and ways to employ PowerShell to my favorite. To name a few:

* Calling PowerShell Functions from C#
* Overriding C# Methods with PowerShell Function
* Add PowerShell to existing WPF Applications
* Building WPF Applications with PowerShell
* Load .NET DLLs and use COM Automation
* Consume LightSwitch OData data from PowerShell
* Provide data source to LightSwitch applications

Anyway, it is something I definitely would like to master as it can become a great tool in my arsenal.