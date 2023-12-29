const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const adminController = {
adminSignup: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const image= req.file;
            const existing = await Admin.findOne({ email });
            if (existing) {
                return res.status(409).json({ success: false, message: 'Admin already exists' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log("otp", otp);

            const newAdmin = new Admin({ name, email, password: hashedPassword,otp ,image:image.path});
            console.log("newAdmin",newAdmin);
            await newAdmin.save();
            sendOTPToEmail(email, otp);

            res.status(201).json({ message: 'User data saved successfully' });
        } catch (error) {
            console.error("Error saving user data: ", error);
            res.status(500).json({ message: 'Error saving user data' });
        }
    },
    adminProfile: async (req, res) => {
        try {
        const decoded=req.decoded;
        console.log("decoded",decoded);
        const admin=await Admin.findOne({email:decoded.email});
                    if (admin) {
                res.status(200).json({ name: admin.name, email: admin.email,image:admin.image});
            } else {
                res.status(404).json({ message: 'Admin not found' });
            }


        } catch (error) {
            console.error("Error fetching admin data: ", error);
            res.status(500).json({ message: 'Error fetching admin data' });
        }
    },
    adminLogin : async (req,res)=>{
        try {
            const { email, password } = req.body;
            const admin = await Admin.findOne({ email });

            if (admin?.verified) {
                
                const passwordMatch = await bcrypt.compare(password, admin.password);

            if (passwordMatch) {
                const token = jwt.sign({
                    _id: admin?._id,
                    email: email,
                    // name: admin.name, // Add the name to the token
                }, 'abc', { expiresIn: '1h' });

                console.log("token", token);
                return res.status(200).json({ message: 'Login successful', token });;
            } else {
                return res.status(401).json({ message: 'Incorrect password' });
            }
            }
            else{
                return res.status(404).json({ message: 'User not found' });
            }
 
        } catch (error) {
            console.error("Login error: ", error);
            return res.status(500).json({ message: 'Error during login' });
        } 
    },
    verifyEmail:async(req,res)=>{
        try{
            console.log("Received request body",req.body);
            const{email,otp}=req.body;
            const admin=await Admin.findOne({email,otp});
            
            if(admin){
                admin.verified=true;
                await admin.save();
                return res.status(200).json({success:true,message:"email verification success"})
            }else{
                return res.status(401).json({success:false,message:'Incoorect otp'});
            }
        }catch(error){
            return res.status(401).json({success:false,message:"error"});
        }
    },
    forgetAdminPass:async(req,res)=>{
        try{
            const {email} = req.body;
            console.log("email received: ",req.body);
            const admin = await Admin.findOne({email});

            if (!admin){
                return res.send(404).json({message:'Admin not found'});
            }

            const resetToken = jwt.sign({email}, 'secret', {expiresIn:'1h'});

            admin.resetToken = resetToken;
            admin.resetTokenExpiry = Date.now() + 3600000;
            await admin.save();

            const resetLink = `http://localhost:3000/resetPass/${resetToken}`;

            sendResetEmail(email,resetLink);

            return res.status(200).json({message: 'Reset link sent successfully'});
        }catch(error){
            console.error('Error sending reset link: ',error);
            res.status(500).json({message: 'Internal server error'});
        }
    },
    resetAdminPass: async(req,res)=>{
        try{
            const{resetToken,newPassword} =req.body;
            const decodedToken = jwt.verify(resetToken, 'secret');
            const admin = await Admin.findOne({
                email: decodedToken.email,
                resetToken,
                resetTokenExpiry:{$gt: Date.now() },
            });
            if(!admin){
                return res.status(401).json({message: 'Invalid or expired token'});
            }
 const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword,salt);
            admin.password = hashedPassword;
            admin.resetToken = null;
            admin.resetTokenExpiry = null;
            await admin.save();

            return res.status(200).json({message: 'Password reset successfully'});
        }catch(error){
            console.error('Error resetting password: ',error);
            res.status(500).json({message:'Internal server error'});
        }
    },
    updateAdmin:async(req,res)=>{
        try{
            console.log('Request Body: ',req.body);
            const decoded = req.decoded;
            const {name,email}=req.body;

            const admin = await Admin.findOneAndUpdate(
                {email:decoded.email},
                {$set: {name,email}},
                {new:true}
            );
            if(admin){
                console.log('Updated User:',admin);
                res.status(200).json({name:admin.name, email:admin.email});
            }else{
                console.log('User not found');
                res.status(404).json({message: 'user not found'});
            }
        }catch(error){
            console.error('Error updating user data',error);
            res.status(500).json({message:'Error updating user data'});
        }
    },
    editAdmin:async(req,res)=>{
        try{
            console.log('Request Body: ', req.body);
            const decoded = req.decoded;
            console.log('Decoded Token: ', decoded);
          
        const {name,email} = req.body;
        const image = req.file;
        const admin = await Admin.findOneAndUpdate(
            {email:decoded.email},
            {$set:{name,email, image:image.path}},
            {new:true}
        );
        if(admin){
            console.log('Updated admin:',admin);
            res.status(200).json({name:admin.name, email:admin.email});
            }else{
                console.log('admin not found');
                res.status(404).json({message: 'admin not found'});
            }
        }catch(error){
            console.error('Error updating admin data',error);
            res.status(500).json({message:'Error updating admin data'});
        }
    },
    
};


const sendOTPToEmail = (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:'yourEmailHere',
            pass:"AppPassword"
        }
    });

    const mailOptions = {
        from: process.env.ADMIN,
        to: email,
        subject: 'OTP for Signup',
        text: `Your OTP for signup is: ${otp}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error("Error sending OTP email: ", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const sendResetEmail = (email,resetLink)=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'yourEmailHere',
            pass:"appPassword",
        },
    });

    const mailOptions = {
        from: 'process.env.Admin',
        to:email,
        subject:'Password Reset',
        text:`Click the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.error('Error sending reset email:', error);
        }else{
            console.log('Reset email sent: ', info.response);
        }
    });
};
module.exports = adminController;
