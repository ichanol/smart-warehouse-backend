const mysql = require("mysql");

const connection = require("../Database_connection/connect");

exports.createProduct = async (req, res, next) => {
  const { number } = req.params;
  const username = 'tip';

  const serialNumberGenerator = (length) => {
    var result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  const productNameGenerator = () => {
    const arr = [
      "glass",
      "pen",
      "calendar",
      "charger",
      "USB-C",
      "shirt",
      "paint",
    ];
    return arr[Math.floor(Math.random() * arr.length)];
  };
  const companyNameGenerator = () => {
    const arr = ["Magic Box Asia", "Loong Pol"];
    return arr[Math.floor(Math.random() * arr.length)];
  };
  const locationGenerator = () => {
    const arr = ["Setthiwan 5th flr.", "Setthiwan 4th flr."];
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const insertData = () => {
    return new Promise((resolve, reject) => {
      let mockData = "";

      for (let i = 1; i <= number; i++) {
        if (i == number) {
          mockData += `(
        ${mysql.escape(serialNumberGenerator(10))},
        ${mysql.escape(productNameGenerator())},
        ${mysql.escape(companyNameGenerator())},
        ${mysql.escape(locationGenerator())},
        ${mysql.escape("detail ...")},
        ${mysql.escape(1)},
        (SELECT id FROM user WHERE username = ${mysql.escape(username)})
        )`;
        } else {
          mockData += `(
          ${mysql.escape(serialNumberGenerator(10))},
          ${mysql.escape(productNameGenerator())},
          ${mysql.escape(companyNameGenerator())},
          ${mysql.escape(locationGenerator())},
          ${mysql.escape("detail ...")},
          ${mysql.escape(1)},
          (SELECT id FROM user WHERE username = ${mysql.escape(username)})
        ),`;
        }
      }
      const SQL = `INSERT INTO product(product_id, product_name, company_name, location, detail, status, created_by) VALUES ${mockData}`;
      connection.query(SQL, (error, result, field) => {
        console.log(SQL);
        if (error) return reject(error);
        resolve(result);
      });
    });
  };
  const result = await insertData();
  if (result) {
    res.json({ success: true, message: `${number} has been created` });
  } else {
    res.json({ success: false, message: "Failed to create new product" });
  }
};
