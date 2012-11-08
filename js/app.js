/**
 * @author theowang
 */
;!function($win,$doc){
	var rootURL = 'http://m.kugou.com/';
	var emptyFn = function(){};
	//http://mobilecdn.kugou.com/new/app/i/search.php?cmd=300&keyword=%E5%88%98%E5%BE%B7%E5%8D%8E&page=1&pagesize=20&outputtype=jsonp&callback=returnSearchData
	function bindEvent(){
		addEvent($('searchForm'),'submit',searchEvent);
		addEvent($('songs'),'click',function(e){
			var target = e.target;
			getSongInfo(target.dataset.hash,function(j){
				console.log(j);
			});
		});
	}
	///////======events==========================/
	function searchEvent(e) {
		var keyword = $('q').value.trim();
		search(keyword);
	   return false;
	}
	
	/////=========events==========================/
	function search(q, page, callback, pageSize) {
		var args = {
			cmd: 300,
			keyword: encodeURIComponent(q),
			page: page || 1,
			pageSize: pageSize || 20,
			outputtype:'jsonp',
			callback: callback || 'searchBack'
		};
		loadJS('http://mobilecdn.kugou.com/new/app/i/search.php', args);
	}
	function searchBack(json){
		if(json.status){
			var data = json.data;
			var str = [];
			for(var i=0,len=data.length;i<len;i++){
				str.push('<li data-extname="'+data[i].extname+'" data-bitrate="'+data[i].bitrate+'" data-time="'+data[i].timelength+'" data-filename="'+data[i].filename+'" data-hash="'+data[i].hash+'" >'+data[i].filename+'</li>');
			}
			str = str.join('');
			$('songs').innerHTML = str;
		}else{
			//出错
		}
	}
	function init(){
		bindEvent();
	}
	
	
	$win.searchBack = searchBack;
	/**
	 * 通过hash获取歌曲信息
	 * @param {Object} hash
	 * @param {Object} callback
	 */
	function getSongInfo(hash,callback){
		callback = callback || emptyFn;
		var url = rootURL+'/app/i/getSongInfo.php?cmd=playInfo&hash='+hash;
		get(url,callback);
	}
	/**
	 * 获取歌词
	 * @param {Object} keyword
	 * @param {Object} timelength
	 * @param {Object} callback
	 */
	function getLRC(keyword, timelength, callback) {
	
		keyword = encodeURIComponent(keyword);
		timelength = timelength * 1000;
		get(rootURL + '/app/i/krc.php', {
			"cmd": 100,
			"keyword": keyword,
			"timelength": timelength,
			"d": +new Date
		}, callback);
	}
	/**
	 * 加载js
	 * @param {Object} url
	 * @param {Object} args
	 * @param {Object} callback
	 */
	function loadJS(url, args, callback) {
        var params = args || "";
        if (args && (typeof args === "object")) {
            var str = "";
            for (var i in args) {
                str += i + "=" + args[i] + "&"
            }
            params = str.substr(0, str.length - 1)
        };
        var script = document.createElement("script");
        script.type = 'text/javascript';
        script.src = url+(~url.indexOf('?')? '&':'?')+ params;
        script.onload = script.onreadystatechange = function() {
            if (!this.readyState || (this.readyState == "complete" || this.readyState == "loaded")) {
                callback && callback();
                script.onreadystatechange = script.onload = null;
                script = null
            }
        };
        $doc.getElementsByTagName("head")[0].appendChild(script);
    }
	//泛数组转换为数组
    function toArray(arrayLike){
        return [].slice.call(arrayLike);
    }
    //封装选择器
    function $$(selector,context){
        context = (context && context.nodeType === 1) ? context : $doc;
        return context.querySelectorAll(selector);
    }
    //getID方法
    function $(id){
        return $doc.getElementById(id);
    }
	//addEvent
	function addEvent(node, type, fn, w) {
		node.addEventListener(type, fn, w || false);
	}
	//removeEvent
	function removeEvent(node,type,fn){
		node.removeEventListener(type, fn);
	}
	//stopEvent
	function stopEvent(e){
		e && e.stopPropagation();
	}
	//getXHR
	function getXHR() {
		return new XMLHttpRequest();
	}
	//ajax get
	function get(url, args, callback, error) {
		if (typeof args === 'function') {
			callback = args;
			args = '';
		}
		error = error || emptyFn;
        ajax("get", url, args, callback, error)
    }
	//ajax post
    function post(url, params, callback, error) {
		error = error || emptyFn;
        ajax("post", url, params, callback, error);
    }
	//ajax
	function ajax(method, url, args, callback, error, docType, async) {
        var params = args;
        async = async == null ? true: async;
        if (args) {
            if (typeof args === "object") {
                var str = "";
                for (var i in args) {
                    str += i + "=" + encodeURI(encodeURI(args[i])) + "&"
                }
                params = str.substr(0, str.length - 1)
            }
        }
        method = method ? method.toUpperCase() : "POST";
        docType = docType ? docType: "text";
        var XMLHttp = getXHR();
        docType = docType || 'json';
		
        XMLHttp.onreadystatechange = function() {
            if (XMLHttp.readyState == 4) {
                if (XMLHttp.status == 200 || XMLHttp.status == 0) {
                    var param = null;
                    switch (docType) {
                    case "xml":
                        param = XMLHttp.responseXML;
                        break;
                    case "json":
                        param = JSON.parse(XMLHttp.responseText);
                        break;
                    default:
                        param = XMLHttp.responseText
                    }
                    callback && callback(param);
                    XMLHttp = null
                } else {
                    error && error()
                }
            }
        };
        if (method == "GET") {
			url += (~url.indexOf('?')? '&':'?')+ params;
            XMLHttp.open(method, url, async);
            XMLHttp.send(null)
        } else {
            XMLHttp.open(method, url, async);
            XMLHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            XMLHttp.send(params)
        }
		
        return XMLHttp;
    }
	
	
	
	init();
}(window,document);
