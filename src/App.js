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
import { HamburgerIcon } from '@chakra-ui/icons';


import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  isOpen,
  onOpen,
  onClose,
  useDisclosure,
  Input
} from '@chakra-ui/react'



function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  const [ele,setEle]=useState(<AddItem/>)
  const [sidebarOpen, setSidebarOpen] = useState(false);



  const {adminAuthenticated,setAdminAuthenticated}=useSupabase();

  async function signOut() {
    const { data,error } = await supabase.auth.signOut()
    
    setAdminAuthenticated(false);
  }



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
     <div className='nav flex  justify-between  items-center'>
      <Button ref={btnRef}  onClick={onOpen} className=''>
        <HamburgerIcon/>
      </Button>
      
      <div className='text-center flex items-center justify-center text-2xl w-[40%]'>
  Mythila Admin
  <img src="https://ecomu.netlify.app/static/media/logom.749151c1ff28a2ffd9fc.png" className='w-[10%]'></img>
      </div>
      
      <Button onClick={signOut} className=''>Sign Out</Button>
      </div>
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
         <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Basic Drawer</DrawerHeader>
          <DrawerBody>
          <h2><Link to='/'></Link></h2>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
    
}

    </div>
  );
}

export default App;
