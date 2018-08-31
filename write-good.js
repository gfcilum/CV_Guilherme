const fs = require('fs');
const util = require('util');
const yml = require('js-yaml');
const writeGood = require('write-good');

const data = yml.safeLoad(fs.readFileSync('./index.yml', 'utf8'));

const loopArray = arr => arr.map(_ => suggestions(_));
const loopObject = obj => Object.keys(obj).map(_ => suggestions(obj[_]));

const suggestions = (segment) => {
  if (typeof segment === 'object') {
    return Array.isArray(segment) ? loopArray(segment) : loopObject(segment);
  }

  return writeGood(`${segment}`, { eprime: true });
};

console.log(util.inspect(suggestions(data), false, null));

