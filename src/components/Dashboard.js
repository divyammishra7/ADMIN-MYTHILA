import React, { useState } from "react";
import {
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Flex,
  Tbody,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
  HStack,
  Badge
} from "@chakra-ui/react";

function Dashboard() {
  // dummy order data for now
  const orders = [
    {
      id: "ORD123",
      customerName: "John Doe",
      amount: 1500,
      paymentStatus: "Paid",
      orderStatus: "Delivered",
      items: [
        { name: "Kari Line Art", quantity: 2, price: 500 },
        { name: "Abstract Painting", quantity: 1, price: 500 }
      ]
    },
    {
      id: "ORD124",
      customerName: "Jane Smith",
      amount: 2000,
      paymentStatus: "Pending",
      orderStatus: "Out for Delivery",
      items: [
        { name: "Floral Sketch", quantity: 1, price: 1200 },
        { name: "Digital Portrait", quantity: 1, price: 800 }
      ]
    }
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  return (
    <Flex justify={"center"}>
      <div className="w-[90%] mt-10">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Customer Name</Th>
              <Th>Amount</Th>
              <Th>Payment Status</Th>
              <Th>Order Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td>{order.id}</Td>
                <Td>{order.customerName}</Td>
                <Td>₹{order.amount}</Td>
                <Td>
                  <Badge
                    colorScheme={order.paymentStatus === "Paid" ? "green" : "red"}
                  >
                    {order.paymentStatus}
                  </Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      order.orderStatus === "Delivered"
                        ? "green"
                        : order.orderStatus === "Out for Delivery"
                        ? "yellow"
                        : "gray"
                    }
                  >
                    {order.orderStatus}
                  </Badge>
                </Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => handleViewDetails(order)}
                  >
                    View Details
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      {/* Modal for order details */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrder ? (
              <VStack align="start" spacing={3}>
                <Text>
                  <b>Order ID:</b> {selectedOrder.id}
                </Text>
                <Text>
                  <b>Customer:</b> {selectedOrder.customerName}
                </Text>
                <Text>
                  <b>Amount:</b> ₹{selectedOrder.amount}
                </Text>
                <Text>
                  <b>Payment Status:</b> {selectedOrder.paymentStatus}
                </Text>
                <Text>
                  <b>Order Status:</b> {selectedOrder.orderStatus}
                </Text>

                <Text fontWeight="bold" mt={4}>
                  Products Ordered:
                </Text>
                {selectedOrder.items.map((item, idx) => (
                  <HStack key={idx} justify="space-between" w="100%">
                    <Text>{item.name}</Text>
                    <Text>x {item.quantity}</Text>
                    <Text>₹{item.price}</Text>
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Text>No order selected</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default Dashboard;
