var jwt = require("jsonwebtoken");
const { getDatabase } = require("../../DB/connect")
const { orgSearchByID } = require("../helpers/searchers")
const bcrypt = require("bcrypt");
// const userModel = require("../../../DB/model/user");
// const sendEmail = require("../../../service/sendEmail");

const db = getDatabase();

const orgIndex = async (req, res) => {
  try {
     await db.query(
      "SELECT name, email AS 'Head Email', niche, region, phone FROM organizations",
      // "SELECT name, email AS [Head Email], niche, region, phone FROM organizations",
      [],
      (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ message: "Error retrieving data" });
        } else {
          // console.log(result);
          res.json({ message: "Organizations Retrieved", result });
        }
      }
    )
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const newOrg = async (req, res) => {
  try {
    const { name, email, pass, niche, region, phone } = req.body;
    const password = await bcrypt.hashSync(pass, parseInt(process.env.saltRounds))
    
    db.query(
      "INSERT INTO organizations (name, email, password, niche, region, phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [name, email, password, niche, region, phone],
      (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ message: "Error inserting data" });
        } else {
          res.json({ message: "Data inserted successfully", name, email, password, niche, region, phone });
        }
      }
    );  
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

 const setOrgPass = async (req, res) => {
   try {
     const orgSearch = await orgSearchByID(req.orgid)
     const organization = orgSearch[0]
     const { newPassword } = req.body;
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

 const updateOrganizationPassword = (orgId, newPassword) => {
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

 const getOrg = async (req, res) => {
  const orgID = req.params.orgID
  await db.query(
    "SELECT name, email AS 'Head Email', niche, region, phone FROM organizations WHERE id = ?",
    // "SELECT name, email AS [Head Email], niche, region, phone FROM organizations",
    [orgID],
    (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error retrieving data" });
      } else {
        console.log(result);
        res.json({ message: "Organization Retrieved", result });
      }
    }
  )
 }

 const softDelOrg = async (req, res) => {
  const orgID = req.params.orgID;
  await db.query(
    "UPDATE organizations SET is_active = 0 where id = ?",
    [orgID],
    (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error deleting Org" });
      } else {
        // console.log(result);
        res.json({ message: "Organization deactivated", result });
      }
    }
  )
 }

 const delEmp = async (req, res) => {
  const userID = req.params.userID;
  await db.query(
    "DELETE FROM employees where id = ?",
    [userID],
    (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ message: "Error deleting Employee" });
      } else {
        console.log(result);
        res.json({ message: "Employee Deleted", result });
      }
    }
  )
 }

module.exports = { orgIndex, newOrg, setOrgPass, getOrg , softDelOrg , delEmp}