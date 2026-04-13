const { briefsFile, readJson, writeJson } = require('../config/db');

function generateId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map((item) => item.id)) + 1;
}

async function createBrief(data) {
  const briefs = readJson(briefsFile);
  const now = new Date().toISOString();

  const brief = {
    id: generateId(briefs),
    ...data,
    created_at: now,
    updated_at: now
  };

  briefs.push(brief);
  writeJson(briefsFile, briefs);
  return brief;
}

async function getAllBriefs() {
  const briefs = readJson(briefsFile);
  return briefs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function getBriefById(id) {
  const briefs = readJson(briefsFile);
  return briefs.find((brief) => brief.id === Number(id)) || null;
}

async function updateBrief(id, data) {
  const briefs = readJson(briefsFile);
  const index = briefs.findIndex((brief) => brief.id === Number(id));

  if (index === -1) return null;

  briefs[index] = {
    ...briefs[index],
    ...data,
    updated_at: new Date().toISOString()
  };

  writeJson(briefsFile, briefs);
  return briefs[index];
}

async function deleteBrief(id) {
  const briefs = readJson(briefsFile);
  const filtered = briefs.filter((brief) => brief.id !== Number(id));
  writeJson(briefsFile, filtered);
  return true;
}

module.exports = {
  createBrief,
  getAllBriefs,
  getBriefById,
  updateBrief,
  deleteBrief
};
