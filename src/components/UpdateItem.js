import React, { useEffect, useState } from "react";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  HStack,
  Select,
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import { useSupabase } from "../context/SupabaseContext";
import AllProducts from "./AllProducts";

function UpdateItem({ prod }) {
  const { updateItemSubmit, setEle } = useSupabase();
  const toast = useToast();

  const [formData, setFormData] = useState({
    Name: prod?.name || "",
    image: prod?.image || "",
    description: prod?.description || "",
    price: prod?.price || "",
    category: prod?.category || "",
    shipping: prod?.shipping ?? true,
    featured: prod?.featured ?? false,
  });

  useEffect(() => {
    if (prod) {
      setFormData({
        Name: prod.name || "",
        image: prod.image || "",
        description: prod.description || "",
        price: prod.price || "",
        category: prod.category || "",
        shipping: prod.shipping ?? true,
        featured: prod.featured ?? false,
      });
    }
  }, [prod]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (prod?.id) {
      await updateItemSubmit(formData, prod.id);
      toast({
        title: "Data Updated!",
        description: "Your data has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "No product selected",
        description: "Please select a product from All Products first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
    setEle(<AllProducts />);
  };

  return (
    <Flex justify="center" h="100vh">
      <form onSubmit={handleSubmit} className="w-[80%] bg-white p-4 rounded-xl">
        <FormControl>
          <FormLabel>Product Image</FormLabel>
          <HStack mb={4}>
            <Avatar src={formData.image} size="md" />
            <Input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image Link"
            />
          </HStack>

          <FormLabel>Name of Item</FormLabel>
          <Input
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            placeholder="Name of Item"
          />

          <FormLabel>Description</FormLabel>
          <Input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <FormLabel>Price</FormLabel>
          <Input
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
          />

          <FormLabel>Category</FormLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Select category"
          >
            <option value="Toy">Toy</option>
            <option value="Notebook">Notebook</option>
            <option value="HandCrafts">HandCrafts</option>
            <option value="Paintings">Paintings</option>
          </Select>

          <Checkbox
            name="shipping"
            isChecked={formData.shipping}
            onChange={handleChange}
            mt={2}
          >
            Shipping Available
          </Checkbox>

          <Checkbox
            name="featured"
            isChecked={formData.featured}
            onChange={handleChange}
            mt={2}
          >
            Featured Product
          </Checkbox>
        </FormControl>

        <Button type="submit" mt={4} colorScheme="blue">
          Submit
        </Button>
      </form>
    </Flex>
  );
}

export default UpdateItem;
