const fs = require("fs");
const PDFDocument = require("pdfkit");
const moment = require("moment");

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const generatePDFfile = async (
  referenceNumber,
  [transactionDetail],
  productList,
  [userInformation]
) => {
  return new Promise((resolve, reject) => {
    try {
      const pdfSizePt = { width: 595.28, height: 841.89 };
      const pdfMarginPt = 40;
      const pdfWidth = pdfSizePt.width - pdfMarginPt * 2;

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

      newPdf.pipe(pdfWirteStream);
      console.log(userInformation);

      // Logo
      newPdf.image("src/images/Logo.jpg", { height: 65, width: 120 });

      //  Company detail
      newPdf
        .fontSize(11)
        .fill("#666")
        .text("MAGIC BOX ASIA 5th Floor, Sethiwan Tower", 180, 47.5, {
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
        .text(`${transactionDetail.reference_number}`, {
          width: 100,
        })
        .moveDown(0.5)
        .fill("#000")
        .text("Invoice Date", {
          width: 100,
        })
        .moveDown(0.2)
        .fill("#666")
        .text(`${moment.utc(transactionDetail.created_at).format("L")}`, {
          width: 100,
        });
      // .moveDown(0.2)
      // .text(`${moment.utc(transactionDetail.created_at).format("LT")}`, {
      //   width: 100,
      // });

      //  Invoice title
      newPdf
        .fontSize(14)
        .fill("#000")
        .text(
          `${capitalize(
            transactionDetail.action_name
          )} Product Transaction Record`,
          40,
          130,
          {
            width: pdfWidth,
            align: "center",
          }
        );

      //Transaction detail
      //   newPdf.rect(pdfMarginPt, 165, 250, 70).stroke("#000");
      newPdf
        .fontSize(11)
        .fill("#000")
        .text(`Date: ${transactionDetail.created_at}`, pdfMarginPt, 165, {
          width: 250,
          height: 20,
          ellipsis: true,
          lineBreak: false,
        })
        .moveDown(0.25)
        .text(
          `Responsable: ${userInformation.firstname} ${userInformation.lastname}`,
          {
            width: 250,
          }
        )
        .moveDown(0.25)
        .text(`Email: ${userInformation.email}`, {
          width: 250,
        })
        .moveTo(pdfMarginPt, 220)
        .lineWidth(4)
        .lineTo(555.28, 220)
        .stroke("#000")
        .lineWidth(1);

      //  Table title
      //  595.28
      newPdf
        .fontSize(12)
        .fill("#000")
        .text("Item", pdfMarginPt, 245 + 5, {
          width: 215.28,
        })
        .text("Location", pdfMarginPt + 215.28, 245 + 5, {
          width: 100,
        })
        .text("Amount (pcs.)", pdfMarginPt + 315.28, 245 + 5, {
          align: "right",
          width: 100,
        })
        .text("Balance (pcs.)", pdfMarginPt + 415.28, 245 + 5, {
          align: "right",
          width: 100,
        })
        .moveTo(pdfMarginPt, 245 + 20)
        .lineTo(555.28, 245 + 20)
        .stroke("#000");

      productList.map((value, i) => {
        newPdf
          .fontSize(12)
          .fill("#000")
          .text(value.product_id, pdfMarginPt, 245 + i * 45 + 5 + 20 + 5, {
            width: 215.28,
          })
          .fill("#777")
          .text(
            value.product_name,
            pdfMarginPt,
            245 + i * 45 + 5 + 20 + 15 + 5,
            {
              width: 215.28,
            }
          )
          .fill("#000")
          .text(
            value.location,
            pdfMarginPt + 215.28,
            245 + i * 45 + 5 + 20 + 10 + 5,
            {
              width: 100,
            }
          )
          .text(
            (transactionDetail.action_type === "DELETE" ? "- " : "+ ") +
              value.amount.toLocaleString(),
            pdfMarginPt + 315.28,
            245 + i * 45 + 5 + 20 + 10 + 5,
            {
              align: "right",
              width: 100,
            }
          )
          .text(
            value.balance.toLocaleString(),
            pdfMarginPt + 415.28,
            245 + i * 45 + 5 + 20 + 10 + 5,
            {
              align: "right",
              width: 100,
            }
          );

        newPdf
          .moveTo(pdfMarginPt, 245 + i * 45 + 5 + 20 + 15 + 5 + 20)
          .lineTo(555.28, 245 + i * 45 + 5 + 20 + 15 + 5 + 20)
          .stroke("#ddd");
      });

      newPdf.moveTo(pdfMarginPt, 801.89).lineTo(555.28, 801.89).stroke("#f00");

      newPdf.end();

      pdfWirteStream.on("finish", () => {
        resolve(true);
      });
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = generatePDFfile;
