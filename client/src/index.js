import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthContextProvider } from './context/AuthContext'
import  ChatContextProvider  from './context/ChatContext'

import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
 
 
  
    <AuthContextProvider>
        <ChatContextProvider>
     <BrowserRouter>
    <ChakraProvider>
        <App />
        </ChakraProvider>
      </BrowserRouter>
      </ChatContextProvider>
    </AuthContextProvider>,
  
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
