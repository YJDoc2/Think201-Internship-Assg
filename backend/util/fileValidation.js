const path = require('path');

// Allowed image types
const imgExt = /jpeg|png|jpg/;

// Final Regex
const allowedExt = new RegExp(imgExt.source);
const allowedMime = new RegExp(imgExt.source);

function validFile(file, cb) {
  const fileExt = path.extname(file.originalname).toLowerCase();
  const fileMime = file.mimetype;

  const extCheck = allowedExt.test(fileExt);
  const mimeCheck = allowedMime.test(fileMime);

  if (extCheck && mimeCheck) {
    return cb(null, true);
  } else {
    return cb('Error : Invalid file Type');
  }
}

module.exports = validFile;
