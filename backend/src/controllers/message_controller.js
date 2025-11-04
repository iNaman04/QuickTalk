import express from 'express';
import Message from '../models/message_model.js';
import mongoose from 'mongoose';
import User from '../models/user_model.js';

export const getUsersForSidebar = async (req, res) => {
    
    
    try {
        const loggedInUserId = new mongoose.Types.ObjectId(req.user._id);
        console.log(loggedInUserId);
        
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
        console.log(filteredUsers);
        res.status(200).json(filteredUsers);


    } catch (error) {
        console.error("Error in getUsersForSidebar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
} 


export const getMessages = async (req, res) => {

    try {
        
        const {id:usertoChatid} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: usertoChatid },
                { sender: usertoChatid, receiver: myId }
            ]
        })

        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}


export const sendMessage = async (req, res) => {
    try {
        
        const { text, image} = req.body;
        const { id : receiverID } = req.params;
        const senderID = req.user._id;

        let imageURL;
        if(image){
            const UploadResponse = await uploadImageToCloudinary(image);
            imageURL = UploadResponse.secure_url;

        }

        const newMessage = new Message({
            senderID,
            receiverID,
            text,
            image: imageURL
        });
        await newMessage.save();


        res.status(201).json(newMessage);

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
