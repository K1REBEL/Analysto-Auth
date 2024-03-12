require("dotenv").config();

const { adminSave, signIn } = require('./controllers/auth.controller');
const { orgIndex, newOrg, setOrgPass, getOrg , softDelOrg } = require('./controllers/org.controller');
const { empIndex, newEmp, setEmpPass, getEmp} = require('./controllers/emp.controller');
const { newPro, addLink } = require('./controllers/product.controller');

const userAPI = require("./userRoles");
const {auth} = require("../middleware/auth");

const router = require('express').Router();

// const authValidation = require("./auth.validator");
const validationFun = require('../middleware/validation');


router.get("/auth/signUp", (req, res)=> res.send("Auth Router!"));
router.post("/saveadmin", adminSave);
router.get("/auth/signIn", /*validationFun(authValidation.signIn),*/ signIn);
router.post("/org/addorg", auth(userAPI.addOrg), newOrg);
router.get("/admin/orgIndex", auth(userAPI.orgIndex), orgIndex);
router.get("/org/empIndex", auth(userAPI.orgEmpIndex), empIndex);
router.get("/org/:orgID/empIndex", auth(userAPI.adminEmpIndex), empIndex); // 
router.get("/org/emp/:userID", auth(userAPI.getEmp), getEmp);
router.get("/org/:orgID", auth(userAPI.getOrg), getOrg);
router.patch("/org/:orgID", auth(userAPI.deleteOrg), softDelOrg);
router.patch("/org/setOrgPass", auth(userAPI.setOrgPass), setOrgPass);
router.post("/emp/addEmp", auth(userAPI.addEmp), newEmp);
router.patch("/emp/setEmpPass", auth(userAPI.setEmpPass), setEmpPass);
router.post("/pro/addPro", auth(userAPI.addPro), newPro);
router.post("/pro/addLink/:prod_id", auth(userAPI.addLink), addLink);

// router.post("/signUp",validationFun(authValidation.signUp),signUp);
// router.post("/signUpMobile",validationFun(authValidation.signUpMobile),signUpMobile);
// router.get("/confirm/:token", confirmEmail);

// router.post("/forgotPassword",validationFun(authValidation.forgotPassword), forgotPassword);
// router.patch("/resetPassword/:email",validationFun(authValidation.resetPassword), resetPassword);
// router.patch("/changePassword/:email",validationFun(authValidation.changePassword), changePassword);

// router.patch("/codeVerification",validationFun(authValidation.codeVerification), codeVerification);

module.exports = router;
