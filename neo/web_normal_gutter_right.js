/*
	Version : 0.0.1
	Created On : 14.03.2015

	-- hoverr_tera.js load this js
	-- It get data set by hoverr_tera.js 
*/
(function() {
	var $isMobile = !!((/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))),
		$onceCalled = false,
		jqueryLink = '//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
		debugRequired = true,
		$,
		_window_dataObject = {};

	var Debugger = function () { };
	Debugger.log = function (message) {
		try {
			if(debugRequired) console.log(message);
		} catch (exception) {}
	};

	var findContainer = function(callback){
		var tempObject = [];

		var inlineContainer = undefined,
		intr = window.setInterval(function(){
			if($('body').length != 0 && $(_window_dataObject.selector).length != 0){
				window.clearInterval(intr);

				inlineContainer = $('body');
				var top = ($(window).height()/2 - (_window_dataObject.dimension.height/2)),
					width = ((($(window).width() - $(_window_dataObject.selector).width()) / 2) - 5),
					containerDiv = $('<div data-attr="not-done" class="_adSenceImagePushContainer" style="height:auto;display:block;text-align:center;padding:0px;margin:auto !important;position:fixed !important;top:20px;width:'+ width +'px;overflow:hidden !important;right:-200px;z-index:2147483644;"><span class="_hov_close" style="position:absolute;top:0;right:0;height:19px;width:19px;text-align:center;cursor:pointer;font-size:19px;line-height:18px;color:#F0F0F0;z-index:2147483648;background:#C1C1C1;" title="Close">&times</span></div>');

				inlineContainer.append(containerDiv);
				tempObject.push({
					containerDiv: containerDiv,
					width: width
				});
				if(typeof(callback) === "function" && callback !== undefined) callback(tempObject);
				else return tempObject;
			}
		}, 100);
	};

	// Set attribute for elements
	var setAttributes = function(el, attrs) {
		for(var key in attrs) { if (attrs.hasOwnProperty(key)) el.setAttribute(key, attrs[key]); }
	};

	var putAd = function(container){
		var iframe = document.createElement('iframe'),
		$width = container.width,
		$iframeWidth = _window_dataObject.dimension.width,
		$iframeHeight = _window_dataObject.dimension.height,

		$scale = (($width / $iframeWidth) <= 1) ? ($width / $iframeWidth) : 1,
		$left = ($scale < 1) ? (($width - $iframeWidth)/2) : 0, 
		$bottom = 0, 
		$cssText, 
		$top,
		$adTag = _window_dataObject.tag,
		$key = [window._pm_object.host, window._pm_object.section, window._pm_object.web_or_mobile, _window_dataObject.id, _window_dataObject.is_default],
		$pixelPingHtml = '<img src="http://track.hoverr.media/pixel.gif?key='+ $key.join('|') +'" style="display:none;"/>';

		$cssText = "height:"+ $iframeHeight +"px !important; left:"+ $left +"px !important; width:"+ $iframeWidth +"px !important; overflow:hidden; bottom:"+ $bottom +"px; border: 0px; position:relative; background: transparent; z-index: 2; -moz-transform: scale("+ $scale +"); -o-transform: scale("+ $scale +"); -webkit-transform: scale("+ $scale +"); transform: scale("+ $scale +"); max-width:initial !important;";

		setAttributes(iframe, {"height": $iframeHeight, "scrolling": "no", "frameBorder": 0, "allowtransparency": "true", "class": "_adSenceImagePush", "width": $iframeWidth, "loadStatus": 0, "data-width": $iframeWidth, "data-height": $iframeHeight, "style":$cssText});
		container.containerDiv.append(iframe);

		try{
			Debugger.log('Log : Setting html content in try block !!');
			var doc = iframe.contentDocument || iframe.contentWindow.document;
			doc.open();
			doc.write('<head><style>html{margin:0 !important;background:transparent;}body{margin:0 !important;position:relative !important;border:0;background-color:transparent;}img{width:100% !important;}object{width:100% !important;}body iframe{width:100% !important;background:transparent;}</style><script type="text/javascript">var d=document,w=window,interval,el=w.frameElement,mIn,vIn;function init(){interval=setInterval(function(){if(d.getElementsByTagName("iframe").length>0||d.getElementsByTagName("img").length>0||d.getElementsByTagName("object").length>0||d.getElementsByTagName("embed").length>0){w.clearInterval(interval);var ip=d.getElementsByTagName("iframe");if(ip.length==0){ani();}else{ip[0].onload=ani();}}},200);}function ani(){ el.setAttribute("loadStatus",1); d.body.style.display="block"; } function bdn(){el.style.display="none";} \x3C/script></head><body onload="init()"> <div style="position: absolute;top: 0;height: 18px;width: 100%;"></div>'+ $adTag + $pixelPingHtml +'</body>');
			doc.close();
		}
		catch(e){}

		$(window).scroll(function(){
			if($(window).scrollTop() > 400){
				if($(container.containerDiv).attr('hov-no-animation') === undefined){
					container.containerDiv.animate({
						'right': 0,
					}, 1000);
				}
			}
		});

		// Binding click event
		container.containerDiv.find('._hov_close').click(function(){
			$(this).closest('._adSenceImagePushContainer').animate({
				'right': "-200px"
			}, 1000, function(){
				$(this).remove();
			});
		});
	};

	// After deciding which jQuery to use this function get called
	var initialize = function(){
		Debugger.log('Log : Initialize function called !!');
		if ($isMobile) return;

		if(!$onceCalled) {
			$onceCalled = true;
			$ = $ || window.jQuery || window.$;

			var localstorageData;
			try{
				localstorageData = JSON.parse(localStorage.getItem("hoverrneo"));	
			}
			catch(e){
				localstorageData = undefined;
			}

			if(localstorageData === undefined || localstorageData.web_normal_gutter_right == undefined) return;
			else _window_dataObject = localstorageData.web_normal_gutter_right;

			findContainer(function(container){
				$.each(container, function(i, v){
					putAd(container[i]);
				});
			});
		}
	};

	// Create script tag with forwarded link and put under the head section and get back to scriptLoadHandler function
	var loadJS = function(src, callback) {
		var s = document.createElement('script');
		s.src = src;
		s.type = "text/javascript";

		s.onreadystatechange = s.onload = function() {
			var state = s.readyState;
			if (!callback.done && (!state || /loaded|complete/.test(state))) {
				callback.done = true;
				callback(true);
			}
		};
		(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(s);
	};
	
	var backupCall = function(){
		$ = $ || window.jQuery || window.$;
		$(document).ready(function(){
			if(!$onceCalled) initialize();
		});

		$(window).load(function() {
			if(!$onceCalled){
				Debugger.log('Log : Calling from the backup call windowload.')
				initialize();	
			} 
		});

		document.addEventListener('DOMContentLoaded', function() {
		   if(!$onceCalled){
				Debugger.log('Log : Calling from the backup call DOMContentLoaded.')
				initialize();	
			} 
		}, false);
	};


	// Load jQuery if not present and swipe handler if mobile
	if (window.jQuery === undefined || parseInt(window.jQuery.fn.jquery.split('.').join("")) < 142) {
		loadJS(jqueryLink, function(status){
			if (document.readyState) {
				document.onreadystatechange = function() {
					if(this.readyState=='interactive' || this.readyState == 'complete' || this.readyState == 'loaded') initialize();
				};
			} else document.onload = initialize;
			backupCall();
		});
	}
	else{
		if (document.readyState) {
			document.onreadystatechange = function() {
				if(this.readyState=='interactive' || this.readyState == 'complete' || this.readyState == 'loaded') initialize();
			};
		} else document.onload = initialize;
		backupCall();
	}
})();
