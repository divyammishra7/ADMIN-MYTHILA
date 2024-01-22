import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import AddItem from "../components/AddItem";

const SupabaseContext = createContext();
export const useSupabase = () => useContext(SupabaseContext);

export const   supabase = createClient(
  "https://dxpplwalsoawnmamajxq.supabase.co",
  process.env.REACT_APP_SUPABASE_KEY
);

export const SupabaseProvider = ({ children }) => {
   
    const Products="Products";


    const [loading,setLoading]=useState(true);
    const [tableData,setTableData]=useState([]);
    const [adminAuthenticated, setAdminAuthenticated] = useState(false);
    const [ele,setEle]=useState(<AddItem/>)
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
      async function checkUserAuthentication() { //
        setLoading(true);
     
        const {data:user}= await supabase.auth.getUser();
        console.log(user);
        
      
        if (user.user!=null) {
          setAdminAuthenticated(true);

          setLoading(false);
          
        }
        
      
      };
      useEffect(()=>{//
        checkUserAuthentication();
        },[])//
    return (
        <SupabaseContext.Provider
          value={{
          loading,
          setLoading,
          tableData,
          adminAuthenticated,
          setAdminAuthenticated,
          ele,
          setEle
  
          }}
        >
          {children}
        </SupabaseContext.Provider>
      );
    };  