const downloadTemplate = async (req, res, next) => {
  try {
    if (req.params.type === "user") {
      res.attachment("user_template.xlsx");
      res.download("./template/user_template.xlsx");
    } else if (req.params.type === "product") {
      res.attachment("role_template.xlsx");
      res.download("./template/role_template.xlsx");
    } else if (req.params.type === "role") {
      res.attachment("product_template.xlsx");
      res.download("./template/product_template.xlsx");
    } else {
      res
        .status(400)
        .json({ success: false, message: "Cannot download template" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = downloadTemplate;
