<?php
$rootURL = 'http://m.kugou.com/';
function getCURL($url){
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HEADER, 0);
    curl_setopt($curl, CURLOPT_TIMEOUT, 60);//超时时间
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1); // 302 redirect
    //curl_setopt($curl, CURLOPT_HEADER, 1);
    //curl_setopt($curl, CURLOPT_COOKIE, 'UOR=,open.weibo.com,; SINAGLOBAL=4278528405074.1177.1309500424912; ULV=1309741183318:2:2:1:521572103679.4796.1309741183316:1309500424938; wvr=3; un=test2reg@sina.cn; ALF=1310106051; USRHAJAWB=usrmdins19118; SUE=es%3D71b3f81d79260ac6ee2b9812e3e6613e%26es2%3Dbed6780afb8299fdf0b737e23bf4f505%26ev%3Dv1; SUP=cv%3D1%26bt%3D1309741164%26et%3D1309827564%26uid%3D2193710865%26user%3Dtest2reg.cn%26ag%3D8%26email%3Dtest2reg%2540sina.cn%26nick%3Dtest2reg%26name%3Dtest2reg%2540sina.cn%26sex%3D%26dob%3D%26ps%3D0; SSOLoginState=1309741164; WNP=2193710865%2C123; _s_tentry=login.sina.com.cn; Apache=521572103679.4796.1309741183316'); //cookie
    curl_setopt($curl, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.47 Safari/536.11'); //useragent
    curl_setopt($curl, CURLOPT_REFERER, 'http://m.kugou.com'); //refer
    //curl_setopt($curl, CURLOPT_COOKIEJAR,dirname(__FILE__)."/cookie.txt");//链接完成后保存cookie的文件
    //curl_setopt($curl, CURLOPT_COOKIEFILE,"cookie.txt");//cookie文件
    $data = curl_exec($curl);
    curl_close($curl);
    if ($data)
    return $data;
    else
    return false;
}

extract($_GET);
if(isset($base) && !empty($base) && isset($query) &&!empty($query)){
	echo getCURL($rootURL.$base.'?'.urldecode($query));
}
