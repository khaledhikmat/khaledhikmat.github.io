var mainService = new function () {
	var setCookie = function (cname,cvalue,exdays) {	
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

	maskPage = function () {
		$('#mask').show();
	},

	unmaskPage = function () {
		$('#mask').hide();
	},

	setCredentials = function (uid, pwd, site) {
		setCookie(site + '-uid', uid, 2);
		setCookie(site + '-pwd', pwd, 2);
		setCookie(site + '-site', site, 2);
	},

	isValidCredentials = function (site, success, failure) {
		if (isCookie(site + '-uid') == '' || isCookie(site + '-pwd') == '' || isCookie(site + '-site') == '') {
			failure();
		} else {
			// Recover the uid and pwd from the cookie
			var uid = getCookie(site + '-uid');
			var pwd = getCookie(site + '-pwd');
			var site = getCookie(site + '-site');
			console.log('uid: ' + uid + ' - pwd: ' + pwd + ' - site: ' + site);
			
			// Use the uid/pwd and site in an AJAX call to check them against a remote service. Make sure you include the site name in the request.
			// My remote service authenticates the request and returns OK or FORBIDDEN
			// My remote service resets the password every 3 days via a scheduler and emails its users the new passwords
			
			var zumoUrl = "https://hmc-jekyll.azure-mobile.net/";
			var zumoKey = "GYqgLmJgfmnJFGUJLmnDwyONmwBSPA51";
            var url = zumoUrl + "api/authenticationmanager";
            var headers = {};
            headers["X-ZUMO-APPLICATION"] = zumoKey;
            var self = this;

            $.ajax({
                url: url,
                type: "POST",
                data: {
		            userId: uid,
                    password: pwd,
                    site: site
                },
                dataType: 'json',
                headers: headers
            }).done(function() {
                console.log('authenticationmanager');
                success();
            }).fail(function (message) {
                console.log('authenticationmanager - error: ' + message);
                for (var i in message)
                    console.log('authenticationmanager - detailed error: ' + message[i]);
                failure();
            });
		}
	},

	isValidCredentialsSuccess = function () {
		$('#siteLoginDlg').modal('hide');
		unmaskPage(); 
	},

	isValidCredentialsFailure = function () {
		maskPage();
		$('#siteLoginDlg').modal('show');
	},

	checkCredentials = function (site) {
		// Initially hide the dialog and unmask the page
		$('#siteLoginDlg').modal('hide');
		unmaskPage(); 
		isValidCredentials(site, isValidCredentialsSuccess, isValidCredentialsFailure);
	},

	deleteCredentials = function (site) {
		deleteCookie(site + '-uid');
		deleteCookie(site + '-pwd');
		checkCredentials();
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
        setCredentials: setCredentials,
        checkCredentials: checkCredentials,
        deleteCredentials: deleteCredentials,
		unmaskPage: unmaskPage,
		maskPage: maskPage,
		tagCloud: tagCloud
	};
}();
