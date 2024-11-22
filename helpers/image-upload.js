const multer = require('multer');
const path = require('path');

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/paintings'); // Pasta onde as imagens serão armazenadas
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para aceitar apenas imagens
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

// Middleware do Multer
const imageUpload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter: fileFilter
});

module.exports = { imageUpload }


// const multer = require("multer")
// const path = require("path")

// // Destination to store the images
// const imageStorage = multer.diskStorage({
//     destination: function(req, file, cb) {

//         let folder = ""

//         // if(req.baseUrl.includes("painting")) {
//         //     folder = "paintings"
//         // }

//         folder = "paintings"

//         console.log("aaaaaaaaaaaaaa")

//         cb(null, `public/img/${folder}`)
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname))
//     }
// })

// const imageUpload = multer({
//     storage: imageStorage,
//     fileFilter(req, file, cb) {
//         if(!file.originalname.match(/\.(png|jpg)$/)) {
//             return cb(new Error('Por favor, envie apenas jpg ou png!'))
//         }
//         cb(undefined, true)
//     }
// })

// module.exports = { imageUpload }