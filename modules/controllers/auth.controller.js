var jwt = require("jsonwebtoken");
const { getDatabase } = require("../../DB/connect")
const { searchAdminsTable, searchOrganizationsTable, searchEmployeesTable } = require("../helpers/searchers")
const bcrypt = require("bcrypt");
// const userModel = require("../../../DB/model/user");
// const sendEmail = require("../../../service/sendEmail");

const db = getDatabase();

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminResults = await searchAdminsTable(email);
    const orgResults = await searchOrganizationsTable(email);
    const empResults = await searchEmployeesTable(email);

    if (adminResults.length > 0) {
      const adminUser = adminResults[0];
      const result = await bcrypt.compare(password, adminUser.password);
      if (result) {
        const token = jwt.sign(
          { id: adminUser.id, role: "admin" },
          process.env.verifyTokenKey
        );
        return res.json({ message: 'Admin found', adminUser, token });
      } else {
        return res.status(422).json({ message: "Ektb el password sa7 ya ADMIN." });
      }
    }

    if (orgResults.length > 0) {
      const orgUser = orgResults[0];
      const result = await bcrypt.compare(password, orgUser.password);
      if (result) {
        const token = jwt.sign(
          { id: orgUser.id, role: "organization" },
          process.env.verifyTokenKey
        );
        return res.json({ message: 'Organization found', orgUser, token });
      } else {
        return res.status(422).json({ message: "Ektb el password sa7 ya ORG." });
      }
    }

    if (empResults.length > 0) {
      const emp = empResults[0];
      const result = await bcrypt.compare(password, emp.password);
      if (result) {
        const token = jwt.sign(
          { id: emp.id, role: "employee" },
          process.env.verifyTokenKey
        );
        return res.json({ message: 'Employee found', emp, token });
      } else {
        return res.status(422).json({ message: "Ektb el password sa7 ya EMP." });
      }
    }

    return res.status(404).json({ message: 'User not found in any of the tables' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// const forgotPassword = async (req, res) => {
//   const { email } = req.body;
//   const user = await userModel.findOne({ email });
//   if (!user) {
//     res
//       .status(404)
//       .json({ message: "Email not found, please register first." });
//   } else {
//     const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 100);
//     msg = `<p>Use this 4-digit code to reset your password : ${code} </p>`;
//     await userModel.findByIdAndUpdate(user._id, { code });
//     sendEmail(
//       email,
//       msg,
//       "Account Password Reset.",
//       "If you're not trying to reset your password, Ignore this email."
//     );
//     res.json({ message: "Code sent." });
//   }
// };

// const codeVerification = async (req, res) => {
//   try {
//     const { code } = req.body;
//     const user = await userModel.findOne({ code });
//     console.log(user);
//     if (!user) {
//       res.status(404).json({ message: "Code is incorrect" });
//     } else {
//       if (user.code.toString() != code.toString()) {
//         res.status(409).json({ message: "Code is incorrect!" });
//       } else {
//         res.status(200).json({ message: "success" });
//         const updatedUser = await userModel.findByIdAndUpdate(
//           user._id,
//           {code:' '},
//           { new: true }
//         );
//       }
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const changePassword = async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;
//     const { email } = req.params;
//     const user = await userModel.findOne({ email });
//     console.log(user);
//     if ( oldPassword ){
//       bcrypt.compare( oldPassword, user.password, async function (err, result) {
//         if (result) {
//           if(oldPassword==newPassword){
//             res.status(422).json({ message: "new password cannot be your old password" });
//           }else{
//             const hashedPassword = await bcrypt.hash(
//               newPassword,
//               parseInt(process.env.saltRound)
//             );
//             const updatedUser = await userModel.findByIdAndUpdate(
//               user._id,
//               { password: hashedPassword },
//               { new: true }
//             ); 
//             const blabla = "I Love Fatouma."
//             res.json({message: "Password changed!", blabla })
//           }
          
//         } else {
//           res.status(422).json({ message: "Old password is incorrect, try to reset your password instead." });
//         }});
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const confirmEmail = async (req, res) => {
//   try {
//     let { token } = req.params;

//     if (token == undefined || token == null || !token) {
//       res.status(404).json({ message: "You should have a token" });
//     } else {
//       let decoded = jwt.verify(token, process.env.verifyTokenKey);
//       if (decoded) {
//         let { id } = decoded;
//         let foundedUser = await userModel.findById(id);
//         if (foundedUser) {
//           if (foundedUser.Confirmed) {
//             res.status(400).json({ message: "Email already confirmed" });
//           } else {
//             let updateUser = await userModel.findByIdAndUpdate(
//               foundedUser._id,
//               { Confirmed: true },
//               { new: true }
//             );
//             res
//               .status(200)
//               .json({ message: "Email confirmed successfully" /*,updateUser*/ });
//           }
//         } else {
//           res.status(400).json({ message: "invalid email" });
//         }
//       } else {
//         res.status(403).json({ message: "Invalid token" });
//       }
//     }
//   } catch (error) {
//     res.status(400).json({ message: "Invalid token", error });
//   }
// };



module.exports = {
  signIn,
  // codeVerification,
  // confirmEmail,
  // changePassword,
};

