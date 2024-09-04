// src/route/index.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../Components/Dashboard/Dashboard';
import Income from '../Components/Income/Income';
import Expenses from '../Components/Expenses/Expenses';
import Register from '../Components/auth/register';
import App from './App';



import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
 

  {
    path: "/Dashboard",
    element: <App />
  },
  {
    path: "/register",
    element: <Register />
  },
 
 
  
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
