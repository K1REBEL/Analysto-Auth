const { getDatabase } = require("../../DB/connect")
const db = getDatabase();


const searchAdminsTable = (email) => {
   return new Promise((resolve, reject) => {
     db.query(
       'SELECT * FROM admins WHERE email = ?',
       [email],
       (err, orgResults) => {
         if (err) {
           console.error('Error searching organization table:', err.message);
           reject('Error searching organizations table');
         } else {
           resolve(orgResults);
         }
       }
     );
   });
 };
 
 const searchOrganizationsTable = (email) => {
   return new Promise((resolve, reject) => {
     db.query(
       'SELECT * FROM organizations WHERE email = ?',
       [email],
       (err, orgResults) => {
         if (err) {
           console.error('Error searching organization table:', err.message);
           reject('Error searching organizations table');
         } else {
           resolve(orgResults);
         }
       }
     );
   });
 };

 const orgSearchByID = (id) => {
   return new Promise((resolve, reject) => {
     db.query(
       'SELECT * FROM organizations WHERE id = ?',
       [id],
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
 
 const searchEmployeesTable = (email) => {
   return new Promise((resolve, reject) => {
     db.query(
       'SELECT * FROM employees WHERE email = ?',
       [email],
       (err, empResults) => {
         if (err) {
           console.error('Error searching employees table:', err.message);
           reject('Error searching employees table');
         } else {
           resolve(empResults);
         }
       }
     );
   });
 };

 module.exports = {
   searchAdminsTable,
   searchOrganizationsTable,
   orgSearchByID,
   searchEmployeesTable
 }
