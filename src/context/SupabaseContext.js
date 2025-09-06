import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import AddItem from "../components/AddItem";
import AllProducts from "../components/AllProducts";
import Dashboard from "../components/Dashboard";
import { v4 as uuidv4 } from "uuid";

const SupabaseContext = createContext();
export const useSupabase = () => useContext(SupabaseContext);

export const supabase = createClient(
  "https://oxcjhpacnlqmkdmabxxr.supabase.co",
  process.env.REACT_APP_SUPABASE_KEY
);

export const SupabaseProvider = ({ children }) => {
  const Products = "products";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [ele, setEle] = useState(<Dashboard />);

  const addItemSubmit = async (formData) => {
    try {
      const { data, error } = await supabase.from("products").insert([
        {
          id: uuidv4(),
          name: formData.Name,
          colors: [],
          image: formData.image,
          description: formData.description,
          price: formData.price,
          company: "mythila",
          category: formData.category,
          shipping: formData.shipping,
          featured: formData.featured,
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
      const { data, error } = await supabase
        .from("products")
        .update([
          {
            name: formData.Name,
            colors: [],
            image: formData.image,
            description: formData.description,
            price: formData.price,
            company: "mythila",
            category: formData.category,
            shipping: formData.shipping,
            featured: formData.featured,
          },
        ])
        .eq("id", id);

      if (error) {
        console.error("Error updating data:", error.message);
      } else {
        console.log("Data updated successfully:", data);
      }
    } catch (error) {
      console.error("Error processing form submission:", error.message);
    }
  };

  const deleteItemSubmit = async (id) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      fetchProductData(null);

      if (error) {
        console.error("Error deleting data:", error.message);
      }
    } catch (error) {
      console.error("Error processing form submission:", error.message);
    }
  };

  const fetchProductData = async (id) => {
    try {
      let supabaseQuery = supabase.from("products").select("*");

      if (id != null) {
        supabaseQuery = supabaseQuery.eq("id", id);
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error("Error fetching data:", error.message);
        return [];
      } else {
        setProducts(data || []);
        console.log("product data from context", products);
        return data || [];
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      return [];
    }
  };

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        let supabaseQuery = supabase.from("products").select("*");
        const { data, error } = await supabaseQuery;

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
  }

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
        deleteItemSubmit,
        supabase,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};
