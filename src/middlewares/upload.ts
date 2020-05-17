import { Request } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: CallableFunction) => {
    if (file.mimetype.includes('image')) {
      cb(undefined, 'static/images');
    }
  },
  filename: (req: Request, file: any, cb: CallableFunction) => {
    const date = new Date().toISOString().replace(/:/g, '_');
    const name = file.originalname.toLowerCase().replace(/[\s]/g, '_');
    cb(undefined, `${date}-${name}`);
  },
});

// const fileFilter = (req: Request, file: any, cb: CallableFunction) => {
//   if (file.mimetype.includes('image')) {
//     cb(undefined, true);
//   } else {
//     cb(undefined, false);
//   }
// };

export default multer({ storage }).fields([{ name: 'images' }, { name: 'image', maxCount: 1 }]);
