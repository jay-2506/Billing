const { readData, writeData } = require('../utils/db');
const { validateEmail, validatePhone, validateGST } = require('../utils/validate');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
const getCustomers = async (req, res) => {
    try {
        const customers = readData('customers');
        // Seed with initial data if empty
        if (customers.length === 0) {
            const initialCustomers = [
                {
                    _id: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '9876543210',
                    address: '123, MG Road, Mumbai, Maharashtra',
                    gstNumber: '27AAAAA0000A1Z5',
                    createdAt: new Date()
                },
                {
                    _id: '2',
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    phone: '8765432109',
                    address: '456, Residency Road, Bangalore, Karnataka',
                    gstNumber: '29BBBBB1111B2Z6',
                    createdAt: new Date()
                }
            ];
            writeData('customers', initialCustomers);
            return res.json(initialCustomers);
        }
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, address, gstNumber } = req.body;

        // Validation
        if (!validatePhone(phone)) {
            return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
        }
        if (email && !validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (gstNumber && !validateGST(gstNumber)) {
            return res.status(400).json({ message: 'Invalid GST number format' });
        }

        const customers = readData('customers');
        const newCustomer = {
            _id: Date.now().toString(),
            name,
            email,
            phone,
            address,
            gstNumber,
            createdAt: new Date(),
        };
        customers.push(newCustomer);
        writeData('customers', customers);
        res.status(201).json(newCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address, gstNumber } = req.body;

        // Validation
        if (phone && !validatePhone(phone)) {
            return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
        }
        if (email && !validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        if (gstNumber && !validateGST(gstNumber)) {
            return res.status(400).json({ message: 'Invalid GST number format' });
        }

        const customers = readData('customers');
        const index = customers.findIndex((c) => c._id === id);
        if (index !== -1) {
            customers[index] = { ...customers[index], ...req.body };
            writeData('customers', customers);
            res.json(customers[index]);
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customers = readData('customers');
        const index = customers.findIndex((c) => c._id === id);
        if (index !== -1) {
            customers.splice(index, 1);
            writeData('customers', customers);
            res.json({ message: 'Customer removed' });
        } else {
            res.status(404).json({ message: 'Customer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
};
