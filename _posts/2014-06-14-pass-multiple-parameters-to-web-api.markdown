---
layout: post
title:  "Pass Multiple Parameters to a Web API GET"
date:   2014-06-14 20:14:01
summary: "A good way to handle passing multiple parameters to a GET method in ASP .NET Web API"
categories: Technical
tags: C#, Web API, ASP .NET
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

I needed to pass multiple query string parameters to a GET method in an ASP .NET Web API. I wanted to receive the parameters as a complex argument 
in the GET Method. This is how I wanted my Web API controller method to look like:

```
        [Route("api/outlets", Name = "Outlets")]
        public IHttpActionResult GetTry(OutletsSearchParameters params)
        {
            try
            {
				// Do stuff...
                return Ok(params); // Just to see what I am getting
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
``` 

Where the OutletsSearchParameters is defined as follows:

```
    public class OutletsSearchParameters 
    {
        public int Page { get; set; }
        public int RecordsPerPage { get; set; }
        public string Lang { get; set; }
        public string City { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
```

I found out that I can use action filer to the rescue. Here is an implementation of the custom filter:

```
    public class JsonParameter : ActionFilterAttribute
    {
        Type _type;
        string _queryStringKey;

        public JsonParameter(Type type, string queryStringKey)
        {
            _type = type;
            _queryStringKey = queryStringKey;
        }

        public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            NameValueCollection qscoll = HttpUtility.ParseQueryString(actionContext.Request.RequestUri.Query);
            if (qscoll != null)
            {
                var jsonParameter = qscoll[_queryStringKey];
                if (jsonParameter != null)
                {
                    var jsonData = JsonConvert.DeserializeObject(jsonParameter, _type);
                    actionContext.ActionArguments[_queryStringKey] = jsonData;
                }
            }
        }
    }
```

and here is how I decorated my Web API controller method:

```
        [Route("api/outlets", Name = "Outlets")]
        [JsonParameter(typeof(OutletsSearchParameters), "json")]
        public IHttpActionResult GetTry(OutletsSearchParameters json)
        {
            try
            {
				// Do stuff...
                return Ok(json); // Just to see what I am getting
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
```

Now....I can use pass the parameters as a JSON object in the query string like so:

```
/api/outlets?json={"city":"some city","lang":"EN","page":"0","recordsPerPage":"10"}
```

From a Java Script client, I can assemble an object literal like this:

```
	var searchParameters = {
		city: 'some nice city',
		lang: 'EN',
		page: 0,
		recordsPerPage: 10
	};
```
and use the JSON stringify method to serialize the object. To assemble the URL, we can write something like this:

```
var url = '/api/outlets?json=' + JSON.stringify(searchParameters);
```
