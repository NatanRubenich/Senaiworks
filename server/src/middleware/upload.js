const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDir = req.uploadSubDir || 'general';
    const dir = path.join(uploadDir, subDir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de imagem inválido. Apenas JPG e PNG são aceitos.'), false);
  }
};

const videoFilter = (req, file, cb) => {
  const allowedMimes = ['video/mp4', 'video/quicktime', 'video/x-ms-wmv', 'video/webm', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de vídeo inválido.'), false);
  }
};

const buildFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.zip') {
    cb(null, true);
  } else {
    cb(new Error('Formato inválido. Apenas arquivos .zip são aceitos para upload via web.'), false);
  }
};

const anyFileFilter = (req, file, cb) => {
  const imageMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const videoMimes = ['video/mp4', 'video/quicktime', 'video/x-ms-wmv', 'video/webm'];
  if ([...imageMimes, ...videoMimes].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo não suportado.'), false);
  }
};

const uploadImage = multer({ storage, fileFilter: imageFilter, limits: { fileSize: 50 * 1024 * 1024 } });
const uploadVideo = multer({ storage, fileFilter: videoFilter, limits: { fileSize: 50 * 1024 * 1024 } });
const uploadBuild = multer({ storage, fileFilter: buildFilter, limits: { fileSize: 50 * 1024 * 1024 } });
const uploadAny   = multer({ storage, fileFilter: anyFileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

module.exports = { uploadImage, uploadVideo, uploadBuild, uploadAny };
