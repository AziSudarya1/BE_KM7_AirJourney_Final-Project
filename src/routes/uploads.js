import { Router } from 'express';
import * as uploadMiddleware from '../middlewares/upload.js';
import * as uploadController from '../controllers/upload.js';
import * as authMiddleware from '../middlewares/auth.js';

export default (app) => {
  const router = Router();

  app.use('/upload', router);

  router.post(
    '/image',
    authMiddleware.isAuthorized,
    uploadMiddleware.parseImage,
    uploadMiddleware.uploadToImageKit,
    uploadController.uploadImage
  );
};
