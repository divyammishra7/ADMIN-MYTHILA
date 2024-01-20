import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SupabaseContext = createContext();
export const useSupabase = () => useContext(SupabaseContext);



export const SupabaseProvider = ({ children }) => {
    const supabase = createClient(
      "https://dxpplwalsoawnmamajxq.supabase.co",
      process.env.REACT_APP_SUPABASE_KEY
    );
    const Products="Products";


    const [loading,setLoading]=useState(true);
    const [tableData,setTableData]=useState([]);
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
    return (
        <SupabaseContext.Provider
          value={{
          loading,
          setLoading,
          tableData,
          }}
        >
          {children}
        </SupabaseContext.Provider>
      );
    };  