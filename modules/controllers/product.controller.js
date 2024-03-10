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

const addLink = async (req, res) => {
  try {
    const prod_id = req.params.prod_id
    // const prod_id = productId.toString()
    // console.log(productId, prod_id)
    const { platform, identifier, url } = req.body
    db.query(
      "INSERT INTO links (prod_id, identifier, platform, url, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [prod_id, identifier, platform, url],
      async (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ message: "Error inserting data" });
        } else {
          // console.log(req.empid)
          await follow(req.empid, prod_id, result.insertId)
          res.json({ message: "Data inserted successfully", prod_id, identifier, platform, url });
        }
      }
    )
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const follow = (emp_id, prod_id, url_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO tracking (user_id, prod_id, url_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [emp_id, prod_id, url_id],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

module.exports = { newPro, addLink }