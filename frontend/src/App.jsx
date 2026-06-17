import styles from "./App.module.css";
import Landing from "../components/Auth.jsx";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import MyForm from "../pages/MyForm.jsx";
import Searchbar from "../components/searchbar.jsx";
import Products from "../pages/Products.jsx";
import ProductView from "../pages/ProductView.jsx";
import Header from "../components/Header.jsx";
import Cart from "../pages/Cart.jsx";
import Home from "../pages/Home.jsx";
import Profile from "../pages/Profile.jsx";
import Address from "../pages/Address.jsx";
import PaymentSuccess from "../components/PaymentSuccess.jsx";
import Homee from "../components/Homee.jsx";
import DoctorsList from "../pages/DoctorsList.jsx";
import AppointmentForm from "../pages/ApointmentForm.jsx";
import CustomCursor from '../components/CustomCursor.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLoginPage from './components/admin/AdminLoginPage.jsx';
import AppointmentManagement from './components/admin/AppointmentManagement.jsx';

function Layout() {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    if (location.pathname === "/landing" || location.pathname === "/form" || location.pathname.startsWith("/admin")) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [location.pathname]);

  return (
    <>
      <CustomCursor />
      {showHeader && <Header />}
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/form" element={<MyForm />} />
        <Route path="/search" element={<Searchbar />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductView />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/address" element={<Address />} />
        <Route path="/payment" element={<Homee />} />
        <Route path="/paymentsuccess" element={<PaymentSuccess />} />
        <Route path="/doctors" element={<DoctorsList />} />
        <Route path="/book-appointment/:doctorId" element={<AppointmentForm />} />
        
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/appointments" element={<AppointmentManagement />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
