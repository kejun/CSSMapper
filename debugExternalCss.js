(function(){
	var css = [], 
	    i = 0, l, url, js, root,
	    evt, dom, util, loader,
	    pos = [1, 0],
	    popup,links,
	    txtUpdate = 'update!',
	    txtMin = '&lt;',
	    txtMax = '&gt;',
	    txtReplace = '替换为：',
	    txtHd = '外部CSS文件映射：',
	    cssUpdate = 'debugcss-update',
	    cssMin = 'debugcss-min',
	    cssMax = 'debugcss-max',
	    maxWidth = '400px',
	    maxHeight = 'auto',
	    minWidth = '30px',
	    minHeight = '2px',
	    domRoot = 'debugcss-overlay',
	    domHd = 'debugcss-hd',
	    domBd = 'debugcss-bd',
	    contCss = 'position:absolute;position:fixed;*position:absolute;width:' + maxWidth + ';top:1px;left:1px;padding:10px;background:#fff;border:2px solid #96CFB6;-moz-box-shadow:5px 5px 10px #999;-webkit-box-shadow:5px 5px 10px #999;text-align:left;font:12px/1.5 arial,sans-serif;',
	    bnCss = 'border:1px solid #96CFB6;padding:2px 10px;font-size:12px;line-height:1;',
	    htmltmpl = '<div id="' + domRoot + '" style="' + contCss + '"><a href="#min" style="' + bnCss + 'position:absolute;right:2px;top:2px;" class="' + cssMin + '">' + txtMin + '</a><div id="' + domHd + '" style="cursor:move;">' + txtHd + '</div><div id="' + domBd + '"  >{$BODY}</div></div>',
	    htmlstr = [],
	    libBase = 'http://ajax.googleapis.com/ajax/libs/yui/2.8.0r4/build/',
	    coreLib = libBase + 'yuiloader-dom-event/yuiloader-dom-event.js',
	    
	    // update css file.
	    updateCSS = function (newUrl, index) {
		   if (!css || newUrl === ''){
			return;
		   }
		   css[index].setAttribute('href', newUrl.indexOf('?') > 0 ? newUrl + '&rnd=' + Math.random() : newUrl + '?rnd=' + Math.random());
	    };
	
	// check js file has loaded.
	if (document.getElementById(domRoot)){
		return;
	}
	
	// load core lib.
	YAHOO_config = {
		listener: function(info){
			var u = info.mainClass.util;
			if (u && u.Dom && u.Event && u.Get){
			  util = YAHOO.util;
			  evt = util.Event;
			  dom = util.Dom;
			  links = document.getElementsByTagName('link');
			  init();
		    }
		}
	};
	
	js = document.createElement('script');
	js.setAttribute('type', 'text/javascript');
	js.setAttribute('src', coreLib);
	document.getElementsByTagName('head')[0].appendChild(js);
	
	
	function init () {
	// collection links.
	for (; l = links[i++];) {
		if (l.getAttribute('rel') === 'stylesheet') {
			css.push(l);
		}
	}
	
	// init popup.
	if (!css[0]) {
		return;
	}
	
	for (i=0; l = css[i++];){
		url = l.getAttribute('href');
		htmlstr.push('<li><a href="' + url + '" target="_blank">' + url + '</a> ' + txtReplace + ' <input type="text" size="50" value="" style="width:80%;"><a href="#' + (i - 1) + '" style="' + bnCss + '" class="' + cssUpdate + '">' + txtUpdate + '</a></li>');
	}
	
	// create popup.
	popup = document.createElement('div');
	popup.innerHTML = htmltmpl.replace('{$BODY}', '<ul>' + htmlstr.join('') + '</ul>');
	document.body.appendChild(popup);
	
	root = dom.get(domRoot);
	
	dom.setXY(root, [1, dom.getDocumentScrollTop()]);
	
	// bind event.
	evt.on(root, 'click', function (e) {
		var el = evt.getTarget(e), action = {}, cn = el.className;
		
		action[cssUpdate] = function(el) {
           updateCSS(el.parentNode.getElementsByTagName('input')[0].value.replace(/^\s+|\s+$/g, ''), 0|el.getAttribute('href').split('#')[1]);
		};
		
		action[cssMin] = function(el) {
           el.className = cssMax;
           el.innerHTML = txtMax;
           dom.setStyle(dom.get(domHd), 'visibility', 'hidden');
           dom.setStyle(dom.get(domBd), 'visibility', 'hidden');
           dom.setStyle(root, 'width', minWidth);
           dom.setStyle(root, 'height', minHeight);
		};

		action[cssMax] = function(el) {
           el.className = cssMin;
           el.innerHTML = txtMin;
           dom.setStyle(dom.get(domHd), 'visibility', 'visible');
           dom.setStyle(dom.get(domBd), 'visibility', 'visible');
           dom.setStyle(root, 'width', maxWidth);
           dom.setStyle(root, 'height', maxHeight);
		};
				
		if (cn) {
			evt.stopEvent(e);
			action[cn] && action[cn](el);
            return;
		}
	});
	
	
	// move it.
	if (YAHOO.env.ua.ie){
	 evt.on(window, 'scroll', function(e){
		var timer;
	    
	    return (function(){
		  if(timer){
		    clearTimeout(timer);
		  }
		
		  timer = setTimeout(function(){
		    dom.setXY(root, [pos[0], dom.getDocumentScrollTop() + pos[1]]);
	      }, 5);
	    })();
	});
    }
	
	// add drag.
	loader = new util.YUILoader({
		base: libBase,
		require: ['dragdrop'],
		onSuccess: function(){
			var dd = new YAHOO.util.DDProxy(root, {useShim: true});
			dd.setHandleElId(domHd);
			dd.on('mouseUpEvent', function(e){
				pos = dom.getXY(this.getEl());
				pos = [pos[0], pos[1] - dom.getDocumentScrollTop()];
			}, dd, true);
		}
	});
	loader.insert();
	
	// hilight drag bar.
	evt.on(domHd, 'mouseover', function(e){ dom.setStyle(evt.getTarget(e), 'backgroundColor', '#EEF9EB'); });
	
	evt.on(domHd, 'mouseout', function(e){ dom.setStyle(evt.getTarget(e), 'backgroundColor', ''); });
   }
})();