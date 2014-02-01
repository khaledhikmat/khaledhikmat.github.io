---
layout: post
title:  "WordPress and JavaScript"
date:   2013-09-20 20:14:01
summary: "How to embed your own JavaScript in a WordPress site"
categories: Technical
tags: WordPress JavaScript
project: "Khaled Hikmat"
tagline: An old time software technologist and architect!
---

{% include post-header.html param=page.tags %}

{% include post-navigation.html %}

I have always wanted a nice and easy-to-use CMS system! The good and easy ones are all in PHP and I have always dreaded learning PHP...nothing bad about it...it just does not suit me well especially that I come from Java and C# background. The ones that are written in Java or .NET are ok...but a little complicated for my purpose. I have tried many: Orchard CMS, .NET Nuke, Embraco, etc. They are all fine but, like I said, they felt like a sludge hammer.

The right answer for me would be WordPress! Yes..it is PHP based but ..man...you can do stuff really quickly on it and there is a ton of help on the Internet. The problem is if I wanted to write some pages that access my database or back-end, PHP would be difficult for me. So instead of fiddling with PHP and server side code, I thought of loading JavaScript in my WP pages and do web service calls to my back-end to conjure up the pages. This seems to work quite well. While this is not earth shattering, it is helpful as I am able to use a PHP based CMS system and augment it with JavaScript to call my back-end. This post will explain the steps that I took to accomplish that.

WordPress Installation and Hosting:
===================================

Well...that was quite simple...because  I have a Windows Azure account. If you don't have one, I definitely recommend signing up for Windows Azure. So I created a new Web Site from gallery and within minutes, my WordPress was up and ready with MYSQL database:

{% include illustration.html param="WP Azure Gallery;WP Azure Gallery;/images/2013-09-03/WPGallery1.png" %}

{% include illustration.html param="WP Azure Gallery2;WP Azure Gallery2;/images/2013-09-03/WPGallery2.png" %}

I set up my admin password and I am in business.

Set up FTP:
===========

In order to change the WP files on the Azure server, you need to setup the FTP. This [Windows Azure Article](http://www.windowsazure.com/en-us/develop/php/tutorials/website-w-mysql-and-ftp/) will help you figure out what you need to.

FTP Client:
===========

Since I am on Windows, I use FileZilla FTP [client](https://filezilla-project.org/) and it works really well. There a small trick you have to do in order to access the WP files stored on Azure. You must download the publish profile, open it in a text editor and copy the FTP user id and password as they are into the FTP client. This is mentioned in the above article but may not be very obvious.

{% include illustration.html param="Fillder Bad Proxy1;Fillder Bad Proxy1;/images/2013-09-03/Profile.png" %}

My JavaScript:
==============

Now that I have FTP connection, I actually downloaded the entire site onto my machine so I can examine the WP site file structure. All I had to do with to change my theme a little bit to allow my own JavaScript to be loaded. It turned out there is only one file called  functions.php (located in wp-content\themes\<your-theme>\functions.php. I placed the following a the end of it. Mine is located here:  wp-content\themes\twentythirteen\functions.php

```
function add_my_scripts() {
 wp_enqueue_script( 'my-script', get_template_directory_uri() . '/js/mine/mine.js', array( 'jquery' ), '', true );
}
add_action('wp_enqueue_scripts', 'add_my_scripts');
```

To do this, I created a directory in wp-content\themes\<your-theme>\js called 'mine' and in it I have placed a mine.js file.  Please read more about WP JavaScript loading here.

As an example, I placed the following JavaScript code in mine.js:

```
var myService = new function () {
tell = function () {
 console.log('wow...inside my script');
 alert('wow...inside my script');
 };

return {
 tell: tell
 };
}();
```

I replaced the functions.php file, created the new 'mine' directory and uploaded the mine.js file.

Now the fun begins:

From WP Dashboard, I created a new page that has the following HTML/JS markup:

This page has my own Java Script! It allows me to make AJAX calls to my back-end to retrieve and position data in my page.

Voila! My script has been called and I can now expand on this to do something quite special.

Doing the above makes my script load in every page! This is probably ok if the script is quite small like the above. But if the script is to do anything significant, you probably want to only load it in your own pages that use it. This is called 'Adding Script Conditionally'. This is one way of restricting loading the script to a specific page:

```
function add_my_scripts() {
	if ( is_page()) {
		if ( is_page('My Script')) {
			wp_enqueue_script( 'my-script', get_template_directory_uri() . '/js/mine/mine.js', array( 'jquery' ), '', true );
		} else if (is_page('My Other Page')) {
		    wp_enqueue_script( 'other-script', get_template_directory_uri() . '/js/other/other.js', array( 'jquery' ), '', true );
		} else {
			/* Do not do anything */
		}
	}
}
add_action('wp_enqueue_scripts', 'add_my_scripts');
```

For a complete list of the all of the available conditional tags, consult [this](http://codex.wordpress.org/Conditional_Tags).

One thing is left to be mentioned.... from my observations, WordPress re-formats the pages and posts! So if you embed JavaScript inline, it may not run properly because it gets reformatted. To combat this, I actually used an Inline JavaScript Plugin.... it worked better but still it is not very reliable (in WP 3.6). Hence the best way is to keep all the JavaScript code in a file on its own (to be injected via the technique above) and only use markup in the page or post.

Of course, this example is quite trivial but it shows that you can have your cake and eat it too. I think WordPress with your own JavaScript will be a very quick and productive combination.