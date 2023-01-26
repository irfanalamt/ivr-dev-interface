const {MongoClient} = require('mongodb');

const client = new MongoClient(process.env.DB_URL);

async function saveProject(req, res) {
  try {
    const {filename, data} = req.body;
    const db = client.db('ivr-dev');
    await db.collection('projects').insertOne({filename, data});
    // fs.writeFileSync(`public/projects/${filename}.ivrf`, data);

    res.status(200).json({message: `File ${filename} written successfully.`});
  } catch (err) {
    res.status(500).json({message: 'Error writing file.', error: err});
  } finally {
    await client.close();
  }
}

export default saveProject;
