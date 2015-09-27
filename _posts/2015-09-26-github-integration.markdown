---
layout: post
title:  "GitHub Integration using C#"
date:   2015-09-26 20:14:01
summary: "Some notes on how to integrate GitHub using C#"
categories: Technical
tags: C#, GitHub
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

We have most of our source code and documentation on GitHub. They are organized as organizations with private repositories. While the privacy is really needed, our executives are not able to see what is going on unless they sign in to GitHub, hop from one repository to another....something they are not particularly happy about. So the following are my objectives to change that and provide our executives a much easier view:

* Provide some sort of analytics to show who is doing what and when to the source code and documentation repositories
* Provide a listing of our source code and documentation repositories, status, last update, etc
* Expose some of our non-sensitive documentation as HTML or PDF
* Provide all of the above on a site available publicly so it will be really convenient to view
 
The rest of the post will describe in details how I managed the objectives as outlined above.

### Analytics

In order to see what is going on with the GitHub repositories, I needed a way to have GitHub let me know whatis going whenever an event takes place. This is usualy called Webhooks. Sure enough GitHub has great Webhooks at the repository level and at the organization level. I am interested in the organization level because it gives what I need without having to set up a Webhook for each repository (we have about 75).

As I was reading the GitHub documentation and searching, I stumbled across a very nice ASP.NET library that does exactly what I needed. The ASP.NET team tools division announced the [ASP.NET WebHooks preview](http://blogs.msdn.com/b/webdev/archive/2015/09/04/introducing-microsoft-asp-net-webhooks-preview.aspx). This is what they said about it:

_WebHooks is a lightweight HTTP pattern providing a simple pub/sub model for wiring together Web APIs and SaaS services. When an event happens in a service, a notification is sent in the form of an HTTP POST request to registered subscribers. The POST request contains information about the event which makes it possible for the receiver to act accordingly._

The best part is they already have GitHub support in the box and the example they showed on their blog is actually for GitHub Webhooks. In literally a few minutes I had GitHub report to me the push events that are happening against our organization repositories.

Essentially the ASP.NET Webhook solution is quite simple. You create a handler to receive the Webhook events and they handle everything else including security, choreography and anything else in between. Basically the code boils down to this:

```csharp
public override Task ExecuteAsync(string receiver, WebHookHandlerContext context)
{
	try
	{
		string action = context.Actions.First();
		JObject data = context.GetDataOrDefault<JObject>();

		// The action should contain the event name
		// The data should contain the actual notification

		// We are only watching the 'push' event from GitHub...so there is no need to do anything
		// Catsing to a dynamic object makes it really aeasy to access the JSON structure
		dynamic json = data;
		
		//TODO: Do something with the data

	}
	catch (Exception e)
	{
		GetLoggerService().Log(LogLevels.Debug, "GitHubHandler", "WebHook.ExecuteAsync caused an exception: " + e.Message);
	}

	return Task.FromResult(true);
}
```  
  
Now that I am being notified whenever a push event takes place, I wanted to do something with this data to make it reportable. After some research, I found a really cool analytics company that allows me to send events and run some analytics queries against them. This is realy exactly what I needed. So I signed up to [Keen](https://keen.io), set up a project and started pumping my push events to Keen. This is what Keen said about themselves:

_Deliver fast, flexible analytics to your teams & customers. With Keen’s developer-friendly APIs, it’s easy to embed custom dashboards and reports in any app or website._

It is really quite simple as they have a .NET library that does most of the work. Querying the data turned out to be quite simple also. The great thing about their solution is you can embed your charts right into your web site via a very lightweight JavaScript library. They also have an explorer that you can experiment on your own. So I can produce something like this in no time:

![Distribution by committer](http://i.imgur.com/KahPKkX.png)  

Ah....looks great and it is exactly what I want. Of course, the GitHub push events that arrive at my handler contain a plothora of other useful information that we can use to chart and report on. But this is a great start.  

### Listing

### Exports

### Web Site

  
