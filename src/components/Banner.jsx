import React from 'react'
import { useEffect ,useState} from 'react'

export default function Banner () {
  const [machine , setmachine] = useState([]);

 
    useEffect(() => {
     fetch("http://localhost:5000/get-machines")
     .then((response) =>response.json())
     .then((data) => setmachine(data));
    
    }, [machine])
    
  

  return (
    <div className='bg-red-300'>Banner
    {machine}

    </div>
  )
}
