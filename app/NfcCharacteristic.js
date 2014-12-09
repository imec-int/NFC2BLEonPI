var util = require('util');
var bleno = require('bleno');

function NfcCharacteristic(pizza) {
  bleno.Characteristic.call(this, {
    uuid: '13333333333333333333333333330002',
    properties: ['read', 'write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Gets or sets NFC ids.'
      })
    ]
  });
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
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG, null);
  }
  else {
    var data = new Buffer(2);
    //data.writeUInt16BE(_VAR_TO_WRITE_TO, 0);
    callback(this.RESULT_SUCCESS, data);
  }
};

module.exports = NfcCharacteristic;