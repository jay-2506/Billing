const { generateInvoiceExcel } = require("../utils/excelGenerator");
const { readData, writeData } = require("../utils/db");

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res) => {
  try {
    const invoices = readData("invoices");

    // Seed initial data if empty
    if (invoices.length === 0) {
      const initialInvoices = [
        {
          _id: "201",
          invoiceNumber: "INV-100001",
          customerId: {
            _id: "1",
            name: "John Doe",
            address: "123, MG Road, Mumbai, Maharashtra",
            phone: "9876543210",
            gstNumber: "27AAAAA0000A1Z5",
          },
          items: [
            {
              name: "Industrial Valve A",
              price: 1500.5,
              quantity: 2,
              total: 3001.0,
              hsnCode: "8481",
            },
          ],
          isGST: true,
          date: new Date(),
          subtotal: 3001.0,
          cgstAmount: 270.09,
          sgstAmount: 270.09,
          totalAmount: 3541.18,
          createdAt: new Date(),
        },
      ];
      writeData("invoices", initialInvoices);
      return res.json(initialInvoices);
    }
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = async (req, res) => {
  try {
    const { customerId, items, isGST, date } = req.body;

    // Lookup customer data
    const customers = readData("customers");
    const customer = customers.find((c) => c._id === customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Lookup product data for items
    const products = readData("products");
    const processingItems = items.map((item) => {
      const product = products.find((p) => p._id === item.productId);
      const price = product ? product.price : (item.price || 0);
      const name = product ? product.name : (item.name || "Manual Entry");
      const hsnCode = product ? product.hsnCode : (item.hsnCode || "");
      const gstPercentage = product ? product.gstPercentage : (item.gstPercentage || 18); // Default to 18% if not specified

      return {
        productId: item.productId || null,
        name,
        hsnCode,
        price,
        quantity: item.quantity || 1,
        gstPercentage,
        total: price * item.quantity,
      };
    });

    let subtotal = 0;
    processingItems.forEach((item) => {
      subtotal += item.total;
    });

    // Calculate GST (Fixed 9% + 9% based on common business logic if not per-product)
    // Or we could calculate per item if needed.
    const cgstAmount = isGST ? subtotal * 0.09 : 0;
    const sgstAmount = isGST ? subtotal * 0.09 : 0;
    const totalAmount = subtotal + cgstAmount + sgstAmount;

    const newInvoice = {
      _id: Date.now().toString(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      customerId: customer, // Store the full customer object for easy frontend access
      items: processingItems,
      isGST,
      date: date || new Date(),
      subtotal,
      cgstAmount,
      sgstAmount,
      totalAmount,
      createdAt: new Date(),
    };

    const invoices = readData("invoices");
    invoices.push(newInvoice);
    writeData("invoices", invoices);

    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
// @access  Private/Admin
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoices = readData("invoices");
    const index = invoices.findIndex((inv) => inv._id === id);
    if (index !== -1) {
      invoices.splice(index, 1);
      writeData("invoices", invoices);
      res.json({ message: "Invoice removed" });
    } else {
      res.status(404).json({ message: "Invoice not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download Excel for an invoice
// @route   GET /api/invoices/excel/:id
// @access  Private
const getInvoiceExcel = async (req, res) => {
  try {
    const { id } = req.params;
    const invoices = readData("invoices");
    const invoice = invoices.find((inv) => inv._id === id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const customer = invoice.customerId || {};

    const company = {
      companyName: "Krishna Devloper",
      address: "Sidharaj Zori, Gandhinagar, Gujarat - 382001",
      gstNumber: "24AAAAA0000A1Z5",
      bankName: "HDFC Bank",
      accountNumber: "12345678901234",
      ifscCode: "HDFC0001234",
      branch: "Main Branch",
      cgstPercentage: 9,
      sgstPercentage: 9,
    };

    await generateInvoiceExcel(invoice, customer, company, res);
  } catch (error) {
    console.error("Excel Generation Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate Excel file" });
    }
  }
};

module.exports = {
  getInvoices,
  getInvoiceById: (req, res) => {
    const invoices = readData("invoices");
    const invoice = invoices.find((i) => i._id === req.params.id);
    if (invoice) res.json(invoice);
    else res.status(404).json({ message: "Not found" });
  },
  createInvoice,
  deleteInvoice,
  getInvoiceExcel,
};
