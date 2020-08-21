const errorHandler = (error, req, res, next) => {
  console.log("ERR HANDLER: ", error);
  res
    .status(500)
    .json({
      success: false,
      err: error.message,
    });
};
module.exports = errorHandler;
