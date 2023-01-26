const {MongoClient} = require('mongodb');
const client = new MongoClient(process.env.DB_URL);

async function getProject(req, res) {
  if (req.method !== 'GET') return;
  try {
    const db = client.db('ivr-dev');
    const {fileName} = req.query;
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
