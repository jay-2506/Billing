const express = require('express');
const router = express.Router();
const { getCompanySettings, updateCompanySettings } = require('../controllers/companyController');

router.route('/')
    .get(getCompanySettings)
    .put(updateCompanySettings);

module.exports = router;
