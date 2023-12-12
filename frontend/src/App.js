import "./App.css";
import React from "react";
import Header from "./components/Header";
import Form from "./components/Form"
import Posts from "./components/Posts";
import { Route, Routes,  } from "react-router-dom";
function App() {
  
 

  return (
    <React.Fragment>
       <Header />
  
     <Routes>
     <Route path="/" element={<Form/>}/>
<Route path="/form" element={<Form/>}/>
<Route path="/posts" element={<Posts/>}/>

     </Routes>

  
    </React.Fragment>
  );
}

export default App;
