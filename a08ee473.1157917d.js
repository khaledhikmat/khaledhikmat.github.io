(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{111:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return i})),r.d(t,"metadata",(function(){return c})),r.d(t,"toc",(function(){return s})),r.d(t,"default",(function(){return u}));var o=r(3),a=r(7),n=(r(0),r(138)),i={title:"Service Fabric Secure Cluster Deployment",author:"Khaled Hikmat",author_title:"Software Engineer",author_url:"https://github.com/khaledhikmat",author_image_url:"https://avatars1.githubusercontent.com/u/3119726?s=400&u=090899e7b366dd702f9d0d5e483f20089010b25c&v=4",tags:["Service Fabric"]},c={permalink:"/blog/2017/02/21/service-fabric-secure-cluster",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/blog/blog/2017-02-21-service-fabric-secure-cluster.md",source:"@site/blog/2017-02-21-service-fabric-secure-cluster.md",description:"In this post, I just used the Service Fabric team article https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-creation-via-arm to create a PowerShell script that will do the entire deployment. I also downloaded all the required helper PowerShell modules and placed them in one repository so it would be easier for others to work with the deployment.",date:"2017-02-21T00:00:00.000Z",tags:[{label:"Service Fabric",permalink:"/blog/tags/service-fabric"}],title:"Service Fabric Secure Cluster Deployment",readingTime:1.87,truncated:!1,prevItem:{title:"Document Deletion in Azure DocumentDB",permalink:"/blog/2017/03/30/deletes-in-docdb"},nextItem:{title:"Web Tests Thoughts",permalink:"/blog/2017/02/15/web-test-thoughts"}},s=[],l={toc:s};function u(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(n.b)("wrapper",Object(o.a)({},l,r,{components:t,mdxType:"MDXLayout"}),Object(n.b)("p",null,"In this post, I just used the Service Fabric team article ",Object(n.b)("a",Object(o.a)({parentName:"p"},{href:"https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-creation-via-arm"}),"https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-cluster-creation-via-arm")," to create a PowerShell script that will do the entire deployment. I also downloaded all the required helper PowerShell modules and placed them in one ",Object(n.b)("a",Object(o.a)({parentName:"p"},{href:"https://github.com/khaledhikmat/service-fabric-secure-deployment"}),"repository")," so it would be easier for others to work with the deployment."),Object(n.b)("p",null,"Here are some of my notes:"),Object(n.b)("ul",null,Object(n.b)("li",{parentName:"ul"},"The account you use to log in to Azure with must be a Global admin."),Object(n.b)("li",{parentName:"ul"},"In case of errors during deployment, please check the Azure Activity Logs. It is pretty good and provides a very useful insight to what went wrong."),Object(n.b)("li",{parentName:"ul"},"After a deployment is successful, you can modify the ARM template and re-deploy. This will update the cluster. For example, if you added a new LN port and re-deployed using the PowerShell script, that new port will be available."),Object(n.b)("li",{parentName:"ul"},"To connect to a secure cluster, use this guide: ",Object(n.b)("a",Object(o.a)({parentName:"li"},{href:"https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-connect-to-secure-cluster"}),"https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-connect-to-secure-cluster")," "),Object(n.b)("li",{parentName:"ul"},"Connect to the cluster using the browser ",Object(n.b)("a",Object(o.a)({parentName:"li"},{href:"https://your-cluster.westus.cloudapp.azure.com:19080/Explorer/index.html"}),"https://your-cluster.westus.cloudapp.azure.com:19080/Explorer/index.html ")," will cause a certificate error. This is expected as the script uses a self-signed certificate. Just proceed.  "),Object(n.b)("li",{parentName:"ul"},"To log in to the fabric explorer requires that you complete the steps where you go to the AD in which the cluster belongs to, select the app that was created and assign an admin role to it as described in the above article. This must be done from the classic portal."),Object(n.b)("li",{parentName:"ul"},"To connect using PowerShell, use ",Object(n.b)("inlineCode",{parentName:"li"},'Connect-ServiceFabricCluster -ConnectionEndpoint ${dnsName}:19000 -ServerCertThumbprint "6C84CEBF914FF489551385BA128542BA63A16222" -AzureActiveDirectory'),". Please note that, similar to the browser, this requires that the user be assigned as in the previous step."),Object(n.b)("li",{parentName:"ul"},"Please note that securing the cluster does not mean that your own application endpoint is secured. You must do whatever you need to do to enable HTTPs in your own application and provide some sort of token authentication. "),Object(n.b)("li",{parentName:"ul"},"I noticed that the only VM size that worked reliably was the Standard_D2. Anything less than that causes health issues due to disk space, etc. I heard from Microsoft ",Object(n.b)("a",Object(o.a)({parentName:"li"},{href:"https://social.msdn.microsoft.com/Forums/en-US/04915062-63fd-4608-94fb-f018c32e15c3/will-there-be-a-service-fabric-managed-service?forum=AzureServiceFabric"}),"here")," that they are working on ways to reduce the cost of the VMs, particularly by allowing us to use smaller VMs and still get the reasonable reliability/durability levels, which would help reduce costs without sacrificing the safety or uptime of our service.")))}u.isMDXComponent=!0},138:function(e,t,r){"use strict";r.d(t,"a",(function(){return p})),r.d(t,"b",(function(){return d}));var o=r(0),a=r.n(o);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,o,a=function(e,t){if(null==e)return{};var r,o,a={},n=Object.keys(e);for(o=0;o<n.length;o++)r=n[o],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(o=0;o<n.length;o++)r=n[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=a.a.createContext({}),u=function(e){var t=a.a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},p=function(e){var t=u(e.components);return a.a.createElement(l.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},h=a.a.forwardRef((function(e,t){var r=e.components,o=e.mdxType,n=e.originalType,i=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),p=u(r),h=o,d=p["".concat(i,".").concat(h)]||p[h]||b[h]||n;return r?a.a.createElement(d,c(c({ref:t},l),{},{components:r})):a.a.createElement(d,c({ref:t},l))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var n=r.length,i=new Array(n);i[0]=h;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var l=2;l<n;l++)i[l]=r[l];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,r)}h.displayName="MDXCreateElement"}}]);