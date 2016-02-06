---
layout: post
title:  "Entity Aggregation in Azure Service Fabric"
date:   2016-02-04 20:14:01
summary: "Notes on Azure Service Fabric"
categories: Technical
tags: Azure, Service Fabric, Actor Model, Stateful Service
featured_image: /images/2016-02-04/cover.jpg
---

As we have identified a need to decompose our monolithic legacy application into little modules to make it easier to update and delegate work on, I have been exploring Microservices as a possible solution. I have listened to many talks and read many articles on the subject. While I could understand the business and technical value, I could not wrap my head around how would one actually go about implementing something like this. What tools would I use? What programming language? What environment? What messages? I also explored the very popular Container approach using [Docker](https://www.docker.com/). It is indeed fascinating......but I felt overwhelmed with the Unix-like commands and the system admin knowledge that one must have to be able to deploy/use something like this. There is also a lot of work being done on Docker including a port to Windows. So this space is a moving target right now. I am sure when the dust settles, we will have better tools that allows everyone to use Containers quite easily. 

Eventually I heard about Azure [Azure Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/)! A new platform that allows developers to develop and update microservice-based application. I downloaded Azure Service Fabric and started looking into it. Having spent 2-3 weeks on the subject in my evenings and weekends, I finally feel there is some concrete implementation I can relate to and that I can now see things in perspective.   

With the ability to run and deploy clusters locally in my laptop, I wanted to try something meaningful and solve a specific business problem for my company. This post describes this process.

## Problem Description

Our company executives and accounting team would like to view sales and revenue by geographical hierarchy where entities are laid out from the top level (i.e. Global) all the way down to the bottom. Of course the ability for users to see different entities is controlled by a fine-grained security:

![Entity Hierarchy](http://i.imgur.com/POkG8aP.png)

In our terms, revenue units are virtual entities that sell a specific product. There could be many revenue units under the same physical call center. Of course, every call center belongs in a country and every country belongs to a region and every region belongs to global. The sales and revenue measures must be aggregated in two dimensions: geographic and time to show a complete picture to executives and accounting.  

A sample of how the data is to be laid out is shown here:

![Sample Data](http://i.imgur.com/4XzXFqF.png)

Users usually view the data by week/year. For example, in the above sample:

* The data is presented for a specific week and year. In the sample, we are showing the 3rd week of 2016. 
* For every entity, there are 2 measures: Net Sales (i.e. NS) and Net Revenue (i.e NR) in every time slot. In reality there are more measures, but we are only showing the minimum here. 
* For every entity, there are 3 time slots: Week to date (i.e. WTD), Quarter to date (i.e. QTD) and Year to date (i.e. YTD). 
* Based on the above geographical hierarchy, users can drill down or up. For example global drills down into regions, a region drills down into countries, a country drills down into call centers and a call center drills down into revenue units.

Historically we have solved this problem by using a typical business intelligence methodology where an ETL process runs to aggregate data from our OLTP database into a data warehouse and then we process the data into an OLAP. The OLAP is then queried to produce the desired results. The idea therefore is to build a solution using Azure Service Fabric that replaces the ETL and OLAP processes (which are quite expensive in both resources and licenses) to aggregate the entity data and provide a queryable executive view.   
       
## Process & Challenges

Sales and other transactions happen in our main transactional legacy system. Every transaction in the system is tagged with a specific revenue unit in a specific week of the year. In essence we are weekly company as sales, revenue & profit need to be reported weekly. 

*_We actually have several sub-systems that can use this solution! While the one we are sampling here is based on years and weeks, others are based on years and months. So the solution has to be able to support entity hierarchy and time slot variations.*_ 

There are several different processors that must take place to keep the system up-to-date:

#### Self & Parent Re-processing

When our main transactional system records a sale for a particular revenue unit on Jan 23, 2016, for example, we need to post an event to this new system to indicate that a re-process is needed for the revenue unit in the week 4/2016. The system must then perform the following calculations for the revenue unit and all of its parents (i.e. call center, country, region and global):

* Recalculate the measures (net revenue, net sales and others) in the affected week/year (i.e. Week 4 of 2016)
* Recalculate the measures in the affected quarter i.e. first quarter of 2016
* Recalculate the measures in the affected year i.e. 2016

Assuming we have weeks 1 through 5 in the system and we are re-processing week 4 of 2016, the self & parent re-processing is depicted like this (in BLUE arrows):

![Self & Parent Reprocessing](http://i.imgur.com/JzvgV3z.png)

#### Forward Week Re-processing

In addition to the above self & parent re-processing, another level of calculation is needed if the re-processed week has any forward weeks. For example, the forward week of 4/2016 is week 5/2016. Therefore week 5/2016 QTD and YTD measures must be re-calculated because they are affected by the changes that took place in week 4/2016. The forward week re-processing is depicted like this (in RED arrows):

![Forward Week Reprocessing](http://i.imgur.com/iVY07nB.png)

_*If we have 30 weeks in the system and week number 1 was changed, all 30 weeks must be re-processed as forward weeks. This domino effect is needed to maintain the system up-to-date.*_

### QTD & TYD Calculations

To calculate the QTD and YTD measures, each entity must determine the previous weeks that make up the quarter and year. For example: 

* If the re-processed week is 4/2016, then weeks 1/2016, 2/2016, 3/2016 and 4/2016 must be included in the query to produce the QTD and YTD values.  
* If the re-processed week is 2/2016, then only weeks 1/2016 and 2/2016 must be included in the query to produce the QTD and YTD values.
* If the re-processed week is 15/2016, however, then only weeks 14/2016 and 15/2016 (assuming that week 14/2016 is the start of the 2nd quarter) must be included in the query to produce QTD values, but weeks 1/2016 through 15/2016 must be included in the query to produce YTD values.

Now that we have a general idea of the system we are trying to build, let us take a look at the proposed architecture.
 
## Architecture

![Architecture](http://i.imgur.com/5mOHjmJ.png)

The following are the elements of this architecture:

#### API Gateway

Included with the Service Fabric App is an ASP .NET 5 managed Web API. It exposes a couple of APIs to allow the external systems to communicate with the Service Fabric app:

* Re-process: Anytime, there is a change in the transactional system, a post message is sent to the API Gateway to re-process the entity for the provided week and year. The post data looks like this:

```csharp
public class EntityReprocessModel
{
    public EntityTypes Type { get; set; }
    public int BusinessKey { get; set; }
    public int Year { get; set; }
    public int Period { get; set; }
}
```
 
_*Please note that I am using a more generic term (i.e. period) to refer to weeks. This is because, as mentioned earlier, the solution must adapt to other systems that rely on month as opposed to weeks*_

* Retrieve entity measures: This is to serve the app clients! Clients issue a GET request to retrieve the measures. For example, this is a sample API:

```
api/entities/{type}/{businesskey}/{year}/{period}
```

The return looks like this:

```jscript
{
  "ParentName": "North America",
  "ParentView": {
    "WtdMeasures": [
      {
        "Measure": 0,
        "Type": 0,
        "Value": 400
      },
      {
        "Measure": 1,
        "Type": 1,
        "Value": 100000
      }
    ],
    "QtdMeasures": [
      {
        "Measure": 0,
        "Type": 0,
        "Value": 800
      },
      {
        "Measure": 1,
        "Type": 1,
        "Value": 200000
      }
    ],
    "YtdMeasures": [
      {
        "Measure": 0,
        "Type": 0,
        "Value": 6000
      },
      {
        "Measure": 1,
        "Type": 1,
        "Value": 1500000
      }
    ]
  },
  "ThisView": {
    "WtdMeasures": [
      {
        "Measure": 0,
        "Type": 0,
        "Value": 300
      },
      {
        "Measure": 1,
        "Type": 1,
        "Value": 75000
      }
    ],
    "QtdMeasures": [
      {
        "Measure": 0,
        "Type": 0,
        "Value": 600
      },
      {
        "Measure": 1,
        "Type": 1,
        "Value": 150000
      }
    ],
    "YtdMeasures": [
      {
        "Measure": 0,
        "Type": 0,
        "Value": 4500
      },
      {
        "Measure": 1,
        "Type": 1,
        "Value": 1125000
      }
    ]
  },
  "ChildrenViews": {
    "CC1": {
      "WtdMeasures": [
        {
          "Measure": 0,
          "Type": 0,
          "Value": 200
        },
        {
          "Measure": 1,
          "Type": 1,
          "Value": 50000
        }
      ],
      "QtdMeasures": [
        {
          "Measure": 0,
          "Type": 0,
          "Value": 400
        },
        {
          "Measure": 1,
          "Type": 1,
          "Value": 100000
        }
      ],
      "YtdMeasures": [
        {
          "Measure": 0,
          "Type": 0,
          "Value": 3000
        },
        {
          "Measure": 1,
          "Type": 1,
          "Value": 750000
        }
      ]
    },
    "CC2": {
      "WtdMeasures": [
        {
          "Measure": 0,
          "Type": 0,
          "Value": 200
        },
        {
          "Measure": 1,
          "Type": 1,
          "Value": 50000
        }
      ],
      "QtdMeasures": [
        {
          "Measure": 0,
          "Type": 0,
          "Value": 400
        },
        {
          "Measure": 1,
          "Type": 1,
          "Value": 100000
        }
      ],
      "YtdMeasures": [
        {
          "Measure": 0,
          "Type": 0,
          "Value": 3000
        },
        {
          "Measure": 1,
          "Type": 1,
          "Value": 750000
        }
      ]
    }
  }
}
```

#### Enqueuer Service

This is a stateful service that implements a queue 
      