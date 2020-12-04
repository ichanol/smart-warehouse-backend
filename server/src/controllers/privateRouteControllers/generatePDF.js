/**
 *   @DESCRIPTION   -   Generate import-export product report / invoice
 *   @ROUTE         -   [GET] /api/smart-warehouse/generate-report
 *   @ACCESS        -   PRIVATE (admin)
 */

const generatePDFHandler = require("../../models/generatePDFHandler");

const generatePDF = async (req, res, next) => {
  try {
    const { reference_number: referenceNumber } = req.params;
    if (referenceNumber) {
      const result = await generatePDFHandler(referenceNumber);
      if (result) {
        res.attachment(`${referenceNumber}.pdf`);
        res.download(`./report/${referenceNumber}.pdf`);
      } else {
        res
          .status(404)
          .json({ success: false, message: "Can't generate .pdf file" });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Can't get reference number" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = generatePDF;
