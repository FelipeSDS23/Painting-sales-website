const multer = require('multer');
const path = require('path');
const fs = require('fs');

// cria uma pasta para cada grupo de imagens enviadas
const folder = (req) => {

  let temp = `public/img/paintings/temp`;

  return temp;
}

// const folder = (req) => {

//   let caminho = `public/img/paintings/${req.body.name}`;
//   let temp = `public/img/paintings/temp`;

//   if(!fs.existsSync(caminho)) {
//     fs.mkdirSync(caminho);
//   } else {
//     return temp;
//   }
  
//   return caminho;
// }





// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, folder(req)); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Arquivo não suportado! Apenas imagens são permitidas.'));
  }
};

// Multer Middleware
const imageUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter: fileFilter
});

module.exports = { imageUpload };