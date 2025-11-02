import { create } from "zustand";  
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";



export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningIn: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth : async ()=>{
    try {
        const res = await axiosInstance.get('/auth/check'); 
        set({ authUser: res.data});  
    } catch (error) {
        set({ authUser: null, isCheckingAuth: false });
    }  finally {
        set({ isCheckingAuth: false });
  }
  } 
  ,

  signup : async (data)=>{
    
    set({ isSigningIn: true });
    console.log(data);
    try {
        const res = await axiosInstance.post('/auth/signup', data);
        
        
        set({ authUser: res.data});  
        toast.success("Account Created Successfully");
     } catch (error) {
        toast.error(error.response?.data?.message || "Signup Failed");
     } finally{
        set({ isSigningIn: false });
     }
  }
  ,

  login : async (data)=>{
    set({ isLoggingIn: true });
    try {
        const res = await axiosInstance.post('/auth/login', data);
        set({ authUser: res.data});
        toast.success("Logged in Successfully");
    } catch (error) {
        toast.error(error.response?.data?.message || "Login Failed");
    } finally {
        set({ isLoggingIn: false });
    }
  },

  logout : async ()=>{ 
    try {
        await axiosInstance.post('/auth/logout');
        set({ authUser: null });
        toast.success("Logged out successfully");
    } catch (error) {
        toast.error(error.response?.data?.message || "Logout Failed");
    }
   }
   ,
   updateProfile : async (data)=>{
    set({ isUpdatingProfile: true });
    try {
        const res = await axiosInstance.put('/auth/update-profile', data);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
    } catch (error) {
        toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
        set({ isUpdatingProfile: false });
    }
   }
  
}));