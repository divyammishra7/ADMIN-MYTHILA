import React from 'react';
import { Link } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { supabase, useSupabase } from '../context/SupabaseContext';
import AddItem from './AddItem';
import DeleteItem from './DeleteItem';
import UpdateItem from './UpdateItem';
import AllProducts from './AllProducts';

function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
    
  const { adminAuthenticated, setAdminAuthenticated } = useSupabase();

  async function signOut() {
    const { data, error } = await supabase.auth.signOut();
    setAdminAuthenticated(false);
  }

  const { setEle } = useSupabase();

  return (
    <>
      <div className='nav flex justify-between items-center'>
        <Button ref={btnRef} onClick={onOpen} className=''>
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
            <h2 style={{cursor:'pointer'}} onClick={() => {
              setEle(<AddItem/>);
              onClose();
            }}>ADD ITEM</h2>
            <h2 style={{cursor:'pointer'}} onClick={() => {
              setEle(<DeleteItem/>);
              onClose();
            }}>DELETE ITEM</h2>
            <h2 style={{cursor:'pointer'}} onClick={() => {
              setEle(<AllProducts/>);
              onClose();
            }}>Update ITEM</h2>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Navbar;