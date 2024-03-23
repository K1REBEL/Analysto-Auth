const { accessroles } = require("../middleware/auth");

const userAPI = {
   addOrg: [accessroles.admin],
   orgIndex: [accessroles.admin],
   getOrg: [accessroles.admin],
   deleteOrg: [accessroles.admin],
   restoreOrg: [accessroles.admin],
   getRequests: [accessroles.admin],
   rejectRequest: [accessroles.admin],
   setOrgPass: [accessroles.admin, accessroles.org],
   adminEmpIndex: [accessroles.admin],
   getEmp:[accessroles.org],
   orgEmpIndex: [accessroles.org],
   addEmp: [accessroles.org],
   delEmp: [accessroles.org],
   setEmpPass: [accessroles.org, accessroles.emp],
   addPro: [accessroles.emp],
   addLink: [accessroles.emp],
   getProducts: [accessroles.emp],
}

module.exports = userAPI; 