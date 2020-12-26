(window.webpackJsonp=window.webpackJsonp||[]).push([[31],{102:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return s})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return u}));var r=n(3),o=n(7),a=(n(0),n(138)),i={title:"ASP.NET API Versioning",author:"Khaled Hikmat",author_title:"Software Engineer",author_url:"https://github.com/khaledhikmat",author_image_url:"https://avatars1.githubusercontent.com/u/3119726?s=400&u=090899e7b366dd702f9d0d5e483f20089010b25c&v=4",tags:["ASP.NET"]},s={permalink:"/blog/2016/02/19/asp-net-api-versioning",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/blog/blog/2016-02-19-asp-net-api-versioning.md",source:"@site/blog/2016-02-19-asp-net-api-versioning.md",description:"A while back, I created an ASP.NET Web API 2 to be a back-end for a mobile app. I used basic authentication to make it easier for mobile apps to consume the Web API. I now decided to provide better security so I wanted to move to a token-based authentication. The problem is that if I change the Web API to a token-based, all existing mobile apps in the field will not function as they will be refused Web API connection.",date:"2016-02-19T00:00:00.000Z",tags:[{label:"ASP.NET",permalink:"/blog/tags/asp-net"}],title:"ASP.NET API Versioning",readingTime:4.56,truncated:!1,prevItem:{title:"Open Azure VM Port",permalink:"/blog/2016/04/25/open-azure-vm-port"}},l=[{value:"Controller Selector",id:"controller-selector",children:[]},{value:"Controller Versions",id:"controller-versions",children:[]},{value:"Request Property",id:"request-property",children:[]}],c={toc:l};function u(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(a.b)("wrapper",Object(r.a)({},c,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"A while back, I created an ASP.NET Web API 2 to be a back-end for a mobile app. I used basic authentication to make it easier for mobile apps to consume the Web API. I now decided to provide better security so I wanted to move to a token-based authentication. The problem is that if I change the Web API to a token-based, all existing mobile apps in the field will not function as they will be refused Web API connection. "),Object(a.b)("p",null,"The answer is to use Web API versioning! This way existing mobile users can continue to use the current version that uses basic authentication until the app is upgraded. The updated app version will switch over to use the new version which is based on token authentication. This post will discuss how I accomplished this versioning scheme."),Object(a.b)("h2",{id:"controller-selector"},"Controller Selector"),Object(a.b)("p",null,"The first step is to configure the ASP.NET framework to use a custom controller selector. In the ",Object(a.b)("inlineCode",{parentName:"p"},"WebApiConfig")," ",Object(a.b)("inlineCode",{parentName:"p"},"Register")," method, we tell the framework to use the custom selector:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),"config.Services.Replace(typeof(IHttpControllerSelector), new VersionAwareControllerSelector(config));\n")),Object(a.b)("p",null,"The selector is coded as follows:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),'public class VersionAwareControllerSelector : DefaultHttpControllerSelector\n{\n    private const string VERSION_HEADER_NAME = "some-value";\n    private const string VERSION_QUERY_NAME = "v";\n\n    private HttpConfiguration _configuration;\n\n    public VersionAwareControllerSelector(HttpConfiguration configuration)\n        : base(configuration)\n    {\n        _configuration = configuration;\n    }\n\n    // This works for Web API 2 and Attributed Routing\n    // FROM: http://stackoverflow.com/questions/19835015/versioning-asp-net-web-api-2-with-media-types/19882371#19882371\n    // BLOG: http://webstackoflove.com/asp-net-web-api-versioning-with-media-types/\n    public override HttpControllerDescriptor SelectController(HttpRequestMessage request)\n    {\n        HttpControllerDescriptor controllerDescriptor = null;\n\n        // Get a list of all controllers provided by the default selector\n        IDictionary<string, HttpControllerDescriptor> controllers = GetControllerMapping();\n\n        IHttpRouteData routeData = request.GetRouteData();\n\n        if (routeData == null)\n        {\n            throw new HttpResponseException(HttpStatusCode.NotFound);\n        }\n\n        // Pick up the API Version from the header...but we could also do query string\n        var apiVersion = GetVersionFromHeader(request);\n\n        // Check if this route is actually an attribute route\n        IEnumerable<IHttpRouteData> attributeSubRoutes = routeData.GetSubRoutes();\n\n        if (attributeSubRoutes == null)\n        {\n            string controllerName = GetRouteVariable<string>(routeData, "controller");\n            if (controllerName == null)\n            {\n                throw new HttpResponseException(HttpStatusCode.NotFound);\n            }\n\n            string newControllerName = String.Concat(controllerName, apiVersion);\n\n            if (controllers.TryGetValue(newControllerName, out controllerDescriptor))\n            {\n                return controllerDescriptor;\n            }\n            else\n            {\n                throw new HttpResponseException(HttpStatusCode.NotFound);\n            }\n        }\n        else\n        {\n            string newControllerNameSuffix = String.Concat("V", apiVersion); ;\n\n            IEnumerable<IHttpRouteData> filteredSubRoutes = attributeSubRoutes.Where(attrRouteData =>\n            {\n                HttpControllerDescriptor currentDescriptor = GetControllerDescriptor(attrRouteData);\n                bool match = currentDescriptor.ControllerName.EndsWith(newControllerNameSuffix);\n\n                if (match && (controllerDescriptor == null))\n                {\n                    controllerDescriptor = currentDescriptor;\n                }\n\n                return match;\n            });\n\n            routeData.Values["MS_SubRoutes"] = filteredSubRoutes.ToArray();\n        }\n\n        return controllerDescriptor;\n    }\n\n    private HttpControllerDescriptor GetControllerDescriptor(IHttpRouteData routeData)\n    {\n        return ((HttpActionDescriptor[])routeData.Route.DataTokens["actions"]).First().ControllerDescriptor;\n    }\n\n    // Get a value from the route data, if present.\n    private static T GetRouteVariable<T>(IHttpRouteData routeData, string name)\n    {\n        object result = null;\n        if (routeData.Values.TryGetValue(name, out result))\n        {\n            return (T)result;\n        }\n        return default(T);\n    }\n    \n\n    private string GetVersionFromHeader(HttpRequestMessage request)\n    {\n        if (request.Headers.Contains(VERSION_HEADER_NAME))\n        {\n            var header = request.Headers.GetValues(VERSION_HEADER_NAME).FirstOrDefault();\n            if (header != null)\n            {\n                return header;\n            }\n        }\n\n        return "1";\n    }\n\n    private string GetVersionFromQueryString(HttpRequestMessage request)\n    {\n        var query = HttpUtility.ParseQueryString(request.RequestUri.Query);\n\n        var version = query[VERSION_QUERY_NAME];\n        if (version != null)\n        {\n            return version;\n        }\n\n        return "1";\n    }\n}\n')),Object(a.b)("p",null,"As demonstarted above, I chose to send the version information as a header value! There are other options ...one of them is to pass it in the query string such as ",Object(a.b)("inlineCode",{parentName:"p"},"http://example.com/api/stats?v=2"),"."),Object(a.b)("h2",{id:"controller-versions"},"Controller Versions"),Object(a.b)("p",null,"The above allows us to have versioned controllers with the following naming convention:"),Object(a.b)("p",null,Object(a.b)("img",Object(r.a)({parentName:"p"},{src:"http://i.imgur.com/5jxk3S5.png",alt:"Controller Versions"}))),Object(a.b)("p",null,"The framework will pick version 1 (i.e. ",Object(a.b)("inlineCode",{parentName:"p"},"StatsV1Controller"),") by default unless the request's header contains a version header value. If the value is 2, then ",Object(a.b)("inlineCode",{parentName:"p"},"StatsV2Controller")," will be picked."),Object(a.b)("p",null,"The V1 controller is defined this way:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),'[BasicAuthorize()]\npublic class StatsV1Controller : ApiController\n{\n    [Route("api/stats", Name = "Stats")]\n    public virtual IHttpActionResult GetStats()\n    {\n        ....\n    }\n}\n')),Object(a.b)("p",null,"while the V2 controller is defined this way:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),'[TokenAuthorize()]\npublic class StatsV2Controller : StatsV1Controller\n{\n    [Route("api/stats", Name = "StatsV2")]\n    public override IHttpActionResult GetStats()\n    {\n        return base.GetStats();\n    }\n}\n')),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"The V1 controller uses basic authorization (as decorated by the attribute on top of the controller class) and V2 uses token authentication as decorated. "),Object(a.b)("li",{parentName:"ul"},"The V2 controller inherits from the V1 controller so there is no need to re-implement the methods."),Object(a.b)("li",{parentName:"ul"},"However, there is a need to supply a different route name for the V2 controller otherwise we will get a conflict. This is done by giving the V2 controller a route name that ends with V1 i.e. StatsV2. This is a little unfortunate but this is how it is. Had it not been for this, we could have simply inherited from V1 without having to repeat any method."),Object(a.b)("li",{parentName:"ul"},"Since V2 inherits from V1, I noticed that both authentication filters run per request. This means that when V2 is picked, the token authorize filer will run first and then followed by the basic authorize filter. This can cause problems. So what I did is at the end of the token authorize filter, I inject a value in the request properties. In the basic authorize filter, I check if the value exists, and, it if it does, I abort the basic authorize filter since the token filter has already run.")),Object(a.b)("h2",{id:"request-property"},"Request Property"),Object(a.b)("p",null,"Here is one way to inject a property in the request in the token filter:"),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),'actionContext.Request.Properties["some-key"] = "some-value";\n')),Object(a.b)("p",null,"Then in the basic filter, I check for this property existence. If it does exist, it means the request is authenticated and there is no need to perform basic authentication."),Object(a.b)("pre",null,Object(a.b)("code",Object(r.a)({parentName:"pre"},{className:"language-csharp"}),'string accessToken;\nif (!actionContext.Request.Properties.TryGetValue("sone-key", out accessToken))            \n{\n}\n')),Object(a.b)("p",null,"I hope someone finds this post helpful. Having multiple versions has provided me with a way to transition my mobile app users from basic authentication to token authentication without breaking the existing mobile apps.\n"))}u.isMDXComponent=!0},138:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return d}));var r=n(0),o=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=o.a.createContext({}),u=function(e){var t=o.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=u(e.components);return o.a.createElement(c.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},h=o.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,i=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=u(n),h=r,d=p["".concat(i,".").concat(h)]||p[h]||b[h]||a;return n?o.a.createElement(d,s(s({ref:t},c),{},{components:n})):o.a.createElement(d,s({ref:t},c))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=h;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var c=2;c<a;c++)i[c]=n[c];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,n)}h.displayName="MDXCreateElement"}}]);