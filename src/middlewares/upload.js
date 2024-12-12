import { uploadToMemory } from '../utils/multer.js';
import { imageKit } from '../utils/imageKit.js';
import { HttpError } from '../utils/error.js';
import crypto from 'crypto';

export function parseImage(req, _res, next) {
  uploadToMemory(req, _res, (err) => {
    if (err) {
      return next(
        new HttpError('Wrong or missing key, please use "image" key.', 400)
      );
    } else {
      next();
    }
  });
}

export async function uploadToImageKit(req, res, next) {
  const file = req.file;

  if (!file) {
    throw new HttpError('No image uploaded', 400);
  }

  const filExtension = file.originalname.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${filExtension}`;

  const result = await imageKit.upload({
    file: file.buffer,
    fileName
  });

  res.locals.imageUrl = result.url;

  next();
}
