#!/usr/bin/env node
const { printData } = require('./utils/print')

function isTrue(value) {
  return !!value && value !== "0" && value !== "false"
}

var envDisable = isTrue(process.env.DISABLE_CONTROLLA) || isTrue(process.env.CI);
var logLevel = process.env.npm_config_loglevel;
var logLevelDisplay = ['silent', 'error', 'warn'].indexOf(logLevel) > -1;


if (!envDisable && !logLevelDisplay) {
  var pkg = require(require('path').resolve('./package.json'));
  printData(pkg)
}
