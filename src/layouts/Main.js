// import { Row, Col, Container } from 'react-bootstrap';
import ResponsiveNavbar from '../components/ResponsiveNavbar';
import Footer from '../components/Footer';
// import Item from '../components/Item';
import {BrowserRouter, Routes, Route} from "react-router-dom";
// import {Link, Navigate} from 'react-router-dom';
import Home from '../pages/Home';
import Contact from '../pages/Contact';
import About from '../components/About' ;
import Amortization from '../pages/Amortization' ;
import Buydown from '../pages/Buydown'; 
import Escrow from '../pages/Escrow' ;
import PreQual from '../pages/PreQual' ;
import Services from '../pages/Services' ;

function Main() {
  console.log("Inside Main.js");
  return (
    <div>
        <BrowserRouter>
            <ResponsiveNavbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/amortization" element={<Amortization />} />
                <Route path="/buydown" element={<Buydown />} />
                <Route path="/escrow" element={<Escrow />} />
                <Route path="/prequal" element={<PreQual />} />
                <Route path="/services" element={<Services />} />
            </Routes>
            <Footer/>
        </BrowserRouter>
    </div>
  );
}

export default Main;