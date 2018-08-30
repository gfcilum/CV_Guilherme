const fs = require('fs');
const util = require('util');
const path = require('path');
const yml = require('js-yaml');
const Nodehun = require('nodehun');
const spellcheck = require('nodehun-sentences');

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

const spellChecker = (text) => {
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

const spellCheckJobs = async (jobs) => {
  const res = [];

  for (let i = 0; i < jobs.length; i++) {
    res.push({
      position: await spellChecker(jobs[i].position),
      description: await spellChecker(jobs[i].description),
    });
  }

  return res;
};

const spellCheckEdu = async (edu) => {
  const res = [];

  for (let i = 0; i < edu.length; i++) {
    res.push({
      grade: await spellChecker(edu[i].grade),
      subject: await spellChecker(edu[i].subject),
    });
  }

  return res;
};

const spellCheckSkills = async (skills) => {
  const res = [];

  for (let i = 0; i < skills.length; i++) {
    res.push({
      title: await spellChecker(skills[i].title),
      skills: await spellChecker(skills[i].skills.map(_ => _.title).join(', ')),
    });
  }

  return res;
};

const spellCheckVolunteering = async (volunteering) => {
  const res = [];

  for (let i = 0; i < volunteering.length; i++) {
    res.push({
      info: await spellChecker(volunteering[i].info),
      position: await spellChecker(volunteering[i].position),
    });
  }

  return res;
};

const res = async () => ({
  profession: await spellChecker(data.profession),
  nationality: await spellChecker(data.nationality),
  personal_statement: await spellChecker(data.personal_statement),
  employment: await spellCheckJobs(data.employment),
  education: await spellCheckEdu(data.education),
  skill_types: await spellCheckSkills(data.skill_types),
  volunteering: await spellCheckVolunteering(data.volunteering),
  others: await spellChecker(data.others.join(', ')),
});

(async () => {
  await addWords([
    'B.Eng.',
  ]);

  console.log(util.inspect(await res(), false, null));
})();
