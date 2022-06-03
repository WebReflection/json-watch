const {join} = require('node:path');
const {writeFile} = require('node:fs');
const watch = require('../cjs');

const file =join(__dirname, 'index.json');
const json = watch(file);

console.assert('test' in json);
console.assert(!('length' in json));
console.assert(JSON.stringify(Reflect.ownKeys(json)) === '["test"]');
console.assert(json().hasOwnProperty('test'));

console.assert(json.test === 123);
writeFile(file, '{"test":456}', err => {
  console.assert(err === null);
  console.assert(json.test === 456);
  writeFile(file, '{"test":123}', err => {
    console.assert(err === null);
    console.assert(json.test === 123);
    json.test = 456;
    console.assert(json.test === 456);
  });
});
