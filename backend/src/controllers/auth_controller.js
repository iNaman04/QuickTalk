import { generateToken } from "../lib/utils.js";
import User from "../models/user_model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {

    try {
        const { email, fullName, password } = req.body;

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

        if(newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({_id: newUser._id, fullName: newUser.fullName, email: newUser.email, profilePic: newUser.profilePic});
        }
        else {
            return res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("error in signup route" , error);
        res.status(500).json({ message: "Server error" });
    }

};

export const login = (req, res) => {
    res.send('Login Route');
};

export const logout = (req, res) => {
    res.send('Logout Route');
}