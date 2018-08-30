const fs = require('fs');
const util = require('util');
const yml = require('js-yaml');
const writeGood = require('write-good');

const data = yml.safeLoad(fs.readFileSync('./index.yml', 'utf8'));

const suggestions = {
  profession: writeGood(data.profession, { eprime: true }),
  nationality: writeGood(data.nationality, { eprime: true }),
  personal_statement: writeGood(data.personal_statement, { eprime: true }),
  employment: data.employment.map(job => ({
    position: writeGood(job.position, { eprime: true }),
    description: writeGood(job.description, { eprime: true }),
  })),
  education: data.education.map(edu => ({
    grade: writeGood(edu.grade, { eprime: true }),
    suject: writeGood(edu.subject, { eprime: true }),
  })),
  skill_types: data.skill_types.map(type => ({
    title: writeGood(type.title, { eprime: true }),
    skills: type.skills.map(skill => writeGood(skill.title, { eprime: true })),
  })),
  volunteering: data.volunteering.map(volunteering => ({
    info: writeGood(volunteering.info, { eprime: true }),
    position: writeGood(volunteering.position, { eprime: true }),
  })),
  others: data.others.map(text => writeGood(text, { eprime: true })),
};

console.log(util.inspect(suggestions, false, null));
