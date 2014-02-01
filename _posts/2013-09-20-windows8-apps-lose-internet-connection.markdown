---
layout: post
title:  "Windows8 Apps lose Internet conncetion"
date:   2013-09-20 20:14:01
summary: "A case where Windows Apps lose Internet connection"
categories: Technical
tags: Windows8 Internet Fiddler
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

I have been running Windows 8 on my main laptop pretty successfully since April 2013! Things are just fine... I am waiting for Windows 8.1 release anxiously as I already installed it on my Surface and I like what I see.

This morning I wanted to install a new app from the store but I was not able to connect! In fact, all my Windows 8 apps could not connect except for Skype! My desktop was fine. I searched everywhere and found many posts with people having similar problems. Most of the posts were related to upgrading Windows 7 to Windows 8. This does not relate to me as I have installed Windows 8 from scratch and have been running successfully for 6 months!

Initial Attempts:
=================

* Reset the laptop several times
* I disable my Norton Anti-Virus software
* Uninstalled the last 3-4 applications that I installed
* Tried all the commands that other folks have written regarding this issue including resetting the winsock and everything else I could find.

Nothing helped!

Solution:
=========

Oh well...I said to myself...at least my desktop side is working fine so I continued working as usual as I have many things I wanted to do. As I was debugging an Android apps and wanted to make sure that I was sending the proper URL to my Web API....so I fired Fiddler! I remembered last time I ran Fiddler (2-3 days ago), it updated to the latest version. when I finished working on it, I used my IE browser (on the desktop) and no connection!!!! My Chrome and FireFox are fine. I checked the LAN settings....and there it is:

{% include illustration.html param="Fillder Bad Proxy1;Fillder Bad Proxy1;/images/2013-09-20/FiddlerBadProxy1.png" %}

{% include illustration.html param="Fillder Bad Proxy2;Fillder Bad Proxy2;/images/2013-09-20/FiddlerBadProxy2.png" %}

What the hell? Localhost port 8888? I don't remember setting this! So I removed the proxy and Voila.... my IE in the desktop and all my Windows 8 apps started working immediately!! The culprit is indeed Fiddler...it fiddled (pun is intended) with my IE proxy settings and caused the Windows 8 apps not to work. I have no idea why the Windows 8 apps failed to connect when the IE proxy settings got tweaked by Fiddler but at least they are working again and I am really happy.

BTW....If I have Fiddler running and reset the proxy connection, I get the waring from Fiddler:

{% include illustration.html param="Fillder Bad Proxy3;Fillder Bad Proxy3;/images/2013-09-20/FiddlerBadProxy3.png" %}

I hope this post will help someone! It took me several frustrating hours but the solution was found by pure luck!!