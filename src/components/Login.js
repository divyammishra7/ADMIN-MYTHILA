
import React, { useState } from 'react';
import { supabase, useSupabase } from '../context/SupabaseContext'; // Import the supabase instance
import { Input } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
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
      <div className=' h-[100vh] w-[40%]  mx-auto flex flex-col justify-center items-center'>
    
        <Input type="email"    className="searchBar shadow-md"  placeholder="Email" value={email}  size='md' onChange={(e) => setEmail(e.target.value)} />
        <Input type="password"    className="searchBar shadow-md mt-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={signIn}>Sign In</Button>
       
      </div>
    );
  };
export default Login