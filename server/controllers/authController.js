// control function like register, login ,logout , passsowrd recoery, verify account
//contollers functions are used to create api endpoints
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodeMailer.js';
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/emailTemplate.js';

export const register = async (req,res)=>{
    const {name,email,password}  = req.body;
    if(!name || !email || !password){
        return res.json({success:false,message:'Please fill all the fields'});
    }
    try{
        const existingUser  = await userModel.findOne({email});
        if(existingUser){
            return res.json({success:false,message:"user already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user =  new userModel({name,email, password:hashedPassword});
        await user.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'3d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:process.env.NODE_ENV ==='production'?'none':'strict',
            maxAge:3*24*60*60*1000 // 3 days
        }); 
        // sending welcome email
        const mailOptions = {
            from:process.env.SENDER_EMAIL,
            to: email,
            subject: "welcome to my app",
            text:`hi ${name}, welcome to our app. we are glad to have you on board`
        }
        await transporter.sendMail(mailOptions);
        return res.json({success:true,message:"user registered successfully"});
        

    }catch(error){
       return  res.json({success:false, message:error.message});
    }
}

export const login = async(req,res)=>{
    const {email,password} = req.body;
    if(!email||!password){
        return res.json({success:false,message:'All fields are required'});
    }
    try{

        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"user does not exit"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.json({success:false,message:"invalide password or userame"});
        }
        const token  = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'3d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:process.env.NODE_ENV ==='production'?'none':'strict',
            maxAge:3*24*60*60*1000 // 3 days
        });
        return res.json({success:true,message:"login successfully"});
    }catch(error){
        return res.json({success:false,message:error.message});
    }
}

export const logout = async(req,res)=>{
    try{
         res.clearCookie('token',{
             httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:process.env.NODE_ENV ==='production'?'none':'strict',
         });
         return res.json({success:true,message:"logout successfully"});
    }
    catch(error){
        return res.json({success:false,message:error.message});
    }
}

// sedn verification otp to user email
export const sendVerifyOtp = async(req,res)=>{
    try{
         const userId = req.user.id;   // ✅ comes from middleware
         const user = await userModel.findById(userId);
         if(user.isAccountVerified){
            return res.json({success:false,message:"account already verified"});
         }
         const otp = String(Math.floor(Math.random()*900000+100000));
         user.verifyOtp  = otp;
         user.verifyOtpExpireAt = Date.now()+ 24*60*60*1000;
         await user.save();

         const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject:"Account verification OTP",
           // text:`Your otp is ${otp}. verify your account using this otp`,
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}},",otp).replace("{{email}}",user.email)
         }
         await transporter.sendMail(mailOptions);
         return res.json({success:true,message:"otp sent to given email"});


    }
    catch(error){
        res.json({success:false,message:error.message});
    }
}

export const verifyAccount = async(req,res)=>{
    const { otp } = req.body;      // otp still comes from client
const userId = req.user.id;    // userId comes from JWT

    if(!userId || !otp){
        return res.json({success:false,message:"All fields are required"});
    }
    try{
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false,message:"user do not exist"}); 
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success:false,message:"invalide otp"});
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false,message:"otp expired"});
        }
        user.isAccountVerified = true;
        user.verifyotp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({success:true,message:"account verified successfully"});

    }catch(error){
        res.json({success:false,message:error.message});
    }
}

export const isAuthenticated = async (req,res)=>{
    try{
        return res.json({success:true});
    }catch(error){
          res.json({success:false,message:error.message});
    }
}

export const sendResetOtp = async(req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.json({success:false,message:'Email is required'});
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"user not found"});
        }
        const otp = String(Math.floor(Math.random()*900000+100000));
         user.resetOtp  = otp;
         user.resetOtpExpireAt = Date.now()+ 15*60*1000;
         await user.save();

         const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject:"Account verification OTP",
           // text:`Your otp for reseting your password is  ${otp}. Regenerate your password using this`
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
         }
         await transporter.sendMail(mailOptions);
        return res.json({success:true,message:"otp sent to your email"});
    }catch(error){
      return res.json({success:false,message:error.message});
    }
}


// to reset the user password 

export const resetPassword = async(req,res)=>{
    const {email,otp,newPassword} = req.body;
    if(!email || !otp || !newPassword){
        return res.json({success:false,message:'All fieds are required'});
    }
    try{
      const user = await userModel.findOne({email});
      if(!user){
        return res.json({success:false,message:"user not found"});
      }
      if(user.resetOtp === "" || user.resetOtp !== otp){
        return res.json({success:false,message:"Invalid Otp"});
      }
      if(user.resetOtpExpireAt < Date.now()){
        return res.json({success:false,message:"otp expired"});
      }
      const hashedPassword = await bcrypt.hash(newPassword,10);
      user.password = hashedPassword;
      user.resetOtp = '';
      user.resetOtpExpireAt=0;
      await user.save();

      return res.json({success:true,message:"your password has been reset successfully"});


    }
    catch(error){
        return res.json({success:false,message:error.message})
    }
}
