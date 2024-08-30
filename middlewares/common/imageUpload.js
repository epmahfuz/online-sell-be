const uploader = require("../../utilities/singleUploader");

function imageUpload(subFolderName) {
  return function(req, res, next) {
    const upload = uploader(
      subFolderName,
      ["image/jpeg", "image/jpg", "image/png"],
      1000000,
      "Only .jpg, jpeg or .png format allowed!"
    );

    upload.any()(req, res, (err) => {
      if (err) {
        res.status(500).json({
          errors: {
            image: {
              msg: err.message,
            },
          },
        });
      } else {
        next();
      }
    });
  }
}

module.exports = imageUpload;
