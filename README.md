html5版 音乐播放器
======

html5版本音乐播放器，支持iOS设备

#### 功能说明
> * 支持iOS设备，但是iOS不支持自动下一曲，这是iOS本身限制，支持touch事件
> * 支持播放模式：循环，单曲循环
> * 支持歌词实时显示，包括显示到title
> * 支持静音，iOS不支持……

#### jQuery版本
withjQuery里面是jquery版本的播放器，之前只是想模仿下亦歌，于是就用jQ写了，后来大家反映可以搞个纯javascript的html5版本，于是出了最新的这个版本

#### 简单说下歌词显示算法
首先异步获取lrc内容（loadLrc），然后使用正则解析lrc（parseLrc），得到格式如下：

	{
		words:[],//歌词数组
		times:[],//时间数组
		data:{}//歌曲信息：作者、歌手、长度；有些lrc不会包括此部分，或者不全
	}
然后循环去除word（歌词）和time（歌词对应时间），生成html，其中会计算出来marginTop位置：

	<p data-lrctime="time" data-lrctop="top">word</p>

当歌曲播放时，实时获取当前播放时间audio.currentTime（为了提高歌词响应速度会提前100ms），然后遍历歌词nodelist，通过计算data-lrctime，取出当前播放进度对应的P元素，根据此P元素data-lrctop设置marginTop，通过css3实现动画。

## 版本库地址

支持三种访问协议：

* HTTP协议： `https://ksky521@github.com/ksky521/player.git` 。
* Git协议： `git://github.com/ksky521/player.git` 。
* SSH协议： `ssh://git@github.com:ksky521/player.git` 。

## 克隆版本库

操作示例：

    $ git clone git://github.com/ksky521/player.git
	
## 联系方式

作者博客：[js8.in](http://js8.in)

作者新浪微博：[@三水清](http://weibo.com/sanshuiqing)



## 特别鸣谢
感谢[@aricme](http://weibo.com/aricme)哥们周末帮我设计html5操作界面