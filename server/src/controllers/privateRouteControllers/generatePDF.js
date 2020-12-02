/**
 *   @DESCRIPTION   -   Get the list of all registered product
 *   @ROUTE         -   [GET] /api/smart-warehouse/generate-report
 *   @ACCESS        -   PRIVATE (admin)
 */

const generatePDF = async (req, res, next) => {
  const fs = require("fs");
  const PDFDocument = require("pdfkit");

  const pdfSizePt = { width: 595.28, height: 841.89 };
  const pdfMarginPt = 40;
  const pdfWidth = pdfSizePt.width - pdfMarginPt * 2;

  const { reference_number: referenceNumber } = req.params;

  const newPdf = new PDFDocument({
    size: [pdfSizePt.width, pdfSizePt.height],
    margins: {
      top: pdfMarginPt,
      bottom: pdfMarginPt,
      left: pdfMarginPt,
      right: pdfMarginPt,
    },
  });
  const pdfWirteStream = fs.createWriteStream(
    `reportPDF/${referenceNumber}.pdf`,
    {
      flags: "w+",
    }
  );

  // res.setHeader("Content-type", "application/pdf");
  res.attachment('pdfname.pdf');
  newPdf.pipe(pdfWirteStream);
  newPdf.pipe(res);

  newPdf
    //  Logo
    .rect(pdfMarginPt, pdfMarginPt, 120, 65)
    .stroke("#0f0")
    //  Company detail
    .rect(170, pdfMarginPt, 250, 65)
    .stroke("#0f0")
    //  Invoice title
    .rect(247.6, 125, 100, 20)
    .stroke("#000")
    //  Buyer / Seller detail
    .rect(pdfMarginPt, 165, 250, 70)
    .stroke("#000");
  // //  Col 1
  // .rect(pdfMarginPt, 255, 215.28, 20)
  // .stroke("#f00")
  // //  Col 2
  // .rect(pdfMarginPt + 215.28, 255, 100, 20)
  // .stroke("#0f0")
  // //  Col 3
  // .rect(pdfMarginPt + 315.28, 255, 100, 20)
  // .stroke("#00f")
  // //  Col 4
  // .rect(pdfMarginPt + 415.28, 255, 100, 20)
  // .stroke("#00f")

  // //  Col 1
  // .rect(pdfMarginPt, 275, 215.28, 20)
  // .stroke("#f00")
  // //  Col 2
  // .rect(pdfMarginPt + 215.28, 275, 100, 20)
  // .stroke("#0f0")
  // //  Col 3
  // .rect(pdfMarginPt + 315.28, 275, 100, 20)
  // .stroke("#00f")
  // //  Col 4
  // .rect(pdfMarginPt + 415.28, 275, 100, 20)
  // .stroke("#00f");

  // Logo
  newPdf.image("src/images/Logo.jpg", { height: 65, width: 120 });

  //  Company detail
  newPdf
    .fontSize(11)
    .fill("#666")
    .text("MAGIC BOX ASIA 5th Floor, Sethiwan Tower", 170, 47.5, {
      width: 250,
    })
    .moveDown(0.15)
    .text("139 Pan Road, Silom, Bangrak,", {
      width: 250,
    })
    .moveDown(0.15)
    .text("Bangkok, 10500, THAILAND", {
      width: 250,
    })
    .moveDown(0.15)
    .text("contact@magicboxasia.com | 02-266-6222", {
      width: 250,
    });

  //  Invoice detail
  newPdf
    .fontSize(12)
    .fill("#000")
    .text("Invoice Number", 465.28, 47.5, {
      width: 100,
    })
    .moveDown(0.2)
    .fill("#666")
    .text("1243423423", {
      width: 100,
    })
    .moveDown(0.5)
    .fill("#000")
    .text("Invoice Date", {
      width: 100,
    })
    .moveDown(0.2)
    .fill("#666")
    .text("1 Jan 2021", {
      width: 100,
    });

  //  Invoice title
  newPdf.fill("#000").text("Invoice", 247.6, 130, {
    width: 100,
    align: "center",
  });

  newPdf
    .moveTo(pdfMarginPt, 255 + 20)
    .lineTo(555.28, 255 + 20)
    .stroke("#ddd");

  //  Table title
  newPdf
    .fontSize(12)
    .fill("#000")
    .text("Item", pdfMarginPt, 255 + 5, {
      width: 215.28,
    })
    .text("Quantity", pdfMarginPt + 215.28, 255 + 5, {
      align: "right",
      width: 100,
    })
    .text("Unit price", pdfMarginPt + 315.28, 255 + 5, {
      align: "right",
      width: 100,
    })
    .text("Amount", pdfMarginPt + 415.28, 255 + 5, {
      align: "right",
      width: 100,
    });

  //  Table data
  // newPdf
  //   .fontSize(12)
  //   .fill("#000")
  //   .text("cajknckeajcekace", pdfMarginPt, 255 + 5 + 20 + 5, {
  //     width: 215.28,
  //   })
  //   .text("Some product name", pdfMarginPt, 255 + 5 + 20 + 15 + 5, {
  //     width: 215.28,
  //   })

  //   //
  //   .text("100", pdfMarginPt + 215.28, 255 + 5 + 20 + 10, {
  //     align: "center",
  //     width: 100,
  //   })
  //   .text("1500", pdfMarginPt + 315.28, 255 + 5 + 20 + 10, {
  //     align: "center",
  //     width: 100,
  //   })
  //   .text("150000", pdfMarginPt + 415.28, 255 + 5 + 20 + 10, {
  //     align: "center",
  //     width: 100,
  //   });

  //   newPdf
  //   .moveTo(pdfMarginPt, 255 + 5 + 20 + 15 + 5 + 20)
  //   .lineTo(555.28, 255 + 5 + 20 + 15 + 5 + 20)
  //   .stroke("#f00");

  for (let i = 0; i < 10; i++) {
    newPdf
      .fontSize(12)
      .fill("#000")
      .text("cajknckeajcekace", pdfMarginPt, 255 + i * 45 + 5 + 20 + 5, {
        width: 215.28,
      })
      .text("Some product name", pdfMarginPt, 255 + i * 45 + 5 + 20 + 15 + 5, {
        width: 215.28,
      })

      //
      .text("100", pdfMarginPt + 215.28, 255 + i * 45 + 5 + 20 + 10 + 5, {
        align: "right",
        width: 100,
      })
      .text("1500", pdfMarginPt + 315.28, 255 + i * 45 + 5 + 20 + 10 + 5, {
        align: "right",
        width: 100,
      })
      .text("150000", pdfMarginPt + 415.28, 255 + i * 45 + 5 + 20 + 10 + 5, {
        align: "right",
        width: 100,
      });

    newPdf
      .moveTo(pdfMarginPt, 255 + i * 45 + 5 + 20 + 15 + 5 + 20)
      .lineTo(555.28, 255 + i * 45 + 5 + 20 + 15 + 5 + 20)
      .stroke("#ddd");
  }
  newPdf.moveTo(pdfMarginPt, 801.89).lineTo(555.28, 801.89).stroke("#f00");

  // newPdf
  //   .fontSize(12)
  //   .fill("#000")
  //   .text("cajknckeajcekace", pdfMarginPt, 255 + 45 + 5 + 20 + 5, {
  //     width: 215.28,
  //   })
  //   .text("Some product name", pdfMarginPt, 255 + 45 + 5 + 20 + 15 + 5, {
  //     width: 215.28,
  //   })

  //   //
  //   .text("100", pdfMarginPt + 215.28, 255 + 45 + 5 + 20 + 10, {
  //     align: "center",
  //     width: 100,
  //   })
  //   .text("1500", pdfMarginPt + 315.28, 255 + 45 + 5 + 20 + 10, {
  //     align: "center",
  //     width: 100,
  //   })
  //   .text("150000", pdfMarginPt + 415.28, 255 + 45 + 5 + 20 + 10, {
  //     align: "center",
  //     width: 100,
  //   });

  // newPdf
  //   .moveTo(pdfMarginPt, 255 + 45 + 5 + 20 + 15 + 5 + 20)
  //   .lineTo(555.28, 255 + 45 + 5 + 20 + 15 + 5 + 20)
  //   .stroke("#f00");

  newPdf.end();

  pdfWirteStream.on("finish", () => {
    // res.json({ success: true });
    console.log("finish");
  });
};

module.exports = generatePDF;
