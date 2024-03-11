require("dotenv").config();

const { adminSave, signIn } = require('./controllers/auth.controller');
const { orgIndex, newOrg, setOrgPass, getOrg } = require('./controllers/org.controller');
const { empIndex, newEmp, setEmpPass, getEmp} = require('./controllers/emp.controller');
const { newPro, addLink } = require('./controllers/product.controller');

const userAPI = require("./userRoles");
const {auth} = require("../middleware/auth");

const router = require('express').Router();

// const authValidation = require("./auth.validator");
const validationFun = require('../middleware/validation');


router.get("/signUp", (req, res)=> res.send("Auth Router!"));
router.post("/saveadmin", adminSave);
router.get("/signIn", /*validationFun(authValidation.signIn),*/ signIn);
router.post("/addorg", auth(userAPI.addOrg), newOrg);
router.get("/orgIndex", auth(userAPI.orgIndex), orgIndex);
router.get("/org/empIndex", auth(userAPI.orgEmpIndex), empIndex);
router.get("/org/:orgID/empIndex", auth(userAPI.adminEmpIndex), empIndex);
router.get("/org/emp/:userID", auth(userAPI.getEmp), getEmp);
router.get("/org/:orgID", auth(userAPI.getOrg), getOrg);
router.patch("/setOrgPass", auth(userAPI.setOrgPass), setOrgPass);
router.post("/addEmp", auth(userAPI.addEmp), newEmp);
router.patch("/setEmpPass", auth(userAPI.setEmpPass), setEmpPass);
router.post("/addPro", auth(userAPI.addPro), newPro);
router.post("/addLink/:prod_id", auth(userAPI.addLink), addLink);

// router.post("/signUp",validationFun(authValidation.signUp),signUp);
// router.post("/signUpMobile",validationFun(authValidation.signUpMobile),signUpMobile);
// router.get("/confirm/:token", confirmEmail);

// router.post("/forgotPassword",validationFun(authValidation.forgotPassword), forgotPassword);
// router.patch("/resetPassword/:email",validationFun(authValidation.resetPassword), resetPassword);
// router.patch("/changePassword/:email",validationFun(authValidation.changePassword), changePassword);

// router.patch("/codeVerification",validationFun(authValidation.codeVerification), codeVerification);

module.exports = router;
