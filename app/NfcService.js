var util = require('util'),
  bleno = require('bleno'),
  BlenoPrimaryService = bleno.PrimaryService,
  NfcCharacteristic = require('./NfcCharacteristic');

function NfcService() {
  NfcService.super_.call(this, {
      uuid: '0x2220',
      characteristics: [
          new NfcCharacteristic()
      ]
  });
}

util.inherits(NfcService, BlenoPrimaryService);

module.exports = NfcService;