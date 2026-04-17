// Default company settings (in-memory)
let companySettings = {
    companyName: 'BillEase Solutions',
    address: '123 Business Park, Tech City',
    phone: '+91 9876543210',
    email: 'contact@billease.com',
    gstNumber: '22AAAAA0000A1Z5',
    bankName: 'SaaS Bank',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
};

// @desc    Get company settings
// @route   GET /api/company
// @access  Private
const getCompanySettings = async (req, res) => {
    try {
        res.json(companySettings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update company settings
// @route   PUT /api/company
// @access  Private
const updateCompanySettings = async (req, res) => {
    try {
        companySettings = { ...companySettings, ...req.body };
        res.json(companySettings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getCompanySettings,
    updateCompanySettings
};
