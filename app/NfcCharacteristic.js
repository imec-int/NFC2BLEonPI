var util = require('util');
var bleno = require('bleno');
var py = require('python-shell');

var pyOptions = {
  mode: 'text',
  pythonOptions: ['-u'],
  scriptPath: '../python'
};

var foundId = "1234";

var self;

function NfcCharacteristic() {
  bleno.Characteristic.call(this, {
    uuid: '13333333333333333333333333330003',
    properties: ['notify'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2902',
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