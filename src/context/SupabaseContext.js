import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SupabaseContext = createContext();
export const useSupabase = () => useContext(SupabaseContext);

export const supabase = createClient(
  "https://dxpplwalsoawnmamajxq.supabase.co",
  process.env.REACT_APP_SUPABASE_KEY
);

export const SupabaseProvider = ({ children }) => {
  const Products = "Products";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  const addItemSubmit = async (formData) => {
    try {
      const { data, error } = await supabase.from("Products").insert([
        {
          Name: formData.Name,
          created_at: new Date().toISOString(),
          image: formData.image,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          shipping: formData.shipping,
          featured: formData.featured
        },
      ]);

      if (error) {
        console.error("Error inserting data:", error.message);
      } else {
        console.log("Data inserted successfully:", data);
      }
    } catch (error) {
      console.error("Error processing form submission:", error.message);
    }
  };

  const updateItemSubmit = async (formData, id) => {
    try {
      const { data, error } = await supabase.from("Products")
        .update([
          {
            Name: formData.Name,
            created_at: new Date().toISOString(),
            image: formData.image,
            description: formData.description,
            price: formData.price,
            category: formData.category,
            shipping: formData.shipping,
            featured: formData.featured
          }
        ]).eq('id', id);
      
      if (error) {
        console.error("Error inserting data:", error.message);
      } else {
        console.log("Data inserted successfully:", data);
      }
    } catch (error) {
      console.error("Error processing from submission:", error.message);
    }
  };

  const deleteItemSubmit = async (id) => {
    try {
      const { error } = await supabase
        .from('Products')
        .delete()
        .eq('id', id);

      fetchProductData(null);

      if (error) {
        console.error("Error inserting data:", error.message);
      }
    } catch (error) {
      console.error("Error processing form submission:", error.message);
    }
  };

  const fetchProductData = async (id) => {
    try {
      let supabaseQuery = supabase.from("Products").select("*");

      if (id != null) {
        supabaseQuery = supabaseQuery.eq("id", id);
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        console.log("Error fetching product: ", error.message);
      } else {
        const productData = data || [];
        setProducts(productData);
        console.log("product data from context", products);
        return productData;
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const { data, error } = await supabase
          .from(Products)
          .select("*")
          .order("id");
    
        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setTableData(data || []);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };
    
    fetchTableData();
  }, []);

  async function checkUserAuthentication() {
    setLoading(true);
    const { data: user } = await supabase.auth.getUser();
    console.log(user);
    
    if (user.user != null) {
      setAdminAuthenticated(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserAuthentication();
  }, []);

  return (
    <SupabaseContext.Provider
      value={{
        loading,
        setLoading,
        tableData,
        adminAuthenticated,
        setAdminAuthenticated,
        addItemSubmit,
        updateItemSubmit,
        fetchProductData,
        products,
        deleteItemSubmit
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};