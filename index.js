const fs = require('fs');
const pdf = require('html-pdf');
const handlebars = require('handlebars');

handlebars.registerHelper('stars', (numberOfStars) => {
  const output = [];

  for (let i = 0; i < 5; i++) {
    if (i < numberOfStars) {
      output.push('<i class="fa fa-star fa-lg"></i>');
    }
    else {
      output.push('<i class="fa fa-star-o fa-lg"></i>');
    }
  }

  return output.join('');
});

const data = require('./data');
const styles = fs.readFileSync('./index.css', 'utf8');
const htmlString = fs.readFileSync('./index.html', 'utf8');
const html = handlebars.compile(htmlString)({ styles, ...data });

pdf.create(html).toFile('./index.pdf', (err, res) => {
  console.log(`PDF exported to: ${res.filename}`);
});
