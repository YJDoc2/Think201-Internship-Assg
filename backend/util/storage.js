const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');

const mongoCfg = require('../config/db');
const checkValidFileType = require('./fileValidation');

// Maximum file size allowed for upload
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Name which will appear in front end form for the image input
const FORM_FIELD_NAME = 'photo';

// Multer and Storage settings

const storage = new GridFsStorage({
  url: mongoCfg.db,
  file: (req, file) => {
    // Actual function to save file to mongoDB
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        }
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    checkValidFileType(file, cb);
  },
}).single(FORM_FIELD_NAME);

module.exports = upload;
