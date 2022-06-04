# @webreflection/json-watch

[![build status](https://github.com/WebReflection/json-watch/actions/workflows/node.js.yml/badge.svg)](https://github.com/WebReflection/json-watch/actions) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/json-watch/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/json-watch?branch=main)

<sup>**Social Media Photo by [Andrik Langfield](https://unsplash.com/@andriklangfield) on [Unsplash](https://unsplash.com/)**</sup>

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

The default export `watcher(path[, options])` accepts an optional object to configure the `watch(path, options)` node operation.

By default, the `options` object contains `{persistent: false}`. All [options for watch](https://nodejs.org/docs/latest/api/fs.html#fswatchfilename-options-listener) are available.

## What are the differences compared to the old module?

  * multiple paths can be observerd, not just one per time
  * the first read is lazy
  * Proxy is (imho) a better DX for this kind of utility / use case
  * the amount of consumed memory is fine-tuned to the minumum
  * the JSON can contain single line comments which, even if not allowed by specs, is practical for `settings.json` like config files and entries description (meaning, the `.json` file can also be a parsable `.js` file that preserve other `.json` rules)
  * it has 100% code coverage
  * it's a dual ESM / CJS module
