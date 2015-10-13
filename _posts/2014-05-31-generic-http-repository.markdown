---
layout: post
title:  "Generic HTTP Repository"
date:   2014-05-31 20:14:01
summary: "A simple C# class to handle HTTP verbs using HttpClient"
categories: Technical
tags: C#, HTTP
featured_image: /images/cover.jpg
---

This is a class that I used in my C# PCL library to target Web APIs written in ASP.NET Web API. I think it is quite helpful as it demonstrates 
C# excellent generic capability and the HttpClient Async programming model. In addition, there is a nice `util` method that converts a list of  
keys and values to a query string.
 
### The repository interface

```csharp
    public interface IHttpRepository
    {
        Task<TResponse> Get<TResponse>(string token, string version, string userName, string apiString, string apiSlug, List<KeyValuePair<string, string>> queryStringParams);
        Task<TResponse> Post<TRequest, TResponse>(TRequest requestObject, string token, string version, string userName, string apiString, string apiSlug, List<KeyValuePair<string, string>> queryStringParams);
        Task<TResponse> Put<TRequest, TResponse>(TRequest requestObject, string token, string version, string userName, string apiString, string apiSlug, List<KeyValuePair<string, string>> queryStringParams);
        Task<bool> Delete(string token, string version, string userName, string apiString, string apiSlug);
    }
``` 

### The repository implementation

```csharp
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
			if (queryStringParams.Count == 0)
				return "";
				
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
