const express = require('express');
const router = express.Router();
const { createBrief } = require('../models/briefModel');

function normalizeField(value) {
  return typeof value === 'string' ? value.trim() : '';
}

router.get('/', (req, res) => {
  res.render('brief/form', {
    title: 'Бриф на розробку платформи Squadly',
    error: null,
    success: req.query.success || null,
    formData: {}
  });
});

router.post('/submit', async (req, res) => {
  try {
    const requiredFeatures = Array.isArray(req.body.required_features)
        ? req.body.required_features.join(', ')
        : normalizeField(req.body.required_features);

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
      required_features: requiredFeatures,
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
      return res.status(400).render('brief/form', {
        title: 'Бриф на розробку платформи Squadly',
        error: 'Заповніть усі обовʼязкові поля.',
        success: null,
        formData
      });
    }

    await createBrief(formData);
    return res.redirect('/?success=1');
  } catch (error) {
    return res.status(500).render('brief/form', {
      title: 'Бриф на розробку платформи Squadly',
      error: 'Сталася помилка під час збереження брифу.',
      success: null,
      formData: req.body
    });
  }
});

module.exports = router;
