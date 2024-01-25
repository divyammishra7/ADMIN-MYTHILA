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
    const addItemSubmit=async(formData)=>{
      try {
        const { data, error } = await supabase.from("Products").insert([
          {
            Name: formData.Name,
            created_at: new Date().toISOString(),
          image: formData.image,
            description: formData.description,
            price: formData.price,
            category: formData.category,
           
            shipping:formData.shipping,
            featured:formData.featured
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

    }



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
          setEle,
          addItemSubmit
  
          }}
        >
          {children}
        </SupabaseContext.Provider>
      );
    };  