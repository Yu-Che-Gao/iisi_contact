
<?php
// 設定文件utf-8編碼
header("Content-Type:text/html; charset=utf-8");
header("Access-Control-Allow-Origin: *");
?>
<!doctype html>
<html class="no-js">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Amaze UI Admin table Examples</title>
  <meta name="description" content="这是一个 table 页面">
  <meta name="keywords" content="table">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="renderer" content="webkit">
  <meta http-equiv="Cache-Control" content="no-siteapp" />
  <link rel="icon" type="image/png" href="assets/i/favicon.png">
  <link rel="apple-touch-icon-precomposed" href="assets/i/app-icon72x72@2x.png">
  <meta name="apple-mobile-web-app-title" content="Amaze UI" />
  <link rel="stylesheet" href="assets/css/amazeui.min.css"/>
  <link rel="stylesheet" href="assets/css/admin.css">
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDxG3c1KLC9qOPt_tFddwyqlx90Qz4reAk&signed_in=true" async defer></script>
<script>
var routes = [];
var points = [];
var data =null;
<?php 
@$id = $_GET["uuid"];
@$starttime = $_GET["starttime"];

if(isset($_GET["uuid"]) && @$_GET["uuid"]!="" && isset($_GET["starttime"]) && @$_GET["starttime"]!=""){
	$mysqli = new mysqli('localhost', 'root', '', 'bumpdb');
	$sql = "SELECT `cValue`,`wValue` FROM `compute` WHERE `id`= '$id' AND `starttime`='$starttime'";
	//echo $sql;
	$mysqli -> set_charset("utf8");
	$result = $mysqli -> query($sql);
	$count=0;
	$str_result="";
	$cc=mysqli_num_rows($result);
	if($cc>0){
		echo "var beaches =[";
		while ($row = mysqli_fetch_row($result)) {
		$count++;
			echo "['gug', ".$row[1].", ".$row[0].", ".$count."],";
		}
		echo "];";
	}
	else{
		echo "var beaches=null;;";
	}
}
else{
	echo "var beaches=null;;";
}
// echo "var beaches =[                       
//['Bondi Beach', -33.890542, 151.274856, 4],
//['Coogee Beach', -33.923036, 151.259052, 5],
//['Cronulla Beach', -34.028249, 151.157507, 3],
//['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
//['Maroubra Beach', -33.950198, 151.259302, 1]
//]";
?>

var markers = [];
//loadmarker();
loaddata();
console.log(data);
function setMarkers(map) {
	if(beaches!=null){
	console.log(beaches);
  var image = {
    url: 'http://incredikai.rce.tw/TKU/A031.png',
    origin: new google.maps.Point(0, 0)
  };
  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };
  for (var i = 0; i < beaches.length; i++) {
    var beach = beaches[i];
    var marker = new google.maps.Marker({
      position: {lat: beach[1], lng: beach[2]},
      map: map,
      icon: image,
      title: beach[0],
      zIndex: beach[3]
    });
  }
 }
}
function loadmarker(){
	var orihref =location.href;
	var hrefsparr =orihref.split('?');
	var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 && xhttp.status == 200) {
	     //data = xhttp.responseText; 
	     var orimarkerstr=xhttp.responseText;
	     //console.log(orimarkerstr);
	     var temparr = orimarkerstr.split(',');
	     var temparr2;
	     //console.log(temparr);
	     beaches = new Array(temparr.length);
				for (i=0; i < temparr.length; i++) {		
					//console.log(temparr[i]);			
					temparr2 = temparr[i].split('|');
				   beaches[i] = new Array(temparr2.length-1);
				   for (j=0; j <=temparr2.length; j++) {		
				   	if(j==1||j==2){		   
				      beaches[i][j] = parseFloat(temparr2[j]);
				    }
				    else if(j==3){
				    	beaches[i][j] = parseInt(temparr2[j]);
				    }
				    else{
				    	beaches[i][j] = temparr2[j];
				    }	 
				   }
				}
				}      
	     
