import Login from './components/Login';
import logo from './logo.svg';
import { supabase, useSupabase } from './context/SupabaseContext';
import { useState,useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Route } from 'react-router-dom';
import AddItem from './components/AddItem'
import { Link } from 'react-router-dom';
import { Routes } from "react-router-dom";
import DeleteItem from './components/DeleteItem'
import UpdateItem from './components/UpdateItem'
function App() {
  const [ele,setEle]=useState(<AddItem/>)

  const [loading,setLoading]=useState(true);
  const {adminAuthenticated,setAdminAuthenticated}=useSupabase();

  async function signOut() {
    const { data,error } = await supabase.auth.signOut()
    
    setAdminAuthenticated(false);
  }



// console.log(adminAuthenticated)//

  return (
    <div className="App">
        <Routes>
          <Route path='/document' element={<AddItem/>}></Route>
        </Routes>
      {
        !adminAuthenticated?
      <Login/>:<div >
        header
        <div className='h-[100vh] fixed bg-[#F3F3F3]' >
        <Sidebar>
  <Menu>
    {/* <SubMenu label="Charts">
      <MenuItem> Pie charts </MenuItem>
      <MenuItem> Line charts </MenuItem>
    </SubMenu> */}
    <MenuItem onClick={()=>{
      setEle(<AddItem/>)
    }}>ADD AN ITEM </MenuItem>
    <MenuItem onClick={()=>{
      setEle(<DeleteItem/>)
    }}> DELETE AN ITEM </MenuItem>
    <MenuItem onClick={()=>{
      setEle(<UpdateItem/>)
    }}>UPDATE AN ITEM </MenuItem>
 
 

  </Menu>

</Sidebar>

</div>

<div className='hero absolute left-[50%]'>
  {ele}
</div>

      </div>
}

    </div>
  );
}

export default App;
