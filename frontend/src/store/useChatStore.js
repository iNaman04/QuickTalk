import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';



export const useChatStore = create((set, get) => ({
    messages : [],
    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,

    getUsers : async ()=>{
        set({isUsersLoading : true});
        try {
            const res = await axiosInstance.get('/messages/users');
            set({users : res.data});
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            set({isUsersLoading : false});
        }
    }, 

    getMessages : async (userId)=>{
        set({isMessagesLoading : true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages : res.data});
        } catch (error) {
            toast.error("Failed to fetch messages");
        } finally{
            set({isMessagesLoading : false});
        }
    }
    ,
    sendMessage : async (MessageData) => {
        const {selectedUser,messages} = get();
        try {
            const result = await axiosInstance.post(`/messages/send/${selectedUser._id}`, MessageData);
            set({messages : [...messages, result.data]})
        } catch (error) {
            toast.error("Failed to send message");
        }
    }
    ,

    setSelectedUser : (user)=>{
        set({selectedUser:user});
    }
    ,
    
}))  