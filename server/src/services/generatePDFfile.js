const fs = require("fs");
const PDFDocument = require("pdfkit");
const { fullFormatDate, shortFormatDate, capitalize } = require("../helper");

const generatePDFfile = async (
  referenceNumber,
  [transactionDetail],
  productList,
  [userInformation]
) => {
  return new Promise((resolve, reject) => {
    try {
      let page = 1;
      const totalRecords = productList.length;
      const totalPages = Math.ceil((totalRecords - 11) / 15) + 1;
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

      const createHeader = () => {
        newPdf.image("src/images/Logo.jpg", { height: 65, width: 120 });

        newPdf
          .fontSize(10)
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
      };

      const createReportIndicator = () =>
        newPdf
          .fontSize(12)
          .fill("#000")
          .text("Report Reference", 465.28, 47.5, {
            width: 100,
          })
          .moveDown(0.2)
          .fill("#666")
          .text(`${transactionDetail.reference_number}`, {
            width: 100,
          })
          .moveDown(0.5)
          .fill("#000")
          .text("Date", {
            width: 100,
          })
          .moveDown(0.2)
          .fill("#666")
          .text(`${shortFormatDate(transactionDetail.created_at)}`, {
            width: 100,
          });

      const createTableTitle = (y = 245) =>
        newPdf
          .fontSize(12)
          .fill("#000")
          .text("Item", pdfMarginPt, y + 5, {
            width: 215.28,
          })
          .text("Location", pdfMarginPt + 215.28, y + 5, {
            width: 100,
          })
          .text("Amount (pcs.)", pdfMarginPt + 315.28, y + 5, {
            align: "right",
            width: 100,
          })
          .text("Balance (pcs.)", pdfMarginPt + 415.28, y + 5, {
            align: "right",
            width: 100,
          })
          .moveTo(pdfMarginPt, y + 20)
          .lineTo(555.28, y + 20)
          .stroke("#000");

      const createReportTitle = () =>
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

      const createPageIndicator = () =>
        newPdf
          .fontSize(10)
          .fill("#666")
          .text(`${page} of ${totalPages}`, 505.28, 781.89, {
            width: 50,
            align: "right",
          })
          .fill("#000");

      const createTransactionRemark = () =>
        newPdf
          .moveDown(2.5)
          .fontSize(12)
          .text(`Note: ${transactionDetail.detail}`, pdfMarginPt, newPdf.y, {
            width: 515.28,
            height: 40,
            ellipsis: true,
          });

      const createReportCompleteDetail = () =>
        newPdf
          .fontSize(12)
          .fill("#000")
          .text(
            `Date: ${fullFormatDate(transactionDetail.created_at)}`,
            pdfMarginPt,
            165,
            {
              width: pdfWidth,
              height: 20,
            }
          )
          .moveDown(0.25)
          .text(
            `Responsable: ${userInformation.firstname} ${userInformation.lastname}`,
            {
              width: pdfWidth,
              height: 20,
            }
          )
          .moveDown(0.25)
          .text(`Email: ${userInformation.email}`, {
            width: pdfWidth,
            height: 20,
          })
          .moveTo(pdfMarginPt, 220)
          .lineWidth(4)
          .lineTo(555.28, 220)
          .stroke("#000")
          .lineWidth(1);

      const createDataRow = (value, multiplier, y = 245) => {
        newPdf
          .fontSize(12)
          .fill("#000")
          .text(
            value.product_id,
            pdfMarginPt,
            y + multiplier * 45 + 5 + 20 + 5,
            {
              width: 215.28,
            }
          )
          .fill("#777")
          .text(
            value.product_name,
            pdfMarginPt,
            y + multiplier * 45 + 5 + 20 + 15 + 5,
            {
              width: 215.28,
            }
          )
          .fill("#000")
          .text(
            value.location,
            pdfMarginPt + 215.28,
            y + multiplier * 45 + 5 + 20 + 10 + 5,
            {
              width: 100,
            }
          )
          .text(
            (transactionDetail.action_type === "DELETE" ? "- " : "+ ") +
              value.amount.toLocaleString(),
            pdfMarginPt + 315.28,
            y + multiplier * 45 + 5 + 20 + 10 + 5,
            {
              align: "right",
              width: 100,
            }
          )
          .text(
            value.balance.toLocaleString(),
            pdfMarginPt + 415.28,
            y + multiplier * 45 + 5 + 20 + 10 + 5,
            {
              align: "right",
              width: 100,
            }
          );

        newPdf
          .moveTo(pdfMarginPt, y + multiplier * 45 + 5 + 20 + 15 + 5 + 20)
          .lineTo(555.28, y + multiplier * 45 + 5 + 20 + 15 + 5 + 20)
          .stroke("#ddd");
      };

      createHeader();
      createReportIndicator();
      createReportTitle();
      createReportCompleteDetail();
      createTableTitle();

      if (productList.length <= 10) {
        productList.map((value, index) => createDataRow(value, index));
        createTransactionRemark();
      } else {
        for (let i = 0; i <= 10; i++) {
          const value = productList[0];
          productList.shift();
          createDataRow(value, i);
        }
        createPageIndicator();

        while (productList[0]) {
          newPdf.addPage();
          page += 1;
          createTableTitle(45);

          for (let i = 0; i < 15; i++) {
            const value = productList[0];
            productList.shift();
            if (value) {
              createDataRow(value, i, 45);
            }
          }

          if (page === totalPages) {
            createTransactionRemark();
          }
          createPageIndicator();
        }
      }

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
