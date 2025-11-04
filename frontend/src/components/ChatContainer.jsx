import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
import { useEffect } from 'react';
const ChatContainer = () => {

  const { selectedUser, getMessages, isMessagesLoading, messages } = useChatStore();
   
  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);


  return (
    <div>
        
    </div>
  )
}

export default ChatContainer