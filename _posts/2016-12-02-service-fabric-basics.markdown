---
layout: post
title:  "Service Fabric Basics"
date:   2016-12-02 20:14:01
summary: "A demonstration of basic but important functionality in Service Fabric"
categories: Technical
tags: Service Fabric Basics
featured_image: /images/cover.jpg
---

Service Fabric is a cool technology from Microsoft! It has advanced features that allows many scenarios. But in this post, we will only cover basic concepts that are usually misunderstood by a lot of folks.

For the purpose of this demo, we are going to develop a very basic guest executable service written as a console app. We will use very basic application and service manifests and PowerShell script to deploy to Service Fabric and show how Service Fabric monitors services, reports their health and allows for upgrade and update. 

## Guest Service  

The Guest service is a very basic console app that does this:

```
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Crashable Service Started....");
        Thread.Sleep(120000);
        Console.WriteLine("Crashable Service crashed...");
        // Crash!!!!!
        Environment.Exit(-1);
    }
}
```

That is it!! The service starts and crashes after 2 minutes. Let us see how we can package this service to run within Service Fabric. Please note that this service is not cognizant of any Service Fabric. It is purely a simple service written as a console app.

## Application Package

Application Package in Service Fabric is nothing but a folder that contains certain manifests in specific sub-folders! We will build the directory by hand instead of using Visual Studio to do it for us so we can find out exactly how to do this. Let us create a directory called `BasicAvailabilityApp` (i.e.  `c:\BasicAvailabilityApp`) to describe the Service Fabric application. 

### The root folder

The root folder contains the application manifest and a sub-folder for each service in contains. Here is how the application manifest looks like for this demo application:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest ApplicationTypeName="BasicAvailabilityAppType" ApplicationTypeVersion="1.0.0"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                     xmlns="http://schemas.microsoft.com/2011/01/fabric">
   <ServiceManifestImport>
      <ServiceManifestRef ServiceManifestName="CrashableServiceTypePkg" ServiceManifestVersion="1.0.0" />
   </ServiceManifestImport>
</ApplicationManifest>
```

There are several pieces of information in this manifest:

- The application type: `BasicAvailabilityAppType`.
- The application version: `1.0.0`.
- The application contains a single service type `CrashableServiceTypePkg` with version `1.0.0`.
- The XML name spaces are not important to us.

This is how the application folder looks like: 

![Root Application Folder](http://i.imgur.com/suY3mS4.png)

### The service folder

The service folder contains the service manifest and a sub-folder for each service in contains. Here is how the application manifest looks like for this demo application:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="CrashableServiceTypePkg"
                 Version="1.0.0"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <StatelessServiceType ServiceTypeName="CrashableServiceType" UseImplicitHost="true" />
  </ServiceTypes>

  <CodePackage Name="CodePkg" Version="1.0.0">
    <EntryPoint>
      <ExeHost>
        <Program>CrashableService.exe</Program>
      </ExeHost>
    </EntryPoint>
  </CodePackage>
</ServiceManifest>
```

There are several pieces of information in this manifest:

- The service package: `CrashableServiceTypePkg`.
- The service version: `1.0.0`.
- The service type: `CrashableServiceType`.
- The service type is stateless.
- The service code package exists in a sub-folder called `CodePkg` and it is of version `1.0.0`.
- The service code consists of an executable called `CrashableService.exe`.
- The XML name spaces are not important to us.

This is how the service folder looks like: 

