import { Table, Thead, Tr, Th,Td, Flex, Tbody } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useSupabase } from '../context/SupabaseContext'

const AllProducts = () => {
    const { fetchProductData, products } = useSupabase();

    useEffect(() => {
        fetchProductData(null);
        console.log("products: ", products);
    },[])
    
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
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        products.map((product) => (
                            <Tr key={product.id}>
                              <Td>{product.Name}</Td>
                              <Td>{product.category}</Td>
                              <Td>{product.price}</Td>
                              <Td>{product.description}</Td>
                              <Td>{product.image}</Td>
                            </Tr>
                        ))
                    }
                </Tbody>
            </Table>
        </div>
    </Flex>
  )
}

export default AllProducts