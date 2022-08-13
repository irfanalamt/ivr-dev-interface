import figures from '../../figures.json';
const fs = require('fs');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return;
  }

  fs.readFile('figures.json', 'utf8', (err, data) => {
    if (err) {
      console.log(`Error reading file from disk: ${err}`);
      res.send('error');
    } else {
      // parse JSON string to JSON object
      const figuresJson = JSON.parse(data.toString());

      console.log('file READ');
      res.send(figuresJson);
      return;
    }
  });
}
