/* =========== ON PAGE LOAD HANDLER */
document.addEventListener('DOMContentLoaded', function(event) {
	Nexpaq.Header.create('Temperature & Humidity');
});

document.addEventListener('NexpaqAPIReady', function(event) {
	Nexpaq.API.Module.addEventListener('DataReceived', function(event) {
		// we don't care about data not related to our module
		if(event.module_uuid != Nexpaq.Arguments[0]) return;

		if(event.data_source == 'SensorValue') {
			nativeDataUpdateHandler(event.variables);
		}
	});

	Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'StartSensor', []);

	Nexpaq.API.addEventListener('BeforeExit', beforeExitActions);
});

function beforeExitActions() {
	Nexpaq.API.Module.SendCommand(Nexpaq.Arguments[0], 'StopSensor', []);
}