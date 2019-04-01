var PSL = 1013.25; // Pressure at sea level hPa
var TSL = 288.15; // Temperature at sea level Kelvin
var TLR = 0.0065; // Temperature Lapse rate K/m
var IGC = 8.3144598; // Ideal gas constant J/(mol K)
var g = 9.80665; // gravitational acceleration m/s2
var MDA = 0.028964; // molar mass of dry air kg/mol
var MW = 0.018; // molar mass of water vapor

var lastTimeRecieved = 0;
// var lastData = {
// 	humidity: null,
// 	temperature: null,
// 	pressure: null
// };

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

function calculateDensityAltitude(barometricPressure, outsideTemperature) {
  return 44330.7692 * (1 - Math.pow((barometricPressure/PSL) / (outsideTemperature/TSL), 0.235));
  //return (TSL/TLR) * (1 - Math.pow((barometricPressure/PSL) / (outsideTemperature/TSL), (TLR*IGC) / (g*MDA - TLR*IGC)));
}

function calculateAltimeter(pressure, temperature, humidity) {
  return ((IGC * temperature) / (g * (MDA * (humidity / 100) + MW * (1 - humidity)))) * Math.log(PSL / pressure);
}

/** ================ Handlers == */
function nativeDataUpdateHandler(data) {
	// getting data and formatting it to numbers with two digits after separator
  var fHumidity = parseFloat(data.humidity);
	var	humidity = fHumidity.toFixed(3);
  var fTemperature = parseFloat(data.temperature);
	var temperature = fTemperature.toFixed(2);
  var fPressure = parseFloat(data.pressure);
	var	pressure = fPressure.toFixed(2);
  var altitude = calculateDensityAltitude(fPressure, fTemperature + 273.15);
  var altimeter = calculateAltimeter(fPressure, fTemperature + 273.15, fHumidity);

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
  // if(humidity != lastData.humidity) {
	// 	lastData.humidity = humidity;
		document.getElementById('humidityValue').textContent = humidity;
  // }
  // if(temperature != lastData.temperature) {
	// 	lastData.temperature = temperature;
		document.getElementById('temperatureValue').textContent = temperature;
  // }
  // if(pressure!= lastData.pressure) {
	// 	lastData.pressure = pressure;
		document.getElementById('pressureValue').textContent = pressure;
  // }
  document.getElementById('altitudeValue').textContent = altitude.toFixed(2);
  document.getElementById('altimeterValue').textContent = altimeter.toFixed(2);
}
