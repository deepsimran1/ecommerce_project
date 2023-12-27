const ContactUs = require("../models/contactUs");
const Admin = require("../models/admin");
const Notification = require('../models/notification');
const nodemailer = require("nodemailer");

const contactusController = {
  addContactMessage: async (req, res) => {
    try {
      console.log("req.body", req.body);
      const { name, email, message } = req.body;

      const newContactUs = new ContactUs({ name, email, message });
      await newContactUs.save();
      const newNotification = new Notification({content:"New Contact User Added",type:0});
      await newNotification.save();
      const admin = await Admin.find({});
      const adminEmails = admin.map((admin) => admin.email);
      console.log("adminEmails:", adminEmails);

      sendEmailToAdmin(name, email, message, adminEmails);

      res
        .status(201)
        .json({ message: "Your message sent. We will contact you soon.." });
    } catch (error) {
      console.error("Error filling form: ", error);
      res.status(500).json({ message: "Error filling form" });
    }
  },

  getContactUsers: async (req, res) => {
    try {
      const contactUsers = await ContactUs.find();
      res.status(200).json(contactUsers);
    } catch (error) {
      console.error("Error fetching users", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  },
  deleteContactUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedContactUser = await ContactUs.findByIdAndDelete(userId);
      if (!deletedContactUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting User:", error);
      res.status(500).json({ message: "Error deleting user" });
    }
  },
  updateContactUserByAdmin: async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, message } = req.body;
      const updatedContactUser = await ContactUs.findByIdAndUpdate(
        userId,
        { name, email, message },
        { new: true }
      );
      if (!updatedContactUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res
        .status(200)
        .json({
          message: "User updated successfully",
          user: updatedContactUser,
        });
    } catch (error) {
      console.error("Error updating user", error);
      res.status(500).json({ message: "Error updating user" });
    }
  },
  //   getContactFormCount : async(req,res)=>{
  //     try {
  //         const contactFormCount = await ContactUs.countDocuments();
  //         res.status(200).json({ count: contactFormCount });
  //     } catch (error) {
  //         console.error("Error fetching contact form notification count:", error);
  //         res.status(500).json({ message: "Error fetching notification count" });
  //     }
  // }
};

const sendEmailToAdmin = (name, email, message, adminEmails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "deepsimran189@gmail.com",
      pass: "twan hugk ciui fghn",
    },
  });
  const mailOptions = {
    from: process.env.CONTACT,
    to: adminEmails.join(","),
    subject: "New Contact Form Submission",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending contact from email to admin", error);
    } else {
      console.log("Contact from email sent to admin:" + info.response);
    }
  });
};

module.exports = contactusController;
