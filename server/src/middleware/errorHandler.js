//  DESCRIPTION   - If error occure, server response with status code 500 and cause of error(error message)
const errorHandler = (error, req, res, next) => {
  res.status(500).json({
    success: false,
    err: error.message,
  });
};
module.exports = errorHandler;
