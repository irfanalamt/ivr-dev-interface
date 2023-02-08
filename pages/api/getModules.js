const {MongoClient} = require('mongodb');

const client = new MongoClient(process.env.DB_URL);

async function getModules(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({message: 'Method not allowed'});
    return;
  }

  try {
    await client.connect();

    const db = client.db('ivr-dev');
    const projects = await db
      .collection('modules')
      .find({}, {projection: {filename: 1}})
      .toArray();
    const fileNames = projects.map(({filename}) => filename);

    res.status(200).json(fileNames);
  } catch (err) {
    res.status(500).json({message: 'Error fetching modules.', error: err});
  } finally {
    await client.close();
  }
}

export default getModules;
