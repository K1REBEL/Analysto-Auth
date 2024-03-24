var jwt = require("jsonwebtoken");
const fs = require('fs');
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

const sendRequest = async (req, res) => {
  try {
    const {org_name, social_media, reply_email, reply_phone, niche, region, avg_revenue, referral_method} = req.body;
    await db.query(
      "INSERT INTO requests (org_name , social_media, reply_email, reply_phone, niche, region, avg_revenue, referral_method, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [org_name,social_media, reply_email, reply_phone, niche, region, avg_revenue, referral_method],
      (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ message: "Error inserting data" });
        } else {
          res.json({ message: "Data inserted successfully", result });
        }
      }
    );
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRequests = async (req, res) => {
  try {
    await db.query(
         "SELECT * FROM requests",
         (err, result) => {
          if (err) {
            console.error(err.message);
            res.status(500).json({ message: "Error retrieving data" });
          } else {
            res.json({ message: "Data retrieved successfully", result});
          }
        }
      );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const rejectRequest = async (req, res) => {
  const req_id = req.params.req_id
  const {org_name} = req.body;
  try {
    await db.query(
      "UPDATE requests SET status = 'rejected' where org_name =?",
      [org_name],
      (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ message: "Error reject" });
        } else {
          res.json({ message: "Request rejected successfully", req_id , org_name});
        }
      }
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const testFetch = async (req, res) => {
  var input = req.body
  try {

    const jsonData = JSON.stringify(input, null, 2); // The third argument (2) adds indentation for readability

    // Specify the file path (assuming 'data.json' in the root directory)
    const filePath = './data.json';

    // Write the JSON data to the file
    fs.writeFileSync(filePath, jsonData);

    res.json({message: "Done!"})
  } catch (error) {
    console.error('Error saving request body:', error);
    res.status(500).json({ error: 'Internal server error' })
  }
}

 module.exports = { adminSave , getRequests , sendRequest , rejectRequest, testFetch }