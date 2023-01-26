const {MongoClient} = require('mongodb');
const client = new MongoClient(process.env.DB_URL);

async function getProject(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({message: 'Method not allowed'});
    return;
  }

  try {
    const {fileName} = req.query;
    await client.connect();
    const db = client.db('ivr-dev');
    const project = await db
      .collection('projects')
      .findOne({filename: fileName}, {projection: {_id: 0, data: 1}});
    res.status(200).send(project.data);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    await client.close();
  }
}

export default getProject;
