import React, { useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Flex, Button } from "@chakra-ui/react";
import { useSupabase, supabase } from "../context/SupabaseContext";
import AddItem from "./AddItem";
import DeleteItem from "./DeleteItem";
import UpdateItem from "./UpdateItem";
import AllProducts from "./AllProducts";
import Dashboard from "./Dashboard";

function Navbar() {
  const { setAdminAuthenticated } = useSupabase();

  const [selectedProduct, setSelectedProduct] = useState(null); // <-- Add this
  const [tabIndex, setTabIndex] = useState(0); // control active tab

  async function signOut() {
    await supabase.auth.signOut();
    setAdminAuthenticated(false);
  }

  return (
    <Box>
      {/* Top navbar */}
      <Flex justify="space-between" align="center" p={4} bg="gray.100" borderBottom="1px solid #ccc">
        <Flex align="center" gap={4}>
          <Box fontSize="2xl" fontWeight="bold">
            Mythila Admin
          </Box>
          <img
            src="https://ecomu.netlify.app/static/media/logom.749151c1ff28a2ffd9fc.png"
            alt="logo"
            className="w-[50px]"
          />
        </Flex>

        <Button colorScheme="red" onClick={signOut}>
          Sign Out
        </Button>
      </Flex>

      {/* Tabs */}
      <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)} variant="enclosed" colorScheme="blue" mt={4}>
        <TabList>
          <Tab>Dashboard</Tab>
          <Tab>Add Item</Tab>
          <Tab>Delete Item</Tab>
          <Tab>Update Item</Tab>
          <Tab>All Products</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Dashboard />
          </TabPanel>
          <TabPanel>
            <AddItem />
          </TabPanel>
          <TabPanel>
            <DeleteItem />
          </TabPanel>
          <TabPanel>
            <UpdateItem prod={selectedProduct} />
          </TabPanel>
          <TabPanel>
            <AllProducts
              onUpdate={(product) => {
                setSelectedProduct(product);
                setTabIndex(3); // Update Item tab index
              }}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Navbar;
