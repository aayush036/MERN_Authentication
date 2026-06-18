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
        const hashedPassword = await bcrypt.hash(password,8);
        const user =  new userModel({name,email, password:hashedPassword});
        await user.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV ==='production',
            sameSite:process.env.NODE_ENV ==='production'?'none':'strict',
            maxAge:1*24*60*60*1000 // 1 day
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

