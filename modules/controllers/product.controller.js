var jwt = require("jsonwebtoken");
const { getDatabase } = require("../../DB/connect")
const { proSearchByID } = require("../helpers/searchers")
const bcrypt = require("bcrypt");

const db = getDatabase();

const newPro = async (req, res) => {
  try {
    const { sku, brand, category } = req.body;
    const modifiedBrand = brand.substring(0, 2);
    const modifiedSku = modifiedBrand.toUpperCase() + "-" + sku.toUpperCase();
    
    await db.query(
      "INSERT INTO products (sku, brand, category, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [modifiedSku, brand, category],
      async (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ message: "Error inserting data" });
        } else {
          await follow(req.empid, result.insertId)
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
          await followlink(prod_id, result.insertId)
          res.json({ message: "Data inserted successfully", prod_id, identifier, platform, url });
        }
      }
    )
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const follow = (emp_id, prod_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO tracking (user_id, prod_id, url_id, created_at, updated_at) VALUES (?, ?, NULL, NOW(), NOW())',
      [emp_id, prod_id],
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

const followlink = (prod_id, url_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE TRACKING SET url_id = ? where prod_id = prod_id',
      [url_id ,prod_id],
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

const getProducts = async (req, res) => {
  try{
    const userID = req.empid
    await db.query(
      "SELECT sku, brand, category FROM products AS pro , tracking AS track WHERE user_id = ?",
      [userID],
      (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ message: "Error retrieving data" });
        } else {
          // console.log(result);
          res.json({ message: "Product's Retrieved", result });
        }
      }
    )
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { newPro, addLink , getProducts }