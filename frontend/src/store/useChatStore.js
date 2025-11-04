import {create} from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';


export const useChatStore = create((set) => ({
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

    setSelectedUser : (user)=>{
        set({selectedUser});
    }
}))  