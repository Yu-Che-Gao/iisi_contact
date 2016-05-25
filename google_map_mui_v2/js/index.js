var map = null;
var makercategory = ['MRT', 'BUS', 'FOOD', 'VIEW', 'UBIKE'];

function setMyLocation() {

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			map = new google.maps.Map(document.getElementById('map'), {
				center: pos,
				zoom: 15
			});
			var infoWindow = new google.maps.InfoWindow({
				map: map
			});
			infoWindow.setPosition(pos);
			infoWindow.setContent('我現在在這裡!!');
			map.setCenter(pos);

			var rendererOptions = {
				suppressMarkers: true
			};
			var directionsService = new google.maps.DirectionsService();
			directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
			directionsDisplay.setMap(map);
			let start = new google.maps.LatLng(24.226845, 120.685009);
			let end = new google.maps.LatLng(24.12, 120.68);
			let arrPoint = [new google.maps.LatLng(24.136845, 120.685009), new google.maps.LatLng(24.136845, 120.75009)]
			let waypts = [];
			for (var i = 0; i < arrPoint.length; i++) {
				waypts.push({
					location: arrPoint[i],
					stopover: true
				});
			}

			//規畫路徑請求
			var request = {
				origin: start,
				destination: end,
				waypoints: waypts,
				optimizeWaypoints: true,
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			};

			directionsService.route(request, function(response, status) {
				//規畫路徑回傳結果
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
				}
			});

			//			xhrUbike(); //xhr Ubike的資料並標點
			//			xhrView(); // xhr 景點的資料並標點
			//			xhrMRTxy(); // xhr 捷運出入口的資料並標點
			//			xhrBusStopXY();// xhr 公車站牌的資料並標點
			//			xhrFood();// xhr食尚玩家的資料並標點
		}, function() {
			//do nothing
		});
	}
}
//var filterMarkers = function (category) {
//  for (i = 0; i < markers1.length; i++) {
//      marker = gmarkers1[i];
//      // If is same category or category not picked
//      if (marker.category == category || category.length === 0) {
//          marker.setVisible(true);
//      }
//      // Categories don't match 
//      else {
//          marker.setVisible(false);
//      }
//  }
//};
function xhrUbike() { //取得Ubike資料
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			let rawData = xhttp.responseText;
			let myPosition = getUbikePosition(xhttp, rawData);
			let image = {
				url: 'images/UBIKE.png',
				origin: new google.maps.Point(0, 0)
			};
			//			let category=makercategory[4];,category
			myMarker(map, myPosition, image);
		}
	};
	xhttp.open('POST', 'http://rags0830.ddns.net:3000/ubike', true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp.send('');
}

function xhrView() { //取得景點資料
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			let rawData = xhttp.responseText;
			let myPosition = getViewPosition(xhttp);
			let image = {
				url: 'images/view.png',
				origin: new google.maps.Point(0, 0)
			};
			//			let category=makercategory[3];,category
			myMarker(map, myPosition, image);
		}
	}
	xhttp.open('POST', 'http://rags0830.ddns.net:3000/view', true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoed');
	xhttp.send('');
}

function xhrMRTxy() { //取得捷運站資料
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			let rawData = xhttp.responseText;
			let myPosition = getMRTxy(xhttp);
			let image = {
				url: 'images/MRT.png',
				origin: new google.maps.Point(0, 0)
			};
			//			let category=makercategory[0];,category
			myMarker(map, myPosition, image);
		}
	}
	xhttp.open('POST', 'http://rags0830.ddns.net:3000/MRT_xy', true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoed');
	xhttp.send('');
}

function xhrBusStopXY() {
	console.log('xhrBusStopXY');
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			let rawData = xhttp.responseText;
			let myPosition = getBusXY(xhttp, rawData);
			let image = {
				url: 'images/BUS.png',
				origin: new google.maps.Point(0, 0)
			};
			myMarker(map, myPosition, image);
		}
	}
	xhttp.open('POST', 'http://rags0830.ddns.net:3000/Bus_xy', true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoed');
	xhttp.send('');
}

