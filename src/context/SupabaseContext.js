import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

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
      const res = await fetch(`${API_BASE}/dashboard/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to create product');
      }
      const data = await res.json();
      console.log("Data inserted successfully:", data);
    } catch (error) {
      console.error("Error processing form submission:", error.message);
    }
  };

  const updateItemSubmit = async (formData, id) => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to update product');
      }
      const data = await res.json();
      console.log("Data updated successfully:", data);
    } catch (error) {
      console.error("Error processing from submission:", error.message);
    }
  };

  const deleteItemSubmit = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/dashboard/products/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to delete product');
      }
      fetchProductData(null);
    } catch (error) {
      console.error("Error processing form submission:", error.message);
    }
  };

  const fetchProductData = async (id) => {
    try {
      const url = new URL(`${API_BASE}/dashboard/products`);
      if (id != null) {
        url.searchParams.append('id', id);
      }
      const res = await fetch(url.toString());
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to fetch products');
      }
      const data = await res.json();
      const productData = data || [];
      setProducts(productData);
      console.log("product data from context", products);
      return productData;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      return [];
    }
  };

  // Orders APIs (Supabase schema: public.orders, public.order_details, public.products)
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/orders`);
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to fetch orders');
      }
      const data = await res.json();
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
      const url = new URL(`${API_BASE}/analytics/order-lines`);
      url.searchParams.append('orderId', orderId);
      const res = await fetch(url.toString());
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to fetch order lines');
      }
      const data = await res.json();
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
      const url = new URL(`${API_BASE}/analytics/order-lines`);
      url.searchParams.append('orderIds', orderIds.join(','));
      const res = await fetch(url.toString());
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || 'Failed to fetch order lines for ids');
      }
      const data = await res.json();
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