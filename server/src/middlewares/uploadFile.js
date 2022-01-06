const multer = require("multer");

exports.uploadFile = (imageFile) => {
  // initialization multer disktorage
  // destination file for upload

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });

  const fileFilter = function (req, file, cb) {
    if (file.filename === imageFile) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = {
          message: "Only image file are allowed!",
        };
        return cb(new Error("Only image file are allowed!"), false);
      }
    }
    cb(null, true);
  };

  const sizeInMb = 10;
  const maxSize = sizeInMb * 1000 * 1000;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).single(imageFile);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      if (!req.file && !err) {
        return res.status(400).send({
          message: "Please select files to upload",
        });
      }

      if (err) {
        if (err.code == "LIMIT_FILESIZE") {
          return res.status(400).send({
            message: "MAx file sized 10Mb",
          });
        }
        return res.status(400).send(err);
      }

      return next();
    });
  };
};
