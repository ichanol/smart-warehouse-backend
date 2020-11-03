const { getRole } = require("../services");

const validateRoleHandler = async (req) => {
  const response = {
    success: false,
    result: null,
  };

  const orderByClause = "ORDER BY ROLE.status ASC, ROLE.created_at ASC";
  const whereClause = `WHERE ROLE.role_name = '${req.query.validate}'`;

  const roleResult = await getRole(whereClause, orderByClause);

  if (roleResult.length) {
    response.success = true;
    response.result = roleResult;
  }
  return response;
};

module.exports = validateRoleHandler;
