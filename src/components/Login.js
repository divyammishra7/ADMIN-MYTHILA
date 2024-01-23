
import React, { useState } from 'react';
import { supabase, useSupabase } from '../context/SupabaseContext'; // Import the supabase instance
import { Input } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react'
import { Image,Box } from '@chakra-ui/react'
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setAdminAuthenticated}=useSupabase();
 
  
    const signIn = async () => {
        if(email!='admin@mythila.com' || password!='1234'){
            return alert('invalid credits');
        }
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
          })
          // console.log(data);
          setAdminAuthenticated(true);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
  
    return (
      <div>
        <div className='flex md:w-[100%] mx-auto justify-center items-center'>
      
  <Image src="https://ecomu.netlify.app/static/media/logom.749151c1ff28a2ffd9fc.png"  className='md:w-[5%] w-[10%]'
   
  
    alt='Dan Abramov'/>

          
          <h1 className='text-4xl'>
      ADMIN MYTHIILA
      </h1>
      
        </div>
      <div className=' w-[40%]  mx-auto flex flex-col justify-center items-center mt-32'>
       
    
        <Input type="email"    className="searchBar shadow-md"  placeholder="Email" value={email}  size='md' onChange={(e) => setEmail(e.target.value)} />
        <Input type="password"    className="searchBar shadow-md mt-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={signIn} className='mt-2'>Sign In</Button>
       
      </div>
      </div>
    );
  };
export default Login