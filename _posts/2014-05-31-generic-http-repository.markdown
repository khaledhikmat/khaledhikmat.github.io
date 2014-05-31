---
layout: post
title:  "Generic HTTP Repository"
date:   2014-05-31 20:14:01
summary: "A simple C# class to handle HTTP verbs using HttpClient"
categories: Technical
tags: C#, HTTP
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

This is a class that I used in my C# PCL library to target Web APIs written in ASP.NET Web API. I think it is quite helpful as it demonstrates 
C# excellent generic capability and the HttpClient Async programming model. In addition, there is a nice `util` method that converts a list of  
keys and values to a query string.
 
The repository interface
========================
```
    public interface IHttpRepository
    {
        Task<TResponse> Get<TResponse>(string token, string version, string userName, string apiString, string apiSlug, List<KeyValuePair<string, string>> queryStringParams);
        Task<TResponse> Post<TRequest, TResponse>(TRequest requestObject, string token, string version, string userName, string apiString, string apiSlug, List<KeyValuePair<string, string>> queryStringParams);
        Task<TResponse> Put<TRequest, TResponse>(TRequest requestObject, string token, string version, string userName, string apiString, string apiSlug, List<KeyValuePair<string, string>> queryStringParams);
        Task<bool> Delete(string token, string version, string userName, string apiString, string apiSlug);
    }
``` 

The repository implementation
=============================
```
    public class HttpRepository : IHttpRepository
    {
        private string _apiUrl;
        private string _apiSecondaryUrl;
        private string _apiKey;
        private string _apiSubscriptionkey;
        private bool _isSecondary;

        public HttpRepository(string apiUrl, string apiSecondaryUrl, string apiKey, string subscriptionKey, bool isSecondary = false)
        {
            _apiUrl = apiUrl;
            _apiSecondaryUrl = apiSecondaryUrl;
            _apiKey = apiKey;
            _apiSubscriptionkey = subscriptionKey;
            _isSecondary = isSecondary;
        }

        public async Task<TResponse> Get<TResponse>(string token, string version, string userName, string apiString, string apiSlug, List<KeyValuePair<string, string>> queryStringParams)
        {
            var uri = GetUri(apiString, apiSlug, queryStringParams);
            HttpClient client = new HttpClient();
            AssignHeaders(ref client, token, version, userName);
            HttpResponseMessage response = await client.GetAsync(uri);

            if (response.StatusCode.ToString().ToUpper().Equals("OK"))
            {
                TResponse responseObject = JsonConvert.DeserializeObject<TResponse>(response.Content.ReadAsStringAsync().Result);
                return responseObject;
            }
            else
            {
                return default(TResponse);
            }
        }

        public async Task<TResponse> Post<TRequest, TResponse>(TRequest requestObject, string token, string version, string userName, string apiString, string apiSlug, List<KeyValuePair<string, string>> queryStringParams)
        {
            var uri = GetUri(apiString, apiSlug, queryStringParams);
            var postData = JsonConvert.SerializeObject(requestObject,
                                                  new JsonSerializerSettings()
                                                  {
                                                      NullValueHandling = NullValueHandling.Ignore
                                                  });
            HttpContent httpContent = new StringContent(postData, Encoding.UTF8, "application/json");

            HttpClient client = new HttpClient();
            AssignHeaders(ref client, token, version, userName);
            HttpResponseMessage response = await client.PostAsync(uri, httpContent);

            if (response.StatusCode.ToString().ToUpper().Equals("CREATED"))
            {
                TResponse responseObject = JsonConvert.DeserializeObject<TResponse>(response.Content.ReadAsStringAsync().Result);
                return responseObject;
            }
            else
            {
                return default(TResponse);
            }
        }

        public async Task<TResponse> Put<TRequest, TResponse>(TRequest requestObject, string token, string version, string userName, string apiString, string apiSlug, List<KeyValuePair<string, string>> queryStringParams)
        {
            var uri = GetUri(apiString, apiSlug, queryStringParams);
            var putData = JsonConvert.SerializeObject(requestObject,
                                                  new JsonSerializerSettings()
                                                  {
                                                      NullValueHandling = NullValueHandling.Ignore
                                                  });
            HttpContent httpContent = new StringContent(putData, Encoding.UTF8, "application/json");

            HttpClient client = new HttpClient();
            AssignHeaders(ref client, token, version, userName);
            HttpResponseMessage response = await client.PutAsync(uri, httpContent);

            if (response.StatusCode.ToString().ToUpper().Equals("OK"))
            {
                TResponse responseObject = JsonConvert.DeserializeObject<TResponse>(response.Content.ReadAsStringAsync().Result);
                return responseObject;
            }
            else
            {
                return default(TResponse);
            }
        }

        public async Task<bool> Delete(string token, string version, string userName, string apiString, string apiSlug)
        {
            var uri = GetUri(apiString, apiSlug, "");
            HttpClient client = new HttpClient();
            AssignHeaders(ref client, token, version, userName);
            HttpResponseMessage response = await client.DeleteAsync(uri);

            if (response.StatusCode.ToString().ToUpper().Equals("OK"))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        private void AssignHeaders(ref HttpClient client, string token, string version, string userName)
        {
            client.DefaultRequestHeaders.Add("X-TC-API-KEY", _apiKey);
            client.DefaultRequestHeaders.Add("X-TC-API-TOKEN", token);
            client.DefaultRequestHeaders.Add("X-TC-API-USER-NAME", userName);
            client.DefaultRequestHeaders.Add("X-TC-VERSION", version);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }

        private string GetUri(string apiString, string apiSlug, List<KeyValuePair<string, string>> queryStringParams)
        {
            string queryString = ToQueryString(queryStringParams);
            return GetUri(apiString, apiSlug, queryString);
        }

        private string GetUri(string apiString, string apiSlug, string queryString)
        {
            if (!_isSecondary)
                return _apiUrl + apiSlug + apiString + (string.IsNullOrEmpty(queryString) ? "?subscription-key=" + _apiSubscriptionkey : queryString + "&subscription-key=" + _apiSubscriptionkey);
            else
                return _apiSubscriptionkey + apiString + (string.IsNullOrEmpty(queryString) ? "" : queryString);
        }

        private string ToQueryString(List<KeyValuePair<string, string>> queryStringParams)
        {
            StringBuilder sb = new StringBuilder("?");

            bool first = true;

            foreach (KeyValuePair<string, string> param in queryStringParams)
            {
                if (!first)
                {
                    sb.Append("&");
                }

                sb.AppendFormat("{0}={1}", Uri.EscapeDataString(param.Key), Uri.EscapeDataString(param.Value));

                first = false;
            }

            return sb.ToString();
        }
    }
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