const fs = require('fs');
const util = require('util');
const path = require('path');
const yml = require('js-yaml');
const Nodehun = require('nodehun');
const spellcheck = require('nodehun-sentences');

const words = require('./words');
const data = yml.safeLoad(fs.readFileSync('./index.yml', 'utf8'));

const dictionaryPath = path.join(
  __dirname,
  'node_modules',
  'dictionary-en-gb'
);

const hunspell = new Nodehun(
  fs.readFileSync(path.join(dictionaryPath, 'index.aff')),
  fs.readFileSync(path.join(dictionaryPath, 'index.dic'))
);

const spellchecker = (text) => {
  return new Promise((resolve, reject) => {
    spellcheck(hunspell, text, (err, typos) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(typos);
      }
    });
  });
};

const addWords = (words) => {
  const promises = [];

  for (let i = 0; i < words.length; i++) {
    promises.push(new Promise((resolve, reject) => {
      hunspell.addWord(words[i], (err, word) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(word);
        }
      });
    }));
  }

  return Promise.all(promises);
};

const loopObject = async (data) => {
  const res = {};
  const keys = Object.keys(data);

  for (let i = 0; i < keys.length; i++) {
    res[keys[i]] = await suggestions(data[keys[i]]);
  }

  return res;
};

const loopArray = async (data) => {
  const res = [];

  for (let i = 0; i < data.length; i++) {
    res.push(await suggestions(data[i]));
  }

  return res;
};

const suggestions = async (data) => {
  if (typeof data === 'object') {
    return Array.isArray(data) ? await loopArray(data) : await loopObject(data);
  }

  return await spellchecker(data);
};

(async () => {
  await addWords(words);
  console.log(util.inspect(await suggestions(data), false, null));
})();
