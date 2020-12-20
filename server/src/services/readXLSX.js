const readXlsxFile = require("read-excel-file/node");

const readXLSX = async (filePath) => {
  const rows = await readXlsxFile(filePath);
  rows.shift();
  return rows;
};

module.exports = readXLSX;
