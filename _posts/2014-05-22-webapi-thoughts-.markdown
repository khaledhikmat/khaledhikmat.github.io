---
layout: post
title:  "Web API Thoughts"
date:   2014-05-22 20:14:01
summary: "A list of thoughts and recommendations gathered while working on an ASP .NET Web API Project"
categories: Technical
tags: WebAPI
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

Setter injection in filters using Unity
=======================================
There are plenty of documentations on how to do constructor injection using Unity in Web API projects. 
But there isn't much about setter injection in filters. I had to deal with this last week, provided that you already have Unity installed 
via Nuget, here is what you have to do:

In the Register method of the WebAPiConfig.cs, add this line of code:

```
	// Unity iOC container filter registration (to allow setter injection)
	config.Services.Add(typeof(IFilterProvider), new UnityWebApiFilterProvider(container));
``` 

This tells Web API to add an IFilterProvider service to the pipeline. 

The UnityWebApiFilterProvider class is defined like so:

```
    public class UnityWebApiFilterProvider : IFilterProvider
    {
        private UnityContainer _container;
        public UnityWebApiFilterProvider(UnityContainer container)
        {
            _container = container;
        }

        public IEnumerable<FilterInfo> GetFilters(HttpConfiguration configuration, HttpActionDescriptor actionDescriptor)
        {
            var controllerFilters = actionDescriptor.ControllerDescriptor.GetFilters().Select(instance => new FilterInfo(instance, FilterScope.Controller));
            var actionFilters = actionDescriptor.GetFilters().Select(instance => new FilterInfo(instance, FilterScope.Action));

            var filters = controllerFilters.Concat(actionFilters);

            foreach (var filter in filters)
            {
                _container.BuildUp(filter.Instance.GetType(), filter.Instance);
            }

            return filters;
        }
    }
```

JSON Only
=========
If you only want to support JSON (i.e. no negotiation) and you want the JSON payload to be as expected when 
consumed by clients such as JavaScript, you can do this in the WebApiConfig.cs:

```
	// Remove all formatters and just leave the JSON formatter
	// No negitiation...always return JSON
	GlobalConfiguration.Configuration.Formatters.Clear();
	GlobalConfiguration.Configuration.Formatters.Add(new JsonMediaTypeFormatter()); 

	var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().FirstOrDefault();
	jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
```

The CamelCase contract resolver changes your C# models naming convention from Pascal to Camel.

Version Support
===============
To support controller versioning, one way to do it would be to intercept the controller selection in the Web API pipeline so we can direct the 
selector to different versions based on some header. To do this first step, you can do this in the WebApiConfig.cs:

```
	// Change the controller and the action selectors to detect 'not found' scenarios
	config.Services.Replace(typeof(IHttpControllerSelector), new VersionAwareControllerSelector(config));
```
  
In the above code, I am changing the controller selector to be version aware. Here is an example of how a Version Aware selector might look like. This works with 
attributed routing which is not very well documented. The code below shows the links where I got most of the code from:

```
    public class VersionAwareControllerSelector : DefaultHttpControllerSelector
	{
        private HttpConfiguration _configuration;

        public VersionAwareControllerSelector(HttpConfiguration configuration)
	        : base(configuration)
	    {
            _configuration = configuration;
	    }

        // This works for Web API 2 and Attributed Routing
        // FROM: http://stackoverflow.com/questions/19835015/versioning-asp-net-web-api-2-with-media-types/19882371#19882371
        // BLOG: http://webstackoflove.com/asp-net-web-api-versioning-with-media-types/
        public override HttpControllerDescriptor SelectController(HttpRequestMessage request)
        {
            HttpControllerDescriptor controllerDescriptor = null;

            // Get a list of all controllers provided by the default selector
            IDictionary<string, HttpControllerDescriptor> controllers = GetControllerMapping();

            IHttpRouteData routeData = request.GetRouteData();

            if (routeData == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }

            // Pick up the API Version
            var apiVersion = GetVersionFromHeader(request);

            // Check if this route is actually an attribute route
            IEnumerable<IHttpRouteData> attributeSubRoutes = routeData.GetSubRoutes();

            if (attributeSubRoutes == null)
            {
                string controllerName = GetRouteVariable<string>(routeData, "controller");
                if (controllerName == null)
                {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                }

                string newControllerName = String.Concat(controllerName, apiVersion);

                if (controllers.TryGetValue(newControllerName, out controllerDescriptor))
                {
                    return controllerDescriptor;
                }
                else
                {
                    throw new HttpResponseException(HttpStatusCode.NotFound);
                }
            }
            else
            {
                // So just hand it over to the base implementation
                //return base.SelectController(request);

                // We want to find all controller descriptors whose controller type names end with
                // the following suffix(ex: OutletsSecured)
                string newControllerNameSuffix = String.Concat("V", apiVersion); ;

                IEnumerable<IHttpRouteData> filteredSubRoutes = attributeSubRoutes.Where(attrRouteData =>
                {
                    HttpControllerDescriptor currentDescriptor = GetControllerDescriptor(attrRouteData);
                    bool match = currentDescriptor.ControllerName.EndsWith(newControllerNameSuffix);

                    if (match && (controllerDescriptor == null))
                    {
                        controllerDescriptor = currentDescriptor;
                    }

                    return match;
                });

                routeData.Values["MS_SubRoutes"] = filteredSubRoutes.ToArray();
            }

            return controllerDescriptor;
        }

        private HttpControllerDescriptor GetControllerDescriptor(IHttpRouteData routeData)
        {
            return ((HttpActionDescriptor[])routeData.Route.DataTokens["actions"]).First().ControllerDescriptor;
        }

        // Get a value from the route data, if present.
        private static T GetRouteVariable<T>(IHttpRouteData routeData, string name)
        {
            object result = null;
            if (routeData.Values.TryGetValue(name, out result))
            {
                return (T)result;
            }
            return default(T);
        }
        
        private string GetVersionFromMediaType(HttpRequestMessage request)
        {
            var accept = request.Headers.Accept;
            var ex = new Regex(@"application\/vnd\.TableConcierge\.([a-z]+)\.v([0-9]+)\+json", RegexOptions.IgnoreCase);

            foreach (var mime in accept)
            {
                var match = ex.Match(mime.MediaType);
                if (match != null)
                {
                    return match.Groups[2].Value;
                }
            }

            return "1";
        }

        private string GetVersionFromAcceptHeaderVersion(HttpRequestMessage request)
        {
            var accept = request.Headers.Accept;

            foreach (var mime in accept)
            {
                if (mime.MediaType == "application/json")
                {
                    var value = mime.Parameters
                                    .Where(v => v.Name.Equals("version", StringComparison.OrdinalIgnoreCase))
                                    .FirstOrDefault();

                    return value.Value;
                }
            }

            return "1";
        }

        private string GetVersionFromHeader(HttpRequestMessage request)
        {
            const string HEADER_NAME = "X-TC-VERSION";

            if (request.Headers.Contains(HEADER_NAME))
            {
                var header = request.Headers.GetValues(HEADER_NAME).FirstOrDefault();
                if (header != null)
                {
                    return header;
                }
            }

            return "1";
        }

        private string GetVersionFromQueryString(HttpRequestMessage request)
        {
            var query = HttpUtility.ParseQueryString(request.RequestUri.Query);

            var version = query["v"];
            if (version != null)
            {
                return version;
            }

            return "1";
        }
    }
``` 