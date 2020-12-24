const {
  createNewProduct,
  createNewCurrentProductBalanceRecord,
} = require("../services");
const validateProductHandler = require("./validateProductHandler");

const createProductHandler = async (req) => {
  const response = {
    success: false,
  };
  const {
    product_id,
    product_name,
    company_name,
    location,
    detail,
    status,
  } = req.body;

  req.query.validate = product_id;

  const { success: isProductIdValid } = await validateProductHandler(req);

  if (!isProductIdValid) {
    const createNewProductResult = await createNewProduct(
      product_id,
      product_name,
      company_name,
      location,
      detail,
      status,
      req.decodedUsername
    );

    if (createNewProductResult) {
      const createNewCurrentProductBalanceResult = await createNewCurrentProductBalanceRecord(
        product_id,
        location
      );
      if (createNewCurrentProductBalanceResult) {
        response.success = true;
      }
    }
  }
  return response;
};

module.exports = createProductHandler;
