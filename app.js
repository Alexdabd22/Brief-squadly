require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const { initDb } = require('./config/db');
const briefRoutes = require('./routes/briefRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { findAdminByUsername, createAdmin } = require('./models/adminModel');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
      secret: process.env.SESSION_SECRET || 'super-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 4 }
    })
);

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use('/', briefRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});

async function bootstrap() {
  await initDb();

  const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
  const defaultPassword = process.env.ADMIN_PASSWORD || 'admin12345';

  const existingAdmin = await findAdminByUsername(defaultUsername);
  if (!existingAdmin) {
    await createAdmin(defaultUsername, defaultPassword);
    console.log(`Default admin created: ${defaultUsername}`);
  }

  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
