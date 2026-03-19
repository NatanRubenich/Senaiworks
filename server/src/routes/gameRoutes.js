const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { auth } = require('../middleware/auth');
const { uploadImage, uploadVideo, uploadBuild } = require('../middleware/upload');

router.post('/', auth, gameController.createGame);
router.get('/', auth, gameController.getMyGames);
router.get('/:id', auth, gameController.getGame);

// Module B
router.put('/:id/basic-data', auth, gameController.updateBasicData);
router.put('/:id/description', auth, gameController.updateDescription);
router.put('/:id/store-graphics', auth, gameController.updateStoreGraphics);
router.put('/:id/screenshots', auth, gameController.updateScreenshots);
router.post('/:id/screenshots/add', auth, gameController.addScreenshot);
router.delete('/:id/screenshots/:screenshotId', auth, gameController.deleteScreenshot);
router.put('/:id/library-assets', auth, gameController.updateLibraryAssets);
router.put('/:id/trailers', auth, gameController.updateTrailers);
router.post('/:id/trailers/add', auth, gameController.addTrailer);
router.delete('/:id/trailers/:trailerId', auth, gameController.deleteTrailer);
router.post('/:id/publish-store', auth, gameController.publishStore);

// Module C
router.put('/:id/app-config', auth, gameController.updateAppConfig);
router.put('/:id/build-upload', auth, gameController.updateBuildUpload);
router.put('/:id/depots', auth, gameController.updateDepots);
router.put('/:id/install-config', auth, gameController.updateInstallConfig);
router.post('/:id/publish-config', auth, gameController.publishConfig);

// File Uploads
router.post('/:id/upload-image', auth, (req, res, next) => {
  req.uploadSubDir = `games/${req.params.id}/images`;
  next();
}, uploadImage.single('file'), gameController.uploadFile);

router.post('/:id/upload-video', auth, (req, res, next) => {
  req.uploadSubDir = `games/${req.params.id}/videos`;
  next();
}, uploadVideo.single('file'), gameController.uploadFile);

router.post('/:id/upload-build', auth, (req, res, next) => {
  req.uploadSubDir = `games/${req.params.id}/builds`;
  next();
}, uploadBuild.single('file'), gameController.uploadFile);

module.exports = router;
