/**
 * @author theowang
 * 界面仿得亦歌
 * 音乐都是我自己用goldwave转的ogg格式
 * 因为sae文件限制，所以没多传音乐
 * 一天完成的，肯定很多问题，要抱着包容的态度哦~
 * 我的新浪微博 @三水清 weibo.com/sanshuiqing
 * 我的博客：js8.in
 */
var playList = [
{
	title:'17岁 - 刘德华',
	lrc:'17.lrc',
	src:'17.ogg'
},
{
	title:'断桥残雪（许嵩）',
	lrc:'dqcx.lrc',
	src:'dqcx.ogg'
},
{
	title:'套马杆 - 草原风 - 乌兰图雅',
    lrc:'tmg.lrc',
    src:'tmg.ogg'
},
{
	title:'最炫民族风 - 凤凰传奇',
    lrc:'zxmzf.lrc',
    src:'zxmzf.ogg'
},
];
!function(){
	var $audio,
		firstIn = true,
		lrcSetp = 0, 
		repeatType = 'repeatList',//repeatList repeatOnce
		origTop = 111,
		showLrc = false,
		curIndex = 0,//当前播放的音乐在playList的索引
		stepHeight = 18,
		$progress = $('#progress'),
	    $timer = $('#timer'),
		$volCtrl = $('#volCtrl'),
		$lrc = $('#lrcContent'),
		$volBtn = $('#volicon'),
		$title = $('#title'),
		$volProgress = $('#volProgress'),
		lrcData,
		audioTotalTime,
		sliderTimer;
	
	//播放结束处理
    function ended(){
      curIndex = getNext(curIndex);
	  play(curIndex);
    }
	//获取下一首歌曲索引
	function getNext(i){
		i = i || 0;
		switch (repeatType) {
			case 'repeatOnce':
				break;
			case 'repeatList':
				++i >= playList.length && (i = 0);
				break;
			default:
				i = 0;
		}
		return i;
	}
	//加载结束后的事件绑定
	function afterLoadBind(){
		$('#playBtn > a').click(togglePlay);
        $('#nextBtn > a').click(next);
		
		$('#progressContent').slider({
            step:0.1,
            slide: function(event, ui) {
                setProgress($audio.duration * ui.value / 100);
                sliderTimer && setInterval(sliderTimer);
            },
            stop: function(event, ui) {
                lrcSetp = 0;
                $audio.currentTime = $audio.duration * ui.value / 100;
                sliderTimer = setInterval(updateProgress, 500);
            }
        });
        
        
        //音量控制
        $('#vol').slider({
            max: 1, min: 0, step: 0.01,
            slide: function(event, ui) {
                setVolume(ui.value);
            },
            stop: function(event, ui) {
                if(ui.value===0){
                    $volBtn.removeClass('icovol').addClass('iconmute');
                }else{
                    $volBtn.removeClass('iconmute').addClass('icovol');
                }
            }
        });
        
        $volBtn.click(function(){
            var $t = $(this);
            if($t.hasClass('icovol')){
                $volBtn.removeClass('icovol').addClass('iconmute');
                setVolume(0,1);
            }else{
                $volBtn.removeClass('iconmute').addClass('icovol');
                var volume = localStorage.volume || 0.5;
                setVolume(volume);
            }
        });
		
		$('#toggleListBtn').click(toggleLrcList);
		$('#resetListBtn').click(toggleLrcList);
//		$('#backMusic').click(toggleLrcList);
        if (!localStorage.tipReaded) {
			$('#close').click(function(){
				$('#listTips').remove();
				localStorage.tipReaded = 1;
			});
			setTimeout(function(){
				$('#listTips').fadeIn();
			}, 2E3);
		}
		
		
		//循环顺序
		$('#repeatBtn').toggle(function(){
			$(this).addClass('repeatOnce').removeClass('repeat');	
			repeatType = 'repeatOnce';	
		},function(){
			$(this).addClass('repeat').removeClass('repeatOnce');
			repeatType = 'repeatList';
		});
		//随机打散
		$('#randomBtn').click(function(){
			var lis = $('#musicList > li'), 
			randNum = rand(1,lis.size()-1);
			Array.prototype.slice.call(lis);
//			console.log(randNum);
			randNum = lis.splice(randNum,1,lis[0]);
			lis.splice(0,1,randNum[0]);
			var len = lis.length,html = '';
			var $p = $('#musicList').empty();//这里需要优化……
			playList.length = 0;
			var i = 0;
			while(len--){
				
				var li = lis[len],data = li.dataset;
				li.dataset.index = i;
				$p.append($(li));
				if(li.classList.contains('cur')){
					curIndex = i;
				}
				playList.push({title:data.title,src:data.src,lrc:data.lrc});
				i++;
			}
			
//			.html(html);
//			console.log(randNum);
//			$rand.insertBefore(first);
//			lis.eq(2).before(lis.eq(randNum));
		});
		
		$('#musicList > li').live('click',function(){
			$('#playBtn > a').removeClass('icoplay').addClass('icopause');
			play(this.dataset.index);
		});
	}
	
	//获取随机数
	function rand(m,n){
		return Math.random()*(n-m)+m|0;
	}
	function toggleLrcList(){
        var $t = $("#toggleListBtn");
        if($t.hasClass('icomusic')){
            $t.removeClass('icomusic').addClass('icolist');
            //这里是lrc面板
            $('#lists').animate({marginLeft:-290});
			showLrc = true;
        }else{
            $t.removeClass('icolist').addClass('icomusic');
            //这里是音乐面板
			showLrc = false;
            $('#lists').animate({marginLeft:0});
        }
	}
	//生成listhtml
	function initList(){
		var html = '',s;
		for(var len=playList.length,i=0;i<len;i++){
			s = playList[i];
			html += '<li data-src="'+s.src+'" data-title="'+s.title+'" data-lrc="'+s.lrc+'" data-index="'+i+'">'+s.title+'</li>';
		}
		$('#musicList').html(html).children().eq(0).addClass('cur');
		
	}
	//播放
	function play(i){
		var source = playList[i];
		loadMusic(source);
		
		if(localStorage[source.lrc] && localStorage[source.lrc]!==''){
			setLrc(localStorage[source.lrc]);
		} else{
			loadLrc(source.lrc);
		}
		$('#musicList li.cur').removeClass('cur');
		$('#musicList > li').eq(i).addClass('cur');
	}
	function playState(){
		$audio.pause();
		$audio.currentTime = 0;
		sliderTimer && clearInterval(sliderTimer);
        sliderTimer = setInterval(updateProgress, 500);
        lrcSetp = 0;
		$audio.play();
		
	}
	//加载播放的音乐
	function loadMusic(source){
		source = source || playList[0];
		
		var html = '<source src="'+source.src+'" />';
		var nAudio = $('<audio id="player" preload="preload"/>').html(html).appendTo($('#playerContainer').empty());
		bindAudioEvent(nAudio);
		$audio = nAudio[0];
		
		//不知道这里是否需要添加~~~~~~~~~~~~~~~~~
//		if($audio.readyState===2){
//			if($('#playBtn > a').hasClass('icopause')){
//				playState()
//            }
//		}
		
	}
	//音乐预加载
	function preload(){
		
	}
	//绑定audio对象事件
	function bindAudioEvent($audio){
		$audio.bind('canplay',function(){
            audioTotalTime = this.duration;
            setProgress(0);
            if(firstIn){
			    $('#playMain').fadeIn(1.2E3);
	            $('#loading').hide();
	            afterLoadBind();
	            firstIn = false;
			}
			if($('#playBtn > a').hasClass('icopause')){
				playState();
			}
			
        }).bind('ended', ended);
	}
	//inti
	function init(){
		initList();
		//localStorage = localStorage.lrcList || {};  
		loadMusic(playList[0]);
		var volume = localStorage.volume || 0.5;
		setVolume(volume);
		play(0);
		
	}
	//更新播放进度
    function updateProgress(){
//		console.log('updateing');
        var words = lrcData.words, 
		  times = lrcData.times,
		  len = times.length, i = lrcSetp,
          curTime = $audio.currentTime*1e3|0;
        for(;i<len;i++){
            var t = times[i]; 
//              console.log(i);
            if (curTime > t && curTime < times[i + 1]) {
                lrcSetp = i;
				var $cur = $lrc.find('[data-lrctime="'+t+'"]');
                var top = $cur.attr('data-lrctop');
				document.title = $cur.html();
				if(showLrc){
					$lrc.stop().animate({marginTop:top}).find('p.cur').removeClass('cur');
				}else{
					$lrc.css({marginTop:top}).find('p.cur').removeClass('cur');
				}
				
				$cur.addClass('cur')
                break;
            }
        }
		setProgress($audio.currentTime);
    }
	//设置歌词
	function setLrc(lrc){
		lrc = lrcData = parseLrc(lrc);
		var words = lrc.words, times = lrc.times, data = lrc.data;
		var len = times.length,i = 0,str='',top = origTop;
		for(;i<len;i++){
			var t = times[i],w = words[t];
            str += '<p data-lrctime="'+t+'" data-lrctop="'+top+'">'+w+'</p>';
			top-=stepHeight;
		}
		data = [data.ti,data.ar,data.al].filter(function(a){return a!==''});
		$title.html(data.join(' - '));
		lrcSetp = 0;
		$lrc.html(str).stop().animate({marginTop:origTop},1.4E3).children().eq(0).addClass('cur');;
	}
	function next(){
		//下一首
		$audio.pause();
		$audio.currentTime = 0;
		sliderTimer && clearInterval(sliderTimer);
		++curIndex>=playList.length && (curIndex = 0);
		$('#playBtn > a').removeClass('icoplay').addClass('icopause');
		play(curIndex);
		
	}
	//加载歌词
    function loadLrc(url){
		$.get(url, function(lrc){
			localStorage[url] = lrc;
			setLrc(lrc);
		});
	}
	
	function togglePlay(){
		//播放和暂停
	   var $t = $(this);
	   if($t.hasClass('icoplay')){
	   	   //用户开始播放
		   $t.removeClass('icoplay').addClass('icopause');
		   $audio.play();
		   sliderTimer && clearInterval(sliderTimer);
           sliderTimer = setInterval(updateProgress, 500);
	   }else{
	   	   //用户暂停播放
	       $t.removeClass('icopause').addClass('icoplay');
		   $audio.pause();
		   sliderTimer && clearInterval(sliderTimer);
	   }
	}
	//拖动设置进度
    function setProgress(time){
        var progess = time/$audio.duration * 100;
        
        $progress.css('width', progess + '%');
        $timer.html(getTotalTime(time)+'/'+getTotalTime(audioTotalTime));
    }
    //分钟格式转换，传入的是秒数
    function getTotalTime(time){
        var min = '00'+(time/60 |0),sec = time%60;
        sec = '00'+ (sec|0);
        return [min.substr(-2),sec.substr(-2)].join(':');
    }
	//设置音量
	function setVolume(value,save) {
        $audio.volume = value;
		!save && (localStorage.volume = value);
        $volProgress.css('width', value * 100 + '%');
        $volCtrl.css('left', value * 100 + '%');
    }
	//解析lrc
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
				
				if(doit && musicData[a]===''){
					temp = str.match(new RegExp('\\['+a+'\\:(.*?)\\]'));
					if(temp && temp[1]){
						doit = false;
						musicData[a] = temp[1]; 
					}
				}
			});
			
			if(word.length===0){
				word = "…… ……";
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
	
	init();
}();
