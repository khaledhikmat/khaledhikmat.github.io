---
layout: post
title:  "Service Fabric Notes"
date:   2016-05-05 20:14:01
summary: "A collection of Service Fabric notes!!"
categories: Technical
tags: Azure, Service Fabric, Actor, Microservice
featured_image: /images/cover.jpg
---

I am learning [Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/) from the folks at Microsoft! Given the capabilities it provides right out of the box, it is really a strong environment to build microservice-based solution at scale. In this post, I will enumerate a few things that I ran into which I think might be helpful to others who are learning the environment as well. This will not be a complete list ....so I will add to it as I go along.

### Solution Layout

If you create a Service Fabric project using Visual Studio, it creates separate projects for the service and its interfaces. This makes the solution quite verbose and difficult to manage. Instead I effectively used this VS solution layout where I bundle all the service interfaces in a contracts project and all the common code in a shared library:

![Solution Layout](http://i.imgur.com/W5Iiz2e.png)     

### Where is the Microservice in Service Fabric?

I knew a little bit about Microservices before I started learning Service Fabric. In fact, it turned out we actually have been employing Microservices concepts all along except we did not know they are actually called Microservices!! When I started looking into Service Fabric, the first thing that I had a question about was: **in the Service Fabric context, where is the boundary of a Microservice? Is each Fabric service we create (whether it is Stateless, Stateful or Actor) a Microservice?** I don't think so! A simple check against the Microservice characteristics will definitely prove this point. So I argue that, in Service Fabric context, the Microservice is actually the Service Fabric App. The individual SF Services that make up the SF App are really internal implementation of the Microservice i.e. SF App.

I further think that the Service Fabric services that make up the SF App should be called something more descriptive. I am leaning towards something like `Nanoservice` but the term `nano` is overloaded and might be confused with `Nano server` for example. In any case, naming them something different than services would make things less confusing for folks who are new to Service Fabric.  

Hence each Service Fabric App must have exposed Endpoints (i.e. HTTP, WCF) where other Microservices or clients can communicate with the Service Fabric App. Therefore this design pattern for Service Fabric Apps must be enforced:

![SF Apps Design Pattern](http://i.imgur.com/3SCdCRp.png)

### Actor Reminder

[Actor Reminders](https://azure.microsoft.com/en-us/documentation/articles/service-fabric-reliable-actors-timers-reminders/) are really nice to have. In the sample app that I am working on, I use them to schedule processing after I return to the caller. Effectively they seem to give me the ability to run things asynchronously and return to the caller right away. Without this, the actor processing throughput may not be at best if the the processing takes a while to complete. 
   
In addition to firing a future event, they do allow me to pack an item or object that can be retrieved when the reminder triggers. This makes a lot of scenarios possible because we are able to pack the item that we want the reminder to work on.
  
The best way I found out to schedule reminders to fire immediately is something like this:

```csharp
public async Task Process(SomeItem item)
{
	var error = "";

	try
	{
		if (item == null)
		{
			...removed for brevity
			return;
		}

		await this.RegisterReminderAsync(
			ReprocessReminder,
			ObjectToByteArray(item),
			TimeSpan.FromSeconds(0),            // If 0, remind immediately
			TimeSpan.FromMilliseconds(-1));     // Disable periodic firing
	}
	catch (Exception ex)
	{
		error = ex.Message;
	}
	finally
	{
		...removed for brevity
	}
}
``` 
When the reminder triggers, `ReprocessReminder` is called to process the item that was packed within the reminder: `ObjectToByteArray(item)`. Here are possible implementation of packing and unpacking the item:

```csharp
private byte[] ObjectToByteArray(Object obj)
{
    if (obj == null)
        return null;

    BinaryFormatter bf = new BinaryFormatter();

    try
    {
        using (var ms = new MemoryStream())
        {
            bf.Serialize(ms, obj);
            return ms.ToArray();
        }

    }
    catch (Exception ex)
    {
        return null;
    }
}

private Object ByteArrayToObject(byte[] arrBytes)
{
    try
    {
        using (var memStream = new MemoryStream())
        {
            var binForm = new BinaryFormatter();
            memStream.Write(arrBytes, 0, arrBytes.Length);
            memStream.Seek(0, SeekOrigin.Begin);
            var obj = binForm.Deserialize(memStream);
            return obj;
        }
    }
    catch (Exception ex)
    {
        return null;
    }
}
```

### Actor Interface

From this [article](https://azure.microsoft.com/en-us/documentation/articles/service-fabric-reliable-actors-notes-on-actor-type-serialization/): *The arguments of all methods, result types of the tasks returned by each method in an actor interface, and objects stored in an actor's State Manager must be Data Contract serializable. This also applies to the arguments of the methods defined in actor event interfaces. (Actor event interface methods always return void.)* 

In my actor interface, I had many methods and everything was working great until I added these two methods:

```csharp
Task<SomeView> GetView(int year, int month);
Task<SomeView> GetView(int year);
```
If you to compile a Service Fabric solution that has an interface that looks like the above, you will be met with a very strange compilation error:

![Actor Compilation Error](http://i.imgur.com/cO972hG.png)

What? What is that? Why? After hours, it turned out you can actually [turn off](http://stackoverflow.com/questions/35820191/how-to-ignore-a-servicetype-from-servicefabric-manifest-file-on-build-deploy) this error. From the above Stack Overflow post:

*By changing the project file .csproj of the project containing the actors and setting property:

```
<UpdateServiceFabricManifestEnabled>false</UpdateServiceFabricManifestEnabled>
```
*

So this tool can be disabled!! But still why is this happening? It turned out that the actor interfaces may not have overridden methods!! So the tool was complaining about the interface containing just that i.e. overridden methods. If the above interface is changed to the below, everything will work well:

```csharp
Task<SomeView> GetViewByYearNMonth(int year, int month);
Task<SomeView> GetViewByYear(int year);
```

In addition, the actor event methods may not return anything but `void`. So if you have something like this, you will get the same `FabActUtil.exe` error:

```csharp
public interface IMyActorEvents : IActorEvents
{
	Task MeasuresRecalculated(....);
}
```

I am hoping to add to this post as I go along. Hopefully this has been helpful.
 