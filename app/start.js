var bleno = require('bleno'),
  NfcService = require('./NfcService');


////////////////////////////////////
//          BLE CLIENT
////////////////////////////////////

var primaryService = new NfcService(this);

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);

    if (state === 'poweredOn') {
        bleno.startAdvertising('woopiNFCreader', [primaryService.uuid]);
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



// PythonShell.run('read.py', pyOptions, function (err, results) {
//   if (err) throw err;
//   // results is an array consisting of messages collected during execution
//   console.log('results: %j', results);
// });