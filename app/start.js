var bleno = require('bleno'),
  NfcService = require('./NfcService');

var primaryService = new NfcService();

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        bleno.startAdvertising('NFC', [primaryService.uuid]);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

    if (!error) {
        bleno.setServices([primaryService]);
    }
});

bleno.on('accept', function(clientAddress){
	console.log('Connected to ' + clientAddress);
});

process.on('SIGINT', function() {
    bleno.stopAdvertising();
    console.log('');
    console.log('stopped advertising');
    process.exit();
});