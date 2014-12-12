var util = require('util');
var bleno = require('bleno');
var py = require('python-shell');
var Gpio = require('onoff').Gpio,
    g = new Gpio(16, 'out'),
    b = new Gpio(20, 'out'),
    r = new Gpio(21, 'out');

var pyOptions = {
  mode: 'text',
  pythonOptions: ['-u'],
  scriptPath: '../python'
};

var foundId = "1234";

var self;

function NfcCharacteristic() {
  bleno.Characteristic.call(this, {
    uuid: '0x2221',
    properties: ['notify'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2221',
        value: 'Gets or sets NFC ids.'
      })
    ]
  });
  self = this;
}

util.inherits(NfcCharacteristic, bleno.Characteristic);

NfcCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG);
  }
  else if (data.length !== 2) {
    callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
  }
  else {
    console.log(data.readUInt16BE(0));
    callback(this.RESULT_SUCCESS);
  }
};

NfcCharacteristic.prototype.onReadRequest = function(offset, callback) {
  // if (offset) {
  //   callback(this.RESULT_ATTR_NOT_LONG, null);
  // }
  // else {
    //var data = new Buffer(2);
    //data.writeUInt16BE(foun, 0);
    console.log("Read: ",foundId);
    var data = new Buffer(foundId, "hex")
    callback(this.RESULT_SUCCESS, data);
  // }
};

////////////////////////////////////
//          LEDS
////////////////////////////////////

function lightUp(led){
  // turn on LED
  led.writeSync(1);
  // turn off LED after 100ms
  setTimeout(function(){
    led.writeSync(0);
  }, 300);
  // turn on LED after 100ms
  setTimeout(function(){ led.writeSync(1); }, 500);
  // turn off LED after 100ms
  setTimeout(function(){ led.writeSync(0); }, 1200);
}

function ledOnID(id){
  if(id == "0483A7AAF52680"){
    // Fire
    lightUp(r);
  }else if(id == "04B1A7AAF52680"){
    // Cano
    lightUp(b);
  }else if(id == "04904BAAF52680"){
    // Banana
    lightUp(g);
  }
}

////////////////////////////////////
//          NFC shield
////////////////////////////////////

nfcPy = new py('read.py',pyOptions);

nfcPy.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
  if(message && message.substr(0,2) == "ID"){
    var newId = message.substr(3);
    console.log("ID",newId);
    foundId = newId;
    ledOnID(newId);
    if (self.updateValueCallback) {
      console.log("notify ",newId);
      var data = new Buffer(newId, "hex")
      self.updateValueCallback(data);
    }
  }
  //foundId = message;
});

nfcPy.end(function (err) {
  if (err) throw err;
  console.log('Python NFC finished');
});


module.exports = NfcCharacteristic;