import client from '../../src/db';

async function saveProject2(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({message: 'Method not allowed'});
    return;
  }
  try {
    const data = req.body;
    const filename = 'testFileX';

    await client.connect();

    const db = client.db('ivrStudio');
    await db
      .collection('projects')
      .findOneAndUpdate({filename}, {$set: {data}}, {upsert: true});

    res.status(200).json({message: `File ${filename} written successfully.`});
  } catch (err) {
    res.status(500).json({message: 'Error writing file.', error: err});
  } finally {
    await client.close();
  }
}

export default saveProject2;
