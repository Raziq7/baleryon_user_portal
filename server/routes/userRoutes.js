import express from 'express';
import { getUserProfile, updateUserProfile } from './../controller/userController.js';
import { verifyToken } from '../middlewares/tokenVerification.js';

const router = express.Router();

router
  .route('/profile')
  .get(verifyToken, getUserProfile)
  .put(verifyToken, updateUserProfile);

export default router;