var jwt = require("jsonwebtoken");
const { getDatabase } = require("../../DB/connect")
const { proSearchByID } = require("../helpers/searchers")
const bcrypt = require("bcrypt");
// const userModel = require("../../../DB/model/user");
// const sendEmail = require("../../../service/sendEmail");

const db = getDatabase();

const newPro = (req, res) => {
  try {
    const { sku, brand, category } = req.body;
    // const password = await bcrypt.hashSync(pass, parseInt(process.env.saltRounds))
    
    db.query(
      "INSERT INTO products (sku, brand, category, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [sku, brand, category],
      (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ message: "Error inserting data" });
        } else {
          res.json({ message: "Data inserted successfully", sku, brand, category });
        }
      }
    );  
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  const setEmpPass = async (req, res) => {
//    try {
//      const empSearch = await empSearchByID(req.empid)
//      const employee = empSearch[0]
//      const { newPassword } = req.body;
//      if (!employee) {
//        res.status(404).json({ message: "Employee Not Found" });
//      } else {
//        const hashedPassword = await bcrypt.hash( newPassword, parseInt(process.env.saltRound) );
//        await updateEmployeePassword(req.empid, hashedPassword)

//        res.status(200).json({ message: "Password reset!"/*, updatedUser*/ });
//      }
//    } catch (error) {
//      res.status(500).json({ message: error.message });
//    }
//  };

//  const updateEmployeePassword = (empId, newPassword) => {
//    return new Promise((resolve, reject) => {
//      const sql = 'UPDATE employees SET password = ? WHERE id = ?';
 
//      db.query(sql, [newPassword, empId], (err, result) => {
//        if (err) {
//          reject(err);
//        } else {
//          resolve(result);
//        }
//      });
//    });
//  };

module.exports = { newPro }