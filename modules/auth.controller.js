var jwt = require("jsonwebtoken");
const { getDatabase } = require("../DB/connect")
const bcrypt = require("bcrypt");
// const userModel = require("../../../DB/model/user");
// const sendEmail = require("../../../service/sendEmail");

const db = getDatabase();

const adminSave = async (req, res) => {
  try {
    const { name, email, pass } = req.body;
    // pass = pass.toString()
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

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

  db.query(
    // 'SELECT * FROM admins WHERE email = ? AND password = ?',
    'SELECT * FROM admins WHERE email = ?',
    [email/*, password*/],
    (err, results) => {
      if (err) {
        console.error('Error executing query:', err.message);
        res.status(500).json({ message: 'Error retrieving admin data' });
      } else {
        // Handle the results (user data) here
        if (results.length > 0) {
          const adminUser = results[0]; // Assuming the query returns a single user
          bcrypt.compare(password, adminUser.password, function (err, result) {
            if (result) {
              var token = jwt.sign(
                { id: adminUser.id, role: "admin" },
                process.env.verifyTokenKey 
              );
              res.json({ message: 'Admin found', adminUser, token });
            } else {
              res.status(422).json({ message: "Ektb el password sa7 ya ADMIN." });
            }
          });
        } else {
          searchOrganizationTable()
        }
      }
    }
  );

    // Function to search the organization table
    const searchOrganizationTable = () => {
      db.query(
        'SELECT * FROM organizations WHERE email = ?',
        [email],
        (err, orgResults) => {
          if (err) {
            console.error('Error searching organization table:', err.message);
            res.status(500).json({ message: 'Error searching organizations table' });
          } else if (orgResults.length > 0) {
            const orgUser = orgResults[0]; // Assuming the query returns a single user
          bcrypt.compare(password, orgUser.password, function (err, result) {
            if (result) {
              var token = jwt.sign(
                { id: orgUser.id, role: "organization" },
                process.env.verifyTokenKey 
              );
              res.json({ message: 'Organization found', orgUser, token });
            } else {
              res.status(422).json({ message: "Ektb el password sa7 ya ORG." });
            }
          });
          } else {
            // No match in organization table, proceed to employees table
            searchEmployeesTable();
          }
        }
      );
    };
  
    // Function to search the employees table
    const searchEmployeesTable = () => {
      db.query(
        'SELECT * FROM employees WHERE email = ?', [email],
        
        (err, empResults) => {
          if (err) {
            console.error('Error searching employees table:', err.message);
            res.status(500).json({ message: 'Error searching employees table' });
          } else if (empResults.length > 0) {
            const emp = empResults[0]; // Assuming the query returns a single user
            bcrypt.compare(password, emp.password, function (err, result) {
              if (result) {
                var token = jwt.sign(
                  { id: emp.id, role: "employee" },
                  process.env.verifyTokenKey 
                );
                res.json({ message: 'Employee found', emp, token });
              } else {
                res.status(422).json({ message: "Ektb el password sa7 ya EMP." });
              }
            });
          } else {
            // No match in any table
            res.status(404).json({ message: 'User not found in any table' });
          }
        }
      );
    };
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  // console.log(req.body)
  // const { email, password } = req.body;
  // const foundedUser = await userModel.findOne({ email });
  // if (foundedUser) {
  //  if (foundedUser.IsDeleted == true) {
  //     res.json({ message: "Your account is deleted." });
  //   } else if ( !foundedUser.IsDeleted) {
  //     bcrypt.compare(password, foundedUser.password, function (err, result) {
  //       if (result) {
  //         var token = jwt.sign(
  //           { id: foundedUser._id },
  //           process.env.verifyTokenKey
  //         );
  //         res.json({ message: "ya welcome ya welcome", token });
  //       } else {
  //         res.status(422).json({ message: "Ektb el password sa7." });
  //       }
  //     });
  //   }
  // } else { res.status(404).json({ message: "Please register first." }); }
};



const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res
      .status(404)
      .json({ message: "Email not found, please register first." });
  } else {
    const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 100);
    msg = `<p>Use this 4-digit code to reset your password : ${code} </p>`;
    await userModel.findByIdAndUpdate(user._id, { code });
    sendEmail(
      email,
      msg,
      "Account Password Reset.",
      "If you're not trying to reset your password, Ignore this email."
    );
    res.json({ message: "Code sent." });
  }
};



const codeVerification = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await userModel.findOne({ code });
    console.log(user);
    if (!user) {
      res.status(404).json({ message: "Code is incorrect" });
    } else {
      if (user.code.toString() != code.toString()) {
        res.status(409).json({ message: "Code is incorrect!" });
      } else {
        res.status(200).json({ message: "success" });
        const updatedUser = await userModel.findByIdAndUpdate(
          user._id,
          {code:' '},
          { new: true }
        );
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { email } = req.params;
    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) {
      res.status(404).json({ message: "Not Found" });
    } else {
      const hashedPassword = await bcrypt.hash(
        newPassword,
        parseInt(process.env.saltRound)
      );
      const updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        { password: hashedPassword},
        { new: true }
      );
      sendNotification(updatedUser._id, "has reset their password.")
      res.status(200).json({ message: "Password reset!", updatedUser });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { email } = req.params;
    const user = await userModel.findOne({ email });
    console.log(user);
    if ( oldPassword ){
      bcrypt.compare( oldPassword, user.password, async function (err, result) {
        if (result) {
          if(oldPassword==newPassword){
            res.status(422).json({ message: "new password cannot be your old password" });
          }else{
            const hashedPassword = await bcrypt.hash(
              newPassword,
              parseInt(process.env.saltRound)
            );
            const updatedUser = await userModel.findByIdAndUpdate(
              user._id,
              { password: hashedPassword },
              { new: true }
            ); 
            const blabla = "I Love Fatouma."
            res.json({message: "Password changed!", blabla })
          }
          
        } else {
          res.status(422).json({ message: "Old password is incorrect, try to reset your password instead." });
        }});
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const confirmEmail = async (req, res) => {
  try {
    let { token } = req.params;

    if (token == undefined || token == null || !token) {
      res.status(404).json({ message: "You should have a token" });
    } else {
      let decoded = jwt.verify(token, process.env.verifyTokenKey);
      if (decoded) {
        let { id } = decoded;
        let foundedUser = await userModel.findById(id);
        if (foundedUser) {
          if (foundedUser.Confirmed) {
            res.status(400).json({ message: "Email already confirmed" });
          } else {
            let updateUser = await userModel.findByIdAndUpdate(
              foundedUser._id,
              { Confirmed: true },
              { new: true }
            );
            res
              .status(200)
              .json({ message: "Email confirmed successfully" /*,updateUser*/ });
          }
        } else {
          res.status(400).json({ message: "invalid email" });
        }
      } else {
        res.status(403).json({ message: "Invalid token" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid token", error });
  }
};





module.exports = {
  adminSave,
  // signUp,
  signIn,
  forgotPassword,
  resetPassword,
  codeVerification,
  confirmEmail,
  changePassword,
};

