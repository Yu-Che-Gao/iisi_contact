var map = null;

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

			//			xhrUbike(); //xhr Ubike的資料並標點
			//			xhrView(); // xhr 景點的資料並標點
			//			xhrMRTxy(); // xhr 捷運出入口的資料並標點
			xhrBusStopXY(); //xhr 公車站牌資料
			//			xhrFood(); //xhr 食尚玩家資料

		}, function() {});
	}
}

function xhrFood() { //取得食尚玩家資料
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			let rawData = xhttp.responseText;
			let myPosition = getFoodPosition(xhttp, rawData);
			console.log(myPosition);
			myMarker(map, myPosition);
		}
	};
	xhttp.open('POST', 'http://rags0830.ddns.net:3000/food', true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp.send('');
}

function xhrUbike() { //取得Ubike資料
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			let rawData = xhttp.responseText;
			let myPosition = getUbikePosition(xhttp, rawData);
			myMarker(map, myPosition);
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
			myMarker(map, myPosition);
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
			myMarker(map, myPosition);
		}
	}
	xhttp.open('POST', 'http://rags0830.ddns.net:3000/MRT_xy', true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoed');
	xhttp.send('');
}

function xhrBusStopXY() {
	let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			let rawData = xhttp.responseText;
			let myPosition = getBusXY(xhttp, rawData);
			myMarker(map, myPosition);
		}
	}
	xhttp.open('POST', 'http://rags0830.ddns.net:3000/Bus_xy', true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoed');
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

function foodResponseHandle(xhttp) {
	let response = xhttp.responseText;
	let json = JSON.parse(response);
	return json;
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

function myMarker(map, positionArray) { //mark所有座標
	for (let i = 0; i < positionArray.length; i++) {
		var marker = new google.maps.Marker({
			position: positionArray[i],
			map: map
		});
	}
}

function fixUbikeJsonText(text) { //修正Ubike可能的錯誤
	let cutCount = 0;
	let temp = text.length;
	while (text.substring(temp, temp - 12) != '"act":"1"}}}') {
		temp = temp - 1;
		cutCount++;
	}
	text = text.slice(0, cutCount * (-1));
	return text;
}

function fixMRTxy(text) { //修正捷運資料發生的錯誤
	while (text.substr(-1) != ',') {
		text = text.slice(0, -1);
	}

	text = text.slice(0, -1);
	return text + ']';
}

function fixBusXY(text) { //修正公車站牌資料的錯誤
	text = text.replace(',"version":null', '');
	return text;
}

function padLeft(str, lenght) { //補0函數
	if (str.length >= lenght)
		return str;
	else
		return padLeft("0" + str, lenght);
}