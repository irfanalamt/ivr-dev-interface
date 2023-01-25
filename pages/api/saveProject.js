import fs from 'fs';

async function saveProject(req, res) {
  try {
    const {filename, data} = req.body;

    fs.writeFileSync(`public/projects/${filename}.ivrf`, data);

    res.status(200).json({message: `File ${filename} written successfully.`});
  } catch (err) {
    res.status(500).json({message: 'Error writing file.', error: err});
  }
}

export default saveProject;
