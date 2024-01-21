
import React, { useState } from 'react';
import { supabase } from '../context/SupabaseContext'; // Import the supabase instance

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    async function signOut() {
        const { data,error } = await supabase.auth.signOut()
        
      }
  
    const signIn = async () => {
        if(email!='admin@mythila.com' || password!='1234'){
            return alert('invalid credits');
        }
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
          })
          console.log(data);
      } catch (error) {
        console.error('Error:', error.message);
      }
    };
  
    return (
      <div>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={signIn}>Sign In</button>
        <button onClick={signOut}>Sign out</button>
      </div>
    );
  };
export default Login