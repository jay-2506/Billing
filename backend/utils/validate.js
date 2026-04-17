const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
};

const validateGST = (gst) => {
    const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return !gst || re.test(gst); // GST can be optional in some cases, but if provided, must match
};

const validateHSN = (hsn) => {
    const re = /^[0-9]{4,8}$/;
    return !hsn || re.test(hsn);
};

module.exports = {
    validateEmail,
    validatePhone,
    validateGST,
    validateHSN
};
