const fs = require('fs');
export default function handler(req, res) {
  console.log('log from api', req.body);

  const { code, fileName } = req.body;

  fs.writeFile(`./configFiles/${fileName}.js`, code, (err) => {
    if (err) console.log(err);
    else console.log('File written successfully\n');
  });

  fs.readFile(`./configFiles/${fileName}.js`, 'utf8', (err, data) => {
    if (err) console.log(err);
    res.status(200).send(data);
    console.log('File read🌟', data);
  });
}
