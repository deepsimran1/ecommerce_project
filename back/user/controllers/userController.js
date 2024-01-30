const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Notification = require('../../models/notification');
// const forgetPass=require('../../utils/forgetpass');
const nodemailer = require("nodemailer");

const userController = {
  submitForm: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "User already exists" });
      }

      // Generate a salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("otp", otp);

      const newUser = new User({ name, email, password: hashedPassword, otp });
      await newUser.save();
      const newNotification = new Notification({content:"New User Registered",type:2});
      await newNotification.save();
      sendOTPToEmail(email, otp);

      res.status(201).json({ message: "User data saved successfully" });
    } catch (error) {
      console.error("Error saving user data: ", error);
      res.status(500).json({ message: "Error saving user data" });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (user?.verified) {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          const token = jwt.sign({ _id: user?._id, email: email }, "abc", {
            expiresIn: "1h",
          });
          console.log("token", token);
          return res.status(200).json({ message: "Login successful", token });
        } else {
          return res.status(401).json({ message: "Incorrect password" });
        }
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Login error: ", error);
      return res.status(500).json({ message: "Error during login" });
    }
  },
  user: async (req, res) => {
    try {
      const decoded = req.decoded;
      console.log("decoded", decoded);
      const user = await User.findOne({ email: decoded.email });
      if (user) {
        const { name, email, dob, mobile, alternativeMob } = user;
      res.status(200).json({
        name,
        email,
        dob: dob || '', 
        mobile: mobile || '',
        alternativeMob: alternativeMob || '', 
      });
      console.log("res.status",res.status);

      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
      res.status(500).json({ message: "Error fetching user data" });
    }
  },
  otp: async (req, res) => {
    try {
      console.log("Received request body", req.body);
      const { email, otp } = req.body;
      const user = await User.findOne({ email, otp });

      if (user) {
        user.verified = true;
        await user.save();
        return res
          .status(200)
          .json({ success: true, message: "email verification success" });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Incoorect otp" });
      }
    } catch (error) {
      return res.status(401).json({ success: false, message: "error" });
    }
  },
  forgetPass: async (req, res) => {
    try {
      const { email } = req.body;
      console.log("email received: ", req.body);
      const user = await User.findOne({ email });

      if (!user) {
        return res.send(404).json({ message: "User not found" });
      }

      const resetToken = jwt.sign({ email }, "secret", { expiresIn: "1h" });

      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 3600000;
      await user.save();

      const resetLink = `http://localhost:3000/resetPass/${resetToken}`;

      sendResetEmail(email, resetLink);

      return res.status(200).json({ message: "Reset link sent successfully" });
    } catch (error) {
      console.error("Error sending reset link: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  resetPass: async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;
      const decodedToken = jwt.verify(resetToken, "secret");
      const user = await User.findOne({
        email: decodedToken.email,
        resetToken,
        resetTokenExpiry: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();

      return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  updateUser: async (req, res) => {
    try {
      console.log("Request Body: ", req.body);
      const decoded = req.decoded;
      const { name, email,mobile,dob, alternativeMob } = req.body;

      const user = await User.findOneAndUpdate(
        { email: decoded.email },
        { $set: { name, email,mobile,dob,alternativeMob } },
        { new: true }
      );
      if (user) {
        console.log("Updated User:", user);
        res.status(200).json({ name: user.name, email: user.email,mobile:user.mobile,dob:user.dob,alternativeMob:user.alternativeMob});
      } else {
        console.log("User not found");
        res.status(404).json({ message: "user not found" });
      }
    } catch (error) {
      console.error("Error updating user data", error);
      res.status(500).json({ message: "Error updating user data" });
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { email } = req.body;

      const deletedUser = await User.findOneAndDelete({ email });

      if (!deletedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user by ID: ", error);
      res.status(500).json({ message: "Error fetching user by ID" });
    }
  },
  updateUserByAdmin: async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, verified } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, verified },
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating user", error);
      res.status(500).json({ message: "Error updating user" });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting User:", error);
      res.status(500).json({ message: "Error deleting user" });
    }
  },
  addCustomer: async (req, res) => {
    try {
      const { name, email } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "User already exists" });
      }
      const defaultPassword = "123";
      const verified = true;

      const newUser = new User({
        name,
        email,
        password: defaultPassword,
        verified,
      });
      await newUser.save();

      res.status(201).json({ message: "User data saved successfully" });
    } catch (error) {
      console.error("Error saving user data: ", error);
      res.status(500).json({ message: "Error saving user data" });
    }
  },
  monthlyReg: async (req, res) => {
    try {
      const monthlyRegistration = await User.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]);

      res.json(monthlyRegistration);
    } catch (error) {
      console.error("Error fetching monthly user registrations:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  getTotalUsers: async(req,res)=>{
    try {
        const totalUsers = await User.countDocuments();
        res.status(200).json({ totalUsers });
        console.log(totalUsers);
      } catch (error) {
        console.error('Error fetching total users: ', error);
        res.status(500).json({ message: 'Error fetching total users' });
      }
  },
  getLoggedInUser: async (req, res) => {
    try {
      const userId = req.decoded?._id;
      if (!userId) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching logged-in user', error);
      res.status(500).json({ message: 'Error fetching logged-in user' });
    }
  },

};

const sendOTPToEmail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourEmailHere",
      pass: "appPassword",
    },
  });

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "OTP for Signup",
    text: `Your OTP for signup is: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending OTP email: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendResetEmail = (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourEmailHere",
      pass: "appPassword",
    },
  });

  const mailOptions = {
    from: "process.env.USER",
    to: email,
    subject: "Password Reset",
    text: `Click the link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending reset email:", error);
    } else {
      console.log("Reset email sent: ", info.response);
    }
  });
};

// const forgetPass =(email, otp) => {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user:'yourEmailHere',
//             pass:"appPassword"
//         }
//     });

//     const mailOptions = {
//         from: process.env.USER,
//         to: email,
//         subject: 'OTP for Signup',
//         text: `Your OTP for signup is: ${otp}`
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//             console.error("Error sending OTP email: ", error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// }

module.exports = userController;
