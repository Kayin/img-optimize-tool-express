const express = require('express'),
      stream  = require('stream');

const router = express.Router();

/* GET download buffer. */
router.get('/', function(req, res){

  let imagesBuffer = req.app.locals.IMG_BUFFER;
  let imagesName   = req.app.locals.IMG_NAME;
  let imagesType   = req.app.locals.IMG_TYPE;

  let fileContents = Buffer.from(imagesBuffer, "base64");

  let readStream = new stream.PassThrough();
  readStream.end(fileContents);

  res.set('Content-disposition', 'attachment; filename=' + imagesName);
  res.set('Content-Type', imagesType);

  readStream.pipe(res);

});

module.exports = router;
