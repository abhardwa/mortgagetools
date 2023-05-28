import {Navbar, NavDropdown, Nav, Container} from 'react-bootstrap';
import { useLocation } from "react-router-dom";
import "../css/menu.css";

const ResponsiveNavbar = (props) => {
    const location = useLocation();
    return (
        <Navbar bg="dark" collapseOnSelect expand="sm">
            <Container>
                <Navbar.Brand href="/">MortgageToolsUSA</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar-toggle" />
                <Navbar.Collapse id="navbar-toggle">
                <Nav activeKey={location.pathname} className="mr-auto sub-nav">
                    <Nav.Link href="/">Home</Nav.Link>
                    <NavDropdown title="Tools & Calculators" id="nav-dropdown">
                    <NavDropdown.Item href="/prequal">Pre-Qualification/Affordability</NavDropdown.Item>
                    <NavDropdown.Item href="/amortization">Amortization</NavDropdown.Item>
                    <NavDropdown.Item href="/buydown">Buy Down</NavDropdown.Item>
                    <NavDropdown.Item href="/escrow">Escrow Calculator</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/services">Services</Nav.Link>
                    <Nav.Link href="/contact">Contact</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
export default ResponsiveNavbar;