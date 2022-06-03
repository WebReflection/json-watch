# @webreflection/json-watch

[![build status](https://github.com/WebReflection/json-watch/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/json-watch/actions) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/json-watch/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/json-watch?branch=main)

A modern take at this 7yo [json-watch](https://www.npmjs.com/package/json-watch) module.

```js
import watcher from '@webreflection/json-watch';

// returns a Proxy for an arrow function
const json = watcher('/path/to/file.json');
// {"any":"data"} as file content example

// the object reads the file only when accessed
// and only if there were no changes in between reads
json.any === 'data'; // true

// setting arbitrary data is OK too
json.other = 'stuff';

// but no write happens out of the box, however
// it is always possible to save the file again
import {writeFile} from 'node:fs';
writeFile('/path/to/file.json', JSON.stringify(json), _ => {
  // once written, all other watchers will have the latest
  // written version of the JSON object content
  console.log(json.other); // "stuff"
});
```

The default export `watcher(path[, options])` accepts an optional object to configures the `watch(path, options)` node operation.

By default, the `options` object contains `{persistent: false}`. All [options for watch](https://nodejs.org/docs/latest/api/fs.html#fswatchfilename-options-listener) are available.
