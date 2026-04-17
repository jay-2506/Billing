const { readData, writeData } = require('../utils/db');
const { validateHSN } = require('../utils/validate');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
    try {
        const products = readData('products');
        // Seed with initial data if empty
        if (products.length === 0) {
            const initialProducts = [
                {
                    _id: '101',
                    name: 'Industrial Valve A',
                    hsnCode: '8481',
                    price: 1500.50,
                    gstPercentage: 18,
                    createdAt: new Date()
                },
                {
                    _id: '102',
                    name: 'Pressure Gauge B',
                    hsnCode: '9026',
                    price: 450.00,
                    gstPercentage: 12,
                    createdAt: new Date()
                }
            ];
            writeData('products', initialProducts);
            return res.json(initialProducts);
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
    try {
        const { name, hsnCode, price, gstPercentage } = req.body;

        // Validation
        if (hsnCode && !validateHSN(hsnCode)) {
            return res.status(400).json({ message: 'HSN Code must be 4 to 8 digits' });
        }

        const products = readData('products');
        const newProduct = {
            _id: Date.now().toString(),
            name,
            hsnCode,
            price: Number(price),
            gstPercentage: Number(gstPercentage),
            createdAt: new Date(),
        };
        products.push(newProduct);
        writeData('products', products);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { hsnCode } = req.body;

        // Validation
        if (hsnCode && !validateHSN(hsnCode)) {
            return res.status(400).json({ message: 'HSN Code must be 4 to 8 digits' });
        }

        const products = readData('products');
        const index = products.findIndex((p) => p._id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...req.body };
            writeData('products', products);
            res.json(products[index]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const products = readData('products');
        const index = products.findIndex((p) => p._id === id);
        if (index !== -1) {
            products.splice(index, 1);
            writeData('products', products);
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
