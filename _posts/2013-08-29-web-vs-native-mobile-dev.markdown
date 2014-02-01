---
layout: post
title:  "Web vs.Native Mobile Development"
date:   2013-08-29 20:14:01
summary: "Decisions about what platforms to target in mobile apps"
categories: Technical
tags: Native HTML5 Mobile
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

Obviously this is a very hot question in the industry today! Whether to build native or web (using HTML5) really depends on the application being built, the available resources at the company and what you are willing to learn.

Recently I have been involved in a Mobile app design & development! Where I work, we have experience in Java and Microsoft technologies. So it would have been acceptable for us to understand and write native mobile apps for the Android and Windows Phone platforms. However, since we also needed to support Apple iOS and the option of learning Objective C  does not strike us as fun, we had to choose to develop the app using HTML5  and forgo the native apps development.

The experience was eventually acceptable and the final product UI was pleasing. Here are the technologies we used:

* Microsoft's TypeScript - We used TypeScript to write the platform responsible for communicating with the back-end to retrieve data. Coming from a Type background, TypeScript really helps in this area.
* Sencha Touch - a very powerful JavaScript UI library for building HTML5 apps. It is very rich library but the learning curve was quite steep even for our seasoned web developer.
* Windows Azure Mobile Services i.e. ZUMO - the application backend APIs, the database and the push notifications are all handled by ZUMO. We find Azure mobile services to be very powerful and easy to use. We engaged the ZUMO APIs, dynamic schema,  GIT source control and sharing capability. We also used Azure's Service Bus Relay to connect to the on-premise database from the cloud.  The Bus Relay essentially is a secured, two-way communication channel between Azure and on-premise. It requires a web service in the form of WCF (Windows Communications Foundation) with a secret key and relay TCP channel. The WCF will sit in front of our on-premise database and will do the queries and the updates against it on behalf of the Azure web layer. The WCF service must be simple....just the relay channel in front if it and the database behind it in an effort to minimize the failure points.
* PhoneGap - we used PhoneGap to package the app and deliver to the different stores. We used Gordova 3 which allowed us to write some plugins mainly to handle the push notifications for Android, iOS and WP. All the push notifications to all platforms (i.e. iOS, Android and WP) were handled by ZUMO.

My observations is that the native apps in Android run a lot faster and smoother than their HTML5 counterpart. In iOS and WP, the performance difference between native and HTML5 is less obvious. Although the future might be for HTML5 and JavaScript, I feel native apps are better options if you have enough resources (or someone adventurous enough to tackle iOS Objective C). In addition, I find it a lot funner and more rewarding to use the native environment to develop mobile apps. In HTML5, you have to use a common denominator or use plugins (as in the case with PhoneGap) to bridge some functionality. The plugins,  while doable, are not easily implemented and there is a lot of guess work involved.


