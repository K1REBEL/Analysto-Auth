var jwt = require("jsonwebtoken");
const { getDatabase } = require("../../DB/connect")
const { searchAdminsTable, searchOrganizationsTable, searchEmployeesTable } = require("../helpers/searchers")
const bcrypt = require("bcrypt");

const db = getDatabase();

const adminSave = async (req, res) => {
   try {
     const { name, email, pass } = req.body;
     const password = await bcrypt.hashSync(pass, parseInt(process.env.saltRounds))
     
     db.query(
       "INSERT INTO admins (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
       [name, email, password],
       (err, result) => {
         if (err) {
           console.error(err.message);
           res.status(500).json({ message: "Error inserting data" });
         } else {
           res.json({ message: "Data inserted successfully", name, email, pass });
         }
       }
     );  
   } catch (error) {
     res.status(400).json({ message: error.message });
   }
 };

const getRequests = async (req, res) => {
   try {
      db.query(
         "SELECT * FROM requests"
      )
   } catch (error) {
      
   }
}

 module.exports = { adminSave }