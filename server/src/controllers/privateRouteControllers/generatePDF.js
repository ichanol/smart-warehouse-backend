/**
 *   @DESCRIPTION   -   Get the list of all registered product
 *   @ROUTE         -   [GET] /api/smart-warehouse/generate-report
 *   @ACCESS        -   PRIVATE (admin)
 */

const generatePDF = async (req, res, next) => {
  const fs = require("fs");
  const PDFDocument = require("pdfkit");

  const { reference_number: referenceNumber } = req.params;

  const newPdf = new PDFDocument({
    size: [595.28, 841.89],
    margins: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    },
  });
  const pdfWirteStream = fs.createWriteStream(
    `reportPDF/${referenceNumber}.pdf`,
    {
      flags: "w+",
    }
  );

  newPdf.pipe(pdfWirteStream);

  newPdf.fontSize(25).text("Some text with an embedded font!", 200);
  newPdf.rect(50, 50, 150, 30).stroke('#f00');

  newPdf.end();

  pdfWirteStream.on("finish", () => {
    res.json({ success: true });
  });
};

module.exports = generatePDF;