![Service Folder](http://i.imgur.com/MTzbGXl.png)

This is what it takes to package an application in Service Fabric. 

## Deployment

Please note that the package we created in the previous step needs to be deployed to Service Fabric in order to run. To do this, we will need to use either Visual Studio or PowerShell. Since we want to use the lower level commands, Visual Studio is not an option for us. We will use PowerShell instead:

Here is the PowerShell script that we can use:

```
# Define equates (hard-coded):
$clusterUrl = "localhost"
$imageStoreConnectionString = "file:C:\SfDevCluster\Data\ImageStoreShare" 
$appPkgName = "BasicAvailabilityAppTypePkg"
$appTypeName = "BasicAvailabilityAppType"
$appName = "fabric:/BasicAvailabilityApp"
$serviceTypeName = "CrashableServiceType"
$serviceName = $appName + "/CrashableService"

# Connect PowerShell session to a cluster
Connect-ServiceFabricCluster -ConnectionEndpoint ${clusterUrl}:19000

# Copy the application package to the cluster
Copy-ServiceFabricApplicationPackage -ApplicationPackagePath "BasicAvailabilityApp" -ImageStoreConnectionString $imageStoreConnectionString -ApplicationPackagePathInImageStore $appPkgName

# Register the application package's application type/version
Register-ServiceFabricApplicationType -ApplicationPathInImageStore $appPkgName

# After registering the package's app type/version, you can remove the package from the cluster image store
Remove-ServiceFabricApplicationPackage -ImageStoreConnectionString $imageStoreConnectionString -ApplicationPackagePathInImageStore $appPkgName

# Create a named application from the registered app type/version
New-ServiceFabricApplication -ApplicationTypeName $appTypeName -ApplicationTypeVersion "1.0.0" -ApplicationName $appName 

# Create a named service within the named app from the service's type
New-ServiceFabricService -ApplicationName $appName -ServiceTypeName $serviceTypeName -ServiceName $serviceName -Stateless -PartitionSchemeSingleton -InstanceCount 1

```

The key commands are the last two where we:

- Create a named application name from the registered application type and version:
```
# Create a named application from the registered app type/version
New-ServiceFabricApplication -ApplicationTypeName $appTypeName -ApplicationTypeVersion "1.0.0" -ApplicationName $appName 
```
- Create a named service within the named app from the service type:
```
# Create a named service within the named app from the service's type
New-ServiceFabricService -ApplicationName $appName -ServiceTypeName $serviceTypeName -ServiceName $serviceName -Stateless -PartitionSchemeSingleton -InstanceCount 1
```

This is extremely significant as it allows us to create multiple application instances within the same cluster and each names application instance has its own set of services. This is how the named application and services are related to the cluster (taken from Service Fabric team presentation):

![Naming Stuff](http://i.imgur.com/P4V2acF.png)

Once the named application and the named service are deployed, the Service Fabric explorer shows it like this:

![Success Deployment](http://i.imgur.com/4htT4ih.png)

## Availability
 
One of the major selling points of Service Fabric is its ability to make services highly available by monitoring them and restarting them if necessary. This post is to show ta very basic example of this to demo this very concept. 

Regardless of whether the service is guest executable or Service Fabric cognizant service, Service Fabric monitors the service to make sure it runs correctly. In our case, the service will crash after 2 minutes.....so once you issue the PowerShell commands to deploy the cluster (in this case to the local one), you will see that Service fabric detects the failure and reports a bad health on the Service Fabric Explorer:

![Error Deployment](http://i.imgur.com/iYLsimO.png)

## Cleanup

In order to remove the named application and its services, you can issue these PowerShell commands:

```
# Delete the named service
Remove-ServiceFabricService -ServiceName $serviceName -Force

# Delete the named application and its named services
Remove-ServiceFabricApplication -ApplicationName $appName -Force
```

In order to delete the application type:

```
# If no named apps are running, you can delete the app type/version
Unregister-ServiceFabricApplicationType -ApplicationTypeName $appTypeName -ApplicationTypeVersion "1.0.0" -Force
```

## Versions & Upgrade

It turned out that Service Fabric does not really care what how you name your versions! If you name your versions as numbers like 1.0.0 or 1.1.0, they call that `Semantic Versioning`. But you are free to use whatever version naming convention you want. 

Let us use a different version scheme for our simple app. How about alpha, beta and productionV1, productionV2, etc. Let us cleanup our app from the cluster (as shown above), fix the service crashing, update the manifest files to make the version `Beta` and re-deploy using the beta version:

### The Service 

```csharp
static void Main(string[] args)
{
    Console.WriteLine("Crashable Service Started....");

    while(true)
    {
        Thread.Sleep(120000);
    }
}
```

### The Application Manifest

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationManifest ApplicationTypeName="BasicAvailabilityAppType" 
					 ApplicationTypeVersion="Beta"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                     xmlns="http://schemas.microsoft.com/2011/01/fabric">
   <ServiceManifestImport>
      <ServiceManifestRef ServiceManifestName="CrashableServiceTypePkg" ServiceManifestVersion="Beta" />
   </ServiceManifestImport>
</ApplicationManifest>
```

### The Service Manifest

```xml
<?xml version="1.0" encoding="utf-8"?>
<ServiceManifest Name="CrashableServiceTypePkg"
                 Version="Beta"
                 xmlns="http://schemas.microsoft.com/2011/01/fabric"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <ServiceTypes>
    <StatelessServiceType ServiceTypeName="CrashableServiceType" UseImplicitHost="true" />
  </ServiceTypes>

  <CodePackage Name="CodePkg" Version="Beta">
    <EntryPoint>
      <ExeHost>
        <Program>CrashableService.exe</Program>
      </ExeHost>
    </EntryPoint>
  </CodePackage>
</ServiceManifest>
```

### Deployment

```
# Define equates (hard-coded):
$clusterUrl = "localhost"
$imageStoreConnectionString = "file:C:\SfDevCluster\Data\ImageStoreShare" 
$appPkgName = "BasicAvailabilityAppTypePkg"
$appTypeName = "BasicAvailabilityAppType"
$appName = "fabric:/BasicAvailabilityApp"
$serviceTypeName = "CrashableServiceType"
$serviceName = $appName + "/CrashableService"

# Connect PowerShell session to a cluster
Connect-ServiceFabricCluster -ConnectionEndpoint ${clusterUrl}:19000

# Copy the application package to the cluster
Copy-ServiceFabricApplicationPackage -ApplicationPackagePath "BasicAvailabilityApp" -ImageStoreConnectionString $imageStoreConnectionString -ApplicationPackagePathInImageStore $appPkgName

# Register the application package's application type/version
Register-ServiceFabricApplicationType -ApplicationPathInImageStore $appPkgName

# After registering the package's app type/version, you can remove the package from the cluster image store
Remove-ServiceFabricApplicationPackage -ImageStoreConnectionString $imageStoreConnectionString -ApplicationPackagePathInImageStore $appPkgName

# Create a named application from the registered app type/version
New-ServiceFabricApplication -ApplicationTypeName $appTypeName -ApplicationTypeVersion "Beta" -ApplicationName $appName 

# Create a named service within the named app from the service's type
New-ServiceFabricService -ApplicationName $appName -ServiceTypeName $serviceTypeName -ServiceName $serviceName -Stateless -PartitionSchemeSingleton -InstanceCount 1
```

### Upgrade

Now that the beta version is deployed, let us make another change in the service, change the version to ProdutionV1 and issue the following PowerShell commands to registe and upgrade to `ProductionV1`

```
# Copy the application package ProductionV1 to the cluster
Copy-ServiceFabricApplicationPackage -ApplicationPackagePath "BasicAvailabilityApp-ProductionV1" -ImageStoreConnectionString $imageStoreConnectionString -ApplicationPackagePathInImageStore $appPkgName

# Register the application package's application type/version
Register-ServiceFabricApplicationType -ApplicationPathInImageStore $appPkgName

# After registering the package's app type/version, you can remove the package
Remove-ServiceFabricApplicationPackage -ImageStoreConnectionString $imageStoreConnectionString -ApplicationPackagePathInImageStore $appPkgName

# Upgrade the application from Beta to ProductionV1
Start-ServiceFabricApplicationUpgrade -ApplicationName $appName -ApplicationTypeVersion "ProductionV1" -UnmonitoredAuto -UpgradeReplicaSetCheckTimeoutSec 100
```

The upgrade takes place rolls in using a concept called Upgrade Domains which makes ure that the service that is being upgraded does not ever become unavailable:

![Upgrade Domains](http://i.imgur.com/kp1uMor.png)

Once the upgrade is done, the new application and service version is `ProductionV1`:

![Production V1](http://i.imgur.com/k4FpO1H.png)

## Updates

Now that our service is in production, let us see what how we can increase and decrease its number of instances at will. This is very useful to scale the service up and down depending on parameters determined by the operations team. 

You may have noticed that we have always used instance count 1 when we deployed our named service:

```
# Create a named service within the named app from the service's type
New-ServiceFabricService -ApplicationName $appName -ServiceTypeName $serviceTypeName -ServiceName $serviceName -Stateless -PartitionSchemeSingleton -InstanceCount 1
```

Let us try to increase the instance count to 5 using PowerShell:

```
# Dynamically change the named service's number of instances
Update-ServiceFabricService -ServiceName $serviceName -Stateless -InstanceCount 5 -Force
```

**Please note** that if your test cluster has less than 5 nodes, you will get health warnings from Service Fabric because SF will not be place more instances than the number of available nodes. This is because SF cannot guarantee availability if it places multiple instances on the same node.

Anyway, if you get health warning or if you would like to scale back on your service, you can downgrade the number of instances using this PowerShell command:

```
Update-ServiceFabricService -ServiceName $serviceName -Stateless -InstanceCount 1 -Force
``` 

Please notice how fast the scaling (up or down) takes place!!

## What is next?

In future posts, I will use Service Fabric .NET programming model to develop and deploy stateless and stateful services with HTTP and RCP endpoints. 
