import { Navbar, Container, Image, NavDropdown } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { API } from "../config/api";

import "bootstrap/dist/css/bootstrap.min.css";
import "../style/style.css";

import user from "../images/user 2.png";
import out from "../images/logout 1.png";
import coffee from "../images/Group.png";
import Logo from "../images/Icon (1).png";
import adminNav from "../images/coffee.jpg";

export default function NavbarPartner() {
  const [state, dispatch] = useContext(UserContext);

  let navigate = useNavigate();

  const logout = () => {
    console.log(state);
    dispatch({
      type: "LOGOUT",
    });
    navigate("/");
  };

  const [profile, setProfile] = useState({});

  // Fetching profile data from database
  const getProfile = async () => {
    try {
      const response = await API.get("/user");
      // Store product data to useState variabel
      setProfile(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <Navbar className="nav">
      <Container>
        <Link to="/income">
          <Navbar.Brand>
            <Image src={Logo} />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="default justify-content-end">
          <Navbar.Text></Navbar.Text>

          <Navbar.Collapse className="default justify-content-end">
            <NavDropdown
              className="dropdown"
              title={
                <Image
                  className="poto"
                  src={profile.image ? profile?.image : adminNav}
                ></Image>
              }
              id="nav-dropdown"
            >
              <NavDropdown.Item className="textDropdown" eventKey="4.2">
                <Link to="/add-product">
                  <Image className="img" src={coffee}></Image>
                  Add Product
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item className="textDropdown" eventKey="4.2">
                <Link to="/my-product">
                  <Image className="img" src={coffee}></Image>
                  MyProduct
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                className="textDropdown"
                eventKey="4.4"
                onClick={logout}
              >
                <Image className="img" src={out}></Image>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
