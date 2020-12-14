const { createNewRole, addRolePermission, getRoleId } = require("../services");

const createRoleHandler = async (role_name, detail, permission, status) => {
  let success = false;
  const createRoleResult = await createNewRole(role_name, detail);
  if (createRoleResult) {
    const roleId = await getRoleId(role_name);
    const permissionArray = permission.map((value) => [
      roleId,
      value.id,
      value.status,
    ]);
    const addRolePermissionResult = await addRolePermission(permissionArray);
    if (addRolePermissionResult) {
      success = true;
    }
  }
  return success;
};

module.exports = createRoleHandler;
