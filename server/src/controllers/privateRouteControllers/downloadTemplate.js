const downloadTemplate = async (req, res, next) => {
  try {
    if (req.params === "user") {
      res.attachment("user_template.xlsx");
      res.download("./template/user_template.xlsx");
    } else if (req.params === "product") {
      res.attachment("role_template.xlsx");
      res.download("./template/role_template.xlsx");
    } else if (req.params === "role") {
      res.attachment("product_template.xlsx");
      res.download("./template/product_template.xlsx");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = downloadTemplate;
