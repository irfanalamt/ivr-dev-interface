const {MongoClient} = require('mongodb');
const client = new MongoClient(process.env.DB_URL);

function convertArray(arr) {
  return arr.map((obj) => obj.filename);
}

async function getProjects(req, res) {
  if (req.method !== 'GET') return;

  try {
    const db = client.db('ivr-dev');
    const projectNames = await db
      .collection('projects')
      .find({}, {projection: {_id: 0, filename: 1}})
      .toArray();

    const fileNamesArray = convertArray(projectNames);

    res.status(200).json(fileNamesArray);
  } catch (err) {
    res.status(500).json({message: 'Error fetching projects.', error: err});
  } finally {
    await client.close();
  }
}

export default getProjects;
