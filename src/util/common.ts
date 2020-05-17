import { Request } from 'express';

/**
 * Pauses execution for given amount of seconds
 * @param sec - amount of seconds
 */
export function sleep(sec: number) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

/**
 * Checks whether given number is in range of base plus/minus step
 * @param number - number to check
 * @param base - base number to compare with
 * @param step - range for a number
 */
export function isNumberInRage(number: number, base: number, step: number = 1) {
  return number >= base - step && number <= base + step;
}

export function getUploadedImage(req: Request): string | undefined {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  return files && files['image'] && files['image'][0] ? files['image'][0].filename : undefined;
}

export function getUploadedImages(req: Request): string[] | undefined {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  return files && files['images'] && files['images'].length
    ? files['images'].map((file) => {
        return file.filename;
      })
    : undefined;
}
