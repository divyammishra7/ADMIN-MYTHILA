import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react';
import { useSupabase } from '../context/SupabaseContext';

function UpdateItem() {
  const { updateItemSubmit } = useSupabase();
  const [formData, setFormData] = useState({
    Name: "",
    image: "",
    description: "",
    price: 0,
    category: "",
    shipping: true,
    featured: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateItemSubmit(formData);
    console.log("Updated!", formData);
  }

  return (
    <Flex justify='center' h='100vh' className=''>
      <form onSubmit={handleSubmit} className='w-[80%] bg-white p-4 rounded-xl'>
        <FormControl>
          <FormLabel>Name of Item</FormLabel>
          <Input type='text' name="Name" value={formData.Name} onChange={handleChange} placeholder='Name of Item'/>
          <FormLabel>Image Link</FormLabel>
          <Input type='text' name="Name" value={formData.image} onChange={handleChange} placeholder='Image Link'/>
          <FormLabel>Description</FormLabel>
          <Input type='text' name="Name" value={formData.description} onChange={handleChange}/>
          <FormLabel>Price</FormLabel>
          <Input type='text' name="Name" value={formData.price} onChange={handleChange} placeholder='Price of Item'/>
          <FormLabel>Category</FormLabel>
          <Input type='text' name="Name" value={formData.category} onChange={handleChange} placeholder='Category'/>
        </FormControl>
      </form>
    </Flex>
  )
}

export default UpdateItem