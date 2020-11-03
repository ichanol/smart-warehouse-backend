const { getUser } = require("../services");

const validateProductHandler = async (req) => {
  const response = {
    success: false,
    result: null,
  };

  const orderByClause = "ORDER BY user.status ASC, user.created_at ASC";
  const whereClause = `WHERE user.username = '${req.query.validate}'`;

  const productResult = await getUser(whereClause, orderByClause);

  if (productResult.length) {
    response.success = true;
    response.result = productResult;
  }
  return response;
};

module.exports = validateProductHandler;
