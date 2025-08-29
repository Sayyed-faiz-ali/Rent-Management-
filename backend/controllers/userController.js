import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import mongoose from 'mongoose';

// @desc    Register a new user (owner or tenant)
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, houseNumber, ownerId } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        houseNumber: role === 'tenant' ? houseNumber : undefined,
        ownerId: role === 'tenant' ? ownerId : undefined,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});


// @desc    Get current user's data (for tenants)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// --- OWNER-SPECIFIC CONTROLLERS ---

// @desc    Get all tenants for the logged-in owner
// @route   GET /api/users/tenants
// @access  Private/Owner
const getTenantsForOwner = asyncHandler(async (req, res) => {
    const tenants = await User.find({ role: 'tenant', ownerId: req.user._id });
    res.json(tenants);
});

// @desc    Get a single tenant by ID
// @route   GET /api/users/tenants/:id
// @access  Private/Owner
const getTenantById = asyncHandler(async (req, res) => {
    const tenant = await User.findById(req.params.id);
    // Security check: ensure the owner is requesting their own tenant
    if (tenant && tenant.ownerId.toString() === req.user._id.toString()) {
        res.json(tenant);
    } else {
        res.status(404);
        throw new Error('Tenant not found');
    }
});

// @desc    Update a tenant's details
// @route   PUT /api/users/tenants/:id
// @access  Private/Owner
const updateTenantDetails = asyncHandler(async (req, res) => {
    const tenant = await User.findById(req.params.id);

    if (tenant && tenant.ownerId.toString() === req.user._id.toString()) {
        tenant.name = req.body.name || tenant.name;
        tenant.email = req.body.email || tenant.email;
        tenant.houseNumber = req.body.houseNumber || tenant.houseNumber;

        const updatedTenant = await tenant.save();
        res.json(updatedTenant);
    } else {
        res.status(404);
        throw new Error('Tenant not found');
    }
});


// @desc    Add family member to a tenant
// @route   POST /api/users/tenants/:id/familymembers
// @access  Private/Owner
const addFamilyMember = asyncHandler(async (req, res) => {
    const { name, age, relation } = req.body;
    const tenant = await User.findById(req.params.id);

    if (tenant && tenant.ownerId.toString() === req.user._id.toString()) {
        const member = {
            name,
            age,
            relation,
        };
        tenant.familyMembers.push(member);
        await tenant.save();
        res.status(201).json(tenant);
    } else {
        res.status(404);
        throw new Error('Tenant not found');
    }
});

// @desc    Remove family member from a tenant
// @route   DELETE /api/users/tenants/:id/familymembers/:memberId
// @access  Private/Owner
const removeFamilyMember = asyncHandler(async (req, res) => {
    const tenant = await User.findById(req.params.id);

    if (tenant && tenant.ownerId.toString() === req.user._id.toString()) {
        tenant.familyMembers.pull({ _id: req.params.memberId });
        await tenant.save();
        res.json({ message: 'Family member removed' });
    } else {
        res.status(404);
        throw new Error('Tenant not found');
    }
});


// @desc    Add payment record for a tenant
// @route   POST /api/users/tenants/:id/payments
// @access  Private/Owner
const addPayment = asyncHandler(async (req, res) => {
    const paymentData = req.body;
    const tenant = await User.findById(req.params.id);

     if (tenant && tenant.ownerId.toString() === req.user._id.toString()) {
        tenant.payments.push(paymentData);
        await tenant.save();
        res.status(201).json(tenant);
    } else {
        res.status(404);
        throw new Error('Tenant not found');
    }
});

// @desc    Update payment record for a tenant
// @route   PUT /api/users/tenants/:id/payments/:paymentId
// @access  Private/Owner
const updatePayment = asyncHandler(async (req, res) => {
    const { rent, electricityBill, waterCharge, amountPaid } = req.body;
    const tenant = await User.findById(req.params.id);

    if (tenant && tenant.ownerId.toString() === req.user._id.toString()) {
        const payment = tenant.payments.id(req.params.paymentId);
        if (payment) {
            payment.rent = rent ?? payment.rent;
            payment.electricityBill = electricityBill ?? payment.electricityBill;
            payment.waterCharge = waterCharge ?? payment.waterCharge;
            payment.amountPaid = amountPaid ?? payment.amountPaid;
            payment.totalDue = payment.rent + payment.electricityBill + payment.waterCharge;
            payment.balance = payment.totalDue - payment.amountPaid;

            await tenant.save();
            res.json(tenant);
        } else {
            res.status(404);
            throw new Error('Payment record not found');
        }
    } else {
        res.status(404);
        throw new Error('Tenant not found');
    }
});

// @desc    Remove payment record from a tenant
// @route   DELETE /api/users/tenants/:id/payments/:paymentId
// @access  Private/Owner
const removePayment = asyncHandler(async (req, res) => {
     const tenant = await User.findById(req.params.id);

    if (tenant && tenant.ownerId.toString() === req.user._id.toString()) {
        tenant.payments.pull({ _id: req.params.paymentId });
        await tenant.save();
        res.json({ message: 'Payment record removed' });
    } else {
        res.status(404);
        throw new Error('Tenant not found');
    }
});

// @desc    Send message to tenant(s)
// @route   POST /api/users/tenants/message
// @access  Private/Owner
const sendMessage = asyncHandler(async (req, res) => {
    const { recipient, message } = req.body;

    if (!recipient || !message) {
        res.status(400);
        throw new Error('Recipient and message are required');
    }

    const messageData = {
        content: message,
        from: 'owner',
        timestamp: new Date()
    };

    if (recipient === 'all') {
        await User.updateMany(
            { role: 'tenant', ownerId: req.user._id },
            { $push: { messages: messageData } }
        );
        res.json({ message: 'Message sent to all tenants' });
    } else {
        const tenant = await User.findById(recipient);
        if (tenant && tenant.ownerId.toString() === req.user._id.toString()) {
            tenant.messages.push(messageData);
            await tenant.save();
            res.json({ message: `Message sent to ${tenant.name}` });
        } else {
            res.status(404);
            throw new Error('Tenant not found');
        }
    }
});


export {
    registerUser,
    loginUser,
    getUserProfile,
    getTenantsForOwner,
    getTenantById,
    updateTenantDetails,
    addFamilyMember,
    removeFamilyMember,
    addPayment,
    updatePayment,
    removePayment,
    sendMessage
};