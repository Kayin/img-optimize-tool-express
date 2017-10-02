const express     = require('express'),
      fs          = require('fs'),
      stream      = require('stream')
      imagemin    = require('imagemin'),
      imageminPng = require('imagemin-pngquant'),
      imageminJpg = require('imagemin-jpeg-recompress'),
      imageminSvg = require('imagemin-svgo'),
      imageminGif = require('imagemin-gifsicle'),
      multer      = require('multer');

const router = express.Router();

const storage = multer.memoryStorage();
const upload  = multer({ storage: storage });

/* POST uploaded images. */
router.post('/', upload.single('upl'), function(req, res){

  //console.log(req.file); //read it all

  let imagesBuffer = req.file.buffer;
  let imagesName   = req.file.originalname;
  let imagesType   = req.file.mimetype;

  //console.log(imagesBuffer); //input buffer

  imagemin.buffer(imagesBuffer, {
    plugins: [
      imageminPng({quality: '70-90'}),
      imageminJpg({quality: 'low', method: 'smallfry', min: 0, max: 25}),
      imageminSvg({plugins: [{cleanupNumericValues: {floatPrecision: 2}}]}),
      imageminGif({interlaced: true})
    ]
  }).then(imagesData => {
    req.app.locals.IMG_BUFFER = imagesData;
    req.app.locals.IMG_NAME   = imagesName;
    req.app.locals.IMG_TYPE   = imagesType;

    //console.log(imagesData); //output buffer

    /* write optimized img to temp folder */
    fs.writeFile('tmp/' + imagesName, imagesData, (err) => {
      // console.log('Write error: ' + err);
    });

  }).catch(err => {
    // console.log('Promise error: ' + err);
  });

  res.status(204).end();

});

module.exports = router;
