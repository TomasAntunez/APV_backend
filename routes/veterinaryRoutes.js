import express from 'express';
import {
    register,
    profile,
    confirm,
    authenticate,
    forgetPassword,
    checkToken,
    newPassword,
    updateProfile,
    updatePassword
} from '../controllers/veterinaryController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

// Public area
router.post('/', register);
router.get('/confirmar/:token', confirm)
router.post('/login', authenticate);
router.post('/olvide-password', forgetPassword);
router.route('/olvide-password/:token').get(checkToken).post(newPassword);

// Private area
router.get('/perfil', checkAuth, profile);
router.put('/perfil/:id', checkAuth, updateProfile)
router.put('/actualizar-password', checkAuth, updatePassword)

export default router;