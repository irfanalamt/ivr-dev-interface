import fs from 'fs';

async function getProject(req, res) {
  if (req.method !== 'GET') return;
  try {
    const {fileName} = req.query;
    const filePath = `public/projects/${fileName}.ivrf`;
    const file = fs.readFileSync(filePath, 'utf8');

    res.status(200).send(file);
  } catch (error) {
    res.status(500).send(error);
  }
}

export default getProject;
