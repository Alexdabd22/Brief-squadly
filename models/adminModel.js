const bcrypt = require('bcryptjs');
const { adminsFile, readJson, writeJson } = require('../config/db');

function generateId(items) {
  if (!items.length) return 1;
  return Math.max(...items.map((item) => item.id)) + 1;
}

async function findAdminByUsername(username) {
  const admins = readJson(adminsFile);
  return admins.find((admin) => admin.username === username) || null;
}

async function findAdminById(id) {
  const admins = readJson(adminsFile);
  return admins.find((admin) => admin.id === Number(id)) || null;
}

async function createAdmin(username, password) {
  const admins = readJson(adminsFile);
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = {
    id: generateId(admins),
    username,
    password_hash: passwordHash,
    created_at: new Date().toISOString()
  };

  admins.push(admin);
  writeJson(adminsFile, admins);
  return admin;
}

async function validateAdmin(username, password) {
  const admin = await findAdminByUsername(username);
  if (!admin) return null;

  const isValid = await bcrypt.compare(password, admin.password_hash);
  if (!isValid) return null;

  return admin;
}

module.exports = {
  findAdminByUsername,
  findAdminById,
  createAdmin,
  validateAdmin
};
