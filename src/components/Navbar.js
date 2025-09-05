import React from 'react';
import { Button, Flex, HStack, Box, Spacer, Image, Text } from '@chakra-ui/react';
import { supabase, useSupabase } from '../context/SupabaseContext';
import { useApp } from '../context/AppContext';
import AddItem from './AddItem';
import DeleteItem from './DeleteItem';
import AllProducts from './AllProducts';
import Dashboard from './Dashboard';

function Navbar() {
  const { adminAuthenticated, setAdminAuthenticated } = useSupabase();
  const { setCurrentComponent } = useApp();

  async function signOut() {
    const { data, error } = await supabase.auth.signOut();
    setAdminAuthenticated(false);
  }

  return (
    <Box as="nav" w="100%" borderBottomWidth="1px" bg="white" position="sticky" top={0} zIndex={10}>
      <Flex align="center" px={4} py={3}>
        <HStack spacing={3}>
          <Image src="https://ecomu.netlify.app/static/media/logom.749151c1ff28a2ffd9fc.png" alt="Mythila" boxSize="36px" />
          <Text fontWeight="bold" fontSize="lg">Mythila Admin</Text>
        </HStack>
        <Spacer />
        <HStack spacing={2}>
          <Button size="sm" variant="ghost" onClick={() => setCurrentComponent(<Dashboard />)}>Dashboard</Button>
          <Button size="sm" variant="ghost" onClick={() => setCurrentComponent(<AddItem />)}>Add Item</Button>
          <Button size="sm" variant="ghost" onClick={() => setCurrentComponent(<DeleteItem />)}>Delete Item</Button>
          <Button size="sm" variant="ghost" onClick={() => setCurrentComponent(<AllProducts />)}>Update Item</Button>
        </HStack>
        <Spacer />
        <Button size="sm" colorScheme="red" onClick={signOut}>Sign Out</Button>
      </Flex>
    </Box>
  );
}

export default Navbar;