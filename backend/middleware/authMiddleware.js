import jwt from 'jsonwebtoken';
import AdminModel from '../database/datamodels/Admin.js';

export const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await AdminModel.findById(decoded.id);

        if (!admin) {
            return res.status(401).json({ message: "Invalid authentication" });
        }

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid authentication", error: error.message });
    }
};