//	     initMap();
	     console.log(beaches);
	  };
	  var purl ="http://incredikai.rce.tw/TKU/getmarker.php?"+hrefsparr[1];
	  console.log(purl);
	  xhttp.open("GET", purl, true);
	  xhttp.send();
}
function loaddata() {
	console.log(location.href);
	var orihref =location.href;
	var hrefsparr =orihref.split('?');
	console.log(orihref);
	console.log(hrefsparr);
	if(orihref.length>1){
	  var xhttp = new XMLHttpRequest();
	  xhttp.onreadystatechange = function() {
	    if (xhttp.readyState == 4 && xhttp.status == 200) {
	     //data = xhttp.responseText; 
	     data = JSON.parse(xhttp.responseText);    
	     console.log(data);
	     initMap();
	     
	    }
	  };
	  var purl ="http://incredikai.rce.tw/TKU/getcw.php?"+hrefsparr[1];
	  console.log(purl);
	  xhttp.open("GET", purl, true);
	  xhttp.send();
  }
}
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 5,
  center: {lat: 25.174708, lng: 121.450392}
 });

 var prev = null;
 for (var i=0, cnt=data['results'].length; i<cnt ; ++i) {
  var point = new google.maps.LatLng(data['results'][i]['location'].lat,data['results'][i]['location'].lng);
  points.push({
   location: point,
   stopover: false, // 是否顯示
  });

  // add marker
//if (0) {
// var marker = new google.maps.Marker({
//  map: map,
//  position: point,
// });
//}
setMarkers(map);
  if (prev) {
   // use multiple routes
   routes.push({
    origin: prev,
    destination: point,
    travelMode: google.maps.TravelMode.DRIVING
   });
  }
  prev = point;
 }

 var directionsService = new google.maps.DirectionsService;
 // multiple routes
 // https://developers.google.com/maps/documentation/javascript/directions
 if (0) {
  for (var i=0, cnt=routes.length ; i<cnt ; ++i) {
   console.log(i);
   directionsService.route(routes[i], function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
     var directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true
     });
     directionsDisplay.setMap(map);
     directionsDisplay.setDirections(result);
    }
   } );
  }
 }

 // use multiple stops
 // https://developers.google.com/maps/documentation/javascript/directions#Waypoints
 var max_steps = 36;
 for (var i=0, cnt=points.length; i < cnt ; i += max_steps) {
  var stops = []; // max should be 8
  var next_stop = Math.floor(max_steps / (8-2) );
  for (var j=i+next_stop ; j<(max_steps - next_stop) && j < (cnt - 1) ; j += next_stop)  // 去頭去尾, 頭擺在 origin
   stops.push(points[j]);
  var request = {
   origin: points[i].location,
   destination: i+(max_steps - 1) < cnt ? points[i+max_steps-1].location : points[cnt-1].location,
   waypoints: stops,
   travelMode: google.maps.TravelMode.DRIVING,
  };
  directionsService.route(request, function(result, status) {
   if (status == google.maps.DirectionsStatus.OK) {
    var directionsDisplay = new google.maps.DirectionsRenderer({
     suppressMarkers: true // 單純畫路線，不要顯示 marker
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setDirections(result);
   } else {
    console.log( status ); // OVER_QUERY_LIMIT, MAX_WAYPOINTS_EXCEEDED
   }
  } );
 }

 map.setZoom(5);
// 		xhttp.onreadystatechange = function() {
//	    if (xhttp.readyState == 4 && xhttp.status == 200) {
//	     bumpdata = xhttp.responseText; 
//	     data = JSON.parse(xhttp.responseText);    
//	     console.log(bumpdata);
//	     initMap();
//	     
//	    }
//	  };
//	  var purl ="http://incredikai.rce.tw/TKU/bumpdata.php?uuid=352444060734138&starttime=2016-04-03 00:30:56";
//	  console.log(purl);
//	  xhttp.open("GET", purl, true);
//	  xhttp.send();
   
}
</script>
</head>
<body>
	<div id="map" style="width:100%; height:100%;"></div>
<!--[if lte IE 9]>
<p class="browsehappy">你正在使用<strong>过时</strong>的浏览器，Amaze UI 暂不支持。 请 <a href="http://browsehappy.com/" target="_blank">升级浏览器</a>
  以获得更好的体验！</p>
<![endif]-->

<header class="am-topbar am-topbar-inverse admin-header">
  <div class="am-topbar-brand">
    <strong>道路顛簸偵測系統</strong> <small>	NO bump No danger</small>
  </div>

  <button class="am-topbar-btn am-topbar-toggle am-btn am-btn-sm am-btn-success am-show-sm-only" data-am-collapse="{target: '#topbar-collapse'}"><span class="am-sr-only">导航切换</span> <span class="am-icon-bars"></span></button>

  <div class="am-collapse am-topbar-collapse" id="topbar-collapse">

    <ul class="am-nav am-nav-pills am-topbar-nav am-topbar-right admin-header-list">
      <li class="am-dropdown" data-am-dropdown>
        <a class="am-dropdown-toggle" data-am-dropdown-toggle href="javascript:;">
          <span class="am-icon-users"></span> 管理员 <span class="am-icon-caret-down"></span>
        </a>
        <ul class="am-dropdown-content">
          <li><a href="#"><span class="am-icon-user"></span> 资料</a></li>
          <li><a href="#"><span class="am-icon-cog"></span> 设置</a></li>
          <li><a href="#"><span class="am-icon-power-off"></span> 退出</a></li>
        </ul>
      </li>
      <li class="am-hide-sm-only"><a href="javascript:;" id="admin-fullscreen"><span class="am-icon-arrows-alt"></span> <span class="admin-fullText">开启全屏</span></a></li>
    </ul>
  </div>
</header>

<a href="#" class="am-icon-btn am-icon-th-list am-show-sm-only admin-menu" data-am-offcanvas="{target: '#admin-offcanvas'}"></a>

<footer>
  <hr>
  <p class="am-padding-left">© 2014 AllMobilize, Inc. Licensed under MIT license.</p>
</footer>

<!--[if lt IE 9]>
<script src="http://libs.baidu.com/jquery/1.11.1/jquery.min.js"></script>
<script src="http://cdn.staticfile.org/modernizr/2.8.3/modernizr.js"></script>
<script src="assets/js/amazeui.ie8polyfill.min.js"></script>
<![endif]-->

<!--[if (gte IE 9)|!(IE)]><!-->
<script src="assets/js/jquery.min.js"></script>
<!--<![endif]-->
<script src="assets/js/amazeui.min.js"></script>
<script src="assets/js/app.js"></script>


</body>

</html>
