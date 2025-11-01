import { generateToken } from "../lib/utils.js";
import User from "../models/user_model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {

    try {
        const { email, fullName, password } = req.body;

        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters long" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({ _id: newUser._id, fullName: newUser.fullName, email: newUser.email, profilePic: newUser.profilePic });
        }
        else {
            return res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("error in signup route", error);
        res.status(500).json({ message: "Server error" });
    }

};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        
        const isPasswordcorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordcorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateToken(user._id, res);
        
        res.status(200).json({ _id: user._id, fullName: user.fullName, email: user.email, profilePic: user.profilePic });
    } 
    catch (error) {
        console.log("error in login route", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const logout = (req, res) => {
    res.clearCookie('jwt', '', {
        maxAge: 0,  
    });
    res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
    try {
        const {profilePic} = req.body;
        const userId =req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "Profile picture is required"});
        }
        const uploadResume = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {profilePic: uploadResume.secure_url},
            {new: true}
        );
        res.status(200).json({message: "Profile updated successfully", profilePic: updatedUser.profilePic});

    } catch (error) {
        console.log("error in updateProfile route", error);
        res.status(500).json({message: "Server error"});
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json({ user: req.user });
    } catch (error) {
        console.log("error in checkAuth route", error);
        res.status(500).json({ message: "Server error" });
    }
}
    