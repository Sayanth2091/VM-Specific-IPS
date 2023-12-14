import React from 'react'
import { Button, Modal } from 'flowbite-react';
import { useState } from 'react';

export const CustomModal = ({open,setOpen}) => {

    console.log(open);

    const data = ['Isolate the Affected Server: Isolate the affected server or IP address to prevent further harm to your network.',
    
    'Notify Your Hosting Provider: Inform your hosting provider about the attack so they can assist with mitigation measures.',
    
   ' Implement DDoS Mitigation Tools: Deploy DDoS mitigation solutions to filter out malicious traffic.',"Monitor Server Health: Continuously monitor your server's health and network traffic to assess the attack's impact."
    
   , "Update Firewall Rules: Adjust your firewall rules to block unwanted traffic."]



  return (
    <>
    <Modal show={open === 'default'} onClose={() => setOpen(undefined)}>
      <Modal.Header>Warning: Excessive Ping Flood Attack Detected</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
          We have detected a severe Distributed Denial of Service (DDoS) attack targeting your website. This attack employs Excessive Ping Flood Attacks, overwhelming your server with an unsustainable volume of ping requests. As a result, your website's availability and performance are at risk.
          </p>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
          Immediate Action Required:
            
            {
           data.map((map,key) => <p key={key}>{key}.{map}</p>)
            }

          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='bg-red-500 text-slate-50' onClick={() => setOpen(undefined)}>I accept</Button>
        <Button color="gray" onClick={() => setOpen(undefined)}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
  </>

  );
}
