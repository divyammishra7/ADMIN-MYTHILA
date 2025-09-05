import React, { useMemo, useState } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from '@chakra-ui/react';
import OrdersTable from './dashboard/OrdersTable';
import AnalyticsView from './dashboard/AnalyticsView';

function Dashboard() {
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const onRowClick = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const onCloseModal = () => setSelectedOrderId(null);

  return (
    <Box p={4}>
      <Tabs colorScheme='teal' variant='enclosed'>
        <TabList>
          <Tab>Orders</Tab>
          <Tab>Analytics</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <OrdersTable selectedOrderId={selectedOrderId} onRowClick={onRowClick} onCloseModal={onCloseModal} />
          </TabPanel>
          <TabPanel>
            <AnalyticsView />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default Dashboard;


