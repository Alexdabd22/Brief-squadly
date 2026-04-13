const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const { getAllBriefs, getBriefById, updateBrief, deleteBrief } = require('../models/briefModel');
const { validateAdmin } = require('../models/adminModel');

function normalizeField(value) {
  return typeof value === 'string' ? value.trim() : '';
}

router.get('/login', (req, res) => {
  res.render('admin/login', {
    title: 'Вхід в адмін-панель',
    error: null
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await validateAdmin(username, password);

  if (!admin) {
    return res.status(401).render('admin/login', {
      title: 'Вхід в адмін-панель',
      error: 'Неправильний логін або пароль.'
    });
  }

  req.session.adminId = admin.id;
  req.session.adminUsername = admin.username;

  return res.redirect('/admin/briefs');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

router.get('/briefs', ensureAuthenticated, async (req, res) => {
  const briefs = await getAllBriefs();

  res.render('admin/list', {
    title: 'Адмін-панель',
    briefs,
    adminUsername: req.session.adminUsername
  });
});

router.get('/briefs/:id', ensureAuthenticated, async (req, res) => {
  const brief = await getBriefById(req.params.id);

  if (!brief) {
    return res.status(404).send('Brief not found');
  }

  return res.render('admin/view', {
    title: 'Перегляд брифу',
    brief,
    adminUsername: req.session.adminUsername
  });
});

router.get('/briefs/:id/edit', ensureAuthenticated, async (req, res) => {
  const brief = await getBriefById(req.params.id);

  if (!brief) {
    return res.status(404).send('Brief not found');
  }

  return res.render('admin/edit', {
    title: 'Редагування брифу',
    brief,
    error: null,
    adminUsername: req.session.adminUsername
  });
});

router.post('/briefs/:id/edit', ensureAuthenticated, async (req, res) => {
  const id = req.params.id;
  const brief = await getBriefById(id);

  if (!brief) {
    return res.status(404).send('Brief not found');
  }

  const formData = {
    contact_person: normalizeField(req.body.contact_person),
    email: normalizeField(req.body.email),
    phone: normalizeField(req.body.phone),
    preferred_contact: normalizeField(req.body.preferred_contact),
    company_name: normalizeField(req.body.company_name),
    organization_type: normalizeField(req.body.organization_type),
    company_activity: normalizeField(req.body.company_activity),
    project_summary: normalizeField(req.body.project_summary),
    problem_statement: normalizeField(req.body.problem_statement),
    project_goal: normalizeField(req.body.project_goal),
    target_audience: normalizeField(req.body.target_audience),
    expected_users: normalizeField(req.body.expected_users),
    success_criteria: normalizeField(req.body.success_criteria),
    platform_modules: normalizeField(req.body.platform_modules),
    content_entities: normalizeField(req.body.content_entities),
    access_notes: normalizeField(req.body.access_notes),
    required_features: normalizeField(req.body.required_features),
    user_roles: normalizeField(req.body.user_roles),
    integrations: normalizeField(req.body.integrations),
    custom_logic: normalizeField(req.body.custom_logic),
    design_preferences: normalizeField(req.body.design_preferences),
    reference_examples: normalizeField(req.body.reference_examples),
    brand_assets: normalizeField(req.body.brand_assets),
    mobile_priority: normalizeField(req.body.mobile_priority),
    deadline: normalizeField(req.body.deadline),
    budget_range: normalizeField(req.body.budget_range),
    technical_constraints: normalizeField(req.body.technical_constraints),
    decision_maker: normalizeField(req.body.decision_maker),
    additional_notes: normalizeField(req.body.additional_notes)
  };

  const requiredFields = [
    'contact_person',
    'email',
    'company_name',
    'organization_type',
    'company_activity',
    'project_summary',
    'problem_statement',
    'project_goal',
    'target_audience',
    'expected_users',
    'success_criteria',
    'platform_modules',
    'content_entities',
    'required_features',
    'user_roles'
  ];

  const hasEmptyRequiredField = requiredFields.some((field) => !formData[field]);

  if (hasEmptyRequiredField) {
    return res.status(400).render('admin/edit', {
      title: 'Редагування брифу',
      brief: { ...brief, ...formData },
      error: 'Заповніть усі обовʼязкові поля.',
      adminUsername: req.session.adminUsername
    });
  }

  await updateBrief(id, formData);
  return res.redirect(`/admin/briefs/${id}`);
});

router.post('/briefs/:id/delete', ensureAuthenticated, async (req, res) => {
  await deleteBrief(req.params.id);
  return res.redirect('/admin/briefs');
});

module.exports = router;
