const { getProduct } = require("../services");

const validateProductHandler = async (req) => {
  const response = {
    success: false,
    result: null,
  };

  const orderByClause = "ORDER BY status ASC, created_at ASC";
  const whereClause = `WHERE product.product_id = '${req.query.validate}'`;

  const productResult = await getProduct(whereClause, orderByClause);

  if (productResult.length) {
    response.success = true;
    response.result = productResult;
  }
  return response;
};

module.exports = validateProductHandler;
