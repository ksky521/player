String.prototype.getBytes = function() {
    var bytes = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 256) {
            bytes += 2
        } else {
            bytes += 1
        }
    }
    return bytes
};
String.prototype.intercept = function(length, appendStr) {
    var str = this;
    str = str.trim();
    if (str.getBytes() < length) return str;
    var countLen = 0;
    var charCount = 0;
    if (appendStr.length > 0) {
        length = length - appendStr.length
    }
    for (var i = 0; i < str.length; i++) {
        if (this.charCodeAt(i) > 256) {
            countLen += 2
        } else {
            countLen += 1
        }
        if (countLen > length) {
            break
        }
        charCount++
    }
    return str.substr(0, charCount) + appendStr
};
String.prototype.trim = function() {
    return this.replace(/^\s*|\s*$/g, "")
};
var Kg = Kg || {
    UA: {
        Android: /Android/gi.test(window.navigator.userAgent),
        Apple: /AppleWebKit/gi.test(window.navigator.userAgent)
    },
    $: function(selector) {
        return document.querySelector(selector)
    },
    $$: function(selector) {
        return document.querySelectorAll(selector)
    },
    $A: function(args) {
        var arr = [];
        for (var i = 0, l = args.length; i < l; i++) {
            arr.push(args[i])
        }
        return arr
    },
    indexOf: function(arr, compare) {
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] === compare) return i
        }
        return - 1
    },
    stopEvent: function(event) {
        event = window.event || event;
        if (event.stopPropagation) {
            event.stopPropagation()
        } else {
            event.cancelBubble = true
        };
        return this
    },
    getBodySize: function() {
        if (document.compatMode == "BackCompat") {
            var clientH = document.body.clientHeight;
            var clientW = document.body.clientWidth;
            var scrollH = document.body.scrollHeight;
            var scrollW = document.body.scrollWidth;
            var scrollT = document.body.scrollTop;
            var scrollL = document.body.scrollLeft
        } else if (document.compatMode == "CSS1Compat") {
            var clientH = document.documentElement.clientHeight;
            var clientW = document.documentElement.clientWidth;
            var scrollH = document.documentElement.scrollHeight;
            var scrollW = document.documentElement.scrollWidth;
            var scrollT = document.body.scrollTop || document.documentElement.scrollTop;
            var scrollL = document.body.scrollLeft || document.documentElement.scrollLeft
        }
        return {
            cH: clientH,
            cW: clientW,
            sH: scrollH,
            sW: scrollW,
            sT: scrollT,
            sL: scrollL
        }
    },
    getXY: function(el) {
        var bodySize = this.getBodySize();
        var elRect = el.getBoundingClientRect();
        return {
            left: bodySize.sL + elRect.left,
            right: bodySize.sL + elRect.right,
            top: bodySize.sT + elRect.top,
            bottom: bodySize.sT + elRect.bottom
        }
    },
    addEvent: function(obj, type, func) {
        obj = this.$(obj);
        if (obj.addEventListener) {
            obj.addEventListener(type, func, true)
        } else if (obj.attachEvent) {
            obj.attachEvent("on" + type, func)
        } else {
            obj["on" + type] = func
        }
    },
    Param: function() {
        var arr = [];
        var o = {};
        this.parse = function(str) {
            var a = str.split("&");
            for (var i = 0, l = a.length; i < l; i++) {
                var k = a[i].split("=");
                o[k[0]] = k[1]
            }
            return o
        };
        this.toString = function(filter) {
            filter = filter || "&";
            return arr.join(filter)
        };
        this.add = function(key, val) {
            var prm = key + "=" + val;
            arr.push(prm);
            return this
        }
    },
    Ajax: function(method, url, async, args, callback, error, docType) {
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
        var XMLHttp = null;
        if (window.XMLHttpRequest && !(window.ActiveXObject)) {
            XMLHttp = new XMLHttpRequest()
        } else if (window.ActiveXObject) {
            try {
                XMLHttp = new ActiveXObject("Microsoft.XMLHTTP")
            } catch(otherMSIE) {
                try {
                    XMLHttp = new ActiveXObject("Msxml2.XMLHTTP")
                } catch(NoSupport) {
                    XMLHttp = null
                }
            }
        }
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
            XMLHttp.open(method, url + "?" + (params || ''), async);
            XMLHttp.send(null)
        } else {
            XMLHttp.open(method, url, async);
            XMLHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            XMLHttp.send(params)
        }
        this.AjaxObjext = XMLHttp
    },
    get: function(url, params, callback, error, async) {
        this.Ajax("get", url, async, params, callback, error)
    },
    post: function(url, params, callback, error, async) {
        this.Ajax("post", url, async, params, callback, error)
    },
    getJSON: function(url, params, callback, error, async) {
        this.Ajax("get", url, async, params, callback, error, "json")
    },
    postJSON: function(url, params, callback, error, async) {
        this.Ajax("post", url, async, params, callback, error, "json")
    },
    loadScript: function(url, args, callback) {
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
        script.src = url + "?" + params;
        script.onload = script.onreadystatechange = function() {
            if (!this.readyState || (this.readyState == "complete" || this.readyState == "loaded")) {
                callback && callback();
                script.onreadystatechange = script.onload = null;
                script = null
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script)
    },
    JSON: function() {
        function f(n) {
            return n < 10 ? '0' + n: n
        }
        Date.prototype.toJSON = function() {
            return this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z'
        };
        var m = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
        function stringify(value, whitelist) {
            var a,
            i,
            k,
            l,
            r = /["\\\x00-\x1f\x7f-\x9f]/g,
            v;
            switch (typeof value) {
            case 'string':
                return r.test(value) ? '"' + value.replace(r, 
                function(a) {
                    var c = m[a];
                    if (c) {
                        return c
                    }
                    c = a.charCodeAt();
                    return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
                }) + '"': '"' + value + '"';
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null'
                }
                if (typeof value.toJSON === 'function') {
                    return stringify(value.toJSON())
                }
                a = [];
                if (typeof value.length === 'number' && !(value.propertyIsEnumerable('length'))) {
                    l = value.length;
                    for (i = 0; i < l; i += 1) {
                        a.push(stringify(value[i], whitelist) || 'null')
                    }
                    return '[' + a.join(',') + ']'
                }
                if (whitelist) {
                    l = whitelist.length;
                    for (i = 0; i < l; i += 1) {
                        k = whitelist[i];
                        if (typeof k === 'string') {
                            v = stringify(value[k], whitelist);
                            if (v) {
                                a.push(stringify(k) + ':' + v)
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (typeof k === 'string') {
                            v = stringify(value[k], whitelist);
                            if (v) {
                                a.push(stringify(k) + ':' + v)
                            }
                        }
                    }
                }
                return '{' + a.join(',') + '}'
            }
        }
        return {
            stringify: stringify,
            parse: function(text, filter) {
                var j;
                function walk(k, v) {
                    var i,
                    n;
                    if (v && typeof v === 'object') {
                        for (i in v) {
                            if (Object.prototype.hasOwnProperty.apply(v, [i])) {
                                n = walk(i, v[i]);
                                if (n !== undefined) {
                                    v[i] = n
                                } else {
                                    delete v[i]
                                }
                            }
                        }
                    }
                    return filter(k, v)
                }
                if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                    j = eval('(' + text + ')');
                    return typeof filter === 'function' ? walk('', j) : j
                }
                throw new SyntaxError('parseJSON')
            }
        }
    } (),
    Cookie: {
        write: function(name, value, exp, path, domain, secure) {
            var cookieValue = name + "=" + value;
            if (exp) {
                var dt = new Date();
                dt.setTime(dt.getTime() + (exp * 1000));
                cookieValue += "; expires=" + dt.toGMTString()
            }
            if (path) {
                cookieValue += "; path=" + path
            }
            if (domain) {
                cookieValue += "; domain=" + domain
            }
            if (secure) {
                cookieValue += "; secure"
            }
            document.cookie = cookieValue
        },
        rewrite: function(name, key, keyVal, exp, path, domain, secure) {
            var str = key;
            if (keyVal) {
                var cookie = this.read(name);
                var reg = new RegExp("\\b" + key + "=([^&]*)\\b", "g");
                str = cookie.replace(reg, 
                function(m1, m2) {
                    return m1.replace(m2, keyVal)
                })
            }
            this.write(name, str, exp, path, domain, secure)
        },
        setDay: function(name, value, exp, path) {
            this.write(name, value, (exp * 24 * 60 * 60), path)
        },
        setHour: function(name, value, exp, path) {
            this.write(name, value, (exp * 60 * 60), path)
        },
        setMin: function(name, value, exp, path) {
            this.write(name, value, (exp * 60), path)
        },
        setSec: function(name, value, exp, path) {
            this.write(name, value, (exp), path)
        },
        read: function(name, key) {
            var cookieValue = "";
            var search = name + "=";
            if (document.cookie.length > 0) {
                offset = document.cookie.indexOf(search);
                if (offset != -1) {
                    offset += search.length;
                    end = document.cookie.indexOf(";", offset);
                    if (end == -1) {
                        end = document.cookie.length
                    }
                    cookieValue = document.cookie.substring(offset, end)
                }
            }
            if (key) {
                return new Kg.Param().parse(cookieValue)[key]
            }
            return cookieValue
        },
        remove: function(name, path, domain) {
            var cookie = name + "=";
            if (path) cookie += '; path=' + path;
            if (domain) cookie += ';domain=' + domain;
            cookie += '; expires=Fri, 02-Jan-1970 00:00:00 GMT';
            document.cookie = cookie
        }
    }
};
var currentTab = 0;
var page = 1;
var pageSize = 20;
var listid = "";
var topListSize = 10;
var specialPage = 1;
var fmPage = 1;
var singerPage = 1;
var playingSong = null;
var newSong = recomData.data;
var focusSong = null;
var rankSong = null;
var singerSong = null;
var collectSong = null;
var defaultSong = null;
var lisdata = new Array();
var defaultImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAIAAAAnX375AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjgxN0M0NjAxMjlFRDExRTE4Qzc0RjZGNTRDNjYxRTFGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjgxN0M0NjAyMjlFRDExRTE4Qzc0RjZGNTRDNjYxRTFGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODE3QzQ1RkYyOUVEMTFFMThDNzRGNkY1NEM2NjFFMUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ODE3QzQ2MDAyOUVEMTFFMThDNzRGNkY1NEM2NjFFMUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6HVETYAAABfUlEQVR42uyWz4qCQBzHc5MCQ0goCepk+AaBb9BB8JbQycfxAXqFoJvQ1ZMvIF07BB1iIdxVUKJDYbhfnEVi120p/5zmexhmnB+/jzPj+P0xpmk26tVbo3ZRJEUWEFtKlmaz2e/3B4NBr9cTRRHtYrEoGQlAlh19QRBKXiXDMOPxmGRHi9X8jgnD8DMVOqqqFkW2Wi1d1++fxHH8kcrzPLQgXS4XMtVut0tAQkmS7HY7kh0KgqDyz+d6vVqWRe8lRVIkRVJk/RYNq1EURZZl2Ah+/ZUj4aDz+ZzneTLsdruFkJ1OB7kyL8x179lslvEyu34FidpiOp1KkkQM+Xa75YYNh8MfVQgibdt+GokshmFwHPcdxLJ/IaMowhTKLTI8n8/r9fpwODyN1DQt4xGh4MiNPJ1Oq9VqMplgh4/H42azgZm/cpYoq+6HePcHe/Wequi9xMtm/f1+v1wufd+v9l46juO67mg0QmVVIuyfLxaHtN1u6T+WIh/pS4ABAE9Qn+Wnzg1MAAAAAElFTkSuQmCC";
var songPage = 1;
var songClassName = "";
var Singer_Data = [{
    "name": "华语男歌手",
    "img": "chineseboys.png",
    "id": "1"
},
{
    "name": "华语女歌手",
    "img": "chinesegirls.png",
    "id": "2"
},
{
    "name": "华语组合",
    "img": "chinesegroup.png",
    "id": "3"
},
{
    "name": "日韩男歌手",
    "img": "kkcboys.png",
    "id": "4"
},
{
    "name": "日韩女歌手",
    "img": "kkcgirls.png",
    "id": "5"
},
{
    "name": "日韩组合",
    "img": "kksgroup.png",
    "id": "6"
},
{
    "name": "欧美男歌手",
    "img": "westernboys.png",
    "id": "7"
},
{
    "name": "欧美女歌手",
    "img": "westerngirls.png",
    "id": "8"
},
{
    "name": "欧美组合",
    "img": "westerngroup.png",
    "id": "9"
},
{
    "name": "其他",
    "img": "other.png",
    "id": "10"
},
];
init();
function init() {
    Kg.$('#layer').onclick = function(e) {
        e = window.event || e;
        Kg.stopEvent(e)
    };
    if (aflogin == "false") {
        recommend()
    }
    lazyLoad();
    setTimeout(function() {
        window.scrollTo(0, 1)
    },
    0)
}
function recommend() {
    var html = "<div class='recomTitle'>新歌推荐</div>";
    for (var j = 0; j < recomData.data.length; j++) {
        var songData = recomData.data[j]["hash"] + "|" + recomData.data[j]["timelength"] + "|" + recomData.data[j]["size"] + "|" + recomData.data[j]["bitrate"];
        var text = recomData.data[j]["filename"];
        html += "<li title='" + recomData.data[j]["filename"] + "' id='newsong" + j + "' idx='" + j + "' data='" + songData + "' onclick='playRankSong(2,this)'>";
        html += "<div class='play gobal_bg' onclick='showLayer(event,this)'><i></i></div>";
        html += "<div class='text'>" + text.intercept(30, "...") + "</div>";
        html += "</li>"
    }
    Kg.$("#recommendSong").innerHTML = html
}
function getFocusPicData(callback) {
    var myScript = document.createElement("script");
    myScript.src = "http://mobileservice.kugou.com/new/app/i/yueku.php?cmd=106&num=6&outputtype=jsonp&callback=" + callback + "&d=" + (new Date).getTime();
    var header = document.getElementsByTagName('body')[0];
    header.appendChild(myScript)
}
getFocusPicData("dealFocusData");
function dealFocusData(o) {
    var htmlstr = "";
    for (var i = 0; i < o.data.length; i++) {
        htmlstr += "<dd onclick='getFocusSongData(this)' title='" + o.data[i].title + "' type='" + o.data[i].type + "' cid='" + o.data[i].cid + "'><img src='" + o.data[i].imgurl + "'/> <span><a href='javascript:;'>" + o.data[i].title + "<em></em></a></span><span class='bg'></span></dd>"
    }
    Kg.$("#idSlider2").innerHTML = htmlstr
}
function getFocusSongData(dom) {
    getFocusPicSongData(dom.getAttribute("type"), dom.getAttribute("cid"), 1, 20, "dealFocusSongData");
    Kg.$(".textTitle p").innerHTML = dom.getAttribute("title")
}
function getFocusPicSongData(type, cid, page, pagesize, callback) {
    var myScript = document.createElement("script");
    myScript.src = "http://mobileservice.kugou.com/new/app/i/yueku.php?cmd=107&type=" + type + "&cid=" + cid + "&page=" + page + "&pagesize=" + pagesize + "&outputtype=jsonp&callback=" + callback + "&d=" + (new Date).getTime();
    var header = document.getElementsByTagName('body')[0];
    header.appendChild(myScript)
}
function dealFocusSongData(o) {
    focusSong = o.data;
    var el = Kg.$$("#content > ul")[10];
    el.style.display = "block";
    Kg.$$("#content > ul")[currentTab].style.display = "none";
    Kg.$$("#content > ul")[5].style.display = "none";
    Kg.$$("#content > ul")[6].style.display = "none";
    Kg.$$("#content > ul")[7].style.display = "none";
    Kg.$$("#content > ul")[8].style.display = "none";
    Kg.$$("#content > ul")[9].style.display = "none";
    Kg.$("#mainTab").style.display = "none";
    Kg.$("#subTab").style.display = "block";
    var lishtml = "";
    if (o.data.length > 0 && o.data != null) {
        for (var j = 0, l = o.data.length; j < l; j++) {
            try {
                var songData = o.data[j]["hash"] + "|" + o.data[j]["timelength"] + "|" + o.data[j]["size"] + "|" + o.data[j]["bitrate"];
                var text = o.data[j]["filename"];
                lishtml += "<li title='" + o.data[j]["filename"] + "' id='focusSong" + j + "' idx='" + j + "' data='" + songData + "' onclick='playRankSong(1,this)'>";
                lishtml += "<div class='play gobal_bg' onclick='showLayer(event,this)'><i></i></div>";
                lishtml += "<div class='text'>" + text.intercept(30, "...") + "</div>";
                lishtml += "</li>"
            } catch(e) {}
        }
        el.className = "";
        el.innerHTML = lishtml;
        window.scrollTo(0, 1)
    }
}
function getMoreInfo() {
    var wait = document.createElement("li");
    wait.className = "m loading";
    var str = "";
    var ul = Kg.$$("#content > ul")[5];
    if (currentTab == 3) {
        ul = Kg.$$("#content > ul")[3]
    }
    var more = ul.getElementsByClassName("m")[0];
    ul.removeChild(more);
    ul.appendChild(wait);
    var params = "";
    var src = "";
    if (currentTab == 0) {
        src = "../app/i/branks.php";
        params = "classname=" + className + "&page=" + page
    } else if (currentTab == 1) {
        src = "../app/i/specialsMusic.php";
        params = "classID=" + className + "&page=" + page
    } else if (currentTab == 2) {
        src = "../app/i/singer_new.php";
        params = "classID=" + className + "&page=" + page
    } else if (currentTab == 3) {
        src = "../app/i/fmList.php";
        params = "pagesize=" + pageSize + "&pageindex=" + page
    }
    setTimeout(function() {
        Kg.get(src, params, 
        function(o) {
            o = new Function("return " + o)();
            if (o.status == 1) {
                if (o.data != null && o.data.length > 0) {
                    var frag = document.createDocumentFragment();
                    if (currentTab == 0 || currentTab == 1) {
                        for (var j = 0, l = o.data.length; j < l; j++) {
                            var songData = o.data[j]["hash"] + "|" + o.data[j]["timeLength"];
                            var text = ((page - 1) * pageSize + j + 1) + "." + o.data[j]["fileName"];
                            var li = document.createElement("li");
                            var html = "<div class='play gobal_bg' onclick='showLayer(event,this)'><i></i></div>";
                            html += "<div class='text'>" + text.intercept(30, "...") + "</div>";
                            li.title = o.data[j]["fileName"];
                            li.setAttribute("data", songData);
                            li.onclick = function() {
                                playRankSong(this)
                            };
                            li.innerHTML = html;
                            frag.appendChild(li)
                        }
                    } else if (currentTab == 2) {
                        for (var j = 0, l = o.data.length; j < l; j++) {
                            var src = "";
                            var li = document.createElement("li");
                            if (o.data[j]["src"]) src = o.data[j]["src"];
                            var html = "<div class='more gobal_bg'>&gt;&gt;</div>";
                            html += '<div class="pic"><img src="' + defaultImg + '" _src="' + src + '" width="38" height="38" alt=""/></div>';
                            html += "<div class='text'>" + o.data[j]["singer"].intercept(30, "...") + "</div>";
                            li.title = o.data[j]["singer"];
                            li.onclick = (function(singer) {
                                return function() {
                                    getSingerSong(this, singer)
                                }
                            })(o.data[j]["singer"]);
                            li.innerHTML = html;
                            frag.appendChild(li)
                        }
                    } else if (currentTab == 3) {
                        for (var j = 0, l = o.data.length; j < l; j++) {
                            var src = "";
                            var li = document.createElement("li");
                            if (o.data[j]["imgurl"]) src = "http://imge.kugou.com/fmlogo/64/" + o.data[j]["imgurl"];
                            var html = "";
                            if (fmid == o.data[j]["fmid"]) {
                                html += "<div id='fmbutton" + o.data[j]["fmid"] + "' class='fmpause gobal_bg'><i></i></div>"
                            } else {
                                html += "<div id='fmbutton" + o.data[j]["fmid"] + "' class='fmplay gobal_bg'><i></i></div>"
                            }
                            html += "<div class='pic'><img src='" + defaultImg + "' _src='" + src + "' width='38' height='38' alt=''/></div>";
                            html += "<div class='textfm'>" + o.data[j]["fmname"].intercept(30, "...") + "<span _size='" + o.data[j]["fmSongData"][0].songs[0].size + "' _bitrate='" + o.data[j]["fmSongData"][0].songs[0].bitrate + "' _hash='" + o.data[j]["fmSongData"][0].songs[0].hash + "' _time='" + o.data[j]["fmSongData"][0].songs[0].time + "' id='fmsong" + o.data[j]["fmid"] + "'>" + o.data[j]["fmSongData"][0].songs[0].name + "</span></div>";
                            html += "</li>";
                            fmids.push(o.data[j]["fmid"]);
                            li.title = o.data[j]["fmname"];
                            li.onclick = (function(id) {
                                return function() {
                                    playFm(id)
                                }
                            })(o.data[j]["fmid"]);
                            li.innerHTML = html;
                            frag.appendChild(li)
                        }
                    }
                    var addMoreEl = document.createElement("li");
                    addMoreEl.className = "m";
                    addMoreEl.onclick = getMoreInfo;
                    addMoreEl.innerHTML = "更多";
                    frag.appendChild(addMoreEl);
                    ul.removeChild(wait);
                    ul.appendChild(frag);
                    page++
                } else {
                    var lastEl = document.createElement("li");
                    lastEl.className = "m";
                    lastEl.innerHTML = "已经是最后一页了";
                    ul.removeChild(wait);
                    ul.appendChild(lastEl)
                }
            } else {
                alert("获取数据失败。")
            }
        })
    },
    100)
}
var playingType = 0;
function playRankSong(type, o) {
    myplayer.pause();
    playingType = type;
    Kg.$(".playHover") && (Kg.$(".playHover").className = "");
    o.className = "playHover";
    var data = o.getAttribute("data");
    var idx = o.getAttribute("idx");
    playingIndex = idx;
    var filename = "";
    var json = [{
        "filename": o.title,
        "hash": data.split("|")[0],
        "time": data.split("|")[1],
        "filesize": data.split("|")[2],
        "bitrate": data.split("|")[3],
        "idx": -1
    }];
    switch (type) {
    case 1:
        myplayer.setSongsPlay(focusSong, idx);
        setTitle("songname");
        break;
    case 2:
        myplayer.setSongsPlay(newSong, idx);
        setTitle("songname");
        break;
    case 3:
        myplayer.setSongsPlay(rankSong, idx);
        setTitle("songname");
        break;
    case 4:
        myplayer.setSongsPlay(singerSong, idx);
        setTitle("songname");
        break;
    case 5:
        myplayer.setSongsPlay(collectSong, idx);
        setTitle("songname");
        break;
    case 6:
        myplayer.setSongsPlay(defaultSong, idx);
        setTitle("songname");
        break;
    case 7:
        addSong(json)
    }
}
function collectRankSong(o) {
    var data = o.getAttribute("data");
    var filename = "";
    var json = {
        "filename": o.title,
        "hash": data.split("|")[0],
        "time": data.split("|")[1],
        "filesize": data.split("|")[2],
        "bitrate": data.split("|")[3]
    };
    collectSongInto = json
}
function playPreSong() {
    try {
        if (playingType == 1) {
            document.getElementById("focusSong" + playingIndex).className = "";
            document.getElementById("focusSong" + myplayer.index).className = "playHover"
        }
        if (playingType == 2) {
            document.getElementById("newsong" + playingIndex).className = "";
            document.getElementById("newsong" + myplayer.index).className = "playHover"
        }
        if (playingType == 3) {
            document.getElementById("rankSong" + playingIndex).className = "";
            document.getElementById("rankSong" + myplayer.index).className = "playHover"
        }
        if (playingType == 4) {
            document.getElementById("singerSong" + playingIndex).className = "";
            document.getElementById("singerSong" + myplayer.index).className = "playHover"
        }
        if (playingType == 5) {
            document.getElementById("collectSong" + playingIndex).className = "";
            document.getElementById("collectSong" + myplayer.index).className = "playHover"
        }
        if (playingType == 6) {
            document.getElementById("defaultSong" + playingIndex).className = "";
            document.getElementById("defaultSong" + myplayer.index).className = "playHover"
        }
    } catch(e) {}
    playingIndex = myplayer.index
}
function playNextSong() {
    try {
        if (playingType == 1) {
            document.getElementById("focusSong" + playingIndex).className = "";
            document.getElementById("focusSong" + myplayer.index).className = "playHover"
        }
        if (playingType == 2) {
            document.getElementById("newsong" + playingIndex).className = "";
            document.getElementById("newsong" + myplayer.index).className = "playHover"
        }
        if (playingType == 3) {
            document.getElementById("rankSong" + playingIndex).className = "";
            document.getElementById("rankSong" + myplayer.index).className = "playHover"
        }
        if (playingType == 4) {
            document.getElementById("singerSong" + playingIndex).className = "";
            document.getElementById("singerSong" + myplayer.index).className = "playHover"
        }
        if (playingType == 5) {
            document.getElementById("collectSong" + playingIndex).className = "";
            document.getElementById("collectSong" + myplayer.index).className = "playHover"
        }
        if (playingType == 6) {
            document.getElementById("defaultSong" + playingIndex).className = "";
            document.getElementById("defaultSong" + myplayer.index).className = "playHover"
        }
    } catch(e) {}
    playingIndex = myplayer.index
}
function getDisplayList() {
    var els = Kg.$$("#content > ul");
    for (var i = 0; i < els.length; i++) {
        if (els[i].offsetHeight > 0) return els[i]
    }
}
function beforeNode(el) {
    var before = el.previousSibling;
    while (before && before.nodeType != 1) {
        before = before.previousSibling
    }
    return before
};
function nextNode(el) {
    var next = el.nextSibling;
    while (next && next.nodeType != 1) {
        next = next.nextSibling
    }
    return next
};
function sendInx(hash) {
    Kg.$(".playHover") && (Kg.$(".playHover").className = "");
    var els = getDisplayList().getElementsByTagName("li");
    for (var i = 0, l = els.length; i < l; i++) {
        if (els[i].getAttribute("data").indexOf(hash) != -1) {
            els[i].className = "playHover";
            break
        }
    }
}
function getSingerTypeList(initList) {
    if (initList == true && singerPage > 1) {
        return
    }
    var el = Kg.$$("#content > ul")[2];
    var str = el.innerHTML;
    for (var i = (topListSize * (singerPage - 1)), l = topListSize * singerPage; i < l; i++) {
        var src = "http://mobileimg.kugou.com/singer/54/" + Singer_Data[i]["img"];
        str += "<li onclick='getSingerList(" + Singer_Data[i]["id"] + ", this)' title=" + Singer_Data[i]["name"] + ">";
        str += "<div class='more gobal_bg'>&gt;&gt;</div>";
        str += "<div class='pic'><img src='" + defaultImg + "' _src='" + src + "' width='38' height='38' alt=''/></div>";
        str += "<div class='text'>" + Singer_Data[i]["name"] + "</div>";
        str += "</li>"
    }
    if (singerPage * topListSize < Singer_Data.length) {
        str += "<li class='m' onclick='getMoreList()'>更多</li>"
    }
    el.innerHTML = str;
    el.className = "";
    singerPage++
}
function getSingerList(id, obj) {
    if (id != null) {
        page = 1;
        className = id;
        var title = obj.title;
        var el = Kg.$$("#content > ul")[5];
        var str = "";
        el.style.display = "block";
        Kg.$$("#content > ul")[currentTab].style.display = "none";
        Kg.$("#mainTab").style.display = "none";
        Kg.$("#subTab").style.display = "block";
        Kg.$(".textTitle p").innerHTML = title;
        setTimeout(function() {
            Kg.get("../app/i/singer_new.php", {
                "classID": id,
                "page": page
            },
            function(o) {
                o = new Function("return " + o)();
                if (o.status == 1) {
                    if (o.data != null && o.data.length > 0) {
                        for (var j = 0, l = o.data.length; j < l; j++) {
                            var src = "";
                            if (o.data[j]["src"]) src = o.data[j]["src"];
                            str += "<li title='" + o.data[j]["singer"] + "' onclick='getSingerSong(this,\"" + o.data[j]["singer"] + "\")'>";
                            str += "<div class='more gobal_bg'>&gt;&gt;</div>";
                            str += '<div class="pic"><img src="' + defaultImg + '" _src="' + src + '" width="38" height="38" alt=""/></div>';
                            str += "<div class='text'>" + o.data[j]["singer"].intercept(30, "...") + "</div>";
                            str += "</li>"
                        }
                        str += "<li class='m' onclick='getMoreInfo()'>更多</li>";
                        page++
                    } else {
                        str += "<li class='m'>已经是最后一页了</li>"
                    }
                    el.className = "";
                    el.innerHTML = str;
                    window.scrollTo(0, 1)
                } else {
                    alert("获取数据失败。")
                }
            })
        },
        100)
    }
}
function getSingerSong(obj, id) {
    if (id != null) {
        songPage = 1;
        songClassName = id;
        var title = obj.title;
        var el = Kg.$$("#content > ul")[6];
        el.style.display = "block";
        Kg.$$("#content > ul")[5].style.display = "none";
        Kg.$("#subTab").style.display = "none";
        Kg.$("#subTab1").style.display = "block";
        Kg.$(".textTitle1 p").innerHTML = title;
        getMoreSingerSong(obj.title)
    }
}
function getMoreSingerSong(singerName) {
    var wait = document.createElement("li");
    wait.className = "m loading";
    var str = "";
    var ul = Kg.$$("#content > ul")[6];
    var more = ul.getElementsByClassName("m")[0];
    var father = null;
    if (more) {
        father = more.parentNode;
        father.removeChild(more)
    }
    var str = ul.innerHTML;
    father && father.appendChild(wait);
    setTimeout(function() {
        Kg.get("../app/i/singerSong_new.php", {
            "singerID": songClassName,
            "page": songPage
        },
        function(o) {
            var d = eval("(" + o + ")");
            if (singerSong == null) {
                singerSong = d.data
            } else {
                singerSong = singerSong.concat(d.data)
            }
            o = new Function("return " + o)();
            if (o.status == 1) {
                if (o.data != null && o.data.length > 0) {
                    for (var j = 0, l = o.data.length; j < l; j++) {
                        var songData = o.data[j]["hash"] + "|" + o.data[j]["timelength"];
                        var text = ((songPage - 1) * pageSize + j + 1) + "." + o.data[j]["filename"];
                        str += "<li title='" + o.data[j]["filename"] + "' id='singerSong" + parseInt((songPage - 1) * pageSize + j) + "' idx='" + parseInt((songPage - 1) * pageSize + j) + "' data='" + songData + "' onclick='playRankSong(4,this)'>";
                        str += "<div class='play gobal_bg' onclick='showLayer(event,this)'><i></i></div>";
                        str += "<div class='text'>" + text.intercept(30, "...") + "</div>";
                        str += "</li>"
                    }
                    str += "<li class='m' onclick='getMoreSingerSong(\"" + singerName + "\")'>更多</li>";
                    songPage++
                } else {
                    str += "<li class='m'>已经是最后一页了</li>"
                }
                ul.className = "";
                ul.innerHTML = str
            } else {
                alert("获取数据失败。")
            }
        })
    },
    100)
}
var fmids = new Array();
function getFmList(initList) {
    var el = Kg.$$("#content > ul")[3];
    var str = "";
    setTimeout(function() {
        Kg.get("../app/i/fmList.php", {
            "pageindex": 1,
            "pagesize": pageSize
        },
        function(o) {
            o = new Function("return " + o)();
            if (o.status == 1) {
                if (o.data != null && o.data.length > 0) {
                    for (var j = 0, l = o.data.length; j < l; j++) {
                        var src = "";
                        if (o.data[j]["imgurl"]) src = "http://imge.kugou.com/fmlogo/64/" + o.data[j]["imgurl"];
                        str += "<li title='" + o.data[j]["fmname"] + "' onclick='playFm(" + o.data[j]["fmid"] + ")'>";
                        if (fmid == o.data[j]["fmid"]) {
                            str += "<div id='fmbutton" + o.data[j]["fmid"] + "' class='fmpause gobal_bg'><i></i></div>"
                        } else {
                            str += "<div id='fmbutton" + o.data[j]["fmid"] + "' class='fmplay gobal_bg'><i></i></div>"
                        }
                        str += "<div class='pic'><img src='" + defaultImg + "' _src='" + src + "' width='38' height='38' alt=''/></div>";
                        str += "<div class='textfm'>" + o.data[j]["fmname"].intercept(30, "...") + "<span _size='" + o.data[j]["fmSongData"][0].songs[0].size + "' _bitrate='" + o.data[j]["fmSongData"][0].songs[0].bitrate + "' _hash='" + o.data[j]["fmSongData"][0].songs[0].hash + "' _time='" + o.data[j]["fmSongData"][0].songs[0].time + "' id='fmsong" + o.data[j]["fmid"] + "'>" + o.data[j]["fmSongData"][0].songs[0].name + "</span></div>";
                        str += "</li>";
                        fmids.push(o.data[j]["fmid"])
                    }
                    str += "<li class='m' onclick='getMoreInfo()'>更多</li>";
                    page++
                } else {
                    str += "<li class='m'>已经是最后一页了</li>"
                }
                el.className = "";
                el.innerHTML = str;
                window.scrollTo(0, 1)
            } else {
                alert("获取数据失败。")
            }
        },
        false)
    },
    100)
}
function changeTab(num) {
    var tabs = Kg.$$("#mainTab li");
    var uls = Kg.$$("#content > ul");
    for (var i = 0, l = tabs.length; i < l; i++) {
        tabs[i].className = tabs[i].className.replace(/\s*hover/g, "");
        uls[i].style.display = "none"
    }
    tabs[num].className += " hover";
    uls[num].style.display = "block";
    currentTab = num;
    uls[9].style.display = "none";
    window.scrollTo(0, 1)
}
function goBack() {
    Kg.AjaxObjext && Kg.AjaxObjext.abort && Kg.AjaxObjext.abort();
    var ul = Kg.$$("#content > ul");
    var el = document.getElementById("layer");
    ul[5].style.display = "none";
    ul[7].style.display = "none";
    ul[8].style.display = "none";
    ul[9].style.display = "none";
    ul[10].style.display = "none";
    Kg.$("#subTab").style.display = "none";
    Kg.$("#mainTab").style.display = "block";
    ul[currentTab].style.display = "block";
    ul[5].innerHTML = "";
    ul[5].className = "loading";
    ul[7].innerHTML = "";
    ul[7].className = "loading";
    ul[8].innerHTML = "";
    ul[8].className = "loading";
    ul[9].innerHTML = "";
    ul[9].className = "loading";
    ul[10].innerHTML = "";
    ul[10].className = "loading";
    el.style.display = "none";
    window.scrollTo(0, 1);
    getMyCollection(kugouid, (new Date).getTime())
}
function goBack1() {
    Kg.AjaxObjext && Kg.AjaxObjext.abort && Kg.AjaxObjext.abort();
    var ul = Kg.$$("#content > ul");
    var el = document.getElementById("layer");
    ul[6].style.display = "none";
    Kg.$("#subTab1").style.display = "none";
    Kg.$("#subTab").style.display = "block";
    ul[5].style.display = "block";
    ul[6].innerHTML = "";
    ul[6].className = "loading";
    el.style.display = "none";
    window.scrollTo(0, 1)
}
function lazyLoad() {
    setInterval(function() {
        var size = Kg.getBodySize();
        var lazyImgs = Kg.$A(document.images);
        for (var i = 0, l = lazyImgs.length; i < l; i++) {
            if (lazyImgs[i].offsetHeight <= 0) continue;
            if (!lazyImgs[i].getAttribute("_src")) continue;
            if (lazyImgs[i].getAttribute("_src") == lazyImgs[i].src) continue;
            if (lazyImgs[i].getBoundingClientRect().top <= (size.cH - lazyImgs[i].offsetHeight / 4)) {
                lazyImgs[i].src = lazyImgs[i].getAttribute("_src")
            }
        }
    },
    100)
}
function showLayer(e, o) {
    Kg.stopEvent(e || window.event);
    var el = document.getElementById("layer");
    if (o == showLayer.currentObj && el.offsetHeight > 0) {
        el.style.display = "none"
    } else {
        var father = o.parentNode;
        var pos = Kg.getXY(o);
        var top = 0;
        if ((pos.top + 175) > (Kg.getBodySize().sH - 70)) {
            top = Kg.getBodySize().sH - 175 - 80
        } else {
            top = pos.top + 10
        }
        el.getElementsByClassName("title")[0].innerHTML = father.title;
        el.style.top = top + "px";
        el.style.right = "53px";
        el.style.display = "block";
        el.className += " fadeInRight";
        var play = el.getElementsByClassName("p")[0];
        var down = el.getElementsByClassName("d")[0];
        play.onclick = function() {
            if (kugouid) {
                Kg.$("#choose_list_box").style.display = "block";
                Kg.$("#shadowDiv").style.display = "block";
                getMyCollection(kugouid, (new Date).getTime());
                collectRankSong(father)
            } else {
                showLogin()
            }
            el.style.display = "none"
        };
        down.onclick = function() {
            var _this = this;
            Kg.getJSON("../app/i/getSongInfo.php", {
                "hash": father.getAttribute("data").split("|")[0],
                "cmd": "playInfo"
            },
            function(o) {
                if (o.status == 1) {
                    el.style.display = "none";
                    _this.href = o.url
                } else {
                    alert('歌曲下载失败')
                }
            },
            null, false)
        };
        play = down = null
    }
    showLayer.currentObj = o
}
function showLayer2(e, o) {
    Kg.stopEvent(e || window.event);
    var el = document.getElementById("layer2");
    Kg.$('#layer') && (Kg.$('#layer').style.display = 'none');
    Kg.$('#layer3') && (Kg.$('#layer3').style.display = 'none');
    Kg.$('#layer4') && (Kg.$('#layer4').style.display = 'none');
    if (o == showLayer.currentObj && el.offsetHeight > 0) {
        el.style.display = "none"
    } else {
        var father = o.parentNode;
        var pos = Kg.getXY(o);
        var top = 0;
        if ((pos.top + 175) > (Kg.getBodySize().sH - 70)) {
            top = Kg.getBodySize().sH - 175 - 80
        } else {
            top = pos.top + 10
        }
        el.style.top = top + "px";
        el.style.right = "53px";
        el.style.display = "block";
        el.className += " fadeInRight";
        var play = el.getElementsByClassName("p")[0];
        var deletes = el.getElementsByClassName("p")[1];
        var down = el.getElementsByClassName("d")[0];
        play.onclick = function() {
            playThisList(father.getAttribute("listid"));
            el.style.display = "none"
        };
        deletes.onclick = function() {
            if (father.getAttribute("title") == "默认收藏") {
                alert("对不起，默认收藏不能删除！");
                return
            }
            Kg.$("#delete_list_box").style.display = "block";
            Kg.$("#delete_list_box").setAttribute("listid", father.getAttribute("listid"));
            el.style.display = "none"
        };
        down.onclick = function() {
            if (father.getAttribute("title") == "默认收藏") {
                alert("对不起，默认收藏不能重命名！");
                return
            }
            Kg.$("#modify_list_box").style.display = "block";
            Kg.$("#shadowDiv").style.display = "block";
            document.getElementById("modifyListButton").setAttribute("listid", father.getAttribute("listid"));
            document.getElementById("modifyListButton").setAttribute("orderweight", father.getAttribute("orderweight"));
            el.style.display = "none"
        };
        play = down = null
    }
    showLayer.currentObj = o
}
function showLayer3(e, o) {
    Kg.stopEvent(e || window.event);
    var el = document.getElementById("layer3");
    Kg.$('#layer') && (Kg.$('#layer').style.display = 'none');
    Kg.$('#layer2') && (Kg.$('#layer2').style.display = 'none');
    Kg.$('#layer4') && (Kg.$('#layer4').style.display = 'none');
    if (o == showLayer.currentObj && el.offsetHeight > 0) {
        el.style.display = "none"
    } else {
        var father = o.parentNode;
        var pos = Kg.getXY(o);
        var top = 0;
        if ((pos.top + 175) > (Kg.getBodySize().sH - 70)) {
            top = Kg.getBodySize().sH - 175 - 80
        } else {
            top = pos.top + 10
        }
        el.style.top = top + "px";
        el.style.right = "53px";
        el.style.display = "block";
        el.className += " fadeInRight";
        var play = el.getElementsByClassName("p")[0];
        var down = el.getElementsByClassName("d")[0];
        play.onclick = function() {
            deleteListSong(Kg.$(".textTitle p").getAttribute("listid"), father.getAttribute("fileid"));
            el.style.display = "none"
        };
        down.onclick = function() {
            var _this = this;
            Kg.getJSON("../app/i/getSongInfo.php", {
                "hash": father.getAttribute("data").split("|")[0],
                "cmd": "playInfo"
            },
            function(o) {
                if (o.status == 1) {
                    el.style.display = "none";
                    _this.href = o.url
                } else {
                    alert('歌曲下载失败')
                }
            },
            null, false)
        };
        play = down = null
    }
    showLayer.currentObj = o
}
function showLayer4(e, o) {
    Kg.stopEvent(e || window.event);
    var el = document.getElementById("layer4");
    Kg.$('#layer') && (Kg.$('#layer').style.display = 'none');
    Kg.$('#layer2') && (Kg.$('#layer2').style.display = 'none');
    Kg.$('#layer3') && (Kg.$('#layer3').style.display = 'none');
    if (o == showLayer.currentObj && el.offsetHeight > 0) {
        el.style.display = "none"
    } else {
        var father = o.parentNode;
        var pos = Kg.getXY(o);
        var top = 0;
        if ((pos.top + 175) > (Kg.getBodySize().sH - 70)) {
            top = Kg.getBodySize().sH - 175 - 80
        } else {
            top = pos.top + 10
        }
        el.style.top = top + "px";
        el.style.right = "53px";
        el.style.display = "block";
        el.className += " fadeInRight";
        var play = el.getElementsByClassName("p")[0];
        var down = el.getElementsByClassName("d")[0];
        play.onclick = function() {
            addList();
            el.style.display = "none"
        };
        down.onclick = function() {
            synNow();
            el.style.display = "none"
        };
        play = down = null
    }
    showLayer.currentObj = o
}
function closeWifiNotice() {
    Kg.$("#wifi_notice").style.display = "none";
    Kg.$("#blank_layer").style.display = "none"
}
function showWifiNotice() {
    var notice = Kg.Cookie.read("wifi_notice");
    if (!notice) {
        setTimeout(function() {
            createBg();
            Kg.$("#wifi_notice").style.display = "block";
            Kg.Cookie.setDay("wifi_notice", "1", "2")
        },
        3000)
    }
}
function shutLoginbox() {
    try {
        Kg.$("#login_box").style.display = "none";
        Kg.$("#reg_box").style.display = "none";
        Kg.$("#shadowDiv").style.display = "none";
        Kg.$("#choose_list_box").style.display = "none";
        Kg.$("#add_list_box").style.display = "none";
        Kg.$("#delete_list_box").style.display = "none";
        Kg.$("#modify_list_box").style.display = "none"
    } catch(e) {}
}
function shutRegbox() {
    try {
        Kg.$("#reg_box").style.display = "none";
        Kg.$("#shadowDiv").style.display = "none"
    } catch(e) {}
}
function showLoadceMusic() {
    var notice = Kg.Cookie.read("load_music_notice");
    if (!notice) {
        createBg();
        Kg.$("#loading_music").style.display = "block"
    }
}
function createBg() {
    var size = Kg.getBodySize();
    var el = Kg.$("#blank_layer");
    if (el) {
        el.style.width = size.sW + "px";
        el.style.height = size.sH + "px";
        el.style.display = "block"
    } else {
        el = document.createElement("div");
        el.style.width = size.sW + "px";
        el.style.height = size.sH + "px";
        el.style.position = "absolute";
        el.style.top = 0;
        el.style.left = 0;
        el.id = "blank_layer";
        document.body.appendChild(el)
    }
}
function check() {
    var el = Kg.$("#loading_music input");
    el.checked = "true"
}
function closeLoadceMusic() {
    Kg.$("#loading_music").style.display = "none";
    Kg.$("#blank_layer").style.display = "none";
    Kg.Cookie.setDay("load_music_notice", "1", "2")
}
document.onclick = function() {
    Kg.$('#layer') && (Kg.$('#layer').style.display = 'none');
    Kg.$('#layer2') && (Kg.$('#layer2').style.display = 'none');
    Kg.$('#layer3') && (Kg.$('#layer3').style.display = 'none');
    Kg.$('#layer4') && (Kg.$('#layer4').style.display = 'none')
};
var kugouid;
var kugouName;
var userpic;
var listData;
function getListData(cmd, uid, callback, d) {
    var myScript = document.createElement("script");
    myScript.src = "http://mobileservice.kugou.com/new/app/i/html5.php?cmd=" + cmd + "&uid=" + uid + "&outputtype=jsonp&callback=" + callback + "&d=" + d;
    var header = document.getElementsByTagName('body')[0];
    header.appendChild(myScript)
}
function getMyCollection(kugouid, d) {
    try {
        getListData(101, kugouid, "dealMyList", d)
    } catch(e) {}
}
var orderweight = 0;
function dealMyList(o) {
    var el = Kg.$$("#content > ul")[4];
    if (currentTab == 4 && Kg.$("#subTab").style.display == "none") {
        el.style.display = "block"
    }
    listData = o;
    var html = "<div class='userInfo'><img src='" + getUserIcon(userpic) + "' width='52' height='52'/><p><label id='username'>" + kugouName + "</label><a class='admin' onclick='showLayer4(event,this)'>管理</a></p><p><span id='syntips'>正在同步中...</span><a class='logout' href='http://www1.kugou.com/user/logout.aspx?url=http://m.kugou.com/index.php' onclick='logout()'>退出</a></p></div>";
    var htmlselect = "";
    var songNums = 0;
    orderweight = listData.data[listData.data.length - 1].orderweight + 1;
    for (var i = 0; i < listData.data.length; i++) {
        var text = listData.data[i].listname;
        text = text.replace(/\'/g, "&acute;");
        text = text.replace(/\'/g, "&quot;");
        html += "<li onclick='getMyListSong(this)' orderweight=" + listData.data[i].orderweight + " listid = " + listData.data[i].listid + " title=" + text + ">";
        html += "<div class='play gobal_bg'  onclick='showLayer2(event,this)' orderweight=" + listData.data[i].orderweight + " listid=" + listData.data[i].listid + " title=" + text + "><i></i></div>";
        html += "<div class='songsNum'>" + listData.data[i].listfilecount + "首曲目</div>";
        html += "<div class='pic'><span class='collistpic'></span></div>";
        html += "<div class='text' id='listtext" + listData.data[i].listid + "'>" + text.intercept(30, "...") + "</div>";
        html += "</li>";
        songNums += listData.data[i].listfilecount;
        htmlselect += "<option value='" + listData.data[i].listid + "'>" + text + "</option>"
    }
    try {
        Kg.$("#select").innerHTML = "<select name='' id='chosenList'>" + htmlselect + "</select>"
    } catch(e) {}
    el.className = "";
    el.innerHTML = html;
    setTimeout(function() {},
    100);
    window.scrollTo(0, 1);
    Kg.$("#syntips").innerHTML = "共收藏" + songNums + "首歌曲";
    Kg.$("#syntips").style.color = "#717171"
}
function synNow() {
    Kg.$("#syntips").innerHTML = "正在同步中...";
    Kg.$("#syntips").style.color = "#c00";
    getMyCollection(kugouid, (new Date).getTime())
}
function getListSongData(cmd, uid, listid, callback, d) {
    var myScript = document.createElement("script");
    myScript.src = "http://mobileservice.kugou.com/new/app/i/html5.php?cmd=" + cmd + "&d=" + d + "&listid=" + listid + "&uid=" + uid + "&outputtype=jsonp&callback=" + callback;
    var header = document.getElementsByTagName('body')[0];
    header.appendChild(myScript)
}
function getMyListSong(obj) {
    var listid = obj.getAttribute("listid");
    var listname = obj.getAttribute("title");
    var el = Kg.$$("#content > ul")[8];
    el.style.display = "block";
    Kg.$$("#content > ul")[currentTab].style.display = "none";
    Kg.$("#mainTab").style.display = "none";
    Kg.$("#subTab").style.display = "block";
    Kg.$(".textTitle p").innerHTML = listname;
    Kg.$(".textTitle p").setAttribute("listid", listid);
    getListSongData(102, kugouid, listid, "dealMyListSong", (new Date).getTime())
}
function dealMyListSong(o) {
    htmlString = "";
    var el = Kg.$$("#content > ul")[8];
    if (o.status == 1) {
        collectSong = o.data;
        if (o.data.length > 0 && o.data != null) {
            for (var j = 0, l = o.data.length; j < l; j++) {
                var songData = o.data[j]["hash"] + "|" + o.data[j]["timelength"] + "|" + o.data[j]["filesize"] + "|" + o.data[j]["bitrate"];
                var text = (j + 1) + "." + o.data[j]["filename"];
                htmlString += "<li _id='file" + o.data[j].fileid + Kg.$(".textTitle p").getAttribute("listid") + "' title='" + o.data[j]["filename"] + "' id='collectSong" + j + "' idx='" + j + "' data='" + songData + "' fileid='" + o.data[j].fileid + "' onclick='playRankSong(5,this)'>";
                htmlString += "<div class='play gobal_bg' onclick='showLayer3(event,this)'><i></i></div>";
                htmlString += "<div class='text'>" + text.intercept(30, "...") + "</div>";
                htmlString += "</li>"
            }
            el.className = "";
            el.innerHTML = htmlString;
            window.scrollTo(0, 1)
        }
        if (o.data == "") {
            el.className = "";
            htmlString += "<li class='nobd'>擦，该列表没有歌曲</li>";
            el.innerHTML = htmlString
        }
    } else {
        alert("获取数据失败。")
    }
}
function playThisList(listid) {
    getListSongData(102, kugouid, listid, "playMyListSong", (new Date).getTime())
}
function playMyListSong(o) {
    if (o.status == 1) {
        var lisdata = new Array();
        for (var j = 0; j < o.data.length; j++) {
            var items = {
                "filename": o.data[j].filename.split("-")[1],
                "singer": o.data[j].filename.split("-")[0],
                "time": o.data[j].timelength,
                "size": o.data[j].filesize,
                "hash": o.data[j].hash,
                "bitrate": +o.data[j].bitrate
            };
            lisdata.push(items)
        }
        myplayer.setSongs(lisdata);
        myplayer.index = 0;
        setTitle("songname")
    }
}
var allSongsSize = 0;
function getAllsize(uid, callback) {
    var myScript = document.createElement("script");
    myScript.src = "http://mobileservice.kugou.com/new/app/i/html5.php?cmd=106&uid=" + uid + "&outputtype=jsonp&callback=" + callback;
    var header = document.getElementsByTagName('body')[0];
    header.appendChild(myScript)
}
function returnAllsize(o) {
    if (o.status == 1) {
        allSongsSize = o.totalsize;
        var songInfo = collectSongInto;
        if (parseInt(allSongsSize) + parseInt(songInfo.filesize) > 5 * 1024 * 1024 * 1024) {
            alert("亲，你的列表空间已经超过5G，请删除一些歌曲后再收藏！");
            return false
        } else {
            var collListid = document.getElementById("chosenList").value;
            getListSongData(102, kugouid, collListid, "dealMyListSongId", (new Date).getTime())
        }
    } else {
        alert("对不起，获取列表数据失败，请稍后收藏！")
    }
}
var songorderweight = 1;
function dealMyListSongId(o) {
    if (o.status == 1) {
        if (o.data.length > 0) {
            songorderweight = o.data[o.data.length - 1]["orderweight"] + 1
        }
        var collListid = document.getElementById("chosenList").value;
        var songInfo = collectSongInto;
        sendSongData(104, kugouid, collListid, songInfo.filename + ".mp3", songInfo.time, songInfo.filesize, songInfo.bitrate, songInfo.hash, "collsucc", songorderweight)
    } else {
        alert("获取数据失败。")
    }
}
var collectSongInto;
function collectSongAct() {
    if (kugouid) {
        getAllsize(kugouid, "returnAllsize")
    } else {
        showLogin()
    }
}
function sendSongData(cmd, uid, listid, filename, timelength, filesize, bitrate, hash, callback, orderweight) {
    var myScript = document.createElement("script");
    myScript.src = "http://mobileservice.kugou.com/new/app/i/html5.php?cmd=" + cmd + "&listid=" + listid + "&uid=" + uid + "&filename=" + encodeURIComponent(filename) + "&timelength=" + timelength + "&filesize=" + filesize + "&bitrate=" + bitrate + "&hash=" + hash + "&outputtype=jsonp&callback=" + callback + "&orderweight=" + orderweight;
    var header = document.getElementsByTagName('body')[0];
    header.appendChild(myScript)
}
function collsucc(o) {
    if (o.status == 1) {
        alert("恭喜，歌曲已经成功收藏！")
    } else {
        alert("抱歉，收藏失败，请稍后再试！")
    }
    Kg.$("#choose_list_box").style.display = "none";
    Kg.$("#shadowDiv").style.display = "none"
}
function addList() {
    Kg.$("#add_list_box").style.display = "block";
    Kg.$("#shadowDiv").style.display = "block"
}
function addListAction() {
    if (Kg.$("#useraddListName").value.trim() == "") {
        alert("请输入列表名！");
        return
    } else {
        var listname = encodeURIComponent(Kg.$("#useraddListName").value);
        modifyList(103, kugouid, "", listname, 1, "addListResult", orderweight)
    }
}
function addListResult(o) {
    if (o.status == 1) {
        alert("新增成功！");
        Kg.$("#add_list_box").style.display = "none";
        Kg.$("#shadowDiv").style.display = "none";
        getMyCollection(kugouid, (new Date).getTime())
    } else {
        alert("新增失败，请稍候再试！")
    }
}
function deleteList(listid) {
    modifyList(103, kugouid, listid, "", 2, "deleteListResult", 0)
}
function deleteListAction() {
    var listid = Kg.$("#delete_list_box").getAttribute("listid");
    deleteList(listid)
}
function deleteListResult(o) {
    if (o.status == 1) {
        try {
            alert("删除成功！");
            Kg.$("#delete_list_box").style.display = "none";
            synNow();
            document.getElementById("listtext" + o.listid).parentNode.style.display = "none"
        } catch(e) {}
    } else {
        alert("删除失败，请稍候再试！")
    }
}
function renameList(dom) {
    if (Kg.$("#userListName").value.trim() == "") {
        alert("请输入新列表名！");
        return
    } else if (Kg.$("#userListName").value.trim().length > 19) {
        alert("列表名不能超过19个字！");
        return false
    } else {
        modifyList(103, kugouid, dom.getAttribute("listid"), Kg.$("#userListName").value, 3, "renameListResult", dom.getAttribute("orderweight"))
    }
}
function renameListResult(o) {
    if (o.status == 1) {
        alert("修改成功！");
        synNow();
        document.getElementById("listtext" + o.listid).innerHTML = o.listname.intercept(30, "...");
        shutLoginbox()
    } else {
        alert("修改失败，请稍候再试！")
    }
}
function modifyList(cmd, uid, listid, listname, operate, callback, orderweight) {
    listname = listname.replace(/\'/g, "&acute;");
    listname = listname.replace(/\'/g, "&quot;");
    var myScript = document.createElement("script");
    myScript.src = "http://mobileservice.kugou.com/new/app/i/html5.php?cmd=" + cmd + "&listid=" + listid + "&listname=" + listname + "&uid=" + uid + "&operate=" + operate + "&outputtype=jsonp&callback=" + callback + "&orderweight=" + orderweight;
    var header = document.getElementsByTagName('body')[0];
    header.appendChild(myScript)
}
function deleteListSong(listid, fileid) {
    modifyListSong(105, kugouid, listid, fileid, "deleteListSongResult")
}
function deleteListSongResult(o) {
    if (o.status == 1) {
        alert("移除成功！");
        getListSongData(102, kugouid, o.listid, "dealMyListSong", (new Date).getTime())
    } else {
        alert("移除失败，请稍后重试！")
    }
}
function modifyListSong(cmd, uid, listid, fileid, callback) {
    var myScript = document.createElement("script");
    myScript.src = "http://mobileservice.kugou.com/new/app/i/html5.php?cmd=" + cmd + "&listid=" + listid + "&fileid=" + fileid + "&uid=" + uid + "&outputtype=jsonp&callback=" + callback;
    var header = document.getElementsByTagName('body')[0];
    header.appendChild(myScript)
}
function login() {
    if (document.getElementById("userName").value == "") {
        alert("请输入用户名！")
    } else if (document.getElementById("userPwd").value == "") {
        alert("请输入密码！")
    } else {
        Kg.get("../app/i/loginAndReg.php", {
            "username": document.getElementById("userName").value,
            "password": document.getElementById("userPwd").value,
            "cmd": 400
        },
        function(result) {
            var myScript = document.createElement("script");
            var d = new Date();
            myScript.src = "http://www1.kugou.com/user/NLoginChenck.aspx?syn=true&d=" + d.getTime() + "&UserName=" + document.getElementById("userName").value + "&UserPwd=" + document.getElementById("userPwd").value + "&sign=" + result + "&locatime=" + d.getFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
            var header = document.getElementsByTagName('body')[0];
            header.appendChild(myScript)
        },
        "", false)
    }
}
function LoginCallBack(o) {
    if (o == "success") {
        alert("登录成功！");
        if (phone == "iphone" || phone == 0) {
            shutLoginbox();
            alreadyLogin();
            getMyCollection(kugouid, (new Date).getTime())
        }
        sdnClick(13929)
    } else {
        alert(o)
    }
}
function getUserIcon(userpic) {
    if (!userpic || userpic == "default.jpg") {
        return "http://image8.kugou.com/myicon/icon1/20111125/10/20111125102548106.jpg"
    }
    var dir = userpic.substring(0, 8) + "/" + userpic.substring(8, 10) + "/";
    var path = "http://image8.kugou.com/myicon/icon2/" + dir + userpic;
    return "http://image8.kugou.com/myicon/icon2/" + dir + userpic
}
function alreadyLogin() {
    kugouid = Kg.Cookie.read("KuGoo", "KugooID");
    kugouName = unescape(Kg.Cookie.read("KuGoo", "NickName"));
    userpic = Kg.Cookie.read("KuGoo", "Pic")
}
function showLogin() {
    if (phone == "iphone" || phone == 0) {
        Kg.$("#login_box").style.display = "block";
        Kg.$("#shadowDiv").style.display = "block";
        Kg.$("#reg_box").style.display = "none"
    } else if (phone == "android") {
        document.location = "/loginReg.php?act=login"
    }
}
try {
    Kg.$("#shadowDiv").onclick = function() {
        try {
            Kg.$("#login_box").style.display = "none";
            Kg.$("#shadowDiv").style.display = "none";
            Kg.$("#add_list_box").style.display = "none";
            Kg.$("#choose_list_box").style.display = "none";
            Kg.$("#modify_list_box").style.display = "none"
        } catch(e) {}
    }
} catch(e) {}
function showRegister() {
    if (phone == "iphone" || phone == 0) {
        Kg.$("#reg_box").style.display = "block";
        Kg.$("#shadowDiv").style.display = "block";
        Kg.$("#login_box").style.display = "none"
    } else if (phone == "android") {
        document.location = "/loginReg.php?act=reg"
    }
}
function collectTab() {
    var el = Kg.$$("#content > ul")[4];
    el.style.display = "block";
    if (kugouid) {
        getMyCollection(kugouid, (new Date).getTime())
    } else {
        var html = "<div class='loginTipbox'><div class='imgbox'></div><p>登录后您可以同步电脑上收藏的歌曲</p><a onclick='showLogin()'>登录</a><a onclick='showRegister()'>注册</a></div>";
        el.innerHTML = html
    }
}
var cookieTimer = setInterval(function() {
    alreadyLogin();
    if (kugouid) {
        clearInterval(cookieTimer)
    }
},
50);
var myemail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
function register() {
    if (document.getElementById("userNameReg").value == "") {
        alert("请输入用户名！")
    } else if (document.getElementById("userPwdReg").value == "") {
        alert("请输入密码！")
    } else if (document.getElementById("userEmail").value == "") {
        alert("请输入邮箱！")
    } else if (!myemail.test(Kg.$("#userEmail").value)) {
        alert("请输入正确的邮箱格式！")
    } else {
        Kg.getJSON("../app/i/loginAndReg.php", {
            "username": document.getElementById("userNameReg").value,
            "password": document.getElementById("userPwdReg").value,
            "email": document.getElementById("userEmail").value,
            "cmd": 401
        },
        function(result) {
            if (result.status == 1) {
                if (result.error == null) {
                    shutRegbox();
                    alert("注册成功！");
                    alreadyLogin();
                    shutLoginbox();
                    collectTab()
                }
            } else {
                if (result.error == "用户名称冲突！") {
                    alert("该名称已被注册！")
                } else {
                    alert(result.error)
                }
            }
        },
        "", false)
    }
}
function getList() {
    page = 1;
    var el = Kg.$$("#content > ul")[1];
    el.style.display = "block";
    getData(100, 21, page, topListSize, "returnLists")
}
function returnLists(o) {
    htmlString = "";
    if (o.status == 1) {
        if (o.data.length > 0 && o.data != null) {
            for (var j = 0, l = o.data.length; j < l; j++) {
                var src = o.data[j]["imgurl"].replace("{size}", "54");
                var text = o.data[j]["cname"];
                htmlString += "<li title='" + o.data[j]["cname"] + "' onclick='showSongsList(" + o.data[j]["cid"] + ",this)'>";
                htmlString += "<div title='" + o.data[j]["cname"] + "' class='more gobal_bg' onclick='showSongsList(" + o.data[j]["cid"] + ",this)'><i></i></div>";
                htmlString += "<div class='pic'><img src='" + defaultImg + "' _src='" + src + "' width='38' height='38' alt=''/></div>";
                htmlString += "<div class='text'>" + text.intercept(30, "...") + "</div>";
                htmlString += "</li>"
            }
            htmlString += "<li class='m' onclick='getListMore()'>更多</li>";
            var el = Kg.$$("#content > ul")[1];
            el.className = "";
            el.innerHTML = htmlString;
            window.scrollTo(0, 1);
            page++
        } else {}
    } else {
        htmlString += "<li class='m'>已经是最后一页了</li>";
        alert("获取数据失败。")
    }
}
function getListMore() {
    getData(100, 21, page, topListSize, "returnMoreLists")
}
function returnMoreLists(o) {
    var more = Kg.$(".m");
    var wait = document.createElement("li");
    wait.className = "m loading";
    htmlString = "";
    var el = Kg.$$("#content > ul")[1];
    el.removeChild(more);
    if (o.status == 1) {
        if (o.data.length > 0 && o.data != null) {
            for (var j = 0, l = o.data.length; j < l; j++) {
                var src = o.data[j]["imgurl"].replace("{size}", "54");
                var text = o.data[j]["cname"];
                htmlString += "<li title='" + o.data[j]["cname"] + "' onclick='showSongsList(" + o.data[j]["cid"] + ",this)'>";
                htmlString += "<div title='" + o.data[j]["cname"] + "' class='more gobal_bg' onclick='showSongsList(" + o.data[j]["cid"] + ",this)'><i></i></div>";
                htmlString += "<div class='pic'><img src='" + defaultImg + "' _src='" + src + "' width='38' height='38' alt=''/></div>";
                htmlString += "<div class='text'>" + text.intercept(30, "...") + "</div>";
                htmlString += "</li>"
            }
            htmlString += "<li class='m' onclick='getListMore()'>更多</li>";
            el.className = "";
            el.innerHTML += htmlString;
            page++
        } else {}
    } else {
        htmlString += "<li class='m'>已经是最后一页了</li>";
        el.className = "";
        el.innerHTML += htmlString
    }
}
function showSongsList(cid, dom) {
    listid = cid;
    page = 1;
    var el = Kg.$$("#content > ul")[5];
    el.style.display = "block";
    Kg.$$("#content > ul")[currentTab].style.display = "none";
    Kg.$("#mainTab").style.display = "none";
    Kg.$("#subTab").style.display = "block";
    Kg.$(".textTitle p").innerHTML = dom.title;
    getData(101, cid, page, pageSize, "returnSongs")
}
var htmlString = "";
function returnSongs(o) {
    rankSong = o.data;
    if (o.status == 1 && o.data != null) {
        htmlString = "";
        for (var j = 0, l = o.data.length; j < l; j++) {
            var songData = o.data[j]["hash"] + "|" + o.data[j]["timelength"] + "|" + o.data[j]["size"] + "|" + o.data[j]["bitrate"];
            var text = ((page - 1) * pageSize + j + 1) + "." + o.data[j]["filename"];
            htmlString += "<li title='" + o.data[j]["filename"] + "' id='rankSong" + j + "' idx='" + j + "'  data='" + songData + "' onclick='playRankSong(3,this)'>";
            htmlString += "<div class='play gobal_bg' onclick='showLayer(event,this)'><i></i></div>";
            htmlString += "<div class='text'>" + text.intercept(30, "...") + "</div>";
            htmlString += "</li>"
        }
        htmlString += "<li class='m' onclick='showSongsListMore()'>更多</li>";
        var el = Kg.$$("#content > ul")[5];
        el.className = "";
        el.innerHTML = htmlString;
        window.scrollTo(0, 1);
        page++
    } else {
        alert("获取数据失败。")
    }
}
function showSongsListMore() {
    getData(101, listid, page, pageSize, "returnSongsMore")
}
function returnSongsMore(o) {
    rankSong = rankSong.concat(o.data);
    var ul = Kg.$$("#content > ul")[5];
    var wait = document.createElement("li");
    wait.className = "m loading";
    var more = ul.getElementsByClassName("m")[0];
    ul.removeChild(more);
    ul.appendChild(wait);
    if (o.status == 1 && o.data != null) {
        htmlString = "";
        var frag = document.createDocumentFragment();
        for (var j = 0, l = o.data.length; j < l; j++) {
            var songData = o.data[j]["hash"] + "|" + o.data[j]["timelength"] + "|" + o.data[j]["size"] + "|" + o.data[j]["bitrate"];
            var text = ((page - 1) * pageSize + j + 1) + "." + o.data[j]["filename"];
            var li = document.createElement("li");
            var html = "<div class='play gobal_bg' onclick='showLayer(event,this)'><i></i></div>";
            html += "<div class='text'>" + text.intercept(30, "...") + "</div>";
            li.title = o.data[j]["filename"];
            li.setAttribute("data", songData);
            li.setAttribute("idx", parseInt((page - 1) * pageSize + j));
            li.setAttribute("id", "rankSong" + parseInt((page - 1) * pageSize + j));
            li.onclick = function() {
                playRankSong(3, this)
            };
            li.innerHTML = html;
            frag.appendChild(li)
        }
        var addMoreEl = document.createElement("li");
        addMoreEl.className = "m";
        addMoreEl.onclick = showSongsListMore;
        addMoreEl.innerHTML = "更多";
        frag.appendChild(addMoreEl);
        ul.removeChild(wait);
        ul.appendChild(frag);
        page++
    } else {
        var lastEl = document.createElement("li");
        lastEl.className = "m";
        lastEl.innerHTML = "已经是最后一页了";
        ul.removeChild(wait);
        ul.appendChild(lastEl)
    }
}
function getData(cmd, cid, page, pagesize, callback) {
    var myScript = document.createElement("script");
    myScript.src = "http://mobilecdn.kugou.com/new/app/i/yueku.php?cmd=" + cmd + "&cid=" + cid + "&type=" + cid + "&page=" + page + "&pagesize=" + pagesize + "&outputtype=jsonp&callback=" + callback;
    var header = document.getElementsByTagName('body')[0];
    header.appendChild(myScript)
}
var searchPage = 1;
function getSearchData(cmd, keyword, page, pagesize, callback) {
    var myScript = document.createElement("script");
    myScript.src = "http://mobilecdn.kugou.com/new/app/i/search.php?cmd=" + cmd + "&keyword=" + keyword + "&page=" + page + "&pagesize=" + pagesize + "&outputtype=jsonp&callback=" + callback;
    var header = document.getElementsByTagName('body')[0];
    header.appendChild(myScript)
}
function searchWord() {
    var word = document.getElementById("userSearchWords").value;
    if (word.trim() == "") {
        alert("亲，请输入关键字！");
        return false
    }
    searchPage = 1;
    getSearchData(300, word, searchPage, pageSize, "returnSearchData")
}
function returnSearchData(o) {
    htmlString = "";
    var el = Kg.$$("#content > ul")[7];
    el.style.display = "block";
    el.html = "";
    el.className = "loading";
    Kg.$$("#content > ul")[5].style.display = "none";
    Kg.$$("#content > ul")[6].style.display = "none";
    Kg.$$("#content > ul")[8].style.display = "none";
    Kg.$$("#content > ul")[9].style.display = "none";
    Kg.$$("#content > ul")[10].style.display = "none";
    Kg.$$("#content > ul")[currentTab].style.display = "none";
    Kg.$("#mainTab").style.display = "none";
    Kg.$("#subTab").style.display = "block";
    Kg.$("#subTab1").style.display = "none";
    Kg.$(".textTitle p").innerHTML = "搜索结果";
    if (o.status == 1) {
        if (o.recordcount != 0) {
            for (var j = 0, l = o.data.length; j < l; j++) {
                var songData = o.data[j]["hash"] + "|" + o.data[j]["timelength"] + "|" + o.data[j]["size"] + "|" + o.data[j]["bitrate"];
                var text = ((searchPage - 1) * pageSize + j + 1) + "." + o.data[j]["filename"];
                htmlString += "<li title='" + o.data[j]["filename"] + "' id='newsong" + j + "' idx='" + j + "' data='" + songData + "' onclick='playRankSong(7,this)'>";
                htmlString += "<div class='play gobal_bg' onclick='showLayer(event,this)'><i></i></div>";
                htmlString += "<div class='text'>" + text.intercept(30, "...") + "</div>";
                htmlString += "</li>"
            }
            htmlString += "<li class='m' onclick='getSearchDataMore()'>更多</li>";
            el.className = "";
            el.innerHTML = htmlString;
            window.scrollTo(0, 1);
            searchPage++
        } else {
            el.className = "";
            htmlString += "<li class='m nobd'>悲催，没有找到结果</li>";
            el.innerHTML = htmlString
        }
    } else {
        htmlString += "<li class='m'>已经是最后一页了</li>";
        alert("获取数据失败。")
    }
}
function getSearchDataMore() {
    var word = document.getElementById("userSearchWords").value;
    getSearchData(300, word, searchPage, pageSize, "returnSearchDataMore")
}
function returnSearchDataMore(o) {
    var wait = document.createElement("li");
    wait.className = "m loading";
    var el = Kg.$$("#content > ul")[7];
    var more = el.getElementsByClassName("m")[0];
    try {
        el.removeChild(more)
    } catch(e) {}
    htmlString = "";
    if (o.status == 1) {
        if (o.data.length > 0 && o.data != null) {
            for (var j = 0, l = o.data.length; j < l; j++) {
                var songData = o.data[j]["hash"] + "|" + o.data[j]["timelength"] + "|" + o.data[j]["size"] + "|" + o.data[j]["bitrate"];
                var text = ((searchPage - 1) * pageSize + j + 1) + "." + o.data[j]["filename"];
                htmlString += "<li title='" + o.data[j]["filename"] + "' data='" + songData + "' onclick='playRankSong(this)'>";
                htmlString += "<div class='play gobal_bg' onclick='showLayer(event,this)'><i></i></div>";
                htmlString += "<div class='text'>" + text.intercept(30, "...") + "</div>";
                htmlString += "</li>"
            }
            htmlString += "<li class='m' onclick='getSearchDataMore()'>更多</li>";
            el.innerHTML += htmlString;
            searchPage++
        } else {}
    } else {
        htmlString += "<li class='m'>已经是最后一页了</li>";
        alert("获取数据失败。")
    }
}
var $ = function(id) {
    return "string" == typeof id ? document.getElementById(id) : id
};
var Class = {
    create: function() {
        return function() {
            this.initialize.apply(this, arguments)
        }
    }
};
Object.extend = function(destination, source) {
    for (var property in source) {
        destination[property] = source[property]
    }
    return destination
};
var TransformView = Class.create();
TransformView.prototype = {
    initialize: function(container, slider, parameter, count, options) {
        if (parameter <= 0 || count <= 0) return;
        var oContainer = $(container),
        oSlider = $(slider),
        oThis = this;
        this.Index = 0;
        this._timer = null;
        this._slider = oSlider;
        this._parameter = parameter;
        this._count = count || 0;
        this._target = 0;
        this.SetOptions(options);
        this.Up = !!this.options.Up;
        this.Step = Math.abs(this.options.Step);
        this.Time = Math.abs(this.options.Time);
        this.Auto = !!this.options.Auto;
        this.Pause = Math.abs(this.options.Pause);
        this.onStart = this.options.onStart;
        this.onFinish = this.options.onFinish;
        oContainer.style.overflow = "hidden";
        oContainer.style.position = "relative";
        oSlider.style.position = "absolute";
        oSlider.style.top = oSlider.style.left = 0
    },
    SetOptions: function(options) {
        this.options = {
            Up: true,
            Step: 5,
            Time: 10,
            Auto: true,
            Pause: 3000,
            onStart: function() {},
            onFinish: function() {}
        };
        Object.extend(this.options, options || {})
    },
    Start: function() {
        if (this.Index < 0) {
            this.Index = this._count - 1
        } else if (this.Index >= this._count) {
            this.Index = 0
        }
        this._target = -1 * this._parameter * this.Index;
        this.onStart();
        this.Move()
    },
    Move: function() {
        clearTimeout(this._timer);
        var oThis = this,
        style = this.Up ? "top": "left",
        iNow = parseInt(this._slider.style[style]) || 0,
        iStep = this.GetStep(this._target, iNow);
        if (iStep != 0) {
            this._slider.style[style] = (iNow + iStep) + "px";
            this._timer = setTimeout(function() {
                oThis.Move()
            },
            this.Time)
        } else {
            this._slider.style[style] = this._target + "px";
            this.onFinish();
            if (this.Auto) {
                this._timer = setTimeout(function() {
                    oThis.Index++;
                    oThis.Start()
                },
                this.Pause)
            }
        }
    },
    GetStep: function(iTarget, iNow) {
        var iStep = (iTarget - iNow) / this.Step;
        if (iStep == 0) return 0;
        if (Math.abs(iStep) < 1) return (iStep > 0 ? 1: -1);
        return iStep
    },
    Stop: function(iTarget, iNow) {
        clearTimeout(this._timer);
        this._slider.style[this.Up ? "top": "left"] = this._target + "px"
    }
};
window.onload = function() {
    function Each(list, fun) {
        for (var i = 0, len = list.length; i < len; i++) {
            fun(list[i], i)
        }
    };
    var objs2 = $("idNum2").getElementsByTagName("dd");
    var widthnum = document.body.clientWidth;
    var objsImg = $("idSlider2").getElementsByTagName("img");
    for (var i = 0; i < objsImg.length; i++) {
        objsImg[i].style.width = widthnum + "px"
    }
    var tv2 = new TransformView("idTransformView2", "idSlider2", widthnum, 6, {
        onStart: function() {
            Each(objs2, 
            function(o, i) {
                o.className = tv2.Index == i ? "on": ""
            })
        },
        Up: false
    });
    tv2.Start();
    var timeout;
    Each(objs2, 
    function(o, i) {
        o.onmouseover = function() {
            timeout = setTimeout(function() {
                o.className = "on";
                tv2.Auto = false;
                tv2.Index = i;
                tv2.Start()
            },
            200)
        };
        o.onmouseout = function() {
            clearTimeout(timeout);
            o.className = "";
            tv2.Auto = true;
            tv2.Start()
        }
    })
};
function showHisLis(data) {
    defaultSong = data;
    var el = Kg.$$("#content > ul")[9];
    el.style.display = "block";
    Kg.$$("#content > ul")[currentTab].style.display = "none";
    Kg.$$("#content > ul")[5].style.display = "none";
    Kg.$$("#content > ul")[6].style.display = "none";
    Kg.$$("#content > ul")[7].style.display = "none";
    Kg.$$("#content > ul")[8].style.display = "none";
    Kg.$$("#content > ul")[10].style.display = "none";
    detailPlay();
    Kg.$("#mainTab").style.display = "none";
    Kg.$("#subTab").style.display = "block";
    Kg.$(".textTitle p").innerHTML = "默认列表";
    var lishtml = "";
    if (data.length > 0 && data != null) {
        for (var j = 0, l = data.length; j < l; j++) {
            try {
                if ((data.length > 1 && data[j].hash != data[j - 1].hash)) {
                    if (data[j]["hash"] != 0) {
                        var songData = data[j]["hash"] + "|" + data[j]["time"] + "|" + data[j]["filesize"] + "|" + data[j]["bitrate"];
                        var text = data[j]["filename"];
                        lishtml += "<li title='" + data[j]["filename"] + "' id='defaultSong" + j + "' idx='" + j + "' data='" + songData + "' onclick='playRankSong(6,this)'>";
                        lishtml += "<div class='play gobal_bg' onclick='showLayer(event,this)'><i></i></div>";
                        lishtml += "<div class='text'>" + text.intercept(30, "...") + "</div>";
                        lishtml += "</li>"
                    }
                } else if (data.length == 1) {
                    if (data[j]["hash"] != 0) {
                        var songData = data[j]["hash"] + "|" + data[j]["time"] + "|" + data[j]["filesize"] + "|" + data[j]["bitrate"];
                        var text = data[j]["filename"];
                        lishtml += "<li title='" + data[j]["filename"] + "' id='defaultSong" + j + "' idx='" + j + "'  data='" + songData + "' onclick='playRankSong(6,this)'>";
                        lishtml += "<div class='play gobal_bg' onclick='showLayer(event,this)'><i></i></div>";
                        lishtml += "<div class='text'>" + text.intercept(30, "...") + "</div>";
                        lishtml += "</li>"
                    } else if (data[j]["hash"] == 0) {
                        lishtml += "<li class='m nobd'>没有最近播放歌曲</li>"
                    }
                }
            } catch(e) {}
        }
        el.className = "";
        el.innerHTML = lishtml;
        window.scrollTo(0, 1)
    }
    if (data.length == 0) {
        el.className = "";
        lishtml += "<li class='m'>没有最近播放歌曲</li>";
        el.innerHTML = lishtml
    }
}
function sdnClick(num) {
    setTimeout(function() { (new Image()).src = "http://sdn.kugou.com/link.aspx?id=" + num + "&url=&t=" + Math.random()
    },
    0)
};
LRC = function() {
    this.initialize.apply(this, arguments)
};
LRC.prototype = {
    arrLyricTime: [],
    arrLyric: [],
    initialize: function(arg) {
        this.lyricTable = arg.lyricTable;
        this.lyricWrapper = arg.lyricWrapper;
        this.curRowClassName = arg.curRowClassName;
        this.separator = arg.separator;
        this.arrLyricTime = [];
        this.arrLyric = [];
        this.initArray(arg.lyric);
        this.arrLyricTime = this.sort(this.arrLyricTime);
        this.setLyricTable(this.arrLyric)
    },
    initArray: function(lyric) {
        var lrc_re = new RegExp('\[[0-9:.]*\]', 'g');
        var lrc_arr = lyric.split(this.separator);
        var lrc_temp = 0;
        var lrc_filter = 0;
        for (var i = 0; i < lrc_arr.length; i++) {
            var lrc_txt = lrc_arr[i].replace(/\[[\w\W]*\]/g, '').Trim();
            if (lrc_txt == '') {
                lrc_filter++;
                continue
            }
            this.arrLyric[i - lrc_filter] = lrc_txt;
            while ((lrc_result = lrc_re.exec(lrc_arr[i])) != null) {
                var lrc_second = this.parseSecond(lrc_result.toString().replace(/\[|\]/g, ''));
                if (!isNaN(lrc_second)) this.arrLyricTime[lrc_temp++] = (i - lrc_filter) + '|' + lrc_second
            }
        }
    },
    IsLyricValid: function(arrLyricTime) {
        return this.arrLyricTime.length > 0
    },
    DoSync: function(curPosition) {
        var lrc_times = this.arrLyricTime;
        for (var i = 0; i < lrc_times.length; i++) {
            var lrc_arrPre = lrc_times[i].split('|');
            if (i == 0 && curPosition < lrc_arrPre[1]) break;
            if (lrc_times[i + 1] == undefined) {
                this.setRow(lrc_arrPre[0]);
                break
            }
            var lrc_arrNext = lrc_times[i + 1].split('|');
            if (curPosition >= lrc_arrPre[1] && curPosition < lrc_arrNext[1]) {
                this.setRow(lrc_arrPre[0]);
                break
            }
        }
    },
    parseSecond: function(time) {
        try {
            var lrc_arr = time.split(':');
            return parseInt(lrc_arr[0]) * 60 + parseFloat(lrc_arr[1])
        } catch(ex) {
            return 0
        }
    },
    setLyricTable: function(arrLyric) {
        this.lyricWrapper.scrollTop = 0;
        if (this.lyricTable.rows.length > 0) {
            this.clearTable(this.lyricTable)
        }
        for (var i = 0; i < arrLyric.length; i++) {
            var lrc_tr = this.lyricTable.insertRow( - 1);
            var lrc_cell = lrc_tr.insertCell(0);
            lrc_cell.innerHTML = arrLyric[i]
        }
    },
    clearTable: function(lyricTable) {
        var lrc_rowNum = lyricTable.rows.length;
        for (var i = 0; i < lrc_rowNum; i++) {
            lyricTable.deleteRow(i);
            lrc_rowNum = lrc_rowNum - 1;
            i = i - 1
        }
    },
    setRow: function(index) {
        this.setRowClass(index);
        this.setScroll(index)
    },
    setRowClass: function(index) {
        var lrc_rows = this.lyricTable.rows;
        for (var i = 0; i < lrc_rows.length; i++) {
            lrc_rows[i].className = ''
        }
        lrc_rows[index].className = this.curRowClassName
    },
    setScroll: function(index) {
        this.lyricWrapper.scrollTop = this.lyricTable.rows[index].offsetTop - Math.round(this.lyricWrapper.offsetHeight / 3)
    },
    sort: function(arrLyricTime) {
        for (var i = 0; i < arrLyricTime.length - 1; i++) {
            for (var ii = i + 1; ii < arrLyricTime.length; ii++) {
                var lrc_cur = parseFloat(arrLyricTime[i].split('|')[1]);
                var lrc_next = parseFloat(arrLyricTime[ii].split('|')[1]);
                if (lrc_cur > lrc_next) {
                    var lrc_temp = arrLyricTime[i];
                    arrLyricTime[i] = arrLyricTime[ii];
                    arrLyricTime[ii] = lrc_temp
                }
            }
        }
        return arrLyricTime
    }
};
String.prototype.Trim = function() {
    return this.replace(/^\s*|\s*$/g, "")
};
function Player(fatherId, playerId) {
    this.fatherId = fatherId;
    this.playerId = playerId;
    this.songs = [];
    this.index = 0;
    this.playMode = "order";
    this.playIndex = [];
    this.init()
};
Player.prototype.create = function(hash, filename) {
    var src;
    if (hash != 0) {
        Kg.getJSON("../app/i/getSongInfo.php", {
            "hash": hash,
            "cmd": "playInfo"
        },
        function(result) {
            src = result.url
        },
        "", false)
    }
    var htmlstr = "<audio id='" + this.playerId + "' src='" + src + "' autoplay='autoplay' controls></audio>";
    document.getElementById(this.fatherId).innerHTML = htmlstr;
    document.getElementById(this.playerId).play();
    if (document.getElementById(this.playerId).onended != "undefined") {
        document.getElementById(this.playerId).onended = function() {
            playNextSongAuto()
        }
    }
    document.getElementById(this.playerId).addEventListener("ended", 
    function() {
        playNextSongAuto()
    });
    if (filename != "听音乐，找酷狗" && filename.trim() != "") {
        getSinHead(filename.split("-")[0], 52);
        if (visible == true) {
            getSinHeadBig(filename.split("-")[0], 400)
        }
    }
    sdnClick(13272)
};
Player.prototype.getSongsNum = function() {
    return this.songs.length
};
var randomSortIndex = 0;
Player.prototype.setPlaymode = function(str) {
    this.playMode = str;
    if (str == "random") {
        randomSortIndex = 0;
        for (i = 0; i < this.getSongsNum(); i++) {
            this.playIndex[i] = i
        }
        this.playIndex.sort(randomSort)
    }
};
Player.prototype.getSongs = function() {
    return this.songs
};
Player.prototype.setSongs = function(songs) {
    this.songs = songs;
    this.create(songs[0].hash, songs[0].filename);
    if (this.getSongs()[this.index]) {
        lisdata.push(this.getSongs()[this.index])
    }
};
Player.prototype.setSongsPlay = function(songs, num) {
    this.songs = songs;
    this.create(this.songs[num].hash, this.songs[num].filename);
    this.index = num;
    if (this.getSongs()[this.index]) {
        lisdata.push(this.getSongs()[this.index])
    }
};
Player.prototype.addSongsPlay = function(songs) {
    var index = this.songs.length;
    for (var i = 0; i < songs.length; i++) {
        this.songs.push(songs[i])
    }
    this.create(this.songs[index].hash, this.songs[index].filename);
    this.index = index;
    if (this.getSongs()[this.index]) {
        lisdata.push(this.getSongs()[this.index])
    }
};
Player.prototype.addSongsNoPlay = function(songs) {
    for (var i = 0; i < songs.length; i++) {
        this.songs.push(songs[i])
    }
    myplayer.pause()
};
Player.prototype.init = function() {
    var hash = 0;
    var filename = "听音乐，找酷狗";
    this.create(hash, filename)
};
Player.prototype.last = function() {
    if (this.index > 0) {
        this.index--
    } else {
        this.index = 0
    }
    this.create(this.songs[this.index].hash, this.songs[this.index].filename);
    if (this.getSongs()[this.index]) {
        lisdata.push(this.getSongs()[this.index])
    }
};
var tempIndexs;
Player.prototype.next = function(auto) {
    switch (this.playMode) {
    case "order":
        if (this.index < this.getSongsNum() - 1) {
            this.index++
        } else {
            if (this.songs[0].hash != 0) {
                this.index = 0
            } else {
                this.index = 1
            }
        }
        this.create(this.songs[this.index].hash, this.songs[this.index].filename);
        if (this.getSongs()[this.index]) {
            lisdata.push(this.getSongs()[this.index])
        }
        break;
    case "list":
        if (this.index < this.getSongsNum() - 1) {
            this.index++
        } else {
            if (this.songs[0].hash != 0) {
                this.index = 0
            } else {
                this.index = 1
            }
        }
        this.create(this.songs[this.index].hash, this.songs[this.index].filename);
        if (this.getSongs()[this.index]) {
            lisdata.push(this.getSongs()[this.index])
        }
        break;
    case "random":
        if (randomSortIndex < this.getSongsNum() - 1) {
            randomSortIndex++;
            this.index = this.playIndex[randomSortIndex];
            if (this.songs[0].hash == 0) {
                this.index = 1
            }
        }
        this.create(this.songs[this.index].hash, this.songs[this.index].filename);
        if (this.getSongs()[this.index]) {
            lisdata.push(this.getSongs()[this.index])
        }
        break;
    case "single":
        if (auto == 1) {
            this.create(this.songs[this.index].hash, this.songs[this.index].filename);
            if (this.getSongs()[this.index]) {
                lisdata.push(this.getSongs()[this.index])
            }
        } else if (auto == 0) {
            if (this.index < this.getSongsNum() - 1) {
                this.index++
            } else {
                if (this.songs[0].hash != 0) {
                    this.index = 0
                } else {
                    this.index = 1
                }
            }
            this.create(this.songs[this.index].hash, this.songs[this.index].filename);
            if (this.getSongs()[this.index]) {
                lisdata.push(this.getSongs()[this.index])
            }
        }
        break
    }
};
Player.prototype.playOrPause = function() {
    if (document.getElementById(this.playerId).paused) {
        document.getElementById(this.playerId).play()
    } else {
        document.getElementById(this.playerId).pause()
    }
};
Player.prototype.play = function() {
    document.getElementById(this.playerId).play()
};
Player.prototype.pause = function() {
    document.getElementById(this.playerId).pause()
};
Player.prototype.getAllTime = function() {
    try {
        return document.getElementById(this.playerId).duration
    } catch(e) {}
};
Player.prototype.getBuffered = function() {
    try {
        return document.getElementById(this.playerId).buffered
    } catch(e) {}
};
Player.prototype.getCurrentTime = function() {
    try {
        return document.getElementById(this.playerId).currentTime
    } catch(e) {}
};
Player.prototype.setCurrentTime = function(time) {
    try {
        document.getElementById(this.playerId).currentTime = time
    } catch(e) {}
};
Player.prototype.setVolume = function(num) {
    document.getElementById(this.playerId).volume = num
};
var randomSort = function() {
    return Math.random() > 0.5 ? -1: 1
};
var Request = {
    QueryString: function(item) {
        var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return svalue ? svalue[1] : svalue
    }
};
String.prototype.trim = function() {
    return this.replace(/^\s*|\s*$/g, "")
};
function undulpicate(array) {
    for (var i = 0; i < array.length; i++) {
        for (var j = i + 1; j < array.length; j++) {
            if (array[i].hash == array[j].hash) {
                array.splice(j, 1);
                j--
            }
        }
    }
    return array
};
var getSinHead = function(name, size) {
    if (name.trim() != "" && name != null && name != "听音乐，找酷狗") {
        Kg.getJSON("../app/i/getSingerHead_new.php", {
            "singerName": name.split(/\s-\s/)[0].trim(),
            "size": size,
            "d": (new Date()).getTime()
        },
        function(result) {
            if (result.status == 1 && result != "") {
                document.getElementById("singerHead").src = decodeURIComponent(result.url)
            } else {
                document.getElementById("singerHead").src = "../static/images/sinheadNew.png"
            }
        })
    }
};
var getSinHeadBig = function(name, size) {
    if (name.trim() != "" && name != null && name != "听音乐，找酷狗") {
        Kg.getJSON("../app/i/getSingerHead_new.php", {
            "singerName": name.split(/\s-\s/)[0].trim(),
            "size": size,
            "d": (new Date()).getTime()
        },
        function(result) {
            if (result.status == 1 && result != "") {
                document.getElementById("singerHeadBig").src = decodeURIComponent(result.url)
            } else {
                document.getElementById("singerHeadBig").src = "../static/images/touch-icon-114.png"
            }
        })
    }
};
var addZero = function(n) {
    return n.toString().length <= 1 ? "0" + n: n
};
var getPlayTime = function() {
    var times = Math.ceil(myplayer.getCurrentTime());
    var mins = Math.floor(times / 60);
    var secs = times % 60;
    return addZero(mins) + ":" + addZero(secs)
};
var setPlayTime = function(dom) {
    setInterval(function() {
        document.getElementById(dom).innerHTML = getPlayTime()
    },
    1000)
};
var setPlayProgress = function() {
    setInterval(function() {
        var amountTimes = Math.ceil(myplayer.getAllTime());
        var playTimes = myplayer.getCurrentTime();
        var rate = Math.ceil(playTimes / amountTimes * 298);
        document.getElementById("progress").style.width = rate + "px"
    },
    300)
};
var setGetBufferedProgress = function() {
    setInterval(function() {
        var amountTimes = Math.ceil(myplayer.getAllTime());
        var bufferTimes = myplayer.getBuffered();
        var rate = Math.ceil(bufferTimes / amountTimes * 298);
        document.getElementById("progress").style.background = "#c00";
        document.getElementById("progress").style.width = rate + "px"
    },
    300)
};
function mousePosition(ev) {
    if (ev.pageX || ev.pageY) {
        return {
            x: ev.pageX,
            y: ev.pageY
        }
    }
    return {
        x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
        y: ev.clientY + document.body.scrollTop - document.body.clientTop
    }
};
function getX(ev) {
    ev = ev || window.event;
    var mousePos = mousePosition(ev);
    var x = mousePos.x;
    return x
};
var chalculateProgress = function(dom, ev) {
    var amountLong = 298;
    var amountTimes = Math.ceil(myplayer.getAllTime());
    var dom_x = document.getElementById(dom).offsetLeft;
    var mouse_x = getX(ev);
    document.getElementById("progress").style.width = mouse_x - dom_x + "px";
    return (mouse_x - dom_x) / amountLong * amountTimes
};
var changeButton = function() {
    var el = document.getElementById("playButton");
    if (el.className.indexOf("play") != -1) {
        el.className = el.className.replace("play", "pause");
        try {
            document.getElementById("fmbutton" + fmid).className = 'fmpause gobal_bg'
        } catch(e) {}
    } else if (el.className.indexOf("pause") != -1) {
        el.className = el.className.replace("pause", "play");
        try {
            document.getElementById("fmbutton" + fmid).className = 'fmplay gobal_bg'
        } catch(e) {}
    }
};
var playerId = "kugou";
var isPlayRadio = false;
var myplayer = new Player("player", playerId);
var playrandom = function() {
    myplayer.setPlaymode("random")
};
var playNextSongAuto = function() {
    if (isPlayRadio == true) {
        getRadioSongHead(fmid, offsets);
        myplayer.next(0);
        getRadioSongs(fmid, offsets)
    } else {
        myplayer.next(1);
        playNextSong()
    }
    setTitle("songname");
    document.getElementById("songTitle").innerHTML = myplayer.songs[myplayer.index].filename;
    showLyrics();
    changeShowSong()
};
var playNextSongManual = function() {
    if (isPlayRadio == true) {
        getRadioSongHead(fmid, offsets);
        myplayer.next(0);
        getRadioSongs(fmid, offsets)
    } else {
        myplayer.next(0);
        playNextSong()
    }
};
var getRadioSongHead = function(fmid, offsets) {
    if (myplayer.getSongsNum() - 1 == myplayer.index) {
        Kg.getJSON("../app/i/fmSongs.php", {
            "fmid": fmid,
            "offset": offsets,
            "size": 20
        },
        function(result) {
            var songs = [];
            for (var i = 0; i < result.data[0].songs.length; i++) {
                songs.push({
                    'filename': result.data[0].songs[i].name,
                    'hash': result.data[0].songs[i].hash,
                    'timelength': result.data[0].songs[i].time / 1000,
                    'filesize': result.data[0].songs[i].size,
                    'bitrate': result.data[0].songs[i].bitrate
                })
            }
            offsets = result.data[0].offset;
            playFmSongs(songs)
        },
        "", false)
    }
};
var getRadioSongs = function(fmid, offsets) {
    if (myplayer.index == myplayer.getSongsNum() - 3) {
        Kg.getJSON("../app/i/fmSongs.php", {
            "fmid": fmid,
            "offset": offsets,
            "size": 20
        },
        function(result) {
            var songsInfo = [];
            for (var i = 0; i < result.data[0].songs.length; i++) {
                songsInfo.push({
                    'filename': result.data[0].songs[i].name,
                    'hash': result.data[0].songs[i].hash,
                    'timelength': result.data[0].songs[i].time / 1000,
                    'filesize': result.data[0].songs[i].size,
                    'bitrate': result.data[0].songs[i].size
                })
            }
            myplayer.addSongsNoPlay(songsInfo)
        },
        "", false)
    }
};
var setTitle = function(dom) {
    if ( !! (document.createElement('audio').canPlayType("audio/mpeg"))) {
        if (myplayer.songs[myplayer.index].singer == "听音乐，找酷狗") {
            document.getElementById(dom).innerHTML = myplayer.songs[myplayer.index].singer
        } else {
            document.getElementById(dom).innerHTML = myplayer.songs[myplayer.index].filename
        }
    }
};
var changeState = function(songs) {
    setTitle("songname");
    changeShowSong();
    document.getElementById("playButton").className = "loading gobal_bg";
    var loadingTime = setInterval(function() {
        if (myplayer.getCurrentTime() != 0) {
            document.getElementById("playButton").className = "pause gobal_bg";
            clearInterval(loadingTime)
        }
    },
    100);
    document.getElementById("songTitle").innerHTML = myplayer.songs[myplayer.index].filename
};
var playFmSongs = function(songs) {
    myplayer.index = 0;
    myplayer.pause();
    myplayer.setPlaymode("order");
    isPlayRadio = true;
    myplayer.setSongs(songs);
    changeState(songs)
};
var offsets = 0;
var fmid = 0;
var playFm = function(id) {
    if (fmid != 0 && fmid != id) {
        document.getElementById("fmbutton" + fmid).className = 'fmplay gobal_bg'
    }
    var el = document.getElementById("playButton");
    if (document.getElementById("fmbutton" + id).className == 'fmpause gobal_bg') {
        document.getElementById("fmbutton" + id).className = 'fmplay gobal_bg';
        document.getElementById("playButton").className = "play gobal_bg";
        el.className = el.className.replace("pause", "play");
        myplayer.pause()
    } else {
        document.getElementById("fmbutton" + id).className = 'fmpause gobal_bg';
        document.getElementById("playButton").className = "pause gobal_bg";
        if (fmid == id) {
            el.className = el.className.replace("fmplay", "fmpause");
            myplayer.play()
        } else {
            var name = document.getElementById("fmsong" + id).innerHTML;
            var time = document.getElementById("fmsong" + id).getAttribute("_time");
            var size = document.getElementById("fmsong" + id).getAttribute("_size");
            var hash = document.getElementById("fmsong" + id).getAttribute("_hash");
            var bitrate = document.getElementById("fmsong" + id).getAttribute("_bitrate");
            var firstSong = [{
                "filename": name,
                "hash": hash,
                "timelength": time / 1000,
                "size": size,
                "bitrate": bitrate
            }];
            offset = document.getElementById("fmsong" + id).getAttribute("_offset");
            fmid = id;
            playFmSongs(firstSong)
        }
    }
    fmid = id
};
var changeShowSong = function() {
    if (isPlayRadio == true) {
        document.getElementById("fmsong" + fmid).innerHTML = myplayer.getSongs()[myplayer.index].filename
    }
};
var addSong = function(songsInfo) {
    isPlayRadio = false;
    myplayer.addSongsPlay(songsInfo);
    changeState(songsInfo)
};
var detailPlayLrc = function() {
    document.getElementById("detailPageSong").style.display = "none";
    document.getElementById("detailPageLrc").style.height = document.getElementById("playwrap").offsetTop + 10 + "px";
    document.getElementById("detailPageLrc").style.display = "block";
    var step = 1;
    var timer = setInterval(function() {
        document.getElementById("detailPageLrc").style.bottom = 0 - document.getElementById("playwrap").offsetTop + step + "px";
        step += 8;
        if (document.getElementById("detailPageLrc").offsetTop <= 0) {
            clearInterval(timer)
        }
    },
    1)
};
var detailPlaySong = function() {
    document.getElementById("detailPageLrc").style.display = "none";
    document.getElementById("detailPageSong").style.height = document.getElementById("playwrap").offsetTop + 10 + "px";
    document.getElementById("detailPageSong").style.display = "block";
    var step = 1;
    var timer = setInterval(function() {
        document.getElementById("detailPageSong").style.bottom = 0 - document.getElementById("playwrap").offsetTop + step + "px";
        step += 8;
        if (document.getElementById("detailPageSong").offsetTop <= 0) {
            clearInterval(timer)
        }
    },
    1)
};
var visible = false;
var detailPlay = function() {
    if (visible == false) {
        visible = true;
        document.getElementById("detailPage").className += " run";
        document.getElementById("singerHeader").style.display = "block";
        document.getElementById("songTitle").innerHTML = myplayer.songs[myplayer.index].filename;
        document.getElementById("lrcWrapper").style.height = document.getElementById("playwrap").offsetTop - document.getElementById("singerHeader").offsetTop - document.getElementById("singerHeader").offsetHeight - 10 + "px"
    } else if (visible == true) {
        visible = false;
        document.getElementById("detailPage").className = "detailWrap"
    }
};
var header = true;
var showOrHideHeader = function() {
    if (header == true) {
        header = false;
        document.getElementById("singerHeader").style.display = "none";
        document.getElementById("viewMode").className = "showlrc";
        document.getElementById("lrcWrapper").style.height = document.getElementById("playwrap").offsetTop - 60 + "px"
    } else if (header == false) {
        header = true;
        document.getElementById("singerHeader").style.display = "block";
        document.getElementById("viewMode").className = "showsong";
        document.getElementById("lrcWrapper").style.height = document.getElementById("playwrap").offsetTop - document.getElementById("singerHeader").offsetTop - document.getElementById("singerHeader").offsetHeight + "px"
    }
};
var timerId;
function showLyrics() {
    clearInterval(timerId);
    var lyricContent = "";
    var keyword = myplayer.getSongs()[myplayer.index].filename;
    var timelength = myplayer.getSongs()[myplayer.index].timelength * 1000;
    Kg.get("../app/i/krc.php", {
        "cmd": 100,
        "keyword": keyword,
        "timelength": timelength,
        "d": (new Date).getTime()
    },
    function(result) {
        if (result != "") {
            lyricContent = result
        } else {
            lyricContent = "悲催，没有找到歌词！"
        }
    },
    "", false);
    var uiLRC = new LRC({
        lyric: lyricContent,
        lyricTable: $('lrcTable'),
        lyricWrapper: $('lrcWrapper'),
        curRowClassName: 'curRow',
        separator: '\r\n'
    });
    if (uiLRC.IsLyricValid()) {
        timerId = setInterval(function() {
            uiLRC.DoSync(GetCurrentPosition())
        },
        100)
    }
};
function $(elId) {
    return document.getElementById(elId)
}
function GetCurrentPosition() {
    return (myplayer.getCurrentTime())
};
var url = document.location.toString();
var play3g = Request.QueryString("play3g");
var action = Request.QueryString("action");
var fmidshare = Request.QueryString("fmid");
var fmtype = Request.QueryString("fmtype");
if ( !! (document.createElement('audio').canPlayType("audio/mpeg"))) {
    if (play3g == "true") {
        var name = decodeURIComponent(Request.QueryString("name"));
        var hash = Request.QueryString("hash");
        var time;
        Kg.getJSON("../app/i/getSongInfo.php", {
            "hash": hash,
            "cmd": "playInfo"
        },
        function(result) {
            time = result.timeLength
        },
        "", false);
        var outsideSongInfo = {
            "filename": name,
            "hash": hash,
            "timelength": time
        };
        playSong(outsideSongInfo);
        try {
            getSinHead(SINGERHEAD, 52)
        } catch(e) {}
    } else if (action) {
        var filename = unescape(Request.QueryString("filename"));
        var hash = Request.QueryString("hash");
        var time;
        var bitrate;
        var size;
        Kg.getJSON("../app/i/getSongInfo.php", {
            "hash": hash,
            "cmd": "playInfo"
        },
        function(result) {
            time = result.timeLength;
            bitrate = result.bitRate;
            size = result.fileSize
        },
        "", false);
        var shareSong = [{
            "filename": filename,
            "timelength": time,
            "size": size,
            "hash": hash,
            "bitrate": bitrate
        }];
        document.getElementById("playButton").className = "loading gobal_bg";
        myplayer.setSongs(shareSong);
        myplayer.index = 0;
        setTitle("songname");
        if (fmidshare) {
            if (fmtype == 2) {
                fmid = fmidshare;
                playFmSongs(shareSong);
                setTitle("songname")
            }
        }
        document.getElementById("playButton").className = "pause gobal_bg"
    } else {
        var songInfo = [{
            "filename": "听音乐，找酷狗",
            "hash": "0",
            "timelength": "123"
        }];
        addSong(songInfo);
        document.getElementById("playButton").className = "play gobal_bg"
    }
    setPlayProgress();
    document.getElementById("playButton").onclick = function() {
        if (myplayer.getSongsNum() == 1 && myplayer.songs[0].hash == 0) {
            var num = Math.floor(recomData.data.length * Math.random());
            var song = [{
                "filename": recomData.data[num].filename,
                "timelength": recomData.data[num].timelength,
                "size": recomData.data[num].size,
                "hash": recomData.data[num].hash,
                "bitrate": +recomData.data[num].bitrate
            }];
            document.getElementById("playButton").className = "loading gobal_bg";
            document.getElementById("poptips").innerHTML = "随机播放了一首新歌";
            myplayer.setSongs(song);
            myplayer.index = 0;
            setTitle("songname");
            document.getElementById("poptips").style.display = "block";
            setTimeout(function() {
                document.getElementById("poptips").style.display = "none"
            },
            1000)
        }
        if (myplayer.getCurrentTime() != 0) {
            changeButton();
            myplayer.playOrPause()
        }
    };
    document.getElementById("lastButton").onclick = function() {
        myplayer.last();
        playPreSong();
        document.getElementById("playButton").className = "pause gobal_bg";
        setTitle("songname");
        document.getElementById("songTitle").innerHTML = myplayer.songs[myplayer.index].filename;
        showLyrics();
        changeShowSong()
    };
    document.getElementById("nextButton").onclick = function() {
        myplayer.pause();
        playNextSongManual();
        document.getElementById("playButton").className = "pause gobal_bg";
        setTitle("songname");
        document.getElementById("songTitle").innerHTML = myplayer.songs[myplayer.index].filename;
        showLyrics();
        changeShowSong()
    };
    document.getElementById("progressWrap").onclick = function() {
        return false
    };
    document.getElementById("modeButton").onclick = function() {
        if (isPlayRadio == true) {
            document.getElementById("poptips").innerHTML = "播放模式对电台无效！"
        } else {
            if (myplayer.playMode == "order") {
                myplayer.setPlaymode("list");
                document.getElementById("modeButton").className = "modeList";
                document.getElementById("poptips").innerHTML = "列表循环"
            } else if (myplayer.playMode == "list") {
                myplayer.setPlaymode("random");
                document.getElementById("modeButton").className = "modeRandom";
                document.getElementById("poptips").innerHTML = "随机播放"
            } else if (myplayer.playMode == "random") {
                myplayer.setPlaymode("single");
                document.getElementById("modeButton").className = "modeSingle";
                document.getElementById("poptips").innerHTML = "单曲循环"
            } else if (myplayer.playMode == "single") {
                myplayer.setPlaymode("order");
                document.getElementById("modeButton").className = "modeOrder";
                document.getElementById("poptips").innerHTML = "顺序播放"
            }
        }
        document.getElementById("poptips").style.display = "block";
        setTimeout(function() {
            document.getElementById("poptips").style.display = "none"
        },
        1000)
    };
    if (noFix != 1) {
        document.getElementById("playDetail").onclick = function() {
            detailPlay();
            getSinHeadBig(myplayer.getSongs()[myplayer.index].filename.split("-")[0], 400);
            showLyrics()
        }
    }
    if (noFix != 1) {
        document.getElementById("singerHead").onclick = function() {
            getSinHeadBig(myplayer.getSongs()[myplayer.index].filename.split("-")[0], 400);
            detailPlay();
            showLyrics()
        }
    }
    document.getElementById("collect").onclick = function() {
        var songInfo = myplayer.getSongs()[myplayer.index];
        if (songInfo.hash != 0) {
            if (kugouid) {
                Kg.$("#choose_list_box").style.display = "block";
                Kg.$("#shadowDiv").style.display = "block";
                getMyCollection(kugouid)
            } else {
                showLogin()
            }
            collectSongInto = songInfo
        } else {
            alert("当前没有播放歌曲！")
        }
    };
    document.getElementById("download").onclick = function() {
        if (document.getElementById(playerId).src != "http://m.kugou.com/undefined") {
            document.getElementById("download").href = document.getElementById(playerId).src
        }
    };
    document.getElementById("showLisHis").onclick = function() {
        showHisLis(undulpicate(lisdata))
    }
} else {
    document.getElementById("songname").innerHTML = "此手机不支持html5播放，扔了吧";
    document.getElementById("songname").style.color = "#c00"
}

