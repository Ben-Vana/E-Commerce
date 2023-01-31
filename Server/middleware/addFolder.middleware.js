const path = require("path");
const fs = require("fs");

module.exports = addFolder = (req, res, next) => {
  try {
    const time = Date.now();
    const dir = path.join(process.cwd() + `/public/images/${time}`);
    fs.mkdirSync(dir, { recursive: true });
    req.folder = dir;
    req.folderTime = time;
    next();
  } catch (error) {
    res.status(400).json({ error });
  }
};
