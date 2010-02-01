(function(){
	var d = document, 
	    css = [], 
	    i = 0, l, url,
	    popup,
	    txtUpdate = 'update!',
	    txtMin = '&lt;',
	    txtMax = '&gt;',
	    txtReplace = '替换为：',
	    cssUpdate = 'debugcss-update',
	    cssMin = 'debugcss-min',
	    cssMax = 'debugcss-max',
	    maxWidth = '400px',
	    maxHeight = 'auto',
	    minWidth = '30px',
	    minHeight = '10px',
	    domRoot = 'debugcss-overlay',
	    domHd = 'debugcss-hd',
	    domBd = 'debugcss-bd',
	    contCss = 'position:fixed;width:' + maxWidth + ';top:1px;left:1px;padding:10px;background:#fff;border:1px solid #ccc;-moz-box-shadow:10px 10px 10px #999;-webkit-box-shadow:5px 5px 10px #999;text-align:left;font:12px/1.5 arial,sans-serif;';
	    bnCss = 'border:1px solid #96CFB6;padding:2px 10px;font-size:12px;line-height:1;',
	    htmltmpl = '<div id="' + domRoot + '" style="' + contCss + '"><div id="' + domHd + '"><a href="#min" style="' + bnCss + 'position:absolute;right:2px;top:2px;" class="' + cssMin + '">' + txtMin + '</a></div><div id="' + domBd + '">{$BODY}</div></div>',
	    htmlstr = [],
	    links = d.getElementsByTagName('link'),
	
	    updateCSS = function (newUrl, index) {
		   if (!css || newUrl === ''){
			return;
		   }
		   css[index].setAttribute('href', newUrl.indexOf('?') > 0 ? newUrl + '&rnd=' + Math.random() : newUrl + '?rnd=' + Math.random());
	    },
	
	    getTarget = function (e) {
		  var ev = e || window.event;
		  return ev.target || ev.srcElement;
	    },
	
	    stopEvent = function (e) {
		  if (e.preventDefault && e.stopPropagation) {
			e.preventDefault();
			e.stopPropagation();
		  } else {
			e.cancelBubble = true;
			e.returnValue = false;
		  }
	    },
	
	    addListener = function (node, type, fn) {
		  if (node.addEventListener) {
			node.addEventListener(type, fn, false);
		  } else if (node.attachEvent) {
			node.attachEvent('on' + type, fn);
		  }
	    };
	
	if (document.getElementById(domRoot)){
		return;
	}
	
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
		htmlstr.push('<li><a href="' + url + '" target="_blank">' + url + '</a> ' + txtReplace + ' <input type="text" size="50"><a href="#' + (i - 1) + '" style="' + bnCss + '" class="' + cssUpdate + '">' + txtUpdate + '</a></li>');
	}
	
	// create popup.
	popup = document.createElement('div');
	popup.innerHTML = htmltmpl.replace('{$BODY}', '<ul>' + htmlstr.join('') + '</ul>');
	document.body.appendChild(popup.cloneNode(true));
	
	
	// bind event.
	addListener(document.getElementById(domRoot), 'click', function (e) {
		var el = getTarget(e), action = {}, cn = el.getAttribute('class');
		
		action[cssUpdate] = function(el) {
           updateCSS(el.parentNode.getElementsByTagName('input')[0].value.replace(/^\s+|\s+$/g, ''), 0|el.getAttribute('href').split('#')[1]);
		};
		
		action[cssMin] = function(el) {
           el.setAttribute('class', cssMax);
           el.innerHTML = txtMax;
           var bd = document.getElementById(domBd),
           root = document.getElementById(domRoot);
           bd.style.visibility = 'hidden';
           root.style.width = minWidth;
           root.style.height = minHeight;
		};

		action[cssMax] = function(el) {
           el.setAttribute('class', cssMin);
           el.innerHTML = txtMin;
           var bd = document.getElementById(domBd),
           root = document.getElementById(domRoot);
           bd.style.visibility = 'visible';
           root.style.width = maxWidth;
           root.style.height = maxHeight;
		};
				
		if (cn) {
			stopEvent(e);
			action[cn] && action[cn](el);
            return;
		}
	});
	
	
	// move it.
})();