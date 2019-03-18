var lastTimeRecieved = 0;
var lastData = {
	humidity: null,
	temperature: null,
	pressure: null
};

/* =========== ON PAGE LOAD HANDLER */
document.addEventListener('DOMContentLoaded', function(event) {
	WebViewTileHeader.create('Barometer');
});

document.addEventListener('WebViewApiReady', function(event) {
	Moduware.v0.API.Module.addEventListener('DataReceived', function(event) {
		// we don't care about data not related to our module
		if(event.moduleUuid != Moduware.Arguments.uuid) return;

		if(event.dataSource == 'SensorValue') {
			nativeDataUpdateHandler(event.variables);
		}
	});

	Moduware.v0.API.Module.SendCommand(Moduware.Arguments.uuid, 'StartSensor', []);

	Moduware.v0.API.addEventListener('BeforeExit', beforeExitActions);
});

function beforeExitActions() {
	Moduware.v0.API.Module.SendCommand(Moduware.Arguments.uuid, 'StopSensor', []);
}

/** ================ Handlers == */
function nativeDataUpdateHandler(data) {
	// getting data and formatting it to numbers with two digits after separator
	var	humidity = parseFloat(data.humidity).toFixed(3);
	var temperature = parseFloat(data.temperature).toFixed(2);
	var	pressure = parseFloat(data.pressure).toFixed(2);

	// current moment
	var	current_time = new Date().getTime();
	// time passed after we received data last time
	var	interval = current_time - lastTimeRecieved;

	if(lastTimeRecieved == 0) {
		// if we never received data before
		document.getElementById('intervalValue').textContent = -1;
	} else {
		// otherwise let's show interval
		document.getElementById('intervalValue').textContent = interval;
	}
	// now this moment is out last time
	lastTimeRecieved = current_time;

	// if data didn't changed we don't need to bother UI
	if(humidity != lastData.humidity) {
		lastData.humidity = humidity;
		document.getElementById('humidityValue').textContent = humidity;
	}
	if(temperature != lastData.temperature) {
		lastData.temperature = temperature;
		document.getElementById('temperatureValue').textContent = temperature;
	}
  if(pressure!= lastData.pressure) {
		lastData.pressure = pressure;
		document.getElementById('pressureValue').textContent = pressure;
	}
}
