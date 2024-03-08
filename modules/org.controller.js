var jwt = require("jsonwebtoken");
const { getDatabase } = require("../DB/connect")
const bcrypt = require("bcrypt");
// const userModel = require("../../../DB/model/user");
// const sendEmail = require("../../../service/sendEmail");

const db = getDatabase();

const newOrg = async (req, res) => {
  try {
    const { name, email, pass, niche, region, phone } = req.body;
    // pass = pass.toString()
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

module.exports = { newOrg, }