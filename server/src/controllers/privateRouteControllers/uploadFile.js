const uploadFileHandler = require("../../models/uploadFileHandler");

const uploadFile = async (req, res, next) => {
  try {
    const result = await uploadFileHandler(req);
    if (result) {
      res.json({ success: true, message: "Upload file success" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Upload file failed" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = uploadFile;
