import express from 'express';
import { adminLogin, getAppointments, updateAppointmentStatus } from '../controllers/adminController.js';

const router = express.Router();

// Admin authentication
router.post('/login', adminLogin);

// Appointment management
router.get('/appointments', getAppointments);
router.put('/appointments/:id', updateAppointmentStatus);

export default router;
