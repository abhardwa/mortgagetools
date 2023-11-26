// import { Row, Col, Container } from 'react-bootstrap';
import ResponsiveNavbar from "../components/ResponsiveNavbar";
import Footer from "../components/Footer";
// import Item from '../components/Item';
import { Routes, Route, useLocation } from "react-router-dom";
// import {Link, Navigate} from 'react-router-dom';
import Home from "../pages/Home";
import Contact from "../pages/Contact";
// import About from '../components/About' ;
import Amortization from "../pages/Amortization";
import Buydown from "../pages/Buydown";
import Escrow from "../pages/Escrow";
import PreQual from "../pages/PreQual";
import Services from "../pages/Services";
import QuoteAnalysis from "../pages/QuoteAnalysis";
import PointsAnalysis from "../pages/PointsAnalysis";
import PaymentCalc from "../pages/PaymentCalc";
import Loans from "../pages/Loans";
import Login from "../pages/login";
import { useState } from "react";

function Main() {
  // console.log("Inside Main.js");
  const [showModal, setShowModal] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname;

  const handleOpenModal = (e) => {
    e?.preventDefault();
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    e?.preventDefault();
    setShowModal(false);
  };
  const login = showModal ? (
    <Login
      action="login"
      show={showModal}
      handleOpen={handleOpenModal}
      handleClose={handleCloseModal}
    />
  ) : (
    ""
  );

  // console.log(currentPath);
  return (
    <div>
      <ResponsiveNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/amortization" element={<Amortization />} />
        <Route path="/buydown" element={<Buydown />} />
        <Route path="/pointsanalysis" element={<PointsAnalysis />} />
        <Route path="/escrow" element={<Escrow />} />
        <Route path="/prequal" element={<PreQual />} />
        <Route path="/quoteanalysis" element={<QuoteAnalysis />} />
        <Route path="/loancomp" element={<Loans />} />
        <Route path="/paymentcalc" element={<PaymentCalc />} />
        <Route path="/services" element={<Services />} />
        <Route
          path="/login"
          element={
            <Login
              action="login"
              show={showModal}
              handleOpen={handleOpenModal}
              handleClose={handleCloseModal}
              location={currentPath}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Login
              action="profile"
              show={showModal}
              handleOpen={handleOpenModal}
              handleClose={handleCloseModal}
              location={currentPath}
            />
          }
        />
        <Route
          path="/logout"
          element={
            <Login
              action="logout"
              handleClose={handleCloseModal}
              location={currentPath}
            />
          }
        />
        <Route
          path="/emailchg"
          element={
            <Login
              action="emailchg"
              handleClose={handleCloseModal}
              location={currentPath}
            />
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default Main;
