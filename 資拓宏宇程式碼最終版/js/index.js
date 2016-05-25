function setMyLocation(a, b, c, d, e) {
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
			if (a == 1) {
				xhrView(); // xhr 景點的資料並標點
			}
			if (b == 1) {
				xhrFood(); // xhr食尚玩家的資料並標點
			}
			if (c == 1) {
				xhrMRTxy(); // xhr 捷運出入口的資料並標點
			}
			if (d == 1) {
				xhrBusStopXY(); // xhr 公車站牌的資料並標點
			}
			if (e == 1) {
				xhrUbike(); //xhr Ubike的資料並標點
			}

			if (getUrlGET() != null) {
				let get = getUrlGET();
				let x = get[0];
				let y = get[1];
				let myPosition = [];
				myPosition.push({
					lat: parseFloat(get[0]),
					lng: parseFloat(get[1])
				});

				let image = {
					url: 'images/UBIKE.png',
					origin: new google.maps.Point(0, 0)
				};
				console.log('xxx');
				let a = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				let b = new google.maps.LatLng(get[0], get[1]);

				let xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (xhttp.readyState == 4 && xhttp.status == 200) {
						let response = xhttp.responseText;
						console.log(response);
						let json = mrtXYResponseHandle(xhttp);
						console.log('ddd');
						for (let i = 0; i < json.length; i++) {
							let results = json[i];
							results.latlng = new google.maps.LatLng(json[i]['緯度'], json[i]['經度']);
							results.distance = distHaversine(results.latlng, a);
						}

						console.log('dddd');
						json.sort(function(a, b) {
							if (a.distance == b.distance) return 0;
							return (a.distance > b.distance) ? 1 : -1;
						});

						console.log(json);
						currentMRT.push(json[0]['緯度']);
						currentMRT.push(json[0]['經度']);
						let cMRTLatLng = new google.maps.LatLng(json[0]['緯度'], json[0]['經度']);

						myPosition.push({
							lat: parseFloat(currentMRT[0]),
							lng: parseFloat(currentMRT[1])
						});
						json = mrtXYResponseHandle(xhttp);
						console.log('xxxzzz');
						for (let i = 0; i < json.length; i++) {
							let results = json[i];
							results.latlng = new google.maps.LatLng(results['緯度'], results['經度']);
							results.distance = distHaversine(results.latlng, b);
						}
						json.sort(function(a, b) {
							if (a.distance == b.distance) return 0;
							return (a.distance > b.distance) ? 1 : -1;
						});

						dstMRT.push(json[0]['緯度']);
						dstMRT.push(json[0]['經度']);
						let dMRTLatLng = new google.maps.LatLng(json[0]['緯度'], json[0]['經度']);

						myPosition.push({
							lat: parseFloat(dstMRT[0]),
							lng: parseFloat(dstMRT[1])
						});

						myMarker(map, myPosition, image);

						let start = cMRTLatLng;
						let end = dMRTLatLng;
						var directionsService = new google.maps.DirectionsService();
						var rendererOptions = {
							suppressMarkers: true
						};

						var request = {
							origin: start,
							destination: end,
							travelMode: google.maps.TravelMode.TRANSIT
						};

						directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
						directionsDisplay.setMap(map);
						directionsService.route(request, function(response, status) {
							if (status == google.maps.DirectionsStatus.OK) {
								directionsDisplay.setDirections(response);
							}
						});
					}
				}
				xhttp.open('POST', 'http://rags0830.ddns.net:3000/MRT_xy', true);
				xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoed');
				xhttp.send('');

				//getMRTAndMe(a, b, map, myPosition, image);
			}
		}, function() {
			//do nothing
		});
	}
}

function distHaversine(p1, p2) { //計算兩點距離
	var rad = function(x) {
		return x * Math.PI / 180;
	}
	var R = 6371; // earth's mean radius in km
	var dLat = rad(p2.lat() - p1.lat());
	var dLong = rad(p2.lng() - p1.lng());
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return parseFloat(d.toFixed(3));
}

function getUrlGET() {
	var strUrl = location.search;
	var getPara, latlng;
	var aryPara = [];
	if (strUrl.indexOf("?") != -1) {
		var getSearch = strUrl.split("?");
		getPara = getSearch[1].split("&");
		latlng = [getPara[0].split('=')[1], getPara[1].split('=')[1]];
	}
	return latlng;
}

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
	let cutCount = 0;
	let temp = text.length;
	while (text.substring(temp, temp - 12) != '"act":"1"}}}') {
		temp = temp - 1;
		cutCount++;
	}
	text = text.slice(0, cutCount * (-1));

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