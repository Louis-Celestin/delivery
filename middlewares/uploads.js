const multer = require('multer');
const path = require('path');

// Config de stockage (ici stockage temporaire)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Dossier temporaire
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtre sur les types de fichiers acceptés (optionnel)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Fichier non supporté. Merci de fournir une image.'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
