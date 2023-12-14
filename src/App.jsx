import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Card from './components/Card';
import { CustomModal } from './components/Modal';
import Banner from './components/Banner';


const socket = io('http://localhost:5000'); 


// Use your Flask server address




function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(undefined);
  

  useEffect(() => {
    socket.on('message', (message) => {
      setOpen("default")
      console.log(message);
      setMessages([...messages, message]);
      
    });
  }, [messages]);

  const sendMessage = () => {
    socket.emit('message', message);
    setMessage('');
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get-messages');
      console.log(response.data) // Create this endpoint in your Flask app
      setMessages([...messages, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
    <div className='bg-purple-900 min-h-screen z-10 p-10'>  
    
      <div className='bg-white p-10 mx-auto mt-20  rounded-3xl flex flex-col justify-evenly md:flex-row'>
        <h1 className='text-4xl font-bold mb-10'>Intrusion Prevension </h1>
        <h1 className='text-3xl font-light mb-10'>Blocked IPS </h1>
        <CustomModal open={open}  setOpen={setOpen} />
      
      <div className='flex flex-col'>
        <ul className='flex flex-col gap-y-5 mt-5'>
         {messages.map((msg) => <Card key={msg.id} hidden={msg.hidden} message={msg.message}   />)}
        </ul>
          <Banner />
        </div>
        
    </div></div></div>
  );
}

export default App;