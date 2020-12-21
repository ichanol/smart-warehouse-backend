const fs = require("fs");
const csv = require("fast-csv");

const readCSV = async (filePath) => {
  const stream = fs.createReadStream(filePath);
  const csvData = [];
  const csvStream = csv
    .parse()
    .on("data", (result) => {
      csvData.push(result);
    })
    .on("end", async () => {
      csvData.shift();
      return csvData;
    });
  stream.pipe(csvStream);
};

module.exports = readCSV;
