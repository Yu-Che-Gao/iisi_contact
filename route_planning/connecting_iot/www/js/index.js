var myApp = new Framework7();
var $$ = Dom7;
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

document.addEventListener('deviceready', onDeviceReady.bind(this), false);
$$(document).on('pageInit', function (e) {
    let page = e.detail.page;
    if (page.name === 'route_planning') {
        $$('.start-planning').on('click', function () {
            myApp.confirm('是否確認開始路徑規劃', '確認', function () {
                showLocalNotification('效果', '開始進行路徑規劃');
                getPicturesLocation();
            });
        });
    }
});

function showLocalNotification(titleText, messageText) {
    myApp.addNotification({
        title: titleText,
        message: messageText
    });
}

function onDeviceReady() {
    document.addEventListener('backbutton', onBackKeyDown, false);
};

function onBackKeyDown() {
    mainView.router.back();
}

var Latitude = undefined;
var Longitude = undefined;

// Get geo coordinates

function getPicturesLocation() {
    showLocalNotification('function', 'getPicturesLocation');
    navigator.geolocation.getCurrentPosition(onPicturesSuccess, onPicturesError, { enableHighAccuracy: true });
}

// Success callback for get geo coordinates

var onPicturesSuccess = function (position) {

    showLocalNotification('function', 'onPicturesSuccess');
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;

    getPictures(Latitude, Longitude);
}

// Get pictures by using coordinates

function getPictures(latitude, longitude) {
    document.getElementsByClassName('google-map')[0].innerHTML = '';
    showLocalNotification('lat', latitude);
    showLocalNotification('lon', longitude);
    var queryString = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ebe93f635a7b9325485f6a5f87fca3b2&lat=' + latitude + '&lon=' + longitude + '&format=json&jsoncallback=?';
    let url = 'https://api.flickr.com/services/rest/';
    let jsonData = { method: 'flickr.photos.search', api_key: 'ebe93f635a7b9325485f6a5f87fca3b2', lat: latitude, lon: longitude };
    showLocalNotification('function', 'getJsonStarting');
    //$$.get(url, { method: 'flickr.photos.search', api_key: 'ebe93f635a7b9325485f6a5f87fca3b2', lat:latitude, lon:longitude, format:'json', jsoncallback:'?'}, function (results) {
    //    showLocalNotification('getPictures', 'getJson');

    //    //$$.each(results.photos.photo, function (index, item) {
    //    //    var photoURL = "http://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + "_m.jpg";
    //    //    $$('.google-map').append($("<img />").attr("src", photoURL));
    //    //    showLocalNotification('函式', '進入getPictures');
    //    //    document.getElementsByClassName('google-map')[0].innerHTML = '<img src="' + photoURL + '" />';
    //    //    showLocalNotification('getPictures', 'each');
    //    //});
    //}
    //);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            showLocalNotification('gpgp', 'success');
        }
    };
    xhttp.open("GET", "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ebe93f635a7b9325485f6a5f87fca3b2&lat=24&lon=120&format=json&jsoncallback=?", true);
    xhttp.send();


    showLocalNotification('function', 'getJson');
}

// Success callback for watching your changing position

var onPicturesWatchSuccess = function (position) {

    var updatedLatitude = position.coords.latitude;
    var updatedLongitude = position.coords.longitude;

    if (updatedLatitude != Latitude && updatedLongitude != Longitude) {

        Latitude = updatedLatitude;
        Longitude = updatedLongitude;

        getPictures(updatedLatitude, updatedLongitude);
    }
}

// Error callback

function onPicturesError(error) {
    showLocalNotification('onPicturesError', 'code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

// Watch your changing position

function watchPicturePosition() {

    return navigator.geolocation.watchPosition
    (onPicturesWatchSuccess, onPicturesError, { enableHighAccuracy: true });
}

