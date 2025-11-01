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

  logout : async ()=>{ 
    try {
        await axiosInstance.post('/auth/logout');
        set({ authUser: null });
        toast.success("Logged out successfully");
    } catch (error) {
        toast.error(error.response?.data?.message || "Logout Failed");
    }
   }
  
}));