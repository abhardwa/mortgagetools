import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUser } from "../store/store";
// import { useState } from "react";
// import Login from '../pages/login';
import "../css/menu.css";

const ResponsiveNavbar = (props) => {
  const location = useLocation();
  // console.log("Inside ResponsiveNavbar.js");
  const user = useSelector(getUser); // If the user is logged in this object will be defined and return true
  // console.log(user);
  // const dispatch = useDispatch();

  return (
    <div>
      <Navbar bg="dark" collapseOnSelect expand="sm">
        <Container>
          <Navbar.Brand href="/">
            <img
              className="block mx-auto rounded-full lg:mx-0 lg:shrink-0"
              style={{ height: "2.5rem", margin: "0px", padding: "0px" }}
              src={require("../img/BrandWhite.png")}
              alt="MortgageToolsUSA"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-toggle" />
          <Navbar.Collapse id="navbar-toggle">
            <Nav activeKey={location.pathname} className="mr-auto sub-nav">
              <Nav.Link href="/">Home</Nav.Link>
              <NavDropdown title="Tools & Calculators" id="nav-dropdown">
                <NavDropdown.Item href="/prequal">
                  Pre-Qualification/Affordability
                </NavDropdown.Item>
                <NavDropdown.Item href="/amortization">
                  Amortization
                </NavDropdown.Item>
                <NavDropdown.Item href="/buydown">
                  Temporary Buydown (3-2-1, 2-1, 1-0)
                </NavDropdown.Item>
                <NavDropdown.Item href="/pointsanalysis">
                  Should I Pay Points?
                </NavDropdown.Item>
                <NavDropdown.Item href="/escrow">
                  Escrow Calculator
                </NavDropdown.Item>
                <NavDropdown.Item href="/quoteanalysis">
                  Quotes Comparison Guide
                </NavDropdown.Item>
                <NavDropdown.Item href="/loancomp">
                  Loan Rate/Term Sensitivity Analysis
                </NavDropdown.Item>
                <NavDropdown.Item href="/paymentcalc">
                  Monthly Mortgage Payment Calculator
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/services">Mortgage News</Nav.Link>
              <Nav.Link href="/contact">Contact</Nav.Link>
              {/* <Nav.Link href="/about">About</Nav.Link> */}
              {/* Conditional rendering of login link */}
              {user ? (
                <NavDropdown
                  title={user.uName}
                  id="nav-dropdown"
                  user={user}
                  className="navbar-right"
                >
                  {/* <NavDropdown.Item href="/profile">Profile</NavDropdown.Item> */}
                  <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                  <NavDropdown.Item href="/emailchg">
                    Update Profile
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item href="/pwdreset">PasswordReset</NavDropdown.Item> */}
                </NavDropdown>
              ) : (
                <Nav.Link href="/login">Login</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};
export default ResponsiveNavbar;
