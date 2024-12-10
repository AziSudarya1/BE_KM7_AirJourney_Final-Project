import { Router } from 'express';
import * as uploadMiddleware from '../middlewares/upload.js';
import * as uploadController from '../controllers/upload.js';

export default (app) => {
  const router = Router();

  app.use('/upload', router);

  router.post(
    '/image',
    uploadMiddleware.parseImage,
    uploadMiddleware.uploadToImageKit,
    uploadController.uploadImage
  );
};
