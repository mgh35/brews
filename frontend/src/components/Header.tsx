import React from "react";
import Nav from "react-bootstrap/Nav";
import NavItem from "react-bootstrap/NavItem";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

export const Header = () => (
    <>
        <Navbar>
            <Navbar.Brand as={Link} to="/">
                Brews
            </Navbar.Brand>
            <Navbar.Collapse>
                <Nav className="mr-auto">
                    <NavItem>
                        <Nav.Link as={Link} to="/add">
                            Add
                        </Nav.Link>
                    </NavItem>
                    <NavItem>
                        <Nav.Link as={Link} to="/list">
                            List
                        </Nav.Link>
                    </NavItem>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </>
);

export default Header;
