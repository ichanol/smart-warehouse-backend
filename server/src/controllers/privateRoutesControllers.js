const mysql = require("mysql");
const connection = require("../Database_connection/connect");

//  DESCRIPTION   - Destroy user credential
//  ROUTE         - [POST] /api/smart-warehouse/logout
//  ACCESS        - PRIVATE
exports.userLogOut = (req, res, next) => {
  res.send("LOG OUT");
  connection.end();
};

//  DESCRIPTION   - Add import products (S/N, amount, etc), update the tables in the database
//  ROUTE         - [POST] /api/smart-warehouse/import-product
//  ACCESS        - PRIVATE (admin. crew)
exports.importProduct = (req, res, next) => {
  res.send("IMPORT PRODUCT");
};

//  DESCRIPTION   - Add export products (S/N, amount, etc), update the tables in the database
//  ROUTE         - [POST] /api/smart-warehouse/export-product
//  ACCESS        - PRIVATE (admin, crew)
exports.exportProduct = (req, res, next) => {
  res.send("EXPORT PRODUCT");
};

//  DESCRIPTION   - Add export products (S/N, amount, etc), update the tables in the database
//  ROUTE         - [POST] /api/smart-warehouse/export-product
//  ACCESS        - PRIVATE (admin, crew)
exports.updateTransaction = async (req, res, next) => {
  try {
    const { referenceNumber, actionType, username, productList } = req.body;

    console.log(productList);
    let idForQueryBalance;
    let valueToInsert;
    let valueToUpdate;

    await productList.map((value, key) => {
      if (key === 0) {
        idForQueryBalance = `${mysql.escape(value.id)},`;
      } else if (key === productList.length - 1) {
        idForQueryBalance = idForQueryBalance + `${mysql.escape(value.id)}`;
      } else {
        idForQueryBalance = idForQueryBalance + `${mysql.escape(value.id)},`;
      }
    });

    const queryProductBalanceData = () => {
      return new Promise((resolve, reject) => {
        const SQL = `SELECT balance FROM current_product_balance WHERE product_id IN (${idForQueryBalance})`;
        connection.query(SQL, (error, result, field) => {
          if (error) return reject(error);
          resolve(result);
        });
      });
    };

    const productBalanceResult = await queryProductBalanceData();

    await productList.map((value, key) => {
      if (key === 0) {
        valueToInsert = `(
                          ${mysql.escape(referenceNumber)},
                          ${mysql.escape(value.id)},
                          ${mysql.escape(actionType)},
                          ${mysql.escape(value.amount)},
                          ${mysql.escape(
                            productBalanceResult[key].balance + value.amount
                          )},
                          ${mysql.escape(value.location)},
                          ${mysql.escape(4)},
                          ${mysql.escape(value.detail)}
                        ),`;

        valueToUpdate = `WHEN product_id = ${mysql.escape(
          value.id
        )} THEN ${mysql.escape(
          productBalanceResult[key].balance + value.amount
        )} `;
      } else if (key === productList.length - 1) {
        valueToInsert =
          valueToInsert +
          `(
            ${mysql.escape(referenceNumber)},
            ${mysql.escape(value.id)},
            ${mysql.escape(actionType)},
            ${mysql.escape(value.amount)},
            ${mysql.escape(productBalanceResult[key].balance + value.amount)},
            ${mysql.escape(value.location)},
            ${mysql.escape(4)},
            ${mysql.escape(value.detail)}
          )`;
        valueToUpdate =
          valueToUpdate +
          `WHEN product_id = ${mysql.escape(value.id)} THEN ${mysql.escape(
            productBalanceResult[key].balance + value.amount
          )} `;
      } else {
        valueToInsert =
          valueToInsert +
          `(
            ${mysql.escape(referenceNumber)},
            ${mysql.escape(value.id)},
            ${mysql.escape(actionType)},
            ${mysql.escape(value.amount)},
            ${mysql.escape(productBalanceResult[key].balance + value.amount)},
            ${mysql.escape(value.location)},
            ${mysql.escape(4)},
            ${mysql.escape(value.detail)}
          ),`;
        valueToUpdate =
          valueToUpdate +
          `WHEN product_id = ${mysql.escape(value.id)} THEN ${mysql.escape(
            productBalanceResult[key].balance + value.amount
          )} `;
      }
    });

    const updateCurrentProductBalance = () => {
      return new Promise((resolve, reject) => {
        const SQL = `UPDATE current_product_balance SET  balance = CASE ${valueToUpdate} END WHERE product_id IN (${idForQueryBalance})`;
        connection.query(SQL, (error, result, field) => {
          if (error) return reject(error);
          resolve(result);
        });
      });
    };
    const updateCurrentProductBalanceResult = await updateCurrentProductBalance();

    const saveTransaction = () => {
      return new Promise((resolve, reject) => {
        const SQL = `INSERT INTO inventory_log(reference_number, product_id, action_type, amount, balance, location, responsable, detail) VALUES ${valueToInsert}`;
        connection.query(SQL, (error, result, field) => {
          if (error) return reject(error);
          resolve(result);
        });
      });
    };
    const saveTransactionResult = await saveTransaction();

    await res
      .status(201)
      .json({ success: true, message: "Save transaction successfully" });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - When client send this request to server, server will send another request
//                  to the hardware to tell the RFID reader to read RFID tags
//  ROUTE         - [GET] /api/smart-warehouse/read-RFID
//  ACCESS        - PRIVATE (admin,crew)
exports.readRFID = (req, res, next) => {
  try {
    const sql = `SELECT * FROm user`;
    connection.query(sql).then((result) => console.log(result));
    res.send("READ RFID");
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Show the transaction/history (import/export logs), user can filter the result
//                  by sending query parameters with request
//  ROUTE         - [GET] /api/smart-warehouse/product-transaction
//  ACCESS        - PRIVATE (admin reporter)
exports.productTransaction = (req, res, next) => {
  res.send("HISTORY");
};

//  DESCRIPTION   - Show the current amount of each product that store in the warehouse
//  ROUTE         - [GET] /api/smart-warehouse/product-balance
//  ACCESS        - PRIVATE (admin, reporter)
exports.productBalance = (req, res, next) => {
  try {
    const sql = `SELECT * FROM current_product_balance`;
    connection.query(sql, (error, result, field) => {
      res.json({ result });
    });
  } catch (error) {
    next(error);
  }
};

//########################################################################################################################

//  DESCRIPTION   - Get the list of all registered user
//  ROUTE         - [GET] /api/smart-warehouse/users
//  ACCESS        - PRIVATE (admin)
exports.getUser = (req, res, next) => {
  try {
    const SQL = `SELECT * FROM user`;
    connection.query(SQL, (error, result, field) => {
      if (result.length > 0) {
        res.json(result);
      } else
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Update the information of specific user
//  ROUTE         - [PUT] /api/smart-warehouse/users
//  ACCESS        - PRIVATE (admin)
exports.updateUser = (req, res, next) => {
  try {
    const {
      username,
      firstname,
      lastname,
      role,
      status,
      password,
      id,
    } = req.body;
    const SQL = `UPDATE user
    SET username= ${mysql.escape(username)}, firstname = ${mysql.escape(
      firstname
    )}, lastname = ${mysql.escape(lastname)},password = ${mysql.escape(
      password
    )},role = ${mysql.escape(role)}, status = ${mysql.escape(status)}
    WHERE id = ${mysql.escape(id)};`;
    connection.query(SQL, (error, result, field) => {
      res.status(200).json({
        success: true,
        message: "Update user information successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Delete / deactive specific user
//  ROUTE         - [DELETE] /api/smart-warehouse/users
//  ACCESS        - PRIVATE (admin)
exports.deleteUser = (req, res, next) => {
  try {
    const { username, detail } = req.body;
    const SQL = `UPDATE user SET status = 2, detail = ${mysql.escape(
      detail
    )} WHERE username = ${mysql.escape(username)};`;
    connection.query(SQL, (error, result, field) => {
      res.status(200).json({
        success: true,
        message:
          "Deactivate user successfully. This user has no longer available",
      });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Create new user
//  ROUTE         - [POST] /api/smart-warehouse/users
//  ACCESS        - PRIVATE (admin)
exports.createUser = (req, res, next) => {
  try {
    const { username, firstname, lastname, password, role, status } = req.body;
    const SQL = `INSERT INTO user(username, firstname, lastname, password, role, status) VALUES (${mysql.escape(
      username
    )},${mysql.escape(firstname)},${mysql.escape(lastname)},${mysql.escape(
      password
    )},${mysql.escape(role)}, ${mysql.escape(status)})`;
    connection.query(SQL, (error, result, field) => {
      res.status(201).json({
        success: true,
        message: "Successfully created a new user account",
      });
    });
  } catch (error) {
    next(error);
  }
};

//########################################################################################################################

//  DESCRIPTION   - Get the list of all registered product
//  ROUTE         - [GET] /api/smart-warehouse/products
//  ACCESS        - PRIVATE (admin)
exports.getProduct = (req, res, next) => {
  try {
    const SQL = `SELECT * FROM product`;
    connection.query(SQL, (error, result, field) => {
      if (result.length > 0) {
        res.json(result);
      } else
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Update the information of specific product
//  ROUTE         - [PUT] /api/smart-warehouse/products
//  ACCESS        - PRIVATE (admin)
exports.updateProduct = (req, res, next) => {
  try {
    const {
      id,
      product_id,
      product_name,
      company_name,
      location,
      detail,
    } = req.body;
    const SQL = `UPDATE product
    SET product_id = ${mysql.escape(product_id)}, product_name = ${mysql.escape(
      product_name
    )}, company_name = ${mysql.escape(company_name)}, location = ${mysql.escape(
      location
    )}, detail = ${mysql.escape(detail)}
    WHERE id = ${mysql.escape(id)};`;
    connection.query(SQL, (error, result, field) => {
      res.status(200).json({
        success: true,
        message: "Update product information successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Delete / remove specific product
//  ROUTE         - [DELETE] /api/smart-warehouse/products
//  ACCESS        - PRIVATE (admin)
exports.deleteProduct = (req, res, next) => {
  try {
    const { product_id, detail } = req.body;
    console.log(product_id, detail);
    const SQL = `UPDATE product SET status = 2, detail = ${mysql.escape(
      detail
    )} WHERE product_id = ${mysql.escape(product_id)};`;
    connection.query(SQL, (error, result, field) => {
      res.status(200).json({
        success: true,
        message: "Remove product successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Create new product
//  ROUTE         - [POST] /api/smart-warehouse/products
//  ACCESS        - PRIVATE (admin)
exports.createProduct = (req, res, next) => {
  try {
    const {
      product_id,
      product_name,
      company_name,
      location,
      detail,
      status,
    } = req.body;
    const SQL = `INSERT INTO product(product_id, product_name, company_name, location, detail, status) VALUES (${mysql.escape(
      product_id
    )},${mysql.escape(product_name)},${mysql.escape(
      company_name
    )},${mysql.escape(location)},${mysql.escape(detail)},${mysql.escape(
      status
    )})`;
    connection.query(SQL, (error, result, field) => {
      res.status(201).json({
        success: true,
        message: "Successfully created a new product",
      });
    });
  } catch (error) {
    next(error);
  }
};

//########################################################################################################################

//  DESCRIPTION   - Get the list of all roles
//  ROUTE         - [GET] /api/smart-warehouse/roles
//  ACCESS        - PRIVATE (admin)
exports.getRole = (req, res, next) => {
  try {
    const SQL = `SELECT * FROM role`;
    connection.query(SQL, (error, result, field) => {
      if (result.length > 0) {
        res.json(result);
      } else
        res
          .status(404)
          .json({ success: false, message: "Can't get the information" });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Update the information of specific role
//  ROUTE         - [PUT] /api/smart-warehouse/roles
//  ACCESS        - PRIVATE (admin)
exports.updateRole = (req, res, next) => {
  try {
    const { id, role_name, detail } = req.body;
    const SQL = `UPDATE role
    SET role_name = ${mysql.escape(role_name)}, detail = ${mysql.escape(detail)}
    WHERE id = ${mysql.escape(id)};`;
    connection.query(SQL, (error, result, field) => {
      res.status(200).json({
        success: true,
        message: "Update role information successfully",
      });
    });
  } catch (error) {
    next(error);
  }
};

//  DESCRIPTION   - Delete / deactive specific role
//  ROUTE         - [DELETE] /api/smart-warehouse/roles
//  ACCESS        - PRIVATE (admin)
exports.deleteRole = (req, res, next) => {
  res.send("DELETE ROLE");
};

//  DESCRIPTION   - Create new role
//  ROUTE         - [POST] /api/smart-warehouse/roles
//  ACCESS        - PRIVATE (admin)
exports.createRole = (req, res, next) => {
  try {
    const { role_name, detail } = req.body;
    const SQL = `INSERT INTO role(role_name, detail) VALUES (${mysql.escape(
      role_name
    )},${mysql.escape(detail)})`;
    connection.query(SQL, (error, result, field) => {
      res.status(201).json({
        success: true,
        message: "Successfully created a new role",
      });
    });
  } catch (error) {
    next(error);
  }
};
