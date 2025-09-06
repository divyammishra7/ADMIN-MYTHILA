import { Table, Thead, Tr, Th, Td, Flex, Tbody, Input, Button, Avatar, HStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useSupabase } from '../context/SupabaseContext'

const AllProducts = ({ onUpdate }) => {
  const { fetchProductData, products } = useSupabase()

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
              <Th>Image Link</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products?.map((product) => (
              <Tr key={product.id}>
                <Td>
                  <HStack spacing={3}>
                    <Avatar src={product.image} size="sm" />
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
                  <Input value={product.image} isReadOnly border="none" />
                </Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => onUpdate && onUpdate(product)}
                  >
                    Update
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

export default AllProducts
