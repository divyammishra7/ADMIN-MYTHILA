import { Table, Thead, Tr, Th,Td, Flex, Tbody, Input, Button, useToast } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useSupabase } from '../context/SupabaseContext'
import { Toast } from '@chakra-ui/react';

function DeleteItem() {
  const toast = useToast();

  const { fetchProductData, products, deleteItemSubmit } = useSupabase();

    useEffect(() => {
        fetchProductData(null);
        console.log("products: ", products);
    },[products])

  return (
    <Flex justify={'center'} >
        <div className='w-[80%] mt-10'>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Product Name</Th>
                        <Th>Product Category</Th>
                        <Th>Product Price</Th>
                        <Th>Product Desc</Th>
                        <Th>Image Link</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        products.map((product) => (
                            <Tr key={product.id}>
                              <Td><Input value={product.Name}></Input></Td>
                              <Td><Input value={product.category}/></Td>
                              <Td><Input value={product.price}/></Td>
                              <Td><Input value={product.description}/></Td>
                              <Td><Input value={product.image}/></Td>
                              <Td>
                                <Button onClick={() => {
                                  deleteItemSubmit(product.id);
                                  toast({
                                    title: 'Data Deleted!.',
                                    description: "Your data has been successfully deleted.",
                                    status: 'success',
                                    duration: 3000,
                                    isClosable: true,
                                  })
                                }}>
                                    Delete
                                </Button>
                              </Td>
                            </Tr>
                        ))
                    }
                </Tbody>
            </Table>
        </div>
    </Flex>
  )
}

export default DeleteItem