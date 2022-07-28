const fs = require('fs');
async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  const { msg } = req.body;
  console.log(msg);
  fs.writeFile('figures.json', msg, (err) => {
    if (err) console.log(err);
    else {
      console.log('File written successfully\n');
      console.log('The written has the following contents:');
      console.log(fs.readFileSync('figures.json', 'utf8'));
    }
  });

  res.status(201).send({
    message: 'figures saved!',
  });
  return;
}

export default handler;
