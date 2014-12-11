var util = require('util'),
  bleno = require('bleno'),
  BlenoPrimaryService = bleno.PrimaryService,
  NfcCharacteristic = require('./NfcCharacteristic');

function NfcService() {
  NfcService.super_.call(this, {
      uuid: '13333333333333333333333333333337',
      characteristics: [
          new NfcCharacteristic()
      ]
  });
}

util.inherits(NfcService, BlenoPrimaryService);

module.exports = NfcService;