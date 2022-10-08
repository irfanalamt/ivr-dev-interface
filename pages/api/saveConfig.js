const fs = require('fs');
export default function handler(req, res) {
  console.log('log from api', req.body);

  const { code, fileName } = req.body;

  fs.writeFile(`./configFiles/${fileName}.js`, code, (err) => {
    if (err) console.log(err);
    else console.log('File written successfully\n');
  });
  res.status(200).json({ message: 'YOU are awesome. ✨' });
}
