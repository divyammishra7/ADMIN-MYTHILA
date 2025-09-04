import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { useApp } from '../context/AppContext';
import { useToast } from '@chakra-ui/react';
import AllProducts from './AllProducts';

function UpdateItem({ prod }) {
  const { updateItemSubmit } = useSupabase();
  const { setCurrentComponent } = useApp();
  const toast = useToast();

  useEffect(() => {
    console.log("prod is ", prod);
  }, []);

  const [formData, setFormData] = useState({
    Name: prod.Name,
    image: prod.image,
    description: prod.description,
    price: prod.price,
    category: prod.category,
    shipping: true,
    featured: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(prod);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateItemSubmit(formData, prod.id);
    toast({
      title: 'Data Updated!.',
      description: "Your data has been successfully updated.",
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setCurrentComponent(<AllProducts />);
    console.log("Updated!", formData);
  };

  return (
    <Flex justify='center' h='100vh' className=''>
      <form onSubmit={handleSubmit} className='w-[80%] bg-white p-4 rounded-xl'>
        <FormControl>
          <FormLabel>Name of Item</FormLabel>
          <Input 
            type='text' 
            name="Name" 
            value={formData.Name} 
            onChange={handleChange} 
            placeholder='Name of Item'
          />
          <FormLabel>Image Link</FormLabel>
          <Input 
            type='text' 
            name="image" 
            value={formData.image} 
            onChange={handleChange} 
            placeholder='Image Link'
          />
          <FormLabel>Description</FormLabel>
          <Input 
            type='text' 
            name="description" 
            value={formData.description} 
            onChange={handleChange}
          />
          <FormLabel>Price</FormLabel>
          <Input 
            type='text' 
            name="price" 
            value={formData.price} 
            onChange={handleChange} 
            placeholder='Price of Item'
          />
          <FormLabel>Category</FormLabel>
          <Input 
            type='text' 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            placeholder='Category'
          />
        </FormControl>
        <Button type='submit' className='mt-4 customButton'>
          Submit
        </Button>
      </form>
    </Flex>
  );
}

export default UpdateItem;