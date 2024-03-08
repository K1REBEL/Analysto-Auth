require("dotenv").config();

const { adminSave, signIn } = require('./auth.controller');
const router = require('express').Router();

// const authValidation = require("./auth.validator");
const validationFun = require('../middleware/validation');


router.get("/signUp", (req, res)=> res.send("Auth Router!"));
router.get("/saveadmin", adminSave);
router.get("/signIn", /*validationFun(authValidation.signIn),*/ signIn);

// router.post("/signUp",validationFun(authValidation.signUp),signUp);
// router.post("/signUpMobile",validationFun(authValidation.signUpMobile),signUpMobile);
// router.get("/confirm/:token", confirmEmail);

// router.post("/forgotPassword",validationFun(authValidation.forgotPassword), forgotPassword);
// router.patch("/resetPassword/:email",validationFun(authValidation.resetPassword), resetPassword);
// router.patch("/changePassword/:email",validationFun(authValidation.changePassword), changePassword);

// router.patch("/codeVerification",validationFun(authValidation.codeVerification), codeVerification);

module.exports = router;
