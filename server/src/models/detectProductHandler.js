const { getProductInformationById } = require("../services");

const detectProductHandler = async (data) => {
  const productId = data.map((value) => value.product_serial_number);

  const productInformationResult = await getProductInformationById(productId);

  if (productInformationResult.length > 0) {
    const result = productInformationResult.map((value, key) => {
      value.product_serial_number = data[key].product_serial_number;
      value.amount = data[key].amount;
      return value
    });
    return result;
  } else {
    return false;
  }
};

module.exports = detectProductHandler;
