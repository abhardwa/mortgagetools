// import { Row, Col, Container } from 'react-bootstrap';
import ResponsiveNavbar from '../components/ResponsiveNavbar';
import Footer from '../components/Footer';
// import Item from '../components/Item';
import {BrowserRouter, Routes, Route} from "react-router-dom";
// import {Link, Navigate} from 'react-router-dom';
import Home from '../components/Home';
import Contact from '../components/Contact';
import About from '../components/About' ;
import Amortization from '../components/Amortization' ;
import Buydown from '../components/Buydown'; 
import Escrow from '../components/Escrow' ;
import PreQual from '../components/PreQual' ;
import Services from '../components/Services' ;

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