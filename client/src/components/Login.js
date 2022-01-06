import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/style.css";
import { Navbar, Modal, Form, Alert } from "react-bootstrap";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../config/api";
import { UserContext } from "../context/userContext";

// import Register from "./Register";

export default function Login({ showLogin, loginClose }) {
  const [state, dispatch] = useContext(UserContext);

  const [message, setMessage] = useState(null);

  let navigate = useNavigate();

  // store data with useState
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { email, password } = form;

  const handleChangeLogin = (a) => {
    setForm({
      ...form,
      [a.target.name]: a.target.value,
    });
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // convert form data to string
      const body = JSON.stringify(form);

      console.log(body);
      // Insert data user to database
      const response = await API.post("/login", body, config);

      // console.log(response);

      console.log(response.data.data);

      if (response?.status === 200) {
        // Send data to useContext
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data.data,
        });
        console.log(state);

        const alert = (
          <Alert variant="success" className="py-1">
            Login success
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Failed
        </Alert>
      );
      setMessage(alert);

      console.log(error);
    }
  };

  const [showRegister, setShowRegister] = useState(false);
  const registerClose = () => setShowRegister(false);
  const registerShow = () => setShowRegister(true);

  const RegisterShow = () => {
    loginClose();
    registerShow();
  };

  return (
    <>
      <Modal show={showLogin} onHide={loginClose}>
        <Modal.Body className="border-regislog">
          <h1 className="title">Login</h1>
          {message && message}
          <form onSubmit={handleLogin}>
            <Form.Group className=" mb-3" controlId="formBasicEmail">
              <Form.Control
                className="input"
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChangeLogin}
                value={email}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                className="input"
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChangeLogin}
                value={password}
              />
            </Form.Group>
            <button className="btn" variant="primary" type="submit">
              Login
            </button>
          </form>
          <div className="text-modal">
            <Form.Text>
              Don't have an account ? Klik
              <button className="btn-here" onClick={RegisterShow}>
                Here
              </button>
            </Form.Text>
          </div>
        </Modal.Body>
      </Modal>

      {/* <Register showRegister={showRegister} registerClose={registerClose} /> */}
    </>
  );
}
