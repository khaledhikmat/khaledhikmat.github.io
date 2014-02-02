---
layout: post
title:  "Generic Project Site with Jekyll"
date:   2014-02-02 20:14:01
summary: "Jekyll is a blo-aware platform that transforms your plain text into static websites "
categories: Technical
tags: Jekyll Static HTML
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

** The problem
Blog sites are bloated and they take a lot of effort to master. They also require 

** Jekyll Installation
It should be quite simple! In Mac, 

** Setup Repositories for gh-pages
Imagine we already have a GitHub repo at <repo-url>. To add gh-pages branch, we do this:
From the bash where we have our sites (i.e. SourceCode\KhaledHikmat\Sites\GitHub), we clone the repository:
$ git clone <repo-url>
This will create a new directory 
$ cd <repo>
$ git branch gh-pages 
This will create a new branch in that repo
$ git checkout gh-pages
This will switch from master to gh-pages
$ git rm -rf .
This will remove all files from the master branch
..Now you can add your pages and push:
$ git add --all
$ git commit -am "asas"
$ git push origin gh-pages

** Jekyll static HTML

** Why significant for developers:
		○ No database
		○ Site files ate git controlled
Generic Site Description
Markdown
User Stories as Blogs
Includes are very powerful
Data Manipulation and its availability to JavaScript
Site.posts data collection and its manipulation
Always remember it is a static site
Authentication
		○ Plugins solution
		○ No plugins allowed in GitHub
		○ JavaScript solution
JavaScript libraries
Comments
Jekyll and its weird bug in (% if %}
Jekyll data files --- violated the tab characteres
