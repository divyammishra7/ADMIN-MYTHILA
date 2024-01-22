import React from 'react';
import Login from './components/Login';
import logo from './logo.svg';
import { supabase, useSupabase } from './context/SupabaseContext';
import { useState,useEffect } from 'react';
import { Button } from '@chakra-ui/react';

import { Route } from 'react-router-dom';
import AddItem from './components/AddItem'
import { Link } from 'react-router-dom';
import { Routes } from "react-router-dom";
import DeleteItem from './components/DeleteItem'
import UpdateItem from './components/UpdateItem'




import Navbar from './components/Navbar';



function App() {
 


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {ele,adminAuthenticated}=useSupabase();




// console.log(adminAuthenticated)//
 console.log(adminAuthenticated)

  return (
    <div className="">
        <Routes>
          <Route path='/additem' element={<AddItem/>}></Route>
          <Route path='/deleteitem' element={<DeleteItem/>}></Route>
          <Route path='/updateitem' element={<UpdateItem/>}></Route>
        </Routes>
      {
        !adminAuthenticated?
      <Login/>:
      <>
     
    <Navbar/>
    <div className='hero '>
      {ele}
    </div>
       


    </>
        
   
    
}

    </div>
  );
}

export default App;
