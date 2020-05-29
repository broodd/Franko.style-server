import multer from 'multer';
import path from 'path';
const cloudinary = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'franko-style',
    format: (req: Request, file: Express.Multer.File) => {
      const extetion = path.extname(file.originalname);
      return extetion == '.svg' ? 'svg' : 'jpg';
    },
  },
});

export default multer({ storage }).fields([{ name: 'images' }, { name: 'image', maxCount: 1 }]);
