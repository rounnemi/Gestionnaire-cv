import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

export const imageFileFilter = (req, file, callback) => {
  // Check if file size exceeds the limit (1MB)
  if (file.size > 1024 * 1024) {
    return callback(
      new HttpException(
        'File size exceeds the limit (1MB)',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }

  // Check if the file type is supported (jpg, jpeg, png)
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return callback(
      new HttpException(
        'Only image files are allowed!',
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }

  // Pass the file if it meets the criteria
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const timestamp = new Date().getTime();
  const randomName = `${timestamp}-${file.originalname}`;
  callback(null, randomName);
};

export const multerOptions = {
  limits: {
    fileSize: 1024 * 1024, // 1MB limit
  },
  fileFilter: imageFileFilter,
  storage: diskStorage({
    destination: './public/uploads',
    filename: editFileName,
  }),
};
