import React, { useEffect, useMemo, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Text } from '@chakra-ui/react';
import { useSupabase } from '../../context/SupabaseContext';

function OrdersTable({ selectedOrderId, onRowClick, onCloseModal }) {
  const [ordersLocal, setOrdersLocal] = useState([]);
  const [lines, setLines] = useState([]);
  const { fetchOrders, fetchOrderLinesWithProducts } = useSupabase();

  useEffect(() => {
    const load = async () => {
      const data = await fetchOrders();
      setOrdersLocal(data || []);
    };
    load();
  }, [fetchOrders]);

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return ordersLocal.find((o) => o.order_id === selectedOrderId) || null;
  }, [selectedOrderId, ordersLocal]);

  useEffect(() => {
    const loadLines = async () => {
      if (!selectedOrderId) {
        setLines([]);
        return;
      }
      const l = await fetchOrderLinesWithProducts(selectedOrderId);
      setLines(l || []);
    };
    loadLines();
  }, [selectedOrderId, fetchOrderLinesWithProducts]);

  const statusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'delivered':
        return 'green';
      case 'shipped':
        return 'blue';
      case 'processing':
        return 'yellow';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      <Table variant='striped' size='md'>
        <Thead>
          <Tr>
            <Th>Order #</Th>
            <Th>Payment ID</Th>
            <Th isNumeric>Total Amount</Th>
            <Th>Delivery Status</Th>
            <Th>Order Date</Th>
            <Th>ETA</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ordersLocal.map((order) => (
            <Tr key={order.order_id} _hover={{ bg: 'gray.50', cursor: 'pointer' }} onClick={() => onRowClick(order.order_id)}>
              <Td>#{order.order_id}</Td>
              <Td>{order.payment_id}</Td>
              <Td isNumeric>${Number(order.total_amount).toFixed(2)}</Td>
              <Td>
                <Badge colorScheme={statusColor(order.delivery_status)}>{order.delivery_status}</Badge>
              </Td>
              <Td>{new Date(order.order_date).toLocaleString()}</Td>
              <Td>{order.estimated_delivery_date ? new Date(order.estimated_delivery_date).toLocaleDateString() : '-'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={!!selectedOrder} onClose={onCloseModal} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details {selectedOrder ? `#${selectedOrder.order_id}` : ''}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder && (
              <Box>
                <Box mb={4}>
                  <Text fontWeight='bold'>Payment ID: {selectedOrder.payment_id}</Text>
                  <Text>Total: ${Number(selectedOrder.total_amount).toFixed(2)}</Text>
                  <Text>Status: {selectedOrder.delivery_status}</Text>
                  <Text>Order Date: {new Date(selectedOrder.order_date).toLocaleString()}</Text>
                </Box>

                <Table variant='simple' size='sm'>
                  <Thead>
                    <Tr>
                      <Th>Product</Th>
                      <Th isNumeric>Price</Th>
                      <Th isNumeric>Qty</Th>
                      <Th isNumeric>Line Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {lines.map((line) => (
                      <Tr key={line.id}>
                        <Td>
                          <Box display='flex' alignItems='center' gap='12px'>
                            {line.product?.image && (
                              <img src={line.product.image} alt={line.product?.name} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6 }} />
                            )}
                            <Box>
                              <Text>{line.product?.name || line.product_id}</Text>
                              <Text fontSize='sm' color='gray.500'>{line.product?.company}</Text>
                            </Box>
                          </Box>
                        </Td>
                        <Td isNumeric>${Number(line.product?.price || 0).toFixed(2)}</Td>
                        <Td isNumeric>{line.quantity}</Td>
                        <Td isNumeric>${((Number(line.product?.price || 0)) * line.quantity).toFixed(2)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default OrdersTable;


