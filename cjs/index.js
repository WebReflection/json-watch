'use strict';
/*! (c) Andrea Giammarchi - ISC */
const {watch, readFileSync} = require('node:fs');

const {parse} = JSON;
const {assign} = Object;
const {ownKeys} = Reflect;

const handler = {
  deleteProperty: ($, key) => (delete $()[key]),
  get: ($, key) => (key === 'toJSON' ? $ : $()[key]),
  has: ($, key) => (key in $()),
  ownKeys: ($) => ownKeys($()),
  set: ($, key, value) => {
    $()[key] = value;
    return true;
  }
};

/**
 * Returns a Proxy of a callback with lazy synchronous JSON parsing.
 * The callback is used to keep the state of the file in sync with
 * its state on the disk.
 * @param {string} path the `*.json` file to parse and watch.
 * @param {object} [options={persistent: false}] the optional
 * `fs.watch(path, options)` object.
 * @returns {Proxy<function>}
 */
module.exports = (path, options) => {
  let json;
  watch(path, assign({persistent: false}, options), () => { json = void 0; });
  return new Proxy(
    () => (json === void 0 ? (json = parse(readFileSync(path))) : json),
    handler
  );
};
