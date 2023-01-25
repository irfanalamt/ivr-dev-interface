import fs from 'fs';

async function getProjects(req, res) {
  if (req.method !== 'GET') return;

  const fileNames = fs.readdirSync('public/projects');

  res.status(200).json(fileNames);
}

export default getProjects;
