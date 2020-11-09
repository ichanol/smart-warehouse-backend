const { getUser } = require("../services");

const validateProductHandler = async (req) => {
  const response = {
    success: false,
    result: null,
  };

  let whereClause;

  if (req.query.type === "username") {
    whereClause = `AND user.username = '${req.query.validate}'`;
  } else if (req.query.type === "email") {
    whereClause = `AND user.email = '${req.query.validate}'`;
  } else {
    return response;
  }

  const productResult = await getUser(whereClause);

  if (productResult.length) {
    response.success = true;
    response.result = productResult;
  }
  return response;
};

module.exports = validateProductHandler;
