---
layout: post
title:  "Entity Aggregation in Azure Service Fabric"
date:   2016-02-04 20:14:01
summary: "Notes on Azure Service Fabric"
categories: Technical
tags: Azure, Service Fabric, Actor Model, Stateful Service
featured_image: /images/cover.jpg
---

As we have identified a need to decompose our monolithic legacy application into little modules to make it easier to update and delegate work on, I have been exploring different options of doing this including the very popular Container approach using [Docker](https://www.docker.com/). The idea of Docker is really superb ....it took me a while to wrap my head around it ....but in order to use it right now requires some good experience with Linux...something we don't currently have as we are mostly Windows shop. There is also a lot of work being done on Docker including a port to Windows. So this space is a moving target right now. I am sure when the dust settles, we will have better tools that allows everyone to use Containers quite easily. 

Then the idea of Microservices came along as I was reading about Azure [Azure Service Fabric](https://azure.microsoft.com/en-us/services/service-fabric/)! I am truly fascinated with this whole concept. It was not long before I downloaded Azure Service Fabric and kicked its tires. But then I wanted to try something meaningful and solve a specific business problem for us.

## Problem Description

Our executives and accounting team would like to view sales and revenue by geographical hierarchy where entities are laid out from the top level (i.e. Global) all the way down to the bottom. Of course the ability for users to see different entities is controlled by a fine-grained security:

![Entity Hierarchy](http://i.imgur.com/POkG8aP.png)

A sample of how the data is to be laid out is shown here:

![Sample Data](http://i.imgur.com/4XzXFqF.png)

Users usually view the data by week/year. For example, in the above sample:

* We are showing the 3rd week of 2016. 
* For every entity, we have 2 measures: Net Sales (i.e. NS) and Net Revenue (i.e NR) in every time slot. In reality there are a lot more, but we are showing the minimum here. 
* There are 3 time slots: Week to date (i.e. WTD), Quarter to date (i.e. QTD) and Year to date (i.e. YTD). 
* Based on the above geographical hierarchy, global drills down into regions, a region drills down into countries, a country drills down into call centers and a call center drills down into revenue units.

Historically we have solved this problem by using a typical business intelligence methodology where an ETL process runs to aggregate data from our OLTP database into a data warehouse and then we process the data into an OLAP. The OLAP is then queried to produce the desired results.

Using Azure Service Fabric, I wanted to see if I can build a solution that replaces the ETL and OLAP processes (which are quite expensive in both resources and licenses).   
       
## Process & Challenges

Sales and other transactions happen against our main transactional legacy system. Usually transactions target a specific revenue unit in a specific week of the year. 

For example, when the backend system records a sale for a Dallas revenue unit, for example, on Jan 23, 2016, we need to post an event to this system (that we are building) to indicate that a re-process is needed for the revenue unit in the said week and year. The system must then perform the following for the affected revenue unit and all of its parents (i.e. call center, country, region and global):

* Recalculate the measures (net revenue, net sales and others) in the affected week/year (i.e. Week 4 of 2016)
* Recalculate the measures in the affected quarter i.e. first quarter of 2016
* Recalculate the measures in the affected year i.e. 2016

Assuming we have weeks 1 through 5 in the system and we are re-processing week 4 of 2016, the self & parent recalculation is depicted like this (in BLUE arrows):

![Parent Week Reprocessing](http://i.imgur.com/Xkpq7xO.png)

There is also a challenge in re-calculating the measures for the quarter and year. This is because each week has to determine the weeks that it must include for its quarter and year to date processing. For example, if we are re-processing week 4 of 2016, weeks 1 through 4 must be included in the query to re-calculate the quarter to date and the year to date measures.

In addition to the above re-calculation, another level of calculation is needed if the re-processed week has any forward week. For example, the forward weeks of week 4 of 2016 is week 5 of 2016 and its QTD and YTD measures will be affected if changes take place in week 4 and therefore must be re-calculated. The forward week re-processing is depicted like this (in RED arrows):

![Forward Week Reproessing](http://i.imgur.com/e56hn60.png) 

_*If we have 30 weeks in the system and week number 1 was changed, all 30 weeks must be re-processed as forward weeks.*_

## Architecture

![Overall Architecture](http://i.imgur.com/sHw2u2J.png)

