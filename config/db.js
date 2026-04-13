const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const briefsFile = path.join(dataDir, 'briefs.json');
const adminsFile = path.join(dataDir, 'admins.json');

function ensureFile(filePath, defaultValue) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
  }
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw || '[]');
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function initDb() {
  ensureFile(briefsFile, []);
  ensureFile(adminsFile, []);
}

module.exports = {
  initDb,
  briefsFile,
  adminsFile,
  readJson,
  writeJson
};
