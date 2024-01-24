import React from 'react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Flex,
  Input,
  Button
} from '@chakra-ui/react'
import { useState } from 'react'
import { Textarea } from '@chakra-ui/react'
import { useSupabase } from '../context/SupabaseContext'
function AddItem() {
  const {addItemSubmit}=useSupabase();
  const handleSubmit=async(e)=>{
    e.preventDefault();
   await addItemSubmit(formData)
    console.log("Done", formData);
  }

  const [formData, setFormData] = useState({
    Name: "",
    image: "",
    description: "",
    price: 0,
    category: "",
    shipping: true,
    featured: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  //name image category shipping featured price description
  return (
    <Flex justify="center"  h="100vh" className="">
       <form onSubmit={handleSubmit} className="w-[80%] bg-white p-4 rounded-md">
      <FormControl>

    <FormLabel>Name of Item</FormLabel>
    <Input type='text' name="Name" value={formData.Name}    onChange={handleInputChange} placeholder='Name of Item'  />
    <FormLabel>Image Link</FormLabel>
    <Input type='text'  name='image' value={formData.image} onChange={handleInputChange} placeholder='Image Link'/>
    <FormLabel>Description</FormLabel>
    <Textarea placeholder='Describe the item' name='description' value={formData.description} onChange={handleInputChange} />
    <FormLabel>Price</FormLabel>
    <Input type='number' name='price' value={formData.price} onChange={handleInputChange} placeholder='Price of Item'/>
    <FormLabel>Category</FormLabel>
    <Input type='text'  name='category' value={formData.category} onChange={handleInputChange} placeholder='Category'/>


  
  </FormControl>
  <Button type="submit" className="mt-4 customButton">
          Submit
        </Button>
  </form>


    </Flex>
  )
}

export default AddItem