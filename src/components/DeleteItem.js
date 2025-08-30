import { Table, Thead, Tr, Th, Td, Flex, Tbody, Input, Button, useToast, Avatar, HStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useSupabase } from '../context/SupabaseContext'

function DeleteItem() {
  const toast = useToast()
  const { fetchProductData, products, deleteItemSubmit } = useSupabase()

  useEffect(() => {
    fetchProductData(null)
  }, [])

  return (
    <Flex justify="center" mt={10}>
      <div className="w-[80%]">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Description</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products?.map((product) => (
              <Tr key={product.id}>
                <Td>
                  <HStack spacing={3}>
                    <Avatar name={product.name} src={product.image} size="lg" />
                    <Input value={product.name} isReadOnly border="none" />
                  </HStack>
                </Td>
                <Td>
                  <Input value={product.category} isReadOnly border="none" />
                </Td>
                <Td>
                  <Input value={product.price} isReadOnly border="none" />
                </Td>
                <Td>
                  <Input value={product.description} isReadOnly border="none" />
                </Td>
                <Td>
                  <Button
                    colorScheme="red"
                    _hover={{ bg: 'red.600' }}
                    onClick={() => {
                      deleteItemSubmit(product.id)
                      toast({
                        title: 'Product deleted!',
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                      })
                    }}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </Flex>
  )
}

export default DeleteItem
