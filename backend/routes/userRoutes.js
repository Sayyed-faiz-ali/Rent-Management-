import express from 'express';
const router = express.Router();
import {
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
} from '../controllers/userController.js';
import { protect, isOwner } from '../middleware/authMiddleware.js';

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes (general)
router.get('/profile', protect, getUserProfile);


// --- OWNER-SPECIFIC ROUTES ---
// All routes below are protected and require owner role
router.route('/tenants')
    .get(protect, isOwner, getTenantsForOwner);

router.route('/tenants/:id')
    .get(protect, isOwner, getTenantById)
    .put(protect, isOwner, updateTenantDetails);

router.route('/tenants/:id/familymembers')
    .post(protect, isOwner, addFamilyMember);

router.route('/tenants/:id/familymembers/:memberId')
    .delete(protect, isOwner, removeFamilyMember);

router.route('/tenants/:id/payments')
    .post(protect, isOwner, addPayment);

router.route('/tenants/:id/payments/:paymentId')
    .put(protect, isOwner, updatePayment)
    .delete(protect, isOwner, removePayment);

router.route('/tenants/message')
    .post(protect, isOwner, sendMessage);
    

export default router;
