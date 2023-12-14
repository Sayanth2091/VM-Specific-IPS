
import { useState } from "react";
import {GrAdd , GrSubtract} from 'react-icons/gr';

const Card = ({id,message, hidden}) => {

const [showMessage, setShowMessage] = useState(false);

  return (

    <div className='border md:w-96 border-gray-300 rounded-lg p-5 shadow-lg   flex flex-col gap-y-4'>
       <div className=' flex flex-row  justify-between align-center' ><li key={id}>{message}</li>
    <button 
    onClick={() => setShowMessage(!showMessage)}
    className='bg-green-400 p-3  m-3 rounded-3xl shadow-2xl text-purple-600'>
      { showMessage ? <GrSubtract />:  <GrAdd   /> }
    </button>
    

    
    </div>      
    {showMessage && <p>{hidden}</p>}
    </div>
  );
}

export default Card