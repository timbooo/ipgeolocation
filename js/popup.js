function unknown() {
	chrome.browserAction.setIcon({path:'../images/unknown.png'});
	update('ip', '-');
	update('flag', '');
	update('country', '-');
	update('latitude', '-');
	update('longitude', '-');
	update('map', '');
	$('*').show();
	updateVisibilities();
}

function updateVisibilities(){
	if (!JSON.parse(localStorage.showPopupHeader)) {
		$('h1').hide();
	}
	if (!JSON.parse(localStorage.showLatLong)) {
		$('.latlong').hide();
	}
}

function update(id, value) {
	$('#' + id).empty();
	$('#' + id).append(value);
}

function updateCountryIcon() {
	chrome.browserAction.setIcon({path:'../images/loading.png'});
	$('*').hide();
	$.ajax({
		url: 'http://jsonip.com/',
		dataType: 'json',
	    cache: false,
	    timeout: 5000,
		success: function(data){
			update('ip', data.ip);			
			$.ajax({
				url: 'http://freegeoip.net/json/' + data.ip,
				dataType: 'json',
			    cache: false,
			    timeout: 5000,
				success: function(data){
					chrome.browserAction.setIcon({path:'../images/countries/' + data.country_code.toLowerCase() + '.png'});
					update('country', data.country_name);
					update('flag', '<img src="../images/countries/' + data.country_code.toLowerCase() + '.png"/>');
					if (JSON.parse(localStorage.showMap)) {
						var latlng = data.latitude + ',' + data.longitude;
						var mapurl = 'https://maps.google.com/maps/api/staticmap?center=' + latlng + '&zoom=' + localStorage.mapZoom + '&maptype=' + localStorage.mapType + '&markers=' + latlng + '&size=300x200&sensor=false';
						update('map', '<img src="' + mapurl + '"/>');
					} else {
						update('map', '');
					} 
					if (JSON.parse(localStorage.showLatLong)) {
						update('latitude', data.latitude);
						update('longitude', data.longitude);
					} 
					$('*').show();
					updateVisibilities();
				},
				error: unknown
			});
		},
		error: unknown
	});
}

function init(param, val) {
	var value = localStorage[param];
	if (!value) {
		localStorage[param] = val;
	}
}

window.addEventListener('load', function() {
	init('showPopupHeader', true);
	init('showMap', true);
	init('showLatLong', false);
	init('mapZoom', '8');
	init('mapType', 'hybrid');
	updateCountryIcon();
	document.querySelector('#options').addEventListener('click', function() { chrome.tabs.create({url: "html/options.html"}); });	
});