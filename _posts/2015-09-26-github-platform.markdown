---
layout: post
title:  "GitHub Platform"
date:   2015-09-26 20:14:01
summary: "Some notes on how to make a good use of the GitHub platform"
categories: Technical
tags: C#, GitHub, Web API, Analytics, Keen
featured_image: /images/cover.jpg
---

We have most of our source code and documentation on GitHub. They are organized as organizations with private repositories. While the privacy is really needed, our executives are not able to see what is going on unless they sign in to GitHub, hop from one repository to another....something they are not particularly happy about. So the following are my objectives to change that and provide our executives a much easier view:

* Provide some sort of analytics to show who is doing what and when to the source code and documentation repositories
* Extract the source code and documentation repositories, status, last update from GitHub using APIs
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
  
Now that I am being notified whenever a push event takes place, I wanted to do something with this data to make it reportable. After some research, I found a really cool analytics company that allows me to send events and run some analytics queries against them. This is realy exactly what I needed. So I signed up to [Keen](https://keen.io), set up a project and started pumping my push events to Keen. This is what Keen says about themselves:

_Deliver fast, flexible analytics to your teams & customers. With Keen’s developer-friendly APIs, it’s easy to embed custom dashboards and reports in any app or website._

It is really quite simple to pump data as they have a .NET library that does most of the work. Querying the data turned out to be quite simple also. The great thing about their solution is that you can embed charts right into web sites via a very lightweight JavaScript library. They also have an explorer that one can experiment to fine tune the queries. So I can produce something like this in no time:

![Distribution by committer]({{ site.baseurl }}/images/2015-09-26/hmccode-analysis.png)  

Ah....looks great and it is exactly what I want. Of course, the GitHub push events that arrive at my handler contain a plothora of other useful information that I can use to chart and report on. But this is a great start.  

### Extraction

Because our repositories are mostly private, I needed a way to collect the repository information from GitHub using their APIs. I opted to use an Azure Web Job that is triggered every day or so and update a JSON file that I host on a blob storage. This JSON file contains all the repository and organization information.

In order to interact with GitHub APIs, I used the excellent [Octokit .NET libray](https://github.com/octokit/octokit.net). 

The following is a code snippet that allows me to pull the user's organizations and repsitories:

```csharp
var githubclient = new GitHubClient(new Octokit.ProductHeaderValue("some-cool-name"));
githubclient.Credentials = new Credentials(personalCode);

var user = await githubclient.User.Current();
_logger.WriteLine("Logged in user : " + user.Login);

var orgs = await githubclient.Organization.GetAllForCurrent();
foreach (var org in orgs)
{
	_logger.WriteLine("Organization - URL: " + org.Url + " - Login: " + org.Login);

	var orgObject = await githubclient.Organization.Get(org.Login);

	var reps = await githubclient.Repository.GetAllForOrg(org.Login);
	foreach (var rep in reps)
	{
		_logger.WriteLine("Repository : " + rep.Name + "-" + rep.FullName + " - Collaborators: " + rep.StargazersCount);
	}
}
```

Where `personalCode` is something I generated from my GitHub account setting to allow me to have a programmtic access without having to do the oAUth authentication flow dance. You can read about them [here](https://github.com/blog/1509-personal-api-tokens).

I collect the organization and repository structure into a .NET structure that looks like this:

```csharp
class MyGitHub
{
	public MyGitHub()
	{
		Organizations = new List<MyOrganization>();
	}

	public List<MyOrganization> Organizations { get; set; }
}

class MyOrganization
{
	public <MyOrganization()
	{
		Repositories = new List<Repository>();
	}

	public Organization Organization { get; set; }
	public List<Repository> Repositories { get; set; }
}
```

Where `Organization` and `Repository` are classes defined by the [Octokit .NET libray](https://github.com/octokit/octokit.net).

Once I collect all the data, I then use Json.NET to serialize the object in JSON:

```csharp
string formattedJson = JsonConvert.SerializeObject(myGitHub, Formatting.Indented, new JsonSerializerSettings
{
	ContractResolver = new CamelCasePropertyNamesContractResolver()
});
```
Finally, I send the serialized JSON to a blob storage:

```csharp
CloudBlockBlob blob = _myBlobContainer.GetBlockBlobReference(blobName);
blob.Properties.ContentType = "application/json; charset=utf-8";

byte[] byteArray = Encoding.UTF8.GetBytes(formattedJson);
MemoryStream memStream = new MemoryStream(byteArray);
blob.UploadFromStream(memStream);
return blob.Uri.ToString()
```

Now I have a URL that I can use from JavaScript, for example, to bind the views to. One more thing though...if you are planning to consume the JSON file from a browser JavaScript, you need to set the storage to honor CORS. One way of doing this programatically using the .NET storage SDK is something like [this](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/02/03/windows-azure-storage-introducing-cors.aspx):

```csharp
// Get context object for working with blobs, and 
// set a default retry policy appropriate for a web user interface.
var blobClient = myStorageAccount.CreateCloudBlobClient();

// CORS should be enabled once at service startup
// Given a BlobClient, download the current Service Properties 
ServiceProperties blobServiceProperties = blobClient.GetServiceProperties();

// Enable and Configure CORS
ConfigureCors(blobServiceProperties);

// Commit the CORS changes into the Service Properties
blobClient.SetServiceProperties(blobServiceProperties);
``` 
Where enabling CORS is defined as follows:

```csharp
private static void ConfigureCors(ServiceProperties serviceProperties)
{
	serviceProperties.Cors = new CorsProperties();
	serviceProperties.Cors.CorsRules.Add(new CorsRule()
	{
		AllowedHeaders = new List<string>() { "*" },
		AllowedMethods = CorsHttpMethods.Put | CorsHttpMethods.Get | CorsHttpMethods.Head | CorsHttpMethods.Post,
		AllowedOrigins = new List<string>() { "*" },
		ExposedHeaders = new List<string>() { "*" },
		MaxAgeInSeconds = 1800 // 30 minutes
	});
}
``` 



    
### Exports

Some of our documenation may need to be made available to the outside world. Perhaps we want to let a client or an internal user access to it. Again...because our documentation repositories are private, we needed a way to export to HTML and perhaps embed in some web site pages. 

To do this, I create in each documentation repository two destination directories: `dest-html` and `dest-pdf` that are ignored by `git` (i.e. via `.gitignore`). I also provide two gulp tasks that will walk though all the .MD files and convert them to HTMLs and PDFs respectively.

To do this, we need to have [Node](https://nodejs.org/en/) and [Gulp](http://gulpjs.com/) installed. Here are local commands to run on the root of the web site: 

```
npm install gulp --save-dev
npm install gulp-markdown --save-dev
npm install gulp-markdown-pdf --save-dev 
```

Once completed, we can now run a gulp task that creates the HTML or PDF files (following the same directory structure) in the said `dest` folder:

```
gulp html
gulp pdf
```
The `.gulpfile` might look something like this:

```
var gulp = require('gulp');
var markdownpdf = require('gulp-markdown-pdf');
var markdownhtml = require('gulp-markdown');

gulp.task('pdf', function () {
        return gulp.src(['**/*.md', '!node_modules/**/*.md'])
        .pipe(markdownpdf())
        .pipe(gulp.dest('dest-pdf'));
});

gulp.task('html', function () {
        return gulp.src(['**/*.md', '!node_modules/**/*.md'])
        .pipe(markdownhtml())
        .pipe(gulp.dest('dest-html'));
});
```

### Web Site

Now that we have everthing we want to expose, I needed a web site to host all of this stuff. It turned out that GitHub provides one public site per repository or per one organization. These web sites are hosted by GitHub and they are referred to as [GitHub pages](https://pages.github.com/) and they powered by [Jekyll](http://jekyllrb.com/). 

I did not want to start making GitHub API calls directly from JavaScript as there are some security concerns. So the web site reads directly from the JSON file (that O prepared above) and bind the data to the views using any JavaScript binding library such as [Knockout](http://knockoutjs.com/) or full JavaScript framework such [AngularJS](https://angularjs.org/).

The site might contain:

* Organization information
* Repository Information showing stats, etc
* Selected Documentation
* Blog Posts
* Analytic Charts

### Conclusion 

GitHub provides an excellent platform for source code and documentation. With a little bit of help from their Webhooks and Web APIs, we can build a useful public site that can be used by executives to monitor progress of our IT efforts without having to log in to GitHub.   