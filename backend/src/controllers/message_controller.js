import express from 'express';
import Message from '../models/message_model.js';
import mongoose from 'mongoose';
import User from '../models/user_model.js';
import cloudinary from "../lib/cloudinary.js"

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
    const { id: usertoChatId } = req.params;   // ID of the person you're chatting with
    const myId = req.user._id;                 // Logged-in user

    const messages = await Message.find({
      $or: [
        { senderID: myId, receiverID: usertoChatId },
        { senderID: usertoChatId, receiverID: myId }
      ]
    }).sort({ createdAt: 1 }); // optional: for chronological order

    res.status(200).json(messages);

  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderID: senderId,       //  MATCHED SCHEMA
      receiverID: receiverId,   //  MATCHED SCHEMA
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

