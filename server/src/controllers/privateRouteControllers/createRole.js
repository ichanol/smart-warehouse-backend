/**
 *   @DESCRIPTION   -   Create new role
 *   @ROUTE         -   [POST] /api/smart-warehouse/roles
 *   @ACCESS        -   PRIVATE (admin)
 */

const { createNewRole } = require("../../services");

const createRole = async (req, res, next) => {
  try {
    const { role_name, detail, permission, status } = req.body;

    const result = await createNewRole(role_name, detail, permission, status);

    if (result) {
      res.status(201).json({
        success: true,
        message: "Successfully created a new role",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to created a new role",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = createRole;
