var mainService = new function () {
	var organizations,
	
	setCookie = function (cname,cvalue,exdays) {	
	    var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "expires="+d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	},

	deleteCookie = function (cname) {	
		setCookie(cname, "", -1);
	},

	getCookie = function (cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
		  var c = ca[i].trim();
		  if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		}

		return "";
	},

	isCookie = function(cname) {
		var mycookie=getCookie(cname);
		if (mycookie != "") 
			return true;
		else
			return false;
	},

	parseRepositories = function() {
		var deferred = $.Deferred();

		if (organizations != null) {
			console.log('parseRepositories cache hit');
			deferred.resolve(organizations);
		} else {
			console.log('parseRepositories fetch from Internet');
			$.getJSON("https://miscwebjobs.blob.core.windows.net/jsons/repositories.json", function(data) {
				organizations = data;
				deferred.resolve(data);
			});
		}
		
		return deferred.promise();
	},
	
	tagCloud = function (dom,tag) {
	   var highVal = 0;
	   var lowVal = Number.MAX_VALUE;
	   var elements = dom.getElementsByTagName(tag);
	   var minFont = parseInt(dom.getAttribute('data-minfont'),10);
	   var maxFont = parseInt(dom.getAttribute('data-maxfont'),10);
	   var fontDif = 0;
	   var sizeDif = 0;
	   var size = 0;
	   var i = 0;
	   var data = 0;
				
	   for(i = 0; i < elements.length; ++i) {
		  data = parseInt(elements[i].getAttribute('data-count'),10);
		  if(data > highVal) {
			 highVal = data;
		  }
		  if(data < lowVal) {
			 lowVal = data;
		  }
	   }
				
	   fontDif = maxFont - minFont;
	   sizeDif = highVal - lowVal;

	   for(i = 0; i < elements.length; ++i) {
		  data = parseInt(elements[i].getAttribute('data-count'),10);
		  size = (fontDif * (data - lowVal) / sizeDif) + minFont;
		  size = Math.round(size);
		  elements[i].style.fontSize = size + "px";
	   }      
	};

    return {
		parseRepositories: parseRepositories,
		tagCloud: tagCloud
	};
}();
