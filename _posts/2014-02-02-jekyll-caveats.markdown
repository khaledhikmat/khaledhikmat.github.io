---
layout: post
title:  "Jekyll caveats"
date:   2014-02-02 20:14:01
summary: "Jekyll is a blog-aware platform that transforms your plain text into static websites. This post describes some caveats I ran into when I first started using it."
categories: Technical
tags: Jekyll
featured_image: /images/cover.jpg
---

Blog engines are bloated and they take a lot of effort to master. They also require setting up databases which is always not very easy. If you are developer, an easier approach might be to deal with your blog site in a similar fashion to 
how you deal with your source code repositories i.e. GitHub. In addition to source code branches, GitHub allows you to publish [GitHub pages]() site for your account and a site for each one of your repositories or projects. 
Full explanation is available [here](http://pages.github.com).

For the project sites, GitHub offers an autmomatic generator which produces a very nice looking site that allows folks to clone or download your source. The GitHub pages are available in the gh-pages branch of the repository. 
So, for example, the master branch is for your source code while the gh-pages are dedicated for your github pages.

The [GitHub pages documentation](https://help.github.com/categories/20/articles) tells you everything you need to know about GitHub pages. This post, however, assumes you are interested in building a blog site on Jekyll and goes through a few 
caveats that I ran into when I started with this. It also provides a sample generic project site tou can enhance and use for your own purposes. 

The advantages (that I see) for using Jekyll and GitHub pages are summarized here:

* Rendering - static HTML pages render very fast.
* Management - similar to our source code, the GitHub pages are stored in our source code in a different branch. This makes it very convenient for developers to manage their site content.
* No database - databases are difficult to setup and host
* GitHub hosting - comes for free using a GitHub account

*This [sample generic site](https://github.com/khaledhikmat/GenericProjectSite) can be used as a reference implementation of this.*

### Jekyll Installation

The installation process is documented on the [Jekyll](http://jekyllrb.com/docs/installation/) site quite well. In my case, I could not install it on my Mac! I kept in having issues with permissions and other issues. I am not versed in Macs...
so this could be the reason. However, I was able to install it quite easily on my Windows 8.1 machine without any problem. Although the Windows installation is not officall supported by Jekyll, the instructions worked well for me. 

### Setup Repositories for gh-pages

At first, I was a little confused about how to create gh-pages branch for my repositories. Here is how I am doing them now. Assumong we already have a GitHub repo at <repo-url>. To add gh-pages branch, we do this:

* Clone the repository
```
$ git clone <repo-url> 
```

* Switch the newly created repo directory
```
$ cd <repo-name>
```

* Create a new branch in the repo. The new branch must be called `gh-pages` so it can be used by GitHub pages
```
$ git branch gh-pages 
```

* Switch to the new gh-branch
$ git checkout gh-pages

* If there are any files that are needed in the branch, use the following to remove them
```
$ git rm -rf .
```

* Now you can add your pages
```
$ git add --all
```

* Commit the new pages
```
$ git commit -am "Blah blah blah"
```

* Push the new pages
```
$ git push origin gh-pages
```

### Layouts

Layputs are like master pages that define the site structure. My [sample generic site](https://github.com/khaledhikmat/GenericProjectSite) uses Bootstrap and loads the required external JavaScript libraries and sets up the content area. I will get back 
to this layout file as I will describe the different functionality.  

### Assets

In the [sample generic site](https://github.com/khaledhikmat/GenericProjectSite), I added the following directories to store my site assets:

* Images
* Files
* javascripts
* stylesheets

The way you would access these assets is via the site base url as follows:
```
<script type="text/javascript" src="{{ site.baseurl }}/javascripts/main.js"></script>
```

### Markdown

Markdown is what you would use to write your posts. This [site](http://daringfireball.net/projects/markdown/) describes the Markdown syntax and offers good examples. I found Markdown to be reasonable but can use more tags and functionality. For example, 
there is no way to add simple things like tables or make a URL reference target a seperate tab!!
 
### Data

Dats structures can be added to the data folder of the site. Say for example, you have a `Players` data structure defined as `.yml` this way:

```
- role: Unsigned User
  description: A user who is browsing the site
- role: Silver Member 
  description: A signed-in user with a SILVER tier
- role: Gold Member 
  description: A signed-in user with a GOLD tier
- role: Platinum Member 
  description: A signed-in user with a PLATINUM tier
- role: Executive
  description: Company Executive
- role: Admin
  description: Site Administrator
```

You would then use this data structure in the site as follows:

```
<div class="panel panel-primary">
	<div class="panel-heading">
		<h3 class="panel-title">Players & Roles</h3>
	</div>
	<div class="panel-body">
		{{"{% for player in site.data.players "}}%}
		<div class="media">
		  <a class="pull-left" href="#">
			<img class="media-object" src="http://placehold.it/64x64/" alt="64x64">
		  </a>
		  <div class="media-body">
			<h4 class="media-heading">{{"{{ player.role "}}}}</h4>
			{{"{{ player.description "}}}}
		  </div>
		</div>
		{{"{% endfor "}}%}
	</div>
</div>
```
 
### Includes are very powerful

Includes are used all over the place as they make sharing common behavior quite easy. Let us say, for example, you want to include attachments in your post, you will create a data entry in the post's  front-matter section (the stuff beteween the --- and ---):

```
illustrations: "
Splash Screen;Splash Screen;/images/2014-01-26/SplashScreen.png|
Home Hotels;Home Hotels;/images/2014-01-26/HomeHotels.png|
Home Map;Home Map;/images/2014-01-26/HomeMap.png
"
```

Then you would send the data element to the illustrations include like this:

```
{{"{% include illustrations.html param=page.illustrations "}}%}
```

The illustrations include can be written this way:

```
<div class="row">
<div class="highslide-gallery">
{{"{% for illustration in include.param "}}%}
{{"{% assign myIllusration =  illustration | split: ';' "}}%} 
<div {{"{% if include.param.size == 1 "}}%} class="col-md-12" {{"{% elsif include.param.size == 2 "}}%} class="col-md-6" {{"{% else "}}%} class="col-md-4" {{"{% endif "}}%}>
<a href="http://placehold.it/800/400/" class="highslide" onclick="return hs.expand(this)">
	<img src="http://placehold.it/200/100/" alt="Highslide JS"
		title="Click to enlarge" />
</a>
<div class="highslide-caption">
	{{"{{ myIllusration[0] "}}}} - {{"{{ myIllusration[1] "}}}}
</div>
</div>
{{"{% endfor "}}%}
</div>
</div>
<hr>
```

### JavaScript and External Libraries

You can include any Java Script code: external libraries and your own. In the sample project, I included Bootstrap, jQuery and highslide. These are all added to the `libraries` subfolder. My own JavaScript is in the `JavaScript` subfolder. 
I reference all of these scripts in default.html like so:

```
<script type="text/javascript" src="{{"{{ site.baseurl "}}}}/libraries/bootstrap/js/jquery.min.js"></script>
<script type="text/javascript" src="{{"{{ site.baseurl "}}}}/libraries/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="{{"{{ site.baseurl "}}}}/libraries/bootstrap/js/scripts.js"></script>
<script type="text/javascript" src="{{"{{ site.baseurl "}}}}/libraries/highslide/highslide-with-gallery.js"></script>
<script type="text/javascript" src="{{"{{ site.baseurl "}}}}/javascripts/main.js"></script>
```

Where main.js is my own.

One thing to note about JavaScript is that the data elements defined in the site (in the _data folder) can also be accessible to JavaScript. For example, the `players` data structure defined earlier can be made accessible to JavaScript like so:

```
<script>
// Very nice way of sending the data into JavaScript - use the jsonify filter available in Jekyll! 
// We can use this to do data charting and other interesting stuff since the data is now available to JavaScript.
var players = {{"{{ site.data.players | jsonify "}}}};
for (x in players) {
	console.log("Role : " + players[x].role + " = " +  players[x].description);
}
</script>
```

The use of the `jsonify` tag in Jekyll makes the process quite easy. Now that the data is available to JavaScript, further processing via JS can be used i.e. charting.

### Posts data manipulation

Jekyll offers a nice data structure called `site.categories` (and `site.tags`) which allows you to enumerate the posts for display purposes. For example, I wanted to show the categories and the number of posts in each category. This is how I did it:

```
<div class="panel panel-primary">
	<div class="panel-heading">
	<h3 class="panel-title">Categories</h3>
	</div>
	<div class="panel-body">
	<ul>
	{{"{% for category in site.categories "}}%}
	<li><a href="#{{"{{ category | first "}}}}">{{"{{ category[0] | capitalize "}}}}&nbsp;({{"{{ category[1] | size "}}}})</a></li>
	{{"{% endfor "}}%}
	</ul>
	</div>
</div>
```

Please note that the `category` in the above code is actually a hash!! The first element of which is the category name and the second element is the array of posts. 

Jekyll (via Liquid) offers very nice array manipulation such as sorting and reversing. This is an example of what I did to display the post archives by month:

```
<div class="panel panel-primary">
	<div class="panel-heading">
	<h3 class="panel-title">Archive</h3>
	</div>
	<div class="panel-body">
	<ul>
	{{"{% assign sortedPostsByDate = site.posts | sort:"date" "}}%}
	{{"{% for post in sortedPostsByDate reversed "}}%}
	  {{"{% capture currentyear "}}%} {{"{{post.date | date: "%B %Y" "}}}} {{"{% endcapture "}}%}
	  {{"{% if currentyear != year2 "}}%}
		<li><a href="#{{"{{ currentyear "}}}}">{{"{{ currentyear"}}}}</a></li>
		{{"{% capture year2 "}}%} {{"{{currentyear "}}}} {{"{% endcapture "}}%} 
	  {{"{% endif "}}%}
	{{"{% endfor "}}%}
	</ul>
	</div>
</div>
```
 
### Configuration

Jekyll uses a configuration file to control its operation. For the sample site, it is defined this way:

```
name: Generic Project
markdown: redcarpet
pygments: true
permalink: /:year-:month-:day/:title
baseurl: /GenericProjectSite
encoding: utf-8
```

All of these items are explained in the Jekyll site, but the `baseurl` requires a little bit of explanation. Using this configuration file, I can push to GitHub and the pages will show properly and all my assets are loaded properly. However, when I use my localhost of testing, the 
paths did not work properly because I do not have a GenericProjectSite as a virtual directory. To get around this, I uses the following to build and deploy my locahost server:

```
Jekyll build --watch
jekyll serve --baseurl ''
```

The `serve --baseurl ""` is overrided at the command line to be blank which is suitable for localhost deployment. When I deploy to GitHub via a Git push, however, the baseurl of `GenericProjectSite` is suitable.

### Authentication

Jekyll does not offer built-in authentication! There are some plugins that do offer authentication but GitHub does not allow plugins in Jekyll and hence they cannot be used. In the sample project, I created a very simple JavaScript solution that needs to 
be enhanced to be worth anything. The idea is that every page that requires authentication, you would an include that looks like this:

```
{{"{% include enforce-password.html "}}%}
``` 

The include is defined this way:

```
<script type="text/javascript">
$('#siteLoginDlgSubmit').click(function (ev) { 
	mainService.setCredentials($('#siteLoginDlgUserId').val(), $('#siteLoginDlgPassword').val());
	mainService.checkCredentials();
});

// Set up the model dialog options - disable the keyboard
$('#siteLoginDlg').modal({
  keyboard: false
});

mainService.checkCredentials();
</script>
```
So the JavaScript mainService (in my main.js) has a checkCredentials method. In the sample code, it allows anything but it can be made to check the credentials stored in the cookie against an authenticator service. This would work well but it means that the site 
has to check the authnetication in every render. Additionaly, programmers who access the site can actually dismiss the mask via the console in the developers' tools. So there has to be something that guards against that. Anyway, the main.js does offer what 
I think is necessary and here how it looks like:

```
	isValidCredentials = function (success, failure) {
		if (isCookie('{{ site.name }}-uid') == '' || isCookie('{{ site.name }}-pwd') == '') {
			failure();
		} else {
			// Recover the uid and pwd from the cookie
			var uid = getCookie('{{"{{ site.name "}}}}-uid');
			var pwd = getCookie('{{"{{ site.name "}}}}-pwd');
			// TODO: Use the uid/pwd in an AJAX call to check them against a remote service. Make sure you include the site name in the request.
			// TODO: My remote service authenticates the request and returns OK or ERROR
			// TODO: My remote service resets the password every 3 days via a scheduler and emails its users the new passwords
			// For now, let it go and success call back
			success();
		}
	},
```
 
### Comments

The pages or posts that require comments can include the comments include which is defined like this:

```
<a id="comments">Comments</a> 
<div id="comments">
<h3>Let us discuss!</h3>
<p>
Refer to some sort of comments policy and let folks know about it.
</p>
 <div id="disqus_thread"></div>
<script type="text/javascript">
/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
var disqus_shortname = '<add-your-own>'; // required: replace example with your forum shortname
/* * * DON'T EDIT BELOW THIS LINE * * */
(function() {
	var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
	dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
	(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
})();
</script>
<noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
<a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>
</div>    
```

This is basically taken from the `discqus` site. There is also some script loaded in the default.html.

### Anomalies

* I encountered many situations where Jekyll/Liquid produces weird bugs if the there are tabs or extra spaces in the {{"{% if "}}%} clauses. The output becomes very unpredictable. 
* Similarly in Jekyll data files, the violated tab characters is very annoying
* Also writing posts that contain some Jekyll/Liquid code (like this post) requires that you use extra brackets. Otherwise Jekyll will misundertand the code and transforms it into HTML!!! Check out [this post](http://truongtx.me/2013/01/09/display-liquid-code-in-jekyll/) 
for further information.

### Conclusion

Overall I think Jekyll and Liquid are a very powerful combination suited for developers who want to produce some documentation quickly without having to worry about maintaining a WordPress site and all the extra baggage that comes with it.

### References

* Jekyll Tutorial: [http://net.tutsplus.com/tutorials/other/building-static-sites-with-jekyll/](http://net.tutsplus.com/tutorials/other/building-static-sites-with-jekyll/)
* Markdown Syntax: [http://daringfireball.net/projects/markdown/](http://daringfireball.net/projects/markdown/)
* Migration from WordPress to Jekyll for blogs: [http://vitobotta.com/how-to-migrate-from-wordpress-to-jekyll/#using-static-and-dynamic-data](http://vitobotta.com/how-to-migrate-from-wordpress-to-jekyll/#using-static-and-dynamic-data)
* Liquid for Designers: [https://github.com/Shopify/liquid/wiki/Liquid-for-Designers](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers)
* Categories Pages: [http://stackoverflow.com/questions/19461396/can-jekyll-use-get-parameters](http://stackoverflow.com/questions/19461396/can-jekyll-use-get-parameters)