function xhrFood() { //取得食尚玩家資料
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			let rawData = xhttp.responseText;
			let myPosition = getFoodPosition(xhttp, rawData);
			console.log(myPosition);
			let image = {
				url: 'images/FOOD.png',
				origin: new google.maps.Point(0, 0)
			};
			myMarker(map, myPosition, image);
		}
	};
	xhttp.open('POST', 'http://rags0830.ddns.net:3000/food', true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp.send('');
}

function getFoodPosition(xhttp, rawData) {
	let json = foodResponseHandle(xhttp);
	let text = [];
	for (let i = 0; i < json.length; i++) {
		text.push({
			lat: parseFloat(json[i].lat),
			lng: parseFloat(json[i].lon)
		});
	}
	return text;
}

function foodResponseHandle(xhttp) {
	let response = xhttp.responseText;
	let json = JSON.parse(response);
	return json;
}

function getBusXY(xhttp, rawData) {
	let json = busXYResponseHandle(xhttp);
	let text = [];
	for (let i = 0; i < json.BusInfo.length; i++) {
		text.push({
			lat: parseFloat(json.BusInfo[i].lat),
			lng: parseFloat(json.BusInfo[i].lon)
		});
	}
	return text;
}

function busXYResponseHandle(xhttp) {
	let response = xhttp.responseText;
	response = fixBusXY(response);
	let json = JSON.parse(response);
	return json;
}

function fixBusXY(text) { //修正公車站牌資料的錯誤
	text = text.replace(',"version":null', '');
	return text;
}

function getUbikePosition(xhttp, rawData) { //設定座標
	let json = UbikeResponseHandle(xhttp);
	let text = [];
	for (let i = 1; i <= 255; i++) {
		try {
			text.push({
				lat: parseFloat(json.retVal[padLeft(i, 4)].lat),
				lng: parseFloat(json.retVal[padLeft(i, 4)].lng)
			});
		} catch (e) {}
	}
	return text;
}

function getViewPosition(xhttp, rawData) {
	let json = viewResponseHandle(xhttp);
	let text = [];
	for (let i = 0; i < json.result.results.length; i++) {
		text.push({
			lat: parseFloat(json.result.results[i].latitude),
			lng: parseFloat(json.result.results[i].longitude)
		});
	}
	return text;
}

function getMRTxy(xhttp, rawData) {
	let json = mrtXYResponseHandle(xhttp);
	let text = [];
	for (let i = 0; i < json.length; i++) {
		text.push({
			lat: parseFloat(json[i]['緯度']),
			lng: parseFloat(json[i]['經度'])
		});
	}
	return text;
}

function UbikeResponseHandle(xhttp) {
	let response = xhttp.responseText;
	let responseFix = fixUbikeJsonText(response);
	let json = JSON.parse(responseFix);
	return json;
}

function viewResponseHandle(xhttp) {
	let response = xhttp.responseText;
	let json = JSON.parse(response);
	return json;
}

function mrtXYResponseHandle(xhttp) {
	let response = xhttp.responseText;
	response = fixMRTxy(response);
	let json = JSON.parse(response);
	return json;
}

function busXYResponseHandle(xhttp) {
	let response = xhttp.responseText;
	response = fixBusXY(response);
	let json = JSON.parse(response);
	return json;
}
//,category
function myMarker(map, positionArray, image) { //mark所有座標

	for (let i = 0; i < positionArray.length; i++) {
		var marker = new google.maps.Marker({
			position: positionArray[i],
			map: map,
			icon: image
		});
	}
}

function fixUbikeJsonText(text) { //修正Ubike可能的錯誤
	console.log(text);
	let cutCount = 0;
	let temp = text.length;
	while (text.substring(temp, temp - 12) != '"act":"1"}}}') {
		temp = temp - 1;
		cutCount++;
	}
	if (text.substring(temp, temp - 12) != '"act":"1"}}}') {
		text = text.slice(0, cutCount * (-1));
	}

	return text;
}

function fixMRTxy(text) {
	while (text.substr(-1) != ',') {
		text = text.slice(0, -1);
	}

	text = text.slice(0, -1);
	return text + ']';
}

function padLeft(str, lenght) { //補0函數
	if (str.length >= lenght)
		return str;
	else
		return padLeft("0" + str, lenght);
}