const fs = require('fs');
const yml = require('js-yaml');
const pdf = require('html-pdf');
const sass = require('node-sass');
const handlebars = require('handlebars');

const htmlString = fs.readFileSync('./index.html', 'utf8');
const data = yml.safeLoad(fs.readFileSync('./index.yml', 'utf8'));
const styles = sass.renderSync({ file: 'index.scss' }).css.toString();

handlebars.registerHelper('stars', (numberOfStars) => {
  return [0, 1, 2, 3, 4].map(i => {
    if (i < numberOfStars) {
      return '<i class="fa fa-star fa-lg"></i>';
    }

    return '<i class="fa fa-star-o fa-lg"></i>'
  }).join('');
});

const html = handlebars.compile(htmlString)({ styles, ...data });

pdf.create(html).toFile('./index.pdf', (err, res) => {
  console.log(`PDF exported to: ${res.filename}`);
});
