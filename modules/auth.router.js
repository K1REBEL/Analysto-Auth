require("dotenv").config();

const { signIn } = require('./controllers/auth.controller');
const { adminSave , getRequests , sendRequest , rejectRequest, testFetch } = require('./controllers/admin.controller');
const { orgIndex, newOrg, setOrgPass, getOrg, softDelOrg, restoreOrg, delEmp } = require('./controllers/org.controller');
const { empIndex, newEmp, setEmpPass, getEmp } = require('./controllers/emp.controller');
const { newPro, addLink , getProducts , deletePro} = require('./controllers/product.controller');

const router = require('express').Router();
const userAPI = require("./userRoles");
const {auth} = require("../middleware/auth");

// const authValidation = require("./auth.validator");
const validationFun = require('../middleware/validation');


router.get("/auth/signUp", (req, res)=> res.send("Auth Router!"));
router.get("/testFetch", testFetch);

router.post("/saveadmin", adminSave);
router.post("/auth/signIn", /*validationFun(authValidation.signIn),*/ signIn);

router.post("/org/addorg", auth(userAPI.addOrg), newOrg);
router.get("/admin/orgIndex", auth(userAPI.orgIndex), orgIndex);
router.get("/org/empIndex", auth(userAPI.orgEmpIndex), empIndex);

router.get("/org/:orgID/empIndex", auth(userAPI.adminEmpIndex), empIndex); // 
router.get("/org/emp/:userID", auth(userAPI.getEmp), getEmp);
router.get("/org/:orgID", auth(userAPI.getOrg), getOrg);

router.patch("/org/freeze/:orgID", auth(userAPI.deleteOrg), softDelOrg);
router.patch("/org/restore/:orgID", auth(userAPI.restoreOrg), restoreOrg);

router.delete("/org/emp/:userID", auth(userAPI.delEmp), delEmp);
router.patch("/org/setOrgPass", auth(userAPI.setOrgPass), setOrgPass);
router.post("/emp/addEmp", auth(userAPI.addEmp), newEmp);

router.patch("/emp/setEmpPass", auth(userAPI.setEmpPass), setEmpPass);
router.post("/pro/addPro", auth(userAPI.addPro), newPro);
router.post("/pro/addLink/:prod_id", auth(userAPI.addLink), addLink);
router.get("/products", auth(userAPI.getProducts), getProducts);
router.delete("/product/:prod_id", auth(userAPI.deletePro), deletePro);

router.get("/admin/requests", auth(userAPI.getRequests), getRequests);
router.post("/requests", sendRequest);
router.patch("/admin/rejReq/:req_id", auth(userAPI.rejectRequest), rejectRequest);

module.exports = router;
