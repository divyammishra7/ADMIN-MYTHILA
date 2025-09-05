import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SupabaseContext = createContext();
export const useSupabase = () => useContext(SupabaseContext);

export const supabase = createClient(
  "https://oxcjhpacnlqmkdmabxxr.supabase.co",
  process.env.REACT_APP_SUPABASE_KEY
);

export const SupabaseProvider = ({ children }) => {
  const Products = "Products";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);

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

  // Orders APIs (Supabase schema: public.orders, public.order_details, public.products)
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });
      if (error) {
        console.error('Error fetching orders:', error.message);
        return [];
      }
      setOrders(data || []);
      return data || [];
    } catch (err) {
      console.error('Unexpected error fetching orders:', err.message);
      return [];
    }
  };

  const fetchOrderLinesWithProducts = async (orderId) => {
    if (!orderId) return [];
    try {
      const { data, error } = await supabase
        .from('order_details')
        .select('id, order_id, product_id, quantity, product:products(*)')
        .eq('order_id', orderId);
      if (error) {
        console.error('Error fetching order lines:', error.message);
        return [];
      }
      return (data || []).map((row) => ({
        id: row.id,
        order_id: row.order_id,
        product_id: row.product_id,
        quantity: row.quantity,
        product: row.product
      }));
    } catch (err) {
      console.error('Unexpected error fetching order lines:', err.message);
      return [];
    }
  };

  const fetchOrderLinesForOrderIds = async (orderIds) => {
    if (!orderIds || !orderIds.length) return [];
    try {
      const { data, error } = await supabase
        .from('order_details')
        .select('id, order_id, product_id, quantity, product:products(*)')
        .in('order_id', orderIds);
      if (error) {
        console.error('Error fetching order lines for ids:', error.message);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Unexpected error fetching order lines for ids:', err.message);
      return [];
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
        deleteItemSubmit,
        // Orders/Analytics
        orders,
        fetchOrders,
        fetchOrderLinesWithProducts,
        fetchOrderLinesForOrderIds,
        supabase
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};