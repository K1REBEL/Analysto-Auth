var jwt = require("jsonwebtoken");
const { getDatabase } = require("../../DB/connect")
const { orgSearchByID } = require("../helpers/searchers")
const bcrypt = require("bcrypt");
// const userModel = require("../../../DB/model/user");
// const sendEmail = require("../../../service/sendEmail");

const db = getDatabase();

const newEmp = async (req, res) => {
  try {
    const { name, email, pass } = req.body;
    const password = await bcrypt.hashSync(pass, parseInt(process.env.saltRounds))
    
    db.query(
      "INSERT INTO employees (name, email, password, org_id, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [name, email, password, req.orgid],
      (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ message: "Error inserting data" });
        } else {
          res.json({ message: "Data inserted successfully", name, email, password });
        }
      }
    );  
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

 const setEmpPass = async (req, res) => {
   try {
     const orgSearch = await orgSearchByID(req.orgid)
     const organization = orgSearch[0]
     const { newPassword } = req.body;
   //   const { email } = req.params;
   //   const user = await userModel.findOne({ email });
   //   console.log(organization);
     if (!organization) {
       res.status(404).json({ message: "Organization Not Found" });
     } else {
       const hashedPassword = await bcrypt.hash( newPassword, parseInt(process.env.saltRound) );
       await updateOrganizationPassword(req.orgid, hashedPassword)

       res.status(200).json({ message: "Password reset!"/*, updatedUser*/ });
     }
   } catch (error) {
     res.status(500).json({ message: error.message });
   }
 };

 const updateEmployeePassword = (orgId, newPassword) => {
   return new Promise((resolve, reject) => {
     const sql = 'UPDATE organizations SET password = ? WHERE id = ?';
 
     db.query(sql, [newPassword, orgId], (err, result) => {
       if (err) {
         reject(err);
       } else {
         resolve(result);
       }
     });
   });
 };

module.exports = { newEmp, setEmpPass }