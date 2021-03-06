const {join} = require('node:path');
const {writeFile} = require('node:fs');
const watch = require('../cjs');

const file =join(__dirname, 'index.json');
let json = watch(file);

console.assert('test' in json);
console.assert(!('length' in json));
console.assert(JSON.stringify(Reflect.ownKeys(json)) === '["test"]');
console.assert(json().hasOwnProperty('test'));

console.assert(json.test === 123);
console.assert(JSON.stringify(json) === '{"test":123}');
writeFile(file, '// this is ignored\n{"test":456}', err => {
  console.assert(err === null);
  console.assert(json.test === 456);
  writeFile(file, '// this is ignored\n{"test":123}', err => {
    console.assert(err === null);
    console.assert(json.test === 123);
    json.test = 456;
    console.assert(json.test === 456);
    console.assert(delete json.test);
    console.assert(!json.test);
    const ac = new AbortController;
    const {signal} = ac;
    json = watch(file, {persistent: true, signal});
    console.log('\x1b[1mPersistent\x1b[0m', JSON.stringify(json));
    setTimeout(ac.abort.bind(ac), 250);
  });
});
