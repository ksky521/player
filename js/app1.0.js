/**
 * @author theowang
 * $Id: app1.0.js 320 2012-07-06 15:24:09Z ksky521@gmail.com $
 */
var playList = [
{
    title:'17岁 - 刘德华',
	author:'刘德华',
    lrc:'../audio/17.lrc',
    src:'../audio/17.ogg',
	src2:'http://storage2.fcdn.kugou.com/M00/31/58/Otfxxk55J3uKgZVYAA9l63SlV8Y351.m4a'
},
{
    title:'断桥残雪',
	author:'许嵩',
    lrc:'../audio/dqcx.lrc',
    src:'../audio/dqcx.ogg',
	src2:'http://storage2.fcdn.kugou.com/M01/10/EA/Otfxxk5tB_eP76KgAA6J8Wc6pxo531.m4a'
},
{
    title:'套马杆 - 草原风',
    author:'乌兰图雅',
	lrc:'../audio/tmg.lrc',
    src:'../audio/tmg.ogg',
	src2:'http://storage3.fcdn.kugou.com/M00/07/FC/OtfxzE5u6UPM0qIkABHL7mur00s613.m4a'
},
{
    title:'最炫民族风',
	author:'凤凰传奇',
    lrc:'../audio/zxmzf.lrc',
    src:'../audio/zxmzf.ogg',
	src2:'http://storage2.fcdn.kugou.com/M01/17/98/Otfxxk5upsKRCNSxABIQZjHTdGY083.m4a'
},
{
    title:'17岁 - 刘德华',
    author:'刘德华',
    lrc:'../audio/17.lrc',
    src:'../audio/17.ogg',
    src2:'http://storage2.fcdn.kugou.com/M00/31/58/Otfxxk55J3uKgZVYAA9l63SlV8Y351.m4a'
},
{
    title:'断桥残雪',
    author:'许嵩',
    lrc:'../audio/dqcx.lrc',
    src:'../audio/dqcx.ogg',
    src2:'http://storage2.fcdn.kugou.com/M01/10/EA/Otfxxk5tB_eP76KgAA6J8Wc6pxo531.m4a'
},
{
    title:'套马杆 - 草原风',
    author:'乌兰图雅',
    lrc:'../audio/tmg.lrc',
    src:'../audio/tmg.ogg',
    src2:'http://storage3.fcdn.kugou.com/M00/07/FC/OtfxzE5u6UPM0qIkABHL7mur00s613.m4a'
},
{
    title:'最炫民族风',
    author:'凤凰传奇',
    lrc:'../audio/zxmzf.lrc',
    src:'../audio/zxmzf.ogg',
    src2:'http://storage2.fcdn.kugou.com/M01/17/98/Otfxxk5upsKRCNSxABIQZjHTdGY083.m4a'
},
{
    title:'17岁 - 刘德华',
    author:'刘德华',
    lrc:'../audio/17.lrc',
    src:'../audio/17.ogg',
    src2:'http://storage2.fcdn.kugou.com/M00/31/58/Otfxxk55J3uKgZVYAA9l63SlV8Y351.m4a'
},
{
    title:'断桥残雪',
    author:'许嵩',
    lrc:'../audio/dqcx.lrc',
    src:'../audio/dqcx.ogg',
    src2:'http://storage2.fcdn.kugou.com/M01/10/EA/Otfxxk5tB_eP76KgAA6J8Wc6pxo531.m4a'
},
{
    title:'套马杆 - 草原风',
    author:'乌兰图雅',
    lrc:'../audio/tmg.lrc',
    src:'../audio/tmg.ogg',
    src2:'http://storage3.fcdn.kugou.com/M00/07/FC/OtfxzE5u6UPM0qIkABHL7mur00s613.m4a'
},
{
    title:'最炫民族风',
    author:'凤凰传奇',
    lrc:'../audio/zxmzf.lrc',
    src:'../audio/zxmzf.ogg',
    src2:'http://storage2.fcdn.kugou.com/M01/17/98/Otfxxk5upsKRCNSxABIQZjHTdGY083.m4a'
}
];
;!function(){
	var UA = navigator.userAgent.toLowerCase();
	
	var isFirefox = /firefox/.test(UA),
	    isChrome = /chrome/.test(UA),
	    isApp = typeof uexAudio==='Object' && typeof uexAudio.open ==='function',
		isPad=/ipad/.test(UA),
	    isIphone = /iphone/.test(UA);
	
	
	var emptyFn = function(){},
	   touchSensitivity = 15,
	   touchDX = 0,//touch事件x数据
       touchDY = 0,//touch事件y数据
       touchStartX = 0,
	   touchStartY = 0,
	   
       touchSDX = 0,//touch song事件x数据
       touchSDY = 0,//touch song事件y数据
       touchStartSX = 0,
	   touchStartSY = 0,
	   curTime = 0,//当前播放毫秒数，主要用于app
       playerTimer,//计数器
	   audioTotalTime =1,//总长度
	   curIndex = 0,//当前playList的索引
	   lrcData,//当前lrcData
	   origTop = 100,//歌词滚动默认的位置
	   lrcSetp = 0,//歌词索引
	   defaultVol = 0.80,//默认音量大小
	   stepHeight = 20,//歌词滚动默认step高度
	   $lists = $('lists'),//歌词和歌曲列表容器
	   $lrcContent = $('lrcContent'),//歌词列表容器
	   $audio = $('playerAudio'),//player audio对象
	   $play = $('play'),//【按钮】播放暂停
	   $playImg = getBtnImg($play),
	   $vol = $('vol'),//【按钮】音量静音
	   $volImg = getBtnImg($vol),
	   $progress = $('progress'),//进度条
	   $lrc = $('lrc'),//【按钮】歌词歌曲切换
	   $lrcImg = getBtnImg($lrc),
	   $repeat = $('repeat'),//【按钮】循环
	   $repeatImg = getBtnImg($repeat),
	   $curTime = $('curTime'),//当前时间node
	   $allTime = $('allTime'),//总时间node
	   $next = $('next'),//【按钮】下一首
	   $song = $('songs');
	var songListHeight = 0;
	var player = {
		play: function(){
			$audio.play();
			playerTimer && clearInterval(playerTimer);
			playerTimer = setInterval(updateProgress, 500);
			
			$playImg.className = 'pause';
			setCurSong(curIndex);
		},
		pause: function() {
			playerTimer && clearInterval(playerTimer);
			$audio && $audio.pause();
			$playImg.className = 'play';
		},
		mute: function() {
			$volImg.className = 'vol';
			if(isApp){
				$audio.volumeDown();
			}else{
				$audio.volume = 0;
			}
		},
		vol: function() {
			$volImg.className = 'mute';
			if(isApp){
                $audio.volumeUp();
            }else{
                $audio.volume = defaultVol;
            }
		},
		repeatOn: function() {
			$repeatImg.className = 'One';
		},
		repeatOne: function() {
			$repeatImg.className = 'Off';
		},
		repeatOff: function() {
			$repeatImg.className = 'On';
		},
		next: function(){
			stopCurSong();
			$playImg.className = 'pause';
			
			++curIndex >= playList.length && (curIndex = 0);
			play(curIndex);
		},
		lrcOn: function() {
			$lrcImg.className = 'Off';
			
			$lists.style.marginLeft = '0';
		},
		lrcOff: function() {
			$lrcImg.className = 'On';
			$lists.style.marginLeft = '-292px';
			var source = playList[curIndex];
			loadLrc(source.lrc);
		}
	};
	/**
	 * 播放
	 * @param {Number} i 播放第几曲（i为li索引）
	 */
	function play(i){
	   
		i = (i || curIndex) | 0;
		var source = playList[i];
		loadSong(i);
		curIndex = i;
		if (isApp) {
			if ($volImg.className === 'vol') {
				//静音
				$audio.volume = 0;
			}else {
				$audio.volume = defaultVol;
			}
		}
		
		$audio.play();
		
		if (isShowLrc()) {
			loadLrc(source.lrc);
		}
		curTime = 0;
		playerTimer && clearInterval(playerTimer);
	    playerTimer = setInterval(updateProgress, 500);
		
		setCurSong(i);
	}
	/**
	 * 设置当前song
	 * @param {Object} i
	 */
	function setCurSong(i){
		var $lists = toArray($$('li.cur', $song));
		
		if($lists.length>0 && $lists[0].dataset.index ===i){
			return;
		}
		$lists.forEach(function(a){
            a.classList.remove('cur');
        });
        
        $$('li', $song)[i].classList.add('cur');
        if (songListHeight > 240) {
            /*
             * 1、计算出来是否在可视区域
             * 2、如果不在，那么需要按照下面的规则设置marginTop：
             * a、计算应该出现的marginTop值
             * b、如果大于0，那么等于0
             * c、如果小于（总高度-240），那么等于（总高度-240）
             */
            var margintop = -i*40,curMarginTop = parseInt($song.style.marginTop);
            isNaN(curMarginTop) && (curMarginTop = 0);
            
            if (curMarginTop - 240 < margintop && margintop < curMarginTop) {
            //在可视范围内
            }else{
                var t = songListHeight-240;
                if(margintop<t && curMarginTop!=t){
                    $song.style.marginTop = margintop+'px';
                }
            }
        }
	}
	/**
	 * 生成listhtml
	 */
    function initList(){
        var html = '',s;
        for(var len=playList.length,i=0;i<len;i++){
            s = playList[i];
            html += '<li data-src="'+s.src+'" data-title="'+s.title+'" data-lrc="'+s.lrc+'" data-index="'+i+'"><h3>'+s.title+'</h3><p>'+s.author+'</p></li>';
        }
		songListHeight = len*40; 
        $song.innerHTML = html;
    }
	/**
	 * 更新播放进度
	 */
	function updateProgress(){
        if(!$audio){
			return;
		}
		curTime += 500;
		if(isApp){
			curTime += 500;
		}else{
			curTime = $audio.currentTime*1e3|0;
			curTime += 100;//加快.1秒，为了快速响应
		}
//        var curTime = $audio.currentTime*1e3|0;
		  setProgress(curTime);
		if (!isShowLrc()) {
			return;
		}
		var words = lrcData.words, 
          times = lrcData.times,
          len = times.length, i = lrcSetp;
          
        for(;i<len;i++){
            var t = times[i]; 
//              console.log(i);
            if (curTime > t && curTime < times[i + 1]) {
                lrcSetp = i;
                var $cur = $$('p[data-lrctime="'+t+'"]',$lrcContent)[0];

				if ($cur && $cur.nodeType === 1) {
					var top = $cur.dataset.lrctop;
					$lrcContent.style.marginTop = top+'px';

                    toArray($$('p.cur',$lrcContent)).forEach(function(i){
						i.classList.remove('cur');
					});
					$cur.classList.add('cur');
					if(isChrome || isFirefox){
						//同步到title
						document.title = $cur.innerHTML;
					}
				}
                break;
            }
        }
        
    }
	//判断是否显示歌词同步
	function isShowLrc(){
		return $lrcImg.classList.contains('On');
	}
	//交互用到的Event处理
    var IaEvents = {
        play: function(e) {
            IaEvents.normal($playImg);
        },
        vol: function(e) {
            IaEvents.normal($volImg);
        },
        repeat: function(e) {
            IaEvents.normal($repeatImg, 'repeat');
        },
        lrc: function(e) {
            IaEvents.normal($lrcImg, 'lrc');
        },
        normal: function($node, context) {
            var action = (context || '') + $node.className;
            typeof player[action] === 'function' && player[action]();
        }
    }; 
	/**
	 * 点击切换歌曲
	 */
	function changeSong(e){
		var target = e.target.parentNode;
		
		if (target === $song) {
			target = e.target;
		}
		if (target.dataset.src) {
			
			stopCurSong();
			$playImg.className = 'pause';
			curIndex = target.dataset.index;
			play(curIndex);
		}
	}
	/**
	 * 停止目前播放的音乐，并且重置到起点
	 */
	function stopCurSong(){
		if($audio){
			$audio.pause();
			if (isApp) {
				curTime = 0;
			} else {
				$audio.currentTime = 0;
			}
//	        $audio.currentTime = 0;
	        playerTimer && clearInterval(playerTimer);
		}
	}
	/**
	 * 绑定事件
	 */
	function bindEvent() {
		addEvent($play, 'click', IaEvents.play);
		addEvent($lrc, 'click', IaEvents.lrc);
		addEvent($vol, 'click', IaEvents.vol);
		addEvent($repeat, 'click', IaEvents.repeat);
		addEvent($next, 'click', player.next);
		
		addEvent($song, 'click', changeSong,true);
		if (isIphone || isPad) {
			//歌词部分touchstart，滚屏
			addEvent($song, 'touchstart', songEvtTouchStart);
			//整个list部分touchstart，切换歌词和歌曲列表
			addEvent($lists, 'touchstart', listEvtTouchStart);
		} else {
			addEvent($song, isFirefox ? 'DOMMouseScroll' : 'mousewheel', songEvtScroll);
		}
		
	}
	/**
	 * 初始化
	 */
	function init() {
		bindEvent();
		initList();
		loadSong(0);
		player.lrcOn();
		
	}
	
	/**
	 * 加载播放的音乐
	 */
    function loadSong(i) {
		i = (i||curIndex)|0;
		var htmlstr = '',source = playList[i];
		
		htmlstr += '<audio id="playerAudio" preload="auto" >'+
                      '<source src="' + source.src + '"></source>'+
                      (source.src2?'<source src="' + source.src2 + '"></source>':'')+
                  '</audio>';
		
		$('playerContainer').innerHTML = htmlstr;
		
		$audio = $('playerAudio');
		audioTotalTime = $audio.duration;
//		$audio.play();
		bindAudioEvent($audio);
		if(isApp){
			$audio = uexAudio.open(source.url);
		}
	}
	/**
	 * 一首歌曲播放结束处理
	 */
    function end() {
		stopCurSong();
		var t = getNextSongIndex(curIndex);
//		console.log(curIndex);
        if(typeof t === 'boolean' && !t){
			setProgress(0);
			$playImg.className = 'play';
			return ;
		}
		play(t);
	}
	
    /**
     * 获取下一首歌曲索引
     * @param {Object} i
     */
    function getNextSongIndex(i){
        i = i || 0;
        switch ($repeatImg.className) {
            case 'One':
			//一首歌循环
                break;
            case 'On':
			//表单循环
                ++i >= playList.length && (i = 0);
                break;
            default:
			 
                i= false;
				
        }
        return i;
    }
	
	/**
	 * 设置进度
	 * @param {Object} time
	 */
    function setProgress(time) {
		if (audioTotalTime <= 0) {
			audioTotalTime = 1;
		}
		var progess = time / audioTotalTime * 0.1;
		
		$progress.style.width = progess + '%';
		$allTime.innerHTML = getFormatTime(audioTotalTime);
		$curTime.innerHTML = getFormatTime(time / 1e3);
	}
	/**
	 * 绑定audio对象事件
	 * @param {Object} $audio
	 */
    function bindAudioEvent(audio){
			
		if (audio.onended !== "undefined") {
			audio.onended = end;
		}
		addEvent(audio, 'ended', end);
		addEvent(audio,'canplay',function(){
            audioTotalTime = this.duration;
        });
    }
	/**
	 * 加载歌词
	 * @param {Object} url
	 */
    function loadLrc(url){
		if (localStorage[url] && localStorage[url] !== '') {
			setLrc(localStorage[url]);
		}
		else {
			get(url, function(lrc){
				localStorage[url] = lrc;
				setLrc(lrc);
			});
		}
		
		
	}
	/**
     * 获取按钮的img
     * @param {Object} $node
     */
    function getBtnImg($node){
        return $$('img',$node)[0];
    }
	/**
	 * 设置歌词
	 * @param {Object} lrc
	 */
	function setLrc(lrc){
        lrcData = parseLrc(lrc);
        var words = lrcData.words, times = lrcData.times, data = lrcData.data;
        var len = times.length,i = 0,str='',top = origTop;
        for(;i<len;i++){
            var t = times[i],w = words[t];
            str += '<p data-lrctime="'+t+'" data-lrctop="'+top+'">'+w+'</p>';
            top-=stepHeight;
        }
//        data = [data.ti,data.ar,data.al].filter(function(a){return a!==''});
//        $title.html(data.join(' - '));
        lrcSetp = 0;
		$lrcContent.innerHTML = str;
		$lrcContent.style.marginTop = origTop +'px';
		$$('p',$lrcContent)[0].classList.add('cur');
    }
	/**
	 * 分钟格式转换，传入的是秒数
	 * @param {Object} time
	 */
	function getFormatTime(time){
		var min = '00' + (time / 60 | 0), sec = time % 60;
		sec = '00' + (sec | 0);
		return [min.substr(-2), sec.substr(-2)].join(':');
	}
	/**
	 * 解析lrc
	 * @param {Object} lrc
	 */
    function parseLrc(lrc) {
        var arr = lrc.split(/[\r\n]/), 
          len = arr.length, 
          words = {}, 
          times = [], i = 0;
        var musicData = {ti:'',ar:'',al:''};
        for (; i < len;) {
            var temp,doit = true,
                str = decodeURIComponent(arr[i]), 
                word = str.replace(/\[\d*:\d*((\.|\:)\d*)*\]/g, '');
            
            'ti ar al'.replace(/\S+/g,function(a){
				if (doit && musicData[a] === '') {
					temp = str.match(new RegExp('\\[' + a + '\\:(.*?)\\]'));
					if (temp && temp[1]) {
						doit = false;
						musicData[a] = temp[1];
					}
				}
			});
            
            if(word.length===0){
                word = '…… ……';
            }
            str.replace(/\[(\d*):(\d*)([\.|\:]\d*)*\]/g, function() {
                var min = arguments[1] | 0, 
                    sec = arguments[2] | 0, 
                    time = min * 60 + sec,
                    p = times.push(time * 1e3);
                words[times[--p]] = word.trim();
            });
            i++;
        }
        times.sort(function(a, b) {
            return a - b;
        });
        return {
            words: words,
            times: times,
            data:musicData
        };
    }
	
	//泛数组转换为数组
    function toArray(arrayLike) {
		return [].slice.call(arrayLike);
	}
    //封装选择器
    function $$(selector, context) {
		context = (context && context.nodeType === 1) ? context : document;
		return context.querySelectorAll(selector);
	}
    //getID方法
    function $(id) {
		return document.getElementById(id);
	}
    //addEvent
    function addEvent(node, type, fn, w) {
		node.addEventListener(type, fn, w || false);
	}
    //removeEvent
    function removeEvent(node, type, fn, w) {
		node.removeEventListener(type, fn, w || false);
	}
    //stopEvent
    function stopEvent(e) {
		e && e.stopPropagation();
	}
	//阻止默认事件
	function stopDefaultEvt(e) {
        e && e.preventDefault();
		return false;
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
        ajax('get', url, args, callback, error)
    }
    //ajax post
    function post(url, params, callback, error) {
        error = error || emptyFn;
        ajax('post', url, params, callback, error);
    }
    //ajax
    function ajax(method, url, args, callback, error, docType, async) {
        var params = args;
        async = async == null ? true: async;
        if (args) {
            if (typeof args === 'object') {
                var str = '';
                for (var i in args) {
                    str += i + "=" + encodeURI(encodeURI(args[i])) + '&'
                }
                params = str.substr(0, str.length - 1)
            }
        }
        method = method ? method.toUpperCase() : 'POST';
        docType = docType ? docType: 'text';
        var XMLHttp = getXHR();
        docType = docType || 'json';
        
        XMLHttp.onreadystatechange = function() {
            if (XMLHttp.readyState == 4) {
                if (XMLHttp.status == 200 || XMLHttp.status == 0) {
                    var param = null;
                    switch (docType) {
                    case 'xml':
                        param = XMLHttp.responseXML;
                        break;
                    case 'json':
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
        if (method == 'GET') {
            params!=='' && (url += (~url.indexOf('?')? '&':'?')+ params);
            XMLHttp.open(method, url, async);
            XMLHttp.send(null)
        } else {
            XMLHttp.open(method, url, async);
            XMLHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            XMLHttp.send(params)
        }
        return XMLHttp;
    };
	/**
	 * 在歌曲列表容器滚动事件
	 * @param {Object} e
	 */
	function songEvtScroll(e){
		stopEvent(e);
		stopDefaultEvt(e);
		var scrollVal = (e.wheelDelta || (isFirefox && (e.detail * ( - 40)))) / 3;
		
		setSongListScrollTo(scrollVal);
	}
	
	
	/**
	 * 设置songlist容器滚动的值
	 * @param {Object} val
	 */
    function setSongListScrollTo(val) {
        var dy = Math.abs(val);
        var top = parseInt($song.style.marginTop);
        top = isNaN(top) ? 0 : top;
        var h = songListHeight;
        
        if (val > 0) {
            top += val;
            if (top > 0) {
                top = 0;
            }
        } else {
            var t = h - 240;
            if ((dy > t) || (Math.abs(top + val) > t)) {
                top = -t;
            } else {
                top += val;
            }
        }
        $song.style.marginTop = top + 'px';
    }
	/******************************** Touch events *********************/
    function listEvtTouchStart(e){
        if (e.touches.length === 1) {
            touchDX = 0;
            touchDY = 0;
            var t = e.touches[0];
            touchStartX = t.pageX;
            touchStartY = t.pageY;
            //捕获，尽早发现事件
			addEvent($lists,'touchmove',listEvtTouchMove,false);
			addEvent($lists,'touchend',listEvtTouchEnd,false);
        }
    }
	//touch事件
    function listEvtTouchMove(e){
		if (e.touches.length > 1) {
			unbindListTouchEvent();
		}
		else {
			var t = e.touches[0];
			touchDX = t.pageX - touchStartX;
			touchDY = t.pageY - touchStartY;
			stopDefaultEvt(e);
		}
		
	}
	//touchend事件
    function listEvtTouchEnd(e){
        var dx = Math.abs(touchDX);
        var dy = Math.abs(touchDY);
	   
        if ((dx > touchSensitivity) && (dy < (dx * 2 / 3))) {
            if (touchDX > 0) {
                if(parseInt($lists.style.marginLeft) !== 0){
                    player.lrcOn();
                }
            }
            else {
                if($lists.style.marginLeft !== '-292px'){
                    player.lrcOff();
                }
            }
			stopEvent(e);
        }
        
        unbindListTouchEvent();
    }
    //取消绑定
    function unbindListTouchEvent() {
        removeEvent($lists, 'touchmove', listEvtTouchMove, false);
        removeEvent($lists, 'touchend', listEvtTouchEnd, false);
    }
	
	function songEvtTouchStart(e) {
		var h = songListHeight;
		
		if ((h > 240) && (e.touches.length === 1)) {
			touchSDX = 0;
			touchSDY = 0;
			var t = e.touches[0];
			touchStartSX = t.pageX;
			touchStartSY = t.pageY;

			//捕获，尽早发现事件
			addEvent($song, 'touchmove', songEvtTouchMove, true);
			addEvent($song, 'touchend', songEvtTouchEnd, true);
		}
		
	}
	//touch事件
    function songEvtTouchMove(e){
        if (e.touches.length > 1) {
            unbindSongTouchEvent();
        }
        else {
			var t = e.touches[0];
            touchSDX = t.pageX - touchStartSX;
            touchSDY = t.pageY - touchStartSY;
			stopDefaultEvt(e);
        }
		
    }
    
    //touchend事件
    function songEvtTouchEnd(e){
        var dx = Math.abs(touchSDX);
        var dy = Math.abs(touchSDY);
        
        if ((dy > touchSensitivity) && (dx < (dy * 2 / 3))) {
			setSongListScrollTo(touchSDY);
			stopEvent(e);
		}
        unbindSongTouchEvent();
    }
	
    //取消绑定
    function unbindSongTouchEvent() {
		removeEvent($song, 'touchmove', songEvtTouchMove, true);
		removeEvent($song, 'touchend', songEvtTouchEnd, true);
	}
	
	init();
}();
