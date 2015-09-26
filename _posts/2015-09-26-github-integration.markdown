---
layout: post
title:  "GitHub Integration using C#"
date:   2015-09-26 20:14:01
summary: "Some notes on how to integrate GitHub using C#"
categories: Technical
tags: C#, GitHub
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

We have most of our source code and documentation on GitHub. They are organized in organizations with private repositories though. While the privacy is really needed, our executives are not able to see what is going on unless they sign in to GitHub....something they are not particularly happy about. So the following are what I sat out to accomplish:

* Provide some sort of analytics to show who is doing what and when to the source code and documentation repositories
* Provide a listing of our source code and documentation repositories, status, last update, etc
* Expose some of our non-sensitive documentation as HTML or PDF
* Provide all of the above on a site available publicly so it will be really easy to view
 
The rest of the post will describe in details how I managed my goals as outlined above.

## Analytics

Assuming you have a complex object represented here for simplicity by a Book. But it can be anything:

```
	public class Book
	{
        public string Title { get; set; }
        public string Author { get; set; }
	}
```

## Listing


## Exports


## Web Site

  
