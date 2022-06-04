/*! (c) Andrea Giammarchi - ISC */
import {watch, readFileSync} from 'node:fs';

const VOID = void 0;

const {parse} = JSON;
const {assign} = Object;
const {ownKeys} = Reflect;
const {replace} = String.prototype;

const handler = {
  deleteProperty: ($, key) => (delete $()[key]),
  get: ($, key) => (key === 'toJSON' ? $ : $()[key]),
  has: ($, key) => (key in $()),
  ownKeys: $ => ownKeys($()),
  set: ($, key, value) => (($()[key] = value), true)
};

const asJSON = path => parse(
  replace.call(readFileSync(path), /^\s*\/\/.*/gm, '')
);

/**
 * Returns a Proxy of a callback with lazy synchronous JSON parsing.
 * The callback is used to keep the state of the file in sync with
 * its state on the disk.
 * @param {string} path the `*.json` file to parse and watch.
 * @param {object} [options={persistent: false}] the optional
 * `fs.watch(path, options)` object.
 * @returns {Proxy<function>}
 */
export default (path, options) => {
  let $;
  watch(path, assign({persistent: false}, options), () => { $ = VOID; });
  return new Proxy(() => ($ === VOID ? ($ = asJSON(path)) : $), handler);
};
