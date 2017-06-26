window.lastTimeRecieved = 0;
window.lastData = {
	ambient_temperature: null,
	object_temperature: null,
	humidity: null
};

/** ================ Handlers == */
function nativeDataUpdateHandler(data) {
	// getting data and formatting it to numbers with two digits after separator
	var ambient_temperature = parseFloat(data.ambient_temperature).toFixed(1);
	var	object_temperature = parseFloat(data.object_temperature).toFixed(1);
	var	humidity = parseFloat(data.humidity).toFixed(1);

	// current moment
	var	current_time = new Date().getTime();
	// time passed after we received data last time
	var	interval = current_time - window.lastTimeRecieved;

	if(window.lastTimeRecieved == 0) {
		// if we never received data before
		document.getElementById('intervalValue').textContent = -1;
	} else {
		// otherwise let's show interval
		document.getElementById('intervalValue').textContent = interval;
	}
	// now this moment is out last time
	window.lastTimeRecieved = current_time;

	// if data didn't changed we don't need to bother UI
	if(ambient_temperature != lastData.ambient_temperature) {
		lastData.ambient_temperature = ambient_temperature;
		document.getElementById('ambientTemperatureValue').textContent = ambient_temperature;
	}
	if(object_temperature != lastData.object_temperature) {
		lastData.object_temperature = object_temperature;
		document.getElementById('objectTemperatureValue').textContent = object_temperature;
	}
	if(humidity != lastData.humidity) {
		lastData.humidity = humidity;
		document.getElementById('humidityValue').textContent = humidity;
	}
}
