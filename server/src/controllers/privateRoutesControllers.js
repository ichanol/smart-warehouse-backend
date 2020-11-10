const connection = require("../Database_connection/connect");

/**
 *   @DESCRIPTION   -   Destroy user credential
 *   @ROUTE         -   [POST] /api/smart-warehouse/logout
 *   @ACCESS        -   PRIVATE
 */
exports.userLogOut = (req, res, next) => {
  try {
    res.json({ success: true, message: "Log out" });
    connection.end();
  } catch (error) {
    next(error);
  }
};


/**
 *   @DESCRIPTION   -   When client send this request to server, server will send another request
 *                      to the hardware to tell the RFID reader to read RFID tags
 *   @ROUTE         -   [GET] /api/smart-warehouse/read-RFID
 *   @ACCESS        -   PRIVATE (admin,crew)
 */
exports.readRFID = (req, res, next) => {
  try {
    res.json({ success: true, message: "READ RFID" });
  } catch (error) {
    next(error);
  }
};
