const { accessroles } = require("../middleware/auth");

const userAPI = {
   addOrg: [accessroles.admin],
   orgIndex: [accessroles.admin],
   getOrg: [accessroles.admin],
   deleteOrg: [accessroles.admin],
   setOrgPass: [accessroles.admin, accessroles.org],
   adminEmpIndex: [accessroles.admin],
   getEmp:[accessroles.org],
   orgEmpIndex: [accessroles.org],
   addEmp: [accessroles.org],
   setEmpPass: [accessroles.org, accessroles.emp],
   addPro: [accessroles.emp],
   addLink: [accessroles.emp],
   getDetails:[accessroles.admin, accessroles.user],
   deleteUser:[accessroles.admin, accessroles.user],
   softDelete:[accessroles.admin],
   updateEmail:[accessroles.admin, accessroles.user],
   addVehicle:[accessroles.admin],
   getVehicle:[accessroles.admin,accessroles.user],
   getEvent:[accessroles.admin, accessroles.user],
}

module.exports = userAPI; 